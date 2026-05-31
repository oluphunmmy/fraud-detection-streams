import 'reflect-metadata';
import { createReadStream } from 'node:fs';
import * as readline from 'node:readline';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FraudProcessorService } from '../fraud/fraud-processor.service';
import { TransactionInput } from '../fraud/fraud.types';

interface CliArgs {
  file: string;
  format: 'ndjson' | 'json-array';
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  const formatIndex = args.indexOf('--format');

  if (fileIndex === -1 || !args[fileIndex + 1]) {
    throw new Error('Usage: npm run process:file -- --file path/to/file --format ndjson|json-array');
  }

  return {
    file: args[fileIndex + 1],
    format: formatIndex === -1 ? 'ndjson' : (args[formatIndex + 1] as CliArgs['format']),
  };
}

async function processNdjson(filePath: string, processor: FraudProcessorService) {
  const stream = createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let processed = 0;
  let flagged = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;

    const transaction = JSON.parse(line) as TransactionInput;
    const result = await processor.process(transaction);

    processed += 1;
    if (result.flagged) flagged += 1;

    if (processed % 10000 === 0) {
      console.log(`Processed ${processed.toLocaleString()} records. Flagged ${flagged.toLocaleString()}.`);
    }
  }

  return { processed, flagged };
}

async function processJsonArray(filePath: string, processor: FraudProcessorService) {
  // stream-json does not always expose complete TypeScript declarations for its
  // streamer subpaths, so we load it through CommonJS and cast the stream types.
  // This keeps the JSON-array processor memory-safe for large files while avoiding
  // compile-time module declaration errors.
  const { parser } = require('stream-json') as {
    parser: () => NodeJS.ReadWriteStream;
  };
  const { streamArray } = require('stream-json/streamers/StreamArray') as {
    streamArray: () => NodeJS.ReadWriteStream;
  };

  const pipeline = createReadStream(filePath)
    .pipe(parser())
    .pipe(streamArray()) as AsyncIterable<{ value: TransactionInput }>;

  let processed = 0;
  let flagged = 0;

  for await (const item of pipeline) {
    const transaction = item.value;
    const result = await processor.process(transaction);

    processed += 1;
    if (result.flagged) flagged += 1;

    if (processed % 10000 === 0) {
      console.log(`Processed ${processed.toLocaleString()} records. Flagged ${flagged.toLocaleString()}.`);
    }
  }

  return { processed, flagged };
}

async function main() {
  const args = parseArgs();
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const processor = app.get(FraudProcessorService);

  const result =
    args.format === 'json-array'
      ? await processJsonArray(args.file, processor)
      : await processNdjson(args.file, processor);

  console.log('Done:', result);
  await app.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

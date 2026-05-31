"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_fs_1 = require("node:fs");
const readline = __importStar(require("node:readline"));
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const fraud_processor_service_1 = require("../fraud/fraud-processor.service");
function parseArgs() {
    const args = process.argv.slice(2);
    const fileIndex = args.indexOf('--file');
    const formatIndex = args.indexOf('--format');
    if (fileIndex === -1 || !args[fileIndex + 1]) {
        throw new Error('Usage: npm run process:file -- --file path/to/file --format ndjson|json-array');
    }
    return {
        file: args[fileIndex + 1],
        format: formatIndex === -1 ? 'ndjson' : args[formatIndex + 1],
    };
}
async function processNdjson(filePath, processor) {
    const stream = (0, node_fs_1.createReadStream)(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let processed = 0;
    let flagged = 0;
    for await (const line of rl) {
        if (!line.trim())
            continue;
        const transaction = JSON.parse(line);
        const result = await processor.process(transaction);
        processed += 1;
        if (result.flagged)
            flagged += 1;
        if (processed % 10000 === 0) {
            console.log(`Processed ${processed.toLocaleString()} records. Flagged ${flagged.toLocaleString()}.`);
        }
    }
    return { processed, flagged };
}
async function processJsonArray(filePath, processor) {
    const { parser } = require('stream-json');
    const { streamArray } = require('stream-json/streamers/StreamArray');
    const pipeline = (0, node_fs_1.createReadStream)(filePath)
        .pipe(parser())
        .pipe(streamArray());
    let processed = 0;
    let flagged = 0;
    for await (const item of pipeline) {
        const transaction = item.value;
        const result = await processor.process(transaction);
        processed += 1;
        if (result.flagged)
            flagged += 1;
        if (processed % 10000 === 0) {
            console.log(`Processed ${processed.toLocaleString()} records. Flagged ${flagged.toLocaleString()}.`);
        }
    }
    return { processed, flagged };
}
async function main() {
    const args = parseArgs();
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn'],
    });
    const processor = app.get(fraud_processor_service_1.FraudProcessorService);
    const result = args.format === 'json-array'
        ? await processJsonArray(args.file, processor)
        : await processNdjson(args.file, processor);
    console.log('Done:', result);
    await app.close();
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=process-file.js.map
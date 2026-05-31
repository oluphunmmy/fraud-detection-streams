# Fraud Detection in High-Volume Transaction Streams

A NestJS + MongoDB project for detecting suspicious financial transactions in high-volume JSON transaction streams.

## Fraud Rules

A transaction is flagged when any of these patterns is detected:

1. More than 5 transactions by the same user in under 1 minute.
2. Same user's daily total exceeds $10,000.
3. Same user transacts from different locations within 2 minutes.

## Architecture

```text
Large JSON / JSONL File
        |
        v
Streaming Reader / CLI Processor
        |
        v
FraudProcessorService
  - per-user 60s sliding queue
  - per-user daily amount map
  - per-user 2-minute location queue
        |
        v
MongoDB flagged_transactions collection
        |
        v
NestJS API: GET /fraud-check?userId=...
        |
        v
Optional React/Leaflet map heatmap
```

## Tech Stack

- Backend: Node.js, NestJS, TypeScript
- Database: MongoDB with Mongoose
- File processing: Node streams, readline, stream-json
- Testing: Jest
- Optional frontend: React + Leaflet

## Quick Start

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### 3. Process a file

For JSON array:

```bash
npm run process:file -- --file ../sample-data/transactions.json --format json-array
```

For JSONL / NDJSON:

```bash
npm run process:file -- --file ../sample-data/transactions.ndjson --format ndjson
```

### 4. Query flagged transactions

```bash
curl "http://localhost:3000/fraud-check?userId=user_123"
```

### 5. Optional frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### GET `/fraud-check?userId=...`

Returns flagged transactions for a user.

Optional query params:

- `reason=HIGH_FREQUENCY|DAILY_AMOUNT_LIMIT|LOCATION_JUMP`
- `limit=100`

### POST `/ingest/transaction`

Processes one transaction in real time.

```json
{
  "transactionId": "txn_001",
  "userId": "user_123",
  "amount": 1200,
  "timestamp": "2026-05-28T10:30:00.000Z",
  "merchant": "Shoprite",
  "location": "Lagos",
  "geo": { "lat": 6.5244, "lng": 3.3792 }
}
```

### POST `/ingest/batch`

Processes a small batch of transactions. For millions of records, use the CLI stream processor.

## Indexing Strategy

The backend creates indexes for:

- `transactionId` unique lookup / idempotency
- `{ userId: 1, timestamp: -1 }` fast user query
- `{ userId: 1, reasons: 1, timestamp: -1 }` filtered user query
- `geo: "2dsphere"` for optional map/geospatial querying

## Performance Notes

The processor avoids loading the whole file into memory. It maintains bounded in-memory state:

- 60-second transaction queue per active user
- 2-minute location queue per active user
- daily amount totals per user/day

For unordered historical data, first partition by `userId` and sort each partition by `timestamp`, or run the detection in a database/streaming system that supports event-time windows.

## Kafka Bonus Design

For real-time ingestion:

```text
Transaction Producer -> Kafka topic: transactions
Kafka Consumer Group -> NestJS FraudProcessorService
MongoDB -> API /fraud-check
```

Recommended Kafka key: `userId`, so all events for one user go to the same partition and the sliding windows stay correct.

import { createHash } from "node:crypto";

export type ReceiptEventType =
  | "JOB_ACCEPTED"
  | "ARTIFACT_BOUND"
  | "NODE_EVIDENCE_ACCEPTED"
  | "SHARD_STARTED"
  | "CHECKPOINT_COMMITTED"
  | "NODE_LOST"
  | "SHARD_RECOVERED"
  | "OUTPUT_VERIFIED"
  | "SETTLEMENT_AUTHORIZED";

export interface ReceiptEvent {
  sequence: number;
  type: ReceiptEventType;
  jobId: string;
  timestamp: string;
  nodeId?: string;
  checkpoint?: number;
  detail: Record<string, string | number | boolean>;
}

export interface ReceiptBlock {
  event: ReceiptEvent;
  previousHash: string;
  hash: string;
}

export const GENESIS_HASH = createHash("sha256").update("KAIROMESH_OUTCOME_RECEIPT_V1").digest("hex");

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  }
  return value;
}

export function hashReceipt(previousHash: string, event: ReceiptEvent): string {
  return createHash("sha256")
    .update(`${previousHash}:${JSON.stringify(stableValue(event))}`)
    .digest("hex");
}

export function createReceiptChain(events: ReceiptEvent[]): ReceiptBlock[] {
  let previousHash = GENESIS_HASH;
  return events.map((event, index) => {
    if (event.sequence !== index + 1) {
      throw new RangeError(`Receipt sequence must be contiguous; expected ${index + 1}.`);
    }
    const hash = hashReceipt(previousHash, event);
    const block = { event, previousHash, hash };
    previousHash = hash;
    return block;
  });
}

export function verifyReceiptChain(blocks: ReceiptBlock[]): boolean {
  if (blocks.length === 0) return false;
  let previousHash = GENESIS_HASH;
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.event.sequence !== index + 1) return false;
    if (block.previousHash !== previousHash) return false;
    if (hashReceipt(previousHash, block.event) !== block.hash) return false;
    previousHash = block.hash;
  }
  return true;
}

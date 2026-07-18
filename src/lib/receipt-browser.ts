export interface BrowserReceiptBlock {
  event: {
    sequence: number;
    type: string;
    jobId: string;
    timestamp: string;
    nodeId?: string;
    checkpoint?: number;
    detail: Record<string, string | number | boolean>;
  };
  previousHash: string;
  hash: string;
}

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

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyReceiptInBrowser(blocks: BrowserReceiptBlock[], expectedRootHash: string) {
  let previousHash = await sha256Hex("KAIROMESH_OUTCOME_RECEIPT_V1");
  if (blocks.length === 0 || !/^[a-f0-9]{64}$/.test(expectedRootHash)) {
    return { valid: false, checkedBlocks: 0, rootHash: previousHash };
  }
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.event.sequence !== index + 1 || block.previousHash !== previousHash) {
      return { valid: false, checkedBlocks: index, rootHash: previousHash };
    }
    const computed = await sha256Hex(`${previousHash}:${JSON.stringify(stableValue(block.event))}`);
    if (computed !== block.hash) {
      return { valid: false, checkedBlocks: index, rootHash: previousHash };
    }
    previousHash = block.hash;
  }
  return { valid: previousHash === expectedRootHash, checkedBlocks: blocks.length, rootHash: previousHash };
}

/**
 * Distributed GPU Heartbeat Jitter Compensator.
 * Accommodates network burst latency and PCIe synchronization hiccups
 * to prevent premature cluster eviction of healthy distributed GPU workers.
 */
export class GpuHeartbeatMonitor {
  constructor({ baseTimeoutMs = 15000, maxJitterAllowanceMs = 5000, consecutiveMissThreshold = 3 } = {}) {
    this.baseTimeoutMs = baseTimeoutMs;
    this.maxJitterAllowanceMs = maxJitterAllowanceMs;
    this.consecutiveMissThreshold = consecutiveMissThreshold;
    this.nodes = new Map();
  }

  recordHeartbeat(nodeId, timestamp = Date.now()) {
    const existing = this.nodes.get(nodeId) || {
      lastSeen: timestamp,
      missCount: 0,
      status: 'HEALTHY',
    };
    existing.lastSeen = timestamp;
    existing.missCount = 0;
    existing.status = 'HEALTHY';
    this.nodes.set(nodeId, existing);
  }

  evaluateNode(nodeId, currentTime = Date.now()) {
    const node = this.nodes.get(nodeId);
    if (!node) {
      return { status: 'UNKNOWN', shouldEvict: true };
    }

    const elapsed = currentTime - node.lastSeen;
    const effectiveTimeout = this.baseTimeoutMs + this.maxJitterAllowanceMs;

    if (elapsed > effectiveTimeout) {
      node.missCount += 1;
      if (node.missCount >= this.consecutiveMissThreshold) {
        node.status = 'EVICTED';
        return { status: 'EVICTED', shouldEvict: true, elapsedMs: elapsed };
      }
      node.status = 'DEGRADED';
      return { status: 'DEGRADED', shouldEvict: false, elapsedMs: elapsed };
    }

    return { status: 'HEALTHY', shouldEvict: false, elapsedMs: elapsed };
  }
}

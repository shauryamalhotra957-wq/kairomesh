import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GpuHeartbeatMonitor } from '../src/utils/heartbeat_jitter.js';

describe('GpuHeartbeatMonitor Test Suite', () => {
  test('node remains healthy within base timeout and jitter allowance', () => {
    const monitor = new GpuHeartbeatMonitor({ baseTimeoutMs: 1000, maxJitterAllowanceMs: 500 });
    const now = 10000;
    monitor.recordHeartbeat('gpu-node-01', now);

    const check1 = monitor.evaluateNode('gpu-node-01', now + 1200);
    assert.strictEqual(check1.status, 'HEALTHY');
    assert.strictEqual(check1.shouldEvict, false);
  });

  test('node degrades when exceeding timeout and evicts on threshold misses', () => {
    const monitor = new GpuHeartbeatMonitor({ baseTimeoutMs: 1000, maxJitterAllowanceMs: 500, consecutiveMissThreshold: 2 });
    const now = 10000;
    monitor.recordHeartbeat('gpu-node-02', now);

    const check1 = monitor.evaluateNode('gpu-node-02', now + 2000);
    assert.strictEqual(check1.status, 'DEGRADED');
    assert.strictEqual(check1.shouldEvict, false);

    const check2 = monitor.evaluateNode('gpu-node-02', now + 2500);
    assert.strictEqual(check2.status, 'EVICTED');
    assert.strictEqual(check2.shouldEvict, true);
  });

  test('unknown node requests immediate eviction', () => {
    const monitor = new GpuHeartbeatMonitor();
    assert.strictEqual(monitor.evaluateNode('ghost-node').shouldEvict, true);
  });
});

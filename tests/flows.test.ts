/**
 * Boardwalk — Data & Signal Flow Test Suite
 *
 * Validates:
 * 1. Hardware Data Flow & Power Flow step configurations.
 * 2. Networking Packet Flow step configurations.
 * 3. 3D Catmull-Rom spline continuity and valid 3D points.
 * 4. Active part cross-referencing with pack definitions.
 */

import { describe, expect, it } from 'vitest';
import {
  HARDWARE_DATA_FLOW_STEPS,
  HARDWARE_POWER_FLOW_STEPS
} from '../src/packs/hardware/flow.ts';
import { NETWORKING_PACKET_FLOW_STEPS } from '../src/packs/networking/flow.ts';
import { createHardwareDataFlowRoutes } from '../src/packs/hardware/layout.ts';
import { createNetworkingDataFlowRoutes } from '../src/packs/networking/layout.ts';
import { hardwarePack } from '../src/packs/hardware/index.ts';
import { networkingPack } from '../src/packs/networking/index.ts';
import { FlowStep } from '../src/packs/types.ts';

function validateFlowSteps(steps: FlowStep[], validPartIds: Set<string>, flowName: string) {
  expect(steps.length, `${flowName} must have at least one step`).toBeGreaterThan(0);

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    expect(step.stepNumber, `${flowName} step index mismatch`).toBe(i + 1);
    expect(step.id.trim().length, `${flowName} step ID cannot be empty`).toBeGreaterThan(0);
    expect(step.title.trim().length, `${flowName} step title cannot be empty`).toBeGreaterThan(0);
    expect(step.caption.trim().length, `${flowName} step caption cannot be empty`).toBeGreaterThan(0);

    // Active parts must be valid
    expect(step.activeParts.length, `${flowName} step must have active parts`).toBeGreaterThan(0);
    for (const partId of step.activeParts) {
      expect(
        validPartIds.has(partId),
        `${flowName} step "${step.id}" references unknown part ID "${partId}"`
      ).toBe(true);
    }

    // Curve check
    expect(step.curve, `${flowName} step curve must be defined`).toBeDefined();
    if (!step.curve) return;

    expect(step.curve.points.length, `${flowName} step curve must have at least 2 points`).toBeGreaterThanOrEqual(2);
    for (const pt of step.curve.points) {
      expect(Number.isFinite(pt.x), `Point x in step ${step.id} must be finite`).toBe(true);
      expect(Number.isFinite(pt.y), `Point y in step ${step.id} must be finite`).toBe(true);
      expect(Number.isFinite(pt.z), `Point z in step ${step.id} must be finite`).toBe(true);
    }

    // Curve length must be non-zero
    const curveLength = step.curve.getLength();
    expect(curveLength, `Curve length in step ${step.id} must be positive`).toBeGreaterThan(0.01);
  }
}

describe('Flow & Animation Systems', () => {
  const hardwarePartIds = new Set(hardwarePack.parts.map((p) => p.id));
  const networkingPartIds = new Set(networkingPack.parts.map((p) => p.id));

  it('validates Hardware Data Flow steps and part references', () => {
    validateFlowSteps(HARDWARE_DATA_FLOW_STEPS, hardwarePartIds, 'Hardware Data Flow');
  });

  it('validates Hardware Power Flow steps and part references', () => {
    validateFlowSteps(HARDWARE_POWER_FLOW_STEPS, hardwarePartIds, 'Hardware Power Flow');

    // Power flow specific: voltage labels
    for (const step of HARDWARE_POWER_FLOW_STEPS) {
      expect(step.voltageLabel, `Power step ${step.id} must include voltageLabel`).toBeDefined();
      expect(step.voltageLabel!.length).toBeGreaterThan(0);
    }
  });

  it('validates Networking Packet Flow steps and part references', () => {
    validateFlowSteps(NETWORKING_PACKET_FLOW_STEPS, networkingPartIds, 'Networking Packet Flow');
  });

  it('generates valid hardware persistent data flow particle routes', () => {
    const routes = createHardwareDataFlowRoutes();
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      expect(route.id).toBeTruthy();
      expect(route.label).toBeTruthy();
      expect(route.pulseCount).toBeGreaterThan(0);
      expect(route.curve.points.length).toBeGreaterThanOrEqual(2);
      expect(route.curve.getLength()).toBeGreaterThan(0.1);
    }
  });

  it('generates valid networking persistent data flow particle routes', () => {
    const routes = createNetworkingDataFlowRoutes();
    expect(routes.length).toBeGreaterThan(0);

    for (const route of routes) {
      expect(route.id).toBeTruthy();
      expect(route.label).toBeTruthy();
      expect(route.pulseCount).toBeGreaterThan(0);
      expect(route.curve.points.length).toBeGreaterThanOrEqual(2);
      expect(route.curve.getLength()).toBeGreaterThan(0.1);
    }
  });
});

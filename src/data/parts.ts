/**
 * Boardwalk — PC Hardware Data (Re-export from hardware pack)
 */

export * from '../packs/types.ts';
export { HARDWARE_JOURNEY_STEPS as JOURNEY_STEPS, HARDWARE_PARTS as PARTS, HARDWARE_PART_LIST as PART_LIST } from '../packs/hardware/parts.ts';

export type PartId =
  | 'motherboard'
  | 'cpu'
  | 'cooler'
  | 'ram'
  | 'gpu'
  | 'vrm'
  | 'chipset'
  | 'ssd'
  | 'sata'
  | 'power'
  | 'io'
  | 'battery';

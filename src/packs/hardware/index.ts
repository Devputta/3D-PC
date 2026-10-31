/**
 * Boardwalk — PC Hardware Pack
 */

import { BUILD_SLOTS, TRAY_PARTS } from '../../data/build.ts';
import { Pack } from '../types.ts';
import { buildHardwarePack } from './build.ts';
import {
  createHardwareDataFlowRoutes,
  HARDWARE_ANCHORS,
  HARDWARE_EXPLODE_VECTORS,
  HARDWARE_HOME,
  HARDWARE_SUBASSEMBLY_LIFTS
} from './layout.ts';
import { HARDWARE_JOURNEY_STEPS, HARDWARE_LESSONS, HARDWARE_PART_LIST } from './parts.ts';

export const hardwarePack: Pack = {
  id: 'hardware',
  name: 'PC Hardware',
  title: 'PC Hardware',
  shortTitle: 'Hardware',
  journeySubtitle: 'Opening a video file',
  parts: HARDWARE_PART_LIST,
  lessons: HARDWARE_LESSONS,
  journey: HARDWARE_JOURNEY_STEPS,
  buildSlots: BUILD_SLOTS,
  trayParts: TRAY_PARTS,
  build: buildHardwarePack,
  explode: HARDWARE_EXPLODE_VECTORS,
  subassemblyLifts: HARDWARE_SUBASSEMBLY_LIFTS,
  anchors: HARDWARE_ANCHORS,
  home: HARDWARE_HOME,
  dataFlowRoutes: createHardwareDataFlowRoutes()
};

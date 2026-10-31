/**
 * Boardwalk — Networking Pack
 */

import { Pack } from '../types.ts';
import { buildNetworkingPack } from './build.ts';
import {
  createNetworkingDataFlowRoutes,
  NETWORKING_ANCHORS,
  NETWORKING_EXPLODE_VECTORS,
  NETWORKING_HOME
} from './layout.ts';
import {
  NETWORKING_BUILD_SLOTS,
  NETWORKING_JOURNEY_STEPS,
  NETWORKING_LESSONS,
  NETWORKING_PART_LIST,
  NETWORKING_TRAY_PARTS
} from './parts.ts';

export const networkingPack: Pack = {
  id: 'networking',
  name: 'Computer Networking',
  title: 'Computer Networking',
  shortTitle: 'Networking',
  journeySubtitle: 'What happens when you type a web address',
  parts: NETWORKING_PART_LIST,
  lessons: NETWORKING_LESSONS,
  journey: NETWORKING_JOURNEY_STEPS,
  buildSlots: NETWORKING_BUILD_SLOTS,
  trayParts: NETWORKING_TRAY_PARTS,
  build: buildNetworkingPack,
  explode: NETWORKING_EXPLODE_VECTORS,
  anchors: NETWORKING_ANCHORS,
  home: NETWORKING_HOME,
  dataFlowRoutes: createNetworkingDataFlowRoutes()
};

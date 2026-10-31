/**
 * Boardwalk — Build Mode Specifications & Compatibility Rules
 *
 * Defines candidate components, target motherboard slots, compatibility checks,
 * and exact one-sentence failure explanations. All text lives in src/data.
 */

export interface BuildSlot {
  id: string;
  name: string;
  description: string;
  acceptedCategory: string;
  installedPartId: string | null;
}

export interface BuildPart {
  id: string;
  name: string;
  category: string;
  summary: string;
  specs: { label: string; value: string }[];
  isCompatible: boolean;
  failureSentence?: string;
  modelPartId: string; // Maps to 3D scene part
}

export const BUILD_SLOTS: BuildSlot[] = [
  {
    id: 'slot_cpu',
    name: 'LGA1700 socket',
    description: 'Motherboard socket for Intel 12th, 13th, and 14th gen processors.',
    acceptedCategory: 'cpu',
    installedPartId: null
  },
  {
    id: 'slot_cooler',
    name: 'Cooler mount',
    description: 'Socket mounting bracket with 155 mm case clearance limit.',
    acceptedCategory: 'cooler',
    installedPartId: null
  },
  {
    id: 'slot_ram',
    name: 'DIMM channels A2 & B2',
    description: 'Dual DDR5 memory slots with 1.1 V PMIC signaling.',
    acceptedCategory: 'ram',
    installedPartId: null
  },
  {
    id: 'slot_gpu',
    name: 'PCIe 5.0 ×16 slot',
    description: 'Primary graphics slot backed by a 650-watt power supply.',
    acceptedCategory: 'gpu',
    installedPartId: null
  },
  {
    id: 'slot_ssd',
    name: 'M.2 PCIe 4.0 slot',
    description: 'Direct processor-connected M.2 2280 NVMe storage socket.',
    acceptedCategory: 'ssd',
    installedPartId: null
  },
  {
    id: 'slot_power',
    name: '24-pin ATX header',
    description: 'Main system power harness delivering 12 V, 5 V, and 3.3 V rails.',
    acceptedCategory: 'power',
    installedPartId: null
  }
];

export const TRAY_PARTS: BuildPart[] = [
  // CPU options
  {
    id: 'cpu_intel',
    name: 'Core-X 3.8 GHz (LGA1700)',
    category: 'cpu',
    summary: '16-core processor matching the motherboard socket pinout.',
    specs: [
      { label: 'Socket', value: 'LGA1700' },
      { label: 'TDP', value: '125 W' }
    ],
    isCompatible: true,
    modelPartId: 'cpu'
  },
  {
    id: 'cpu_amd',
    name: 'Ryzen 7 (Socket AM5)',
    category: 'cpu',
    summary: '8-core processor designed for AMD AM5 motherboards.',
    specs: [
      { label: 'Socket', value: 'Socket AM5 (1718 pins)' },
      { label: 'TDP', value: '105 W' }
    ],
    isCompatible: false,
    failureSentence: 'This AMD AM5 processor cannot fit into an Intel LGA1700 motherboard socket.',
    modelPartId: 'cpu'
  },

  // RAM options
  {
    id: 'ram_ddr5',
    name: '32 GB DDR5-5600 Kit',
    category: 'ram',
    summary: 'Matched dual-channel DDR5 sticks with 288-pin DDR5 key notch.',
    specs: [
      { label: 'Generation', value: 'DDR5' },
      { label: 'Voltage', value: '1.10 V' }
    ],
    isCompatible: true,
    modelPartId: 'ram'
  },
  {
    id: 'ram_ddr4',
    name: '32 GB DDR4-3200 Kit',
    category: 'ram',
    summary: 'Matched dual-channel DDR4 sticks with legacy center key notch.',
    specs: [
      { label: 'Generation', value: 'DDR4' },
      { label: 'Voltage', value: '1.20 V' }
    ],
    isCompatible: false,
    failureSentence: 'DDR4 memory modules have a different pin count and key notch that physically prevents insertion into DDR5 slots.',
    modelPartId: 'ram'
  },

  // Cooler options
  {
    id: 'cooler_150',
    name: 'Tower Cooler (150 mm)',
    category: 'cooler',
    summary: 'Compact heat-pipe tower standing 150 mm tall with 180 W cooling capacity.',
    specs: [
      { label: 'Height', value: '150 mm' },
      { label: 'Rating', value: '180 W TDP' }
    ],
    isCompatible: true,
    modelPartId: 'cooler'
  },
  {
    id: 'cooler_175',
    name: 'Heavy Dual-Tower (175 mm)',
    category: 'cooler',
    summary: 'Oversized twin-tower heatsink with dual 140 mm fans.',
    specs: [
      { label: 'Height', value: '175 mm' },
      { label: 'Rating', value: '250 W TDP' }
    ],
    isCompatible: false,
    failureSentence: 'This cooler stands 175 mm tall and will collide with the case side panel clearance of 155 mm.',
    modelPartId: 'cooler'
  },

  // GPU options
  {
    id: 'gpu_rtx_200w',
    name: 'RTX Graphics Card (200 W)',
    category: 'gpu',
    summary: 'Mid-range discrete graphics card requiring a 650 W system supply.',
    specs: [
      { label: 'Power draw', value: '200 W' },
      { label: 'Min PSU', value: '600 W' }
    ],
    isCompatible: true,
    modelPartId: 'gpu'
  },
  {
    id: 'gpu_rtx_450w',
    name: 'Flagship GPU (450 W)',
    category: 'gpu',
    summary: 'Ultra-high-power graphics card with triple fan cooler.',
    specs: [
      { label: 'Power draw', value: '450 W' },
      { label: 'Min PSU', value: '850 W' }
    ],
    isCompatible: false,
    failureSentence: 'This high-power graphics card draws 450 watts and requires an 850-watt power supply, exceeding this system’s 650-watt unit.',
    modelPartId: 'gpu'
  },

  // SSD options
  {
    id: 'ssd_nvme',
    name: '2 TB NVMe M.2 SSD',
    category: 'ssd',
    summary: 'M.2 2280 form factor solid-state stick connecting directly to PCIe lanes.',
    specs: [
      { label: 'Form factor', value: 'M.2 2280' },
      { label: 'Interface', value: 'PCIe 4.0 ×4' }
    ],
    isCompatible: true,
    modelPartId: 'ssd'
  },
  {
    id: 'ssd_sata_25',
    name: '2 TB SATA 2.5-inch Drive',
    category: 'ssd',
    summary: 'Bulk 2.5-inch storage drive requiring external SATA ribbon and power cables.',
    specs: [
      { label: 'Form factor', value: '2.5-inch bay' },
      { label: 'Interface', value: 'SATA III' }
    ],
    isCompatible: false,
    failureSentence: 'A 2.5-inch SATA drive cannot plug into an M.2 motherboard slot without a separate mounting bay and data cable.',
    modelPartId: 'ssd'
  },

  // Power connector
  {
    id: 'psu_24pin',
    name: '24-Pin ATX Main Cable',
    category: 'power',
    summary: 'Keyed primary power delivery harness from the 650 W power supply.',
    specs: [
      { label: 'Pins', value: '24 pins' },
      { label: 'PSU rating', value: '650 W 80-Plus Gold' }
    ],
    isCompatible: true,
    modelPartId: 'power'
  }
];

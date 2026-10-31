/**
 * Boardwalk — Hardware Comparison Data
 *
 * Side-by-side technical specifications and decision criteria
 * for hardware architecture pairs. All text lives in src/data.
 */

export interface CompareItem {
  id: string;
  name: string;
  summary: string;
  specs: { label: string; value: string }[];
  whenChoice: string;
}

export interface ComparePair {
  id: string;
  title: string;
  itemA: CompareItem;
  itemB: CompareItem;
  summarySentence: string;
}

export const COMPARE_PAIRS: ComparePair[] = [
  {
    id: 'ddr4_vs_ddr5',
    title: 'DDR4 vs DDR5',
    itemA: {
      id: 'ddr4',
      name: 'DDR4 Memory',
      summary: 'Mature memory standard with wide compatibility and budget-friendly pricing.',
      specs: [
        { label: 'Data rate', value: '2133 to 3600 MT/s' },
        { label: 'Channels', value: 'One 64-bit bus per stick' },
        { label: 'Operating voltage', value: '1.20 V standard' },
        { label: 'Power control', value: 'Regulated on motherboard' }
      ],
      whenChoice: 'Choose DDR4 for budget builds, secondary systems, or repurposing existing motherboards where memory bandwidth is not the bottleneck.'
    },
    itemB: {
      id: 'ddr5',
      name: 'DDR5 Memory',
      summary: 'Current generation standard doubling transfer rates and introducing dual subchannels.',
      specs: [
        { label: 'Data rate', value: '4800 to 7200+ MT/s' },
        { label: 'Channels', value: 'Two 32-bit subchannels per stick' },
        { label: 'Operating voltage', value: '1.10 V standard' },
        { label: 'Power control', value: 'On-module power management IC (PMIC)' }
      ],
      whenChoice: 'Choose DDR5 for current generation gaming, 4K video rendering, and workstation multitasking requiring massive data bandwidth.'
    },
    summarySentence: 'DDR4 remains the economical choice for low-cost systems, while DDR5 is necessary for current processors demanding high memory bandwidth for modern workloads.'
  },

  {
    id: 'sata_vs_nvme',
    title: 'SATA SSD vs NVMe SSD',
    itemA: {
      id: 'sata_ssd',
      name: 'SATA SSD',
      summary: 'Solid-state drive connected over the legacy Serial ATA storage controller bus.',
      specs: [
        { label: 'Interface', value: 'SATA III (6 Gbit/s limit)' },
        { label: 'Max sequential', value: 'About 550 MB/s' },
        { label: 'Command queues', value: 'Single queue (32 commands)' },
        { label: 'Cabling', value: 'Requires SATA data & power cables' }
      ],
      whenChoice: 'Choose a SATA SSD for secondary storage, older PC upgrades, or motherboards that lack additional open M.2 slots.'
    },
    itemB: {
      id: 'nvme_ssd',
      name: 'NVMe SSD',
      summary: 'Direct PCI Express storage communicating over four dedicated high-speed lanes.',
      specs: [
        { label: 'Interface', value: 'PCIe 4.0 / 5.0 ×4' },
        { label: 'Max sequential', value: '3500 to 7400+ MB/s' },
        { label: 'Command queues', value: '64,000 queues (64k commands each)' },
        { label: 'Cabling', value: 'Cable-free, bolts directly to board' }
      ],
      whenChoice: 'Choose NVMe for your primary operating system, game installations, and active creative media caches where instant responsiveness matters.'
    },
    summarySentence: 'SATA SSDs offer economical bulk storage for legacy drive bays, whereas NVMe SSDs are over ten times faster and mount directly onto the motherboard without cables.'
  },

  {
    id: 'hdd_vs_ssd',
    title: 'HDD vs SSD',
    itemA: {
      id: 'hdd',
      name: 'Mechanical HDD',
      summary: 'Traditional storage drive using magnetic platters spinning at 5400 or 7200 RPM.',
      specs: [
        { label: 'Sequential speed', value: '140 to 220 MB/s' },
        { label: 'Seek latency', value: '12 to 18 ms (mechanical head move)' },
        { label: 'Cost per terabyte', value: '$15 to $20 / TB (lowest)' },
        { label: 'Physical shock', value: 'Vulnerable to drops and vibration' }
      ],
      whenChoice: 'Choose a mechanical hard drive for multi-terabyte cold archives, network backups, and surveillance video where low cost per gigabyte is paramount.'
    },
    itemB: {
      id: 'ssd',
      name: 'Solid-State Drive (SSD)',
      summary: 'Semiconductor flash memory storage with zero moving parts and microsecond latencies.',
      specs: [
        { label: 'Sequential speed', value: '550 to 7000+ MB/s' },
        { label: 'Seek latency', value: '< 0.05 ms (instant electronic access)' },
        { label: 'Cost per terabyte', value: '$60 to $90 / TB' },
        { label: 'Physical shock', value: 'Immune to physical movement' }
      ],
      whenChoice: 'Choose an SSD for any system drive running an operating system, software applications, or games where mechanical seek delay would cause stutter.'
    },
    summarySentence: 'Mechanical hard drives provide cheap bulk storage for cold archives, whereas solid-state drives are mandatory for modern boot drives and responsive computing.'
  }
];

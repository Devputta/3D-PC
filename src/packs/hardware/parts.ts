/**
 * Boardwalk — PC Hardware Pack Data
 *
 * Full catalog of the 12 motherboard hardware components and 6-step journey.
 */

import { JourneyStep, PartData } from '../types.ts';

export const HARDWARE_PARTS: Record<string, PartData> = {
  motherboard: {
    id: 'motherboard',
    number: 1,
    name: 'Motherboard',
    summary: 'The main circuit board that physically anchors every component and routes signals between them.',
    body: [
      'A multi-layer printed circuit board built from woven fiberglass and epoxy resin, crisscrossed by micro-thin copper traces. It distributes clean electrical power from the power supply, hosts the primary buses, and provides mounting sockets for processor, memory, storage drives, and expansion cards.',
      'Most modern desktop motherboards pack six to twelve internal copper layers sandwiched together. If a single trace inside an inner layer breaks from flexing or a dropped screwdriver, the entire board can fail intermittently or permanently without any visible scratch on the surface.'
    ],
    specs: [
      { label: 'Form factor', value: 'ATX (305 × 244 mm typical)' },
      { label: 'PCB layers', value: '6 to 12 copper layers' },
      { label: 'PCIe slots', value: '1 to 3 full-length (PCIe 4.0 / 5.0)' },
      { label: 'Standby draw', value: 'About 2 to 5 W' }
    ],
    fails: 'The PC fails to power on at all, or fans spin for half a second before immediately shutting down, usually caused by a short circuit or blown decoupling capacitor.',
    clue: 'Click the large main board that physically holds every component and connects them with printed copper traces.'
  },

  cpu: {
    id: 'cpu',
    number: 2,
    name: 'Central processor (CPU)',
    summary: 'Executes software instructions and performs calculations billions of times per second.',
    body: [
      'The computational engine of the computer, containing billions of microscopic transistors fabricated on a silicon die. It fetches program instructions from memory, decodes them, performs arithmetic and logic operations in execution units, and writes the results back to cache or RAM.',
      'Modern desktop CPUs feature multiple distinct processing cores operating under a nickel-plated copper integrated heat spreader (IHS). While running at frequencies up to 5.8 GHz, the chip adjusts its clock speed and core voltage hundreds of times per second based on temperature and current load.'
    ],
    specs: [
      { label: 'Clock speed', value: 'About 3.2 to 5.8 GHz' },
      { label: 'Cores / threads', value: '6 to 24 cores (up to 32 threads)' },
      { label: 'Typical TDP', value: '65 to 253 W under load' },
      { label: 'L3 cache', value: '16 to 96 MB shared' }
    ],
    fails: 'Sudden system freeze under heavy load, blue-screen crash loops citing machine check exceptions, or refusal to boot past the initial motherboard diagnostic LED.',
    clue: 'Click the central silicon chip under the metal heat spreader that runs your software instructions.'
  },

  cooler: {
    id: 'cooler',
    number: 3,
    name: 'CPU cooler',
    summary: 'Draws intense heat away from the processor die and dissipates it into surrounding air.',
    body: [
      'A cooling assembly comprising a smooth copper contact base, sintered copper heat pipes filled with a phase-change working fluid, a dense stack of aluminium fins, and an axial fan. As the processor heats up, liquid inside the vacuum-sealed pipes vaporises, travels to the cold fin stack, condenses, and wicks back down.',
      'The fan is simply an airflow mover; the actual cooling work is done by surface area. Spreading heat over roughly thirty thin stamped aluminium fins increases the conductive contact area with ambient room air by more than fifty times compared to a bare metal block.'
    ],
    specs: [
      { label: 'Fin count', value: 'About 25 to 55 aluminium plates' },
      { label: 'Heat pipes', value: '4 to 6 sintered copper tubes' },
      { label: 'Fan speed', value: '500 to 1800 RPM' },
      { label: 'Cooling capacity', value: '150 to 250 W TDP' }
    ],
    fails: 'The processor quickly reaches 95 to 100 °C and thermally throttles to a crawl, caused by a stopped fan motor, dried thermal paste, or uneven mounting pressure.',
    clue: 'Click the tall assembly with stacked metal fins and heat pipes that pulls warmth away from the hot processor.'
  },

  ram: {
    id: 'ram',
    number: 4,
    name: 'Memory (RAM)',
    summary: 'High-speed temporary working memory that holds the operating system and running programs.',
    body: [
      'Synchronous dynamic random-access memory modules installed in dual in-line memory module (DIMM) slots. Each memory chip contains billions of microscopic capacitor-and-transistor cells that hold bits as electric charges, refreshed thousands of times every second to prevent data leakage.',
      'Installing memory in matched pairs enables dual-channel mode, doubling the communication bus width between the memory controller and the sticks from 64 bits to 128 bits. Having two 16 GB sticks installed in alternating slots yields substantially higher transfer throughput than a single 32 GB stick.'
    ],
    specs: [
      { label: 'Transfer rate', value: '4800 to 6400 MT/s (DDR5 typical)' },
      { label: 'Bus width', value: '128-bit (two 64-bit channels)' },
      { label: 'Module capacity', value: '16 to 32 GB per stick' },
      { label: 'Operating voltage', value: '1.1 to 1.35 V' }
    ],
    fails: 'Random desktop crashes, corrupted file downloads, or memory management error screens, frequently traced to mismatched timings or a stick not seated firmly in its slot.',
    clue: 'Click the slender vertical sticks with gold edge pins that store running apps only while power is on.'
  },

  gpu: {
    id: 'gpu',
    number: 5,
    name: 'Graphics card (GPU)',
    summary: 'Dedicated expansion processor engineered for massive parallel rendering and video output.',
    body: [
      'A dedicated processing board equipped with thousands of specialized shader cores, ultra-wide high-speed GDDR video memory, and multiple video display outputs. While a CPU handles complex sequential branches, a graphics processor excels at performing identical mathematical matrix calculations on millions of pixels simultaneously.',
      'Because the graphics card generates its own display signal, your monitor cable must plug directly into the ports on this card rather than the motherboard ports above. Plugging into the motherboard mistakenly routes video through the processor’s slower integrated graphics unit.'
    ],
    specs: [
      { label: 'VRAM capacity', value: '8 to 24 GB GDDR6 / GDDR6X' },
      { label: 'Memory bus', value: '128 to 384-bit interface' },
      { label: 'Power draw', value: '130 to 450 W under 3D load' },
      { label: 'Interface', value: 'PCIe 4.0 / 5.0 ×16 slot' }
    ],
    fails: 'Coloured horizontal artifact lines or checkerboards across the monitor, sudden driver crash resets while gaming, or no video output to connected displays.',
    clue: 'Click the heavy expansion card with its own fans, gold PCIe connector, and rear video ports.'
  },

  ssd: {
    id: 'ssd',
    number: 6,
    name: 'NVMe SSD',
    summary: 'Non-volatile high-speed solid-state storage that keeps files and the OS indefinitely without power.',
    body: [
      'A compact M.2 expansion card that mounts directly to the motherboard and communicates over high-speed PCI Express lanes using the NVM Express protocol. It uses 3D NAND flash memory cells to trap electrical charges in floating gates, preserving operating system files and games when power turns off.',
      'Unlike mechanical spinning hard drives that top out around 180 MB/s due to moving magnetic heads, modern PCIe 4.0 and 5.0 NVMe drives read and write data in parallel across multiple flash dies, achieving speeds exceeding 7000 MB/s with access latencies under 0.05 milliseconds.'
    ],
    specs: [
      { label: 'Sequential read', value: '3500 to 7300 MB/s (PCIe 4.0)' },
      { label: 'Interface', value: 'M.2 2280 form factor (PCIe ×4)' },
      { label: 'Capacity', value: '1 to 4 TB typical' },
      { label: 'Power active', value: 'About 4 to 8 W' }
    ],
    fails: 'The computer boots directly to BIOS saying "No bootable device found", or the filesystem abruptly switches to read-only mode after flash wear limits are exceeded.',
    clue: 'Click the slim rectangular gumstick card bolted near the processor that holds all permanent files.'
  },

  chipset: {
    id: 'chipset',
    number: 7,
    name: 'Chipset',
    summary: 'Secondary silicon hub coordinating data flow between processor, storage, USB, and audio buses.',
    body: [
      'A dedicated silicon controller soldered directly onto the lower motherboard beneath an aluminium heatsink. While high-bandwidth devices like the primary graphics card and M.2 SSD link straight to the processor, the chipset multiplexes slower peripheral channels including SATA ports, network controllers, USB headers, and audio chips.',
      'The link connecting the CPU and the chipset acts as an internal highway funnel. High-end motherboards supply dedicated heatsinks or heat-pipe connections for the chipset because heavy USB data transfers, secondary drives, and Ethernet traffic all pass simultaneously through this single controller.'
    ],
    specs: [
      { label: 'Uplink to CPU', value: 'DMI 4.0 / PCIe 4.0 ×4 or ×8' },
      { label: 'Downstream lanes', value: '12 to 20 general PCIe lanes' },
      { label: 'USB support', value: 'Up to 10 USB 3.2 Gen 2 ports' },
      { label: 'TDP rating', value: 'About 6 to 15 W' }
    ],
    fails: 'Intermittent disconnection of onboard USB devices, inability to detect secondary storage drives, or sudden loss of wired Ethernet network connections.',
    clue: 'Click the low-profile ribbed heatsink covering the secondary controller chip on the lower board.'
  },

  vrm: {
    id: 'vrm',
    number: 8,
    name: 'Voltage regulators (VRM)',
    summary: 'Steps down the 12-volt rail from the power supply into precise, stable voltages for the processor.',
    body: [
      'A tightly coordinated array of pulse-width modulation (PWM) controllers, driver MOSFET power stages, solid ferrite chokes, and polymer capacitors arranged along the top and left of the CPU socket. Modern processors require operating voltages near 1.1 V with instantaneous current spikes reaching 150 to 250 amperes.',
      'The VRM operates as a multi-phase buck converter, cycling power delivery sequentially across 12 to 18 individual power phases hundreds of thousands of times per second. This phase interleaving spreads electrical stress and heat evenly, keeping voltage ripples under a few millivolts.'
    ],
    specs: [
      { label: 'Phase count', value: '12 to 18 power phases typical' },
      { label: 'Output voltage', value: '0.8 to 1.45 V adjustable' },
      { label: 'Peak current', value: 'Up to 250 A combined' },
      { label: 'Operating temp', value: '50 to 85 °C under sustained load' }
    ],
    fails: 'Sudden motherboard throttling causing the processor clock to drop to 800 MHz, or random sudden power cuts without warning when the MOSFETs overheat.',
    clue: 'Click the bank of metal heatsinks, cube-shaped chokes, and capacitors bordering the processor socket.'
  },

  power: {
    id: 'power',
    number: 9,
    name: '24-pin power connector',
    summary: 'The main electrical umbilical receiving regulated multi-voltage direct current from the power supply.',
    body: [
      'A keyed nylon connector housing twenty-four gold-plated metal contact terminals. It delivers +12 V, +5 V, and +3.3 V direct current lines alongside multiple ground returns and control signals, supplying the base power consumed by the motherboard circuitry, chipset, memory slots, and PCIe buses.',
      'Pins on this socket are physically keyed with square and bevelled corners so the heavy power harness cannot be inserted upside down. It also features a latch clip on the outside wall that locks into the plug, preventing high-vibration loosening that could lead to electrical arcing.'
    ],
    specs: [
      { label: 'Pin configuration', value: '24 pins (ATX12V standard)' },
      { label: 'Voltage rails', value: '+12 V, +5 V, +3.3 V, -12 V, +5 Vsb' },
      { label: 'Current rating', value: 'Up to 6 A per pin' },
      { label: 'Keying', value: 'Polarised moulded housings' }
    ],
    fails: 'The machine fails to wake up from standby or power button presses do nothing, often caused by a loose locking latch or melted pin contact from resistance.',
    clue: 'Click the tall off-white 24-pin socket on the right edge where the main power cable plugs in.'
  },

  battery: {
    id: 'battery',
    number: 10,
    name: 'CMOS battery',
    summary: 'Maintains the real-time clock and hardware configuration settings when mains power is disconnected.',
    body: [
      'A 3-volt lithium manganese dioxide coin cell (standard CR2032) seated inside a horizontal plastic retention clip. When the computer is disconnected from the wall outlet or the power supply switch is flipped off, this tiny battery keeps the onboard real-time clock oscillator ticking and supplies standby power to the BIOS/UEFI CMOS SRAM chip.',
      'Even when your PC is unplugged in a shipping box for two years, the CMOS battery ensures the clock does not reset to January 1, 1970. If this battery drops below 2.5 V, your system loses its memory timing tweaks, fan curves, and boot priority selections on every power cycle.'
    ],
    specs: [
      { label: 'Cell chemistry', value: 'Lithium coin cell (CR2032)' },
      { label: 'Nominal voltage', value: '3.0 V (replaces at < 2.7 V)' },
      { label: 'Capacity', value: 'About 220 mAh' },
      { label: 'Lifespan', value: '3 to 5 years typical' }
    ],
    fails: 'The computer forgets custom BIOS overclock settings and prompts with "CMOS checksum error" or shows the wrong system clock time after every startup.',
    clue: 'Click the shiny circular 3-volt coin cell seated in a latch socket on the lower motherboard.'
  },

  io: {
    id: 'io',
    number: 11,
    name: 'Rear I/O ports',
    summary: 'Connects peripheral accessories, network cables, audio hardware, and external displays.',
    body: [
      'A metal-shielded block containing modular external interface sockets: USB Type-A and Type-C receptacles, RJ-45 Gigabit or 2.5 Gb Ethernet jacks, HDMI and DisplayPort sockets, Wi-Fi antenna terminals, and 3.5 mm analog audio jacks. It rests against the back panel cutout of your computer case.',
      'The metal housing around the ports is grounded directly to the computer case and motherboard ground planes to dissipate electrostatic discharge (ESD). When you plug in a static-charged metal USB cable, the spark is safely shunted away from sensitive digital data traces.'
    ],
    specs: [
      { label: 'USB ports', value: '6 to 12 ports (up to 20 Gbps)' },
      { label: 'Ethernet speed', value: '1 Gbps or 2.5 Gbps (RJ-45)' },
      { label: 'Audio channels', value: '7.1 channel HD analog + optical' },
      { label: 'Video out', value: 'HDMI 2.1 / DisplayPort 1.4' }
    ],
    fails: 'A port stops detecting plugged accessories or provides power without carrying data, usually caused by broken plastic center tongues or damaged ESD diodes.',
    clue: 'Click the tall metal bank of external sockets on the edge where you plug keyboards, mice, and network lines.'
  },

  sata: {
    id: 'sata',
    number: 12,
    name: 'SATA ports',
    summary: 'Serial ATA sockets for connecting secondary bulk mechanical hard drives and SATA optical devices.',
    body: [
      'Right-angled serial interface sockets arranged in pairs along the lower right perimeter of the circuit board. SATA cables use high-frequency differential signalling pairs to stream data back and forth to 2.5-inch and 3.5-inch storage drives.',
      'While M.2 NVMe drives connect over four PCIe lanes for extreme speed, SATA III operates at a modest 6 Gbit/s ceiling (roughly 550 MB/s real-world throughput). It remains standard on desktop boards because SATA cables can extend up to a meter, letting you mount four to eight mass-storage drives inside the PC case.'
    ],
    specs: [
      { label: 'Protocol', value: 'SATA Revision 3.0 (6 Gbit/s)' },
      { label: 'Peak transfer', value: 'About 550 to 600 MB/s' },
      { label: 'Pin count', value: '7-pin keyed connector' },
      { label: 'Port count', value: '4 to 6 ports typical' }
    ],
    fails: 'Hard drives fail to show in file explorer or report cyclic redundancy check (CRC) errors in SMART logs, often due to a loose cable latch or bent internal contact pin.',
    clue: 'Click the right-angle plastic ports on the edge used to attach ribbon cables for larger secondary drives.'
  }
};

export const HARDWARE_PART_LIST: PartData[] = Object.values(HARDWARE_PARTS);

export const HARDWARE_JOURNEY_STEPS: JourneyStep[] = [
  {
    stepNumber: 1,
    partId: 'ssd',
    title: 'Reading the file from storage',
    lede: 'The operating system issues a read request to the NVMe storage drive.',
    body: 'When you double-click a video file, the file system locates its raw data blocks on the NAND flash chips of the NVMe SSD. The drive’s memory controller streams the encoded stream across four PCIe lanes directly into the processor’s memory controller in a few milliseconds.'
  },
  {
    stepNumber: 2,
    partId: 'ram',
    title: 'Loading into high-speed memory',
    lede: 'A working copy lands in dynamic RAM so the processor can reach it immediately.',
    body: 'Storage is fast, but system RAM is roughly ten times faster with much lower latency. The video player buffers several seconds of compressed video packets directly into dual-channel RAM, ensuring smooth playback even if storage has brief background latency spikes.'
  },
  {
    stepNumber: 3,
    partId: 'cpu',
    title: 'Decoding instructions and audio',
    lede: 'The central processor parses the file container and routes streams to their destination.',
    body: 'Processor cores demux the video container into discrete audio, video, and subtitle tracks. The CPU decodes the digital audio stream, applies volume mixing, and dispatches raw video bitstream frames to the graphics card over the primary PCIe bus.'
  },
  {
    stepNumber: 4,
    partId: 'vrm',
    title: 'Supplying power under load',
    lede: 'Voltage regulators step down high amperage to keep processor voltages rock-steady.',
    body: 'As the processor spins up multiple execution cores to decode the stream, its current demand spikes by dozens of amperes in nanoseconds. The voltage regulator module smooths the incoming 12-volt current down to roughly 1.1 volts, preventing catastrophic voltage droop.'
  },
  {
    stepNumber: 5,
    partId: 'gpu',
    title: 'Rendering frames to your monitor',
    lede: 'Hardware video decoders on the graphics card turn bitstreams into displayed pixels.',
    body: 'Dedicated hardware decoders (such as NVDEC or VCN) on the graphics silicon decompress the video frames at sixty frames per second. The GPU writes final RGB pixels to its framebuffer memory and converts them to digital display signals transmitted out the rear display port.'
  },
  {
    stepNumber: 6,
    partId: 'cooler',
    title: 'Carrying heat into room air',
    lede: 'Copper heat pipes and aluminium fins dissipate the thermal energy created by the work.',
    body: 'Billions of transistor switching operations generate thermal energy inside the microscopic silicon die. Sintered copper heat pipes vaporise internal fluid to carry this heat up to the aluminium fin stack, where forced airflow from the fan carries it out into the room.'
  }
];

export { HARDWARE_LESSONS } from './lessons.ts';



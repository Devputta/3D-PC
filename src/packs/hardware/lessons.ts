/**
 * Boardwalk — PC Hardware Pack Lessons
 *
 * All 8 lessons strictly conform to the progressive disclosure Lesson schema:
 * - Title: max 3 words
 * - Goal: one plain sentence
 * - Callouts: max 5, max 2 lines (bold uppercase title <= 3 words, line < 8 words)
 * - Overview: description <= 2 sentences, exactly 3 facts
 * - Connections: from, to, label
 * - Example: <= 10 lines of code, one sentence explanation
 * - Specs: <= 6 rows
 * - Quiz: exactly 3 questions with 1-line explanations
 */

import { Lesson } from '../types.ts';

export const HARDWARE_LESSONS: Lesson[] = [
  {
    id: 'pc-lesson-1',
    number: 1,
    title: 'Motherboard Foundation',
    goal: 'Learn how the printed circuit board anchors and interconnects all computer hardware.',
    highlightParts: ['motherboard', 'chipset', 'power'],
    callouts: [
      { partId: 'motherboard', title: 'MAIN PCB', line: 'Carries copper signal traces across layers.' },
      { partId: 'chipset', title: 'PLATFORM CHIPSET', line: 'Directs traffic from slower peripheral buses.' },
      { partId: 'power', title: '24-PIN POWER', line: 'Receives DC power from the supply.' }
    ],
    overview: {
      description:
        'The motherboard is the primary printed circuit board (PCB) that anchors every component in your computer. It routes electrical power and high-speed data signals between chips through microscopic copper traces.',
      facts: [
        { icon: 'circuit', text: 'Sandwiches 6 to 12 laminated copper signal layers' },
        { icon: 'layers', text: 'ATX standard size measures 305 by 244 millimetres' },
        { icon: 'bolt', text: 'Operates low-voltage standby rails at 2.5 watts' }
      ]
    },
    connections: [
      { from: 'Power Supply', to: 'Motherboard', label: '24-pin ATX power harness' },
      { from: 'Motherboard', to: 'Chipset', label: 'Direct Media Interface bus' },
      { from: 'Chipset', to: 'SATA Ports', label: '6 Gbps serial storage links' }
    ],
    example: {
      language: 'bash',
      code: `# Inspect motherboard DMI hardware table
sudo dmidecode -t baseboard | grep -E "Manufacturer|Product"
# Read ACPI vendor identifier
cat /sys/class/dmi/id/board_vendor`,
      explanation: 'DMI (Desktop Management Interface) tables store motherboard model and revision numbers directly in firmware.',
      runAnimation: 'bus'
    },
    specs: [
      { label: 'Form factor', value: 'Standard ATX' },
      { label: 'PCB layers', value: '8 copper layers' },
      { label: 'PCIe version', value: 'PCIe 5.0 ready' },
      { label: 'Standby draw', value: '2.5 W quiescent' }
    ],
    quiz: [
      {
        question: 'What is the primary role of the motherboard?',
        options: [
          'It connects and powers all computer components.',
          'It only runs the 3D graphics rendering pipeline.',
          'It acts as long-term permanent file storage.',
          'It generates alternating current from the wall.'
        ],
        correctIndex: 0,
        explanation: 'The motherboard mechanically holds every component and routes signals through copper traces.'
      },
      {
        question: 'What happens if an internal copper trace inside the PCB breaks?',
        options: [
          'The computer will run at half speed only.',
          'The board fails intermittently or stops turning on.',
          'Only the display brightness decreases.',
          'Storage files automatically convert to text.'
        ],
        correctIndex: 1,
        explanation: 'Broken inner traces cut crucial power or clock signals, preventing reliable boot.'
      },
      {
        question: 'What bus connects the processor to the motherboard chipset?',
        options: [
          'DMI (Direct Media Interface)',
          'HDMI audio return channel',
          'VGA analogue video cable',
          'SATA optical disk ribbon'
        ],
        correctIndex: 0,
        explanation: 'DMI is the dedicated high-speed point-to-point link between CPU and motherboard chipset.'
      }
    ]
  },

  {
    id: 'pc-lesson-2',
    number: 2,
    title: 'Central Processor',
    goal: 'Understand how the CPU executes software code and calculates results.',
    highlightParts: ['cpu', 'vrm', 'motherboard'],
    callouts: [
      { partId: 'cpu', title: 'CPU DIE', line: 'Runs calculations billions of times per second.' },
      { partId: 'vrm', title: 'VOLTAGE REGULATOR', line: 'Steps down 12V to clean processor voltage.' }
    ],
    overview: {
      description:
        'The Central Processing Unit (CPU) is the computation brain that decodes and executes program instructions. It performs arithmetic and logic operations across multiple independent silicon cores.',
      facts: [
        { icon: 'cpu', text: 'Packs billions of transistors on a single die' },
        { icon: 'gauge', text: 'Clock speeds fluctuate between 3.2 and 5.8 GHz' },
        { icon: 'flame', text: 'Draws 65 to 253 watts of power under load' }
      ]
    },
    connections: [
      { from: 'VRM Module', to: 'CPU Socket', label: 'Clean 1.2V core power rail' },
      { from: 'CPU', to: 'RAM Slots', label: '128-bit dual-channel memory bus' },
      { from: 'CPU', to: 'PCIe x16', label: '16 direct high-speed graphics lanes' }
    ],
    example: {
      language: 'python',
      code: `import psutil
# Read CPU frequency and core count
cores = psutil.cpu_count(logical=True)
freq = psutil.cpu_freq()
print(f"Cores: {cores} | Current: {freq.current:.0f} MHz")`,
      explanation: 'The operating system reads processor core topology and frequency states from hardware registers.',
      runAnimation: 'dataflow'
    },
    specs: [
      { label: 'Socket type', value: 'LGA1700 / AM5' },
      { label: 'Core count', value: '16 cores (24 threads)' },
      { label: 'Base clock', value: '3.4 GHz base' },
      { label: 'Boost clock', value: '5.6 GHz turbo' },
      { label: 'L3 Cache', value: '30 MB unified' },
      { label: 'Peak TDP', value: '253 W thermal target' }
    ],
    quiz: [
      {
        question: 'What is the fundamental task of a processor core?',
        options: [
          'Fetch, decode, and execute software instructions.',
          'Store photos permanently while power is switched off.',
          'Transform DC voltage into AC wall power.',
          'Blow cold air across the metal heat pipes.'
        ],
        correctIndex: 0,
        explanation: 'CPUs fetch instructions from RAM, decode the opcodes, and execute logic calculations.'
      },
      {
        question: 'Why does the CPU require a Voltage Regulator Module (VRM)?',
        options: [
          'To boost battery life in laptops only.',
          'To convert 12V power down to sub-1.4V safely.',
          'To format hard drives into NTFS partitions.',
          'To connect Wi-Fi antennas to the motherboard.'
        ],
        correctIndex: 1,
        explanation: 'Sensitive CPU transistors will burn out if powered directly from raw 12V rails.'
      },
      {
        question: 'What does clock speed (gigahertz) measure in a processor?',
        options: [
          'The total weight of the copper heat spreader.',
          'How many clock cycles occur each second.',
          'The maximum volume of audio output.',
          'The number of USB devices plugged in.'
        ],
        correctIndex: 1,
        explanation: 'One gigahertz equals one billion internal clock synchronization pulses every second.'
      }
    ]
  },

  {
    id: 'pc-lesson-3',
    number: 3,
    title: 'System Memory',
    goal: 'Discover how Random Access Memory provides volatile high-speed workspace for running software.',
    highlightParts: ['ram', 'cpu'],
    callouts: [
      { partId: 'ram', title: 'DDR5 DIMM', line: 'Stores open programs with nanosecond latency.' },
      { partId: 'cpu', title: 'MEMORY CONTROLLER', line: 'Coordinates read and write memory transfers.' }
    ],
    overview: {
      description:
        'Random Access Memory (RAM) holds open operating system files and running software for instant access. It is volatile memory, meaning its contents vanish when you shut down the power.',
      facts: [
        { icon: 'zap', text: 'Operates with latency below 60 nanoseconds' },
        { icon: 'activity', text: 'Transfers data at 5600 megatransfers per second' },
        { icon: 'refresh', text: 'Capacitor cells refresh thousands of times per second' }
      ]
    },
    connections: [
      { from: 'RAM Sticks', to: 'CPU Socket', label: 'Dual 64-bit DDR5 memory channels' },
      { from: 'Motherboard', to: 'RAM Slot', label: '1.1V PMIC electrical power rail' }
    ],
    example: {
      language: 'bash',
      code: `# View total and available volatile system memory
free -h --si
# Check memory stick transfer speed
sudo dmidecode -t memory | grep -E "Speed|Size|Type"`,
      explanation: 'The free command displays active operating system memory buffers and cached disk pages.',
      runAnimation: 'dataflow'
    },
    specs: [
      { label: 'Technology', value: 'DDR5 SDRAM' },
      { label: 'Speed rating', value: '5600 MT/s' },
      { label: 'Operating V', value: '1.1 V nominal' },
      { label: 'Form factor', value: '288-pin DIMM' },
      { label: 'Bandwidth', value: '89.6 GB/s dual-channel' },
      { label: 'Latency', value: 'CL36 (12.8 ns)' }
    ],
    quiz: [
      {
        question: 'What does volatile memory mean in computer hardware?',
        options: [
          'Data is permanently saved to flash chips forever.',
          'Contents disappear immediately when power turns off.',
          'Data is encrypted with biometric fingerprints.',
          'The memory chips catch fire under heavy load.'
        ],
        correctIndex: 1,
        explanation: 'RAM cells rely on electrical charge that leaks away without continuous power refresh.'
      },
      {
        question: 'Why is installing two matched RAM sticks better than one stick?',
        options: [
          'It activates dual-channel mode to double bus width.',
          'It makes the monitor display higher brightness.',
          'It stops CPU cooling fans from making noise.',
          'It connects the computer to two separate Wi-Fi routers.'
        ],
        correctIndex: 0,
        explanation: 'Dual-channel mode widens the data path from 64 to 128 bits, doubling peak transfer rates.'
      },
      {
        question: 'How fast is typical DDR5 RAM access compared to SSD storage?',
        options: [
          'RAM is roughly ten times slower than an SSD.',
          'RAM and SSD operate at identical microsecond speeds.',
          'RAM responds in nanoseconds, thousands of times faster.',
          'RAM access speed depends only on internet ping.'
        ],
        correctIndex: 2,
        explanation: 'DRAM access takes about 50 nanoseconds, while NVMe SSD access takes 50,000 nanoseconds.'
      }
    ]
  },

  {
    id: 'pc-lesson-4',
    number: 4,
    title: 'Graphics Acceleration',
    goal: 'Explore how the GPU accelerates 3D matrix math and drives external displays.',
    highlightParts: ['gpu', 'cpu', 'power'],
    callouts: [
      { partId: 'gpu', title: 'GRAPHICS CARD', line: 'Processes thousands of pixels in parallel.' },
      { partId: 'power', title: 'PCIE POWER', line: 'Supplies high-current 12V to graphics card.' }
    ],
    overview: {
      description:
        'The Graphics Processing Unit (GPU) renders 3D graphics, physics simulations, and video output. It contains thousands of compact compute cores that execute the same math operation on millions of pixels simultaneously.',
      facts: [
        { icon: 'grid', text: 'Features over 5,000 parallel shader execution cores' },
        { icon: 'layers', text: 'Includes high-bandwidth dedicated GDDR6 video RAM' },
        { icon: 'monitor', text: 'Generates DisplayPort 2.1 and HDMI 2.1 video signals' }
      ]
    },
    connections: [
      { from: 'CPU', to: 'GPU PCIe Slot', label: '16 high-speed PCIe 5.0 data lanes' },
      { from: 'PSU', to: 'GPU Aux Header', label: '12VHPWR 450W power connector' },
      { from: 'GPU', to: 'Computer Monitor', label: 'DisplayPort video output stream' }
    ],
    example: {
      language: 'bash',
      code: `# Verify PCIe link negotiation for the graphics card
lspci -vnn | grep -A 4 -i vga
# Query active GPU temperature and power draw
nvidia-smi --query-gpu=temperature.gpu,power.draw --format=csv`,
      explanation: 'Modern graphics cards report live operating telemetry, fan speed, and power draw over PCIe.',
      runAnimation: 'dataflow'
    },
    specs: [
      { label: 'Slot type', value: 'PCIe 5.0 x16' },
      { label: 'VRAM capacity', value: '12 GB GDDR6X' },
      { label: 'Memory bus', value: '192-bit interface' },
      { label: 'Shader cores', value: '5,888 CUDA cores' },
      { label: 'Total power', value: '200 W TGP' },
      { label: 'Bandwidth', value: '504 GB/s throughput' }
    ],
    quiz: [
      {
        question: 'Where must you plug the monitor video cable when using a graphics card?',
        options: [
          'Into the ports on the graphics card itself.',
          'Into the motherboard top HDMI port.',
          'Into any standard USB port on the front panel.',
          'Directly into the wall electrical socket.'
        ],
        correctIndex: 0,
        explanation: 'Plugging into the motherboard uses slower integrated graphics instead of the dedicated card.'
      },
      {
        question: 'How does GPU architecture differ from CPU architecture?',
        options: [
          'The GPU has a few fast cores; CPU has thousands of slow cores.',
          'The GPU has thousands of cores designed for parallel math.',
          'The GPU cannot calculate any numbers.',
          'The GPU only operates when the computer is disconnected from Wi-Fi.'
        ],
        correctIndex: 1,
        explanation: 'GPUs excel at running identical pixel calculations across thousands of parallel cores.'
      },
      {
        question: 'What interface slot physically mounts the graphics card?',
        options: [
          'PCIe x16 expansion slot',
          'SATA optical drive bay',
          'M.2 Wi-Fi card slot',
          'DDR5 RAM socket'
        ],
        correctIndex: 0,
        explanation: 'PCIe x16 provides the sixteen dedicated high-speed lanes needed for heavy 3D frame throughput.'
      }
    ]
  },

  {
    id: 'pc-lesson-5',
    number: 5,
    title: 'Solid State Storage',
    goal: 'Learn how NVMe solid state drives save data permanently without moving parts.',
    highlightParts: ['ssd', 'chipset', 'cpu'],
    callouts: [
      { partId: 'ssd', title: 'NVME M.2 SSD', line: 'Stores your files permanently on flash memory.' },
      { partId: 'cpu', title: 'PCIE LANES', line: 'Carries direct storage data to the processor.' }
    ],
    overview: {
      description:
        'Solid State Drives (SSDs) store the operating system, games, and personal files permanently using NAND flash memory chips. Because they contain no moving parts, NVMe drives access files nearly instantaneously.',
      facts: [
        { icon: 'save', text: 'Preserves saved files with zero electrical power' },
        { icon: 'zap', text: 'Sequential read speeds reach 7,000 megabytes per second' },
        { icon: 'shield', text: 'Withstands physical bumps without mechanical head crashes' }
      ]
    },
    connections: [
      { from: 'M.2 Socket', to: 'CPU', label: '4 dedicated PCIe 4.0 data lanes' },
      { from: 'Motherboard', to: 'M.2 SSD', label: '3.3V power and ground traces' }
    ],
    example: {
      language: 'bash',
      code: `# List physical storage drives and mount points
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
# Check NVMe solid state drive health and temperature
sudo nvme smart-log /dev/nvme0n1`,
      explanation: 'The NVMe protocol connects directly to processor PCIe lanes without legacy SATA bottlenecking.',
      runAnimation: 'dataflow'
    },
    specs: [
      { label: 'Form factor', value: 'M.2 2280' },
      { label: 'Interface', value: 'PCIe 4.0 x4 NVMe' },
      { label: 'Sequential read', value: '7,400 MB/s' },
      { label: 'Sequential write', value: '6,800 MB/s' },
      { label: 'Random IOPS', value: '1,000,000 IOPS' },
      { label: 'Flash type', value: '3D TLC NAND' }
    ],
    quiz: [
      {
        question: 'Why are NVMe SSDs significantly faster than mechanical hard drives?',
        options: [
          'SSDs have microscopic motors that spin twice as fast.',
          'SSDs read flash chips electrically with no moving parts.',
          'SSDs only store compressed text files.',
          'SSDs connect using external USB cables.'
        ],
        correctIndex: 1,
        explanation: 'Mechanical drives wait milliseconds for magnetic platters to spin; SSDs access flash chips electronically.'
      },
      {
        question: 'What does non-volatile storage mean?',
        options: [
          'Saved files remain intact even after the computer powers off.',
          'Files are automatically deleted every ten minutes.',
          'The drive requires liquid cooling to avoid exploding.',
          'Only administrative users can open documents.'
        ],
        correctIndex: 0,
        explanation: 'Non-volatile flash cells trap electrons in microscopic floating gates without power.'
      },
      {
        question: 'Which slot format do modern desktop NVMe SSDs plug into?',
        options: [
          'M.2 slot on the motherboard',
          'VGA 15-pin analogue port',
          'Front headphone 3.5mm jack',
          'Ethernet RJ-45 socket'
        ],
        correctIndex: 0,
        explanation: 'The M.2 format mounts the small gumstick drive flat against the motherboard surface.'
      }
    ]
  },

  {
    id: 'pc-lesson-6',
    number: 6,
    title: 'Power Delivery',
    goal: 'Understand how the Power Supply Unit converts wall electricity into clean DC rails.',
    highlightParts: ['power', 'vrm', 'motherboard'],
    callouts: [
      { partId: 'power', title: 'POWER SUPPLY', line: 'Converts AC wall voltage to stable DC.' },
      { partId: 'vrm', title: 'VRM CHOKES', line: 'Filters current for sensitive silicone components.' }
    ],
    overview: {
      description:
        'The Power Supply Unit (PSU) converts dangerous 120V or 240V alternating current (AC) from the wall into safe direct current (DC). It distributes clean +12V, +5V, and +3.3V power rails to your components.',
      facts: [
        { icon: 'shield', text: '80 PLUS rating guarantees at least 85% energy efficiency' },
        { icon: 'bolt', text: 'Supplies heavy 50-ampere current along the 12-volt rail' },
        { icon: 'check', text: 'Protects hardware with over-voltage and short-circuit cutoff' }
      ]
    },
    connections: [
      { from: 'Wall Outlet', to: 'PSU Input', label: '120V / 240V AC alternating current' },
      { from: 'PSU', to: 'Motherboard', label: '24-pin ATX +12V, +5V, +3.3V harness' },
      { from: 'PSU', to: 'CPU EPS Socket', label: '8-pin dedicated +12V processor cable' }
    ],
    example: {
      language: 'bash',
      code: `# Read motherboard voltage sensor telemetries
sensors | grep -E "in0|\\+12V|\\+5V|\\+3.3V"
# Typical output:
# +12V:   +12.08 V  (limit ±5%)
# +5V:    +5.02 V   (limit ±5%)`,
      explanation: 'Motherboard sensors verify that power delivery rails stay within strict voltage tolerances.',
      runAnimation: 'powerflow'
    },
    specs: [
      { label: 'Wattage rating', value: '750 Watts continuous' },
      { label: 'Efficiency', value: '80 PLUS Gold certified' },
      { label: '+12V single rail', value: '62.5 Amperes (750 W)' },
      { label: 'Safety circuits', value: 'OVP, UVP, OCP, SCP' },
      { label: 'Form factor', value: 'Standard ATX PS/2' },
      { label: 'Modularity', value: 'Fully modular cables' }
    ],
    quiz: [
      {
        question: 'What is the main task of the computer power supply?',
        options: [
          'Convert high-voltage AC wall current into safe low-voltage DC.',
          'Store temporary browser tabs in memory.',
          'Calculate 3D lighting shaders for games.',
          'Transmit radio waves to the Wi-Fi router.'
        ],
        correctIndex: 0,
        explanation: 'Computer chips need smooth direct current (DC), whereas wall plugs supply alternating current (AC).'
      },
      {
        question: 'What happens if a power supply wattage is too low for the graphics card?',
        options: [
          'The PC abruptly shuts down under heavy gaming load.',
          'The monitor screen permanently changes color to green.',
          'The keyboard keys type backward letters.',
          'The internet download speed drops to zero.'
        ],
        correctIndex: 0,
        explanation: 'Over-current protection kicks in and powers off the system to prevent electrical fires.'
      },
      {
        question: 'Which voltage rail powers the CPU and modern graphics cards?',
        options: [
          '+12V direct current rail',
          '-220V alternating current line',
          '+1.5V alkaline battery trace',
          '+48V phantom audio header'
        ],
        correctIndex: 0,
        explanation: 'The +12V rail delivers the heavy amperage demanded by processors and graphics cards.'
      }
    ]
  },

  {
    id: 'pc-lesson-7',
    number: 7,
    title: 'Thermal Cooling',
    goal: 'See how heat sinks, copper pipes, and fans prevent thermal throttling.',
    highlightParts: ['cooler', 'cpu'],
    callouts: [
      { partId: 'cooler', title: 'CPU COOLER', line: 'Draws intense heat away from the silicon die.' },
      { partId: 'cpu', title: 'HEAT SPREADER', line: 'Spreads heat evenly to the copper cooler base.' }
    ],
    overview: {
      description:
        'Computer chips generate intense heat while calculating software instructions. The cooling assembly pulls heat away from the chip using sealed copper heat pipes and aluminium fins so fans can exhaust it into room air.',
      facts: [
        { icon: 'wind', text: 'Increases cooling contact surface area by fifty times' },
        { icon: 'droplet', text: 'Heat pipes cycle vaporising and condensing fluid' },
        { icon: 'thermometer', text: 'Keeps CPU temperature well below its 100°C safe limit' }
      ]
    },
    connections: [
      { from: 'CPU Heat Spreader', to: 'Cooler Base', label: 'Thermal paste conductive layer' },
      { from: 'Cooler Base', to: 'Aluminium Fins', label: 'Phase-change copper heat pipes' },
      { from: 'Motherboard', to: 'Cooler Fan', label: '4-pin PWM fan speed signal' }
    ],
    example: {
      language: 'bash',
      code: `# Monitor real-time processor core temperatures
sensors | grep -i "core 0"
# Observe cooling fan revolutions per minute
sensors | grep -i "fan1"`,
      explanation: 'The motherboard PWM (Pulse Width Modulation) circuit speeds up the fan when chip temperatures rise.',
      runAnimation: 'bus'
    },
    specs: [
      { label: 'Cooling type', value: 'Tower air heatsink' },
      { label: 'Heat pipes', value: '4 sintered copper pipes' },
      { label: 'Fin count', value: '48 aluminium fins' },
      { label: 'Fan RPM', value: '600 to 1800 RPM' },
      { label: 'TDP capacity', value: '220 Watts thermal' },
      { label: 'Sound level', value: 'Under 26 dBA' }
    ],
    quiz: [
      {
        question: 'Why is thermal paste applied between the CPU and cooler?',
        options: [
          'It fills microscopic air pockets to conduct heat efficiently.',
          'It permanently glues the cooler so it can never be removed.',
          'It acts as electrical insulation to stop static shocks.',
          'It adds decorative color inside the case.'
        ],
        correctIndex: 0,
        explanation: 'Trapped microscopic air acts as a heat insulator; thermal paste conducts heat effectively.'
      },
      {
        question: 'What is thermal throttling in computer processors?',
        options: [
          'The CPU automatically slows down its clock speed to avoid overheating.',
          'The cooling fan reverses direction to warm up the room.',
          'The hard drive permanently wipes all downloaded software.',
          'The power supply switches from DC back to AC.'
        ],
        correctIndex: 0,
        explanation: 'To prevent permanent silicon damage, modern chips drop clock speeds when exceeding ~95°C.'
      },
      {
        question: 'How do sintered copper heat pipes move heat so fast?',
        options: [
          'Internal liquid vaporises at the hot end and condenses at the cold end.',
          'Miniature electric pumps push water back and forth.',
          'They use magnets to pull electrons through the metal.',
          'They suck cold air directly into the silicon die.'
        ],
        correctIndex: 0,
        explanation: 'Phase-change fluid absorbs latent heat by vaporising, moving up to the fin stack to condense.'
      }
    ]
  },

  {
    id: 'pc-lesson-8',
    number: 8,
    title: 'Chipset and Ports',
    goal: 'Understand peripheral connectivity through motherboard I/O and expansion ports.',
    highlightParts: ['io', 'chipset', 'motherboard', 'sata', 'battery'],
    callouts: [
      { partId: 'io', title: 'REAR I/O', line: 'Connects external USB, network, and audio gear.' },
      { partId: 'chipset', title: 'CHIPSET CONTROLLER', line: 'Manages SATA, USB, and audio communications.' },
      { partId: 'battery', title: 'CMOS BATTERY', line: 'Maintains BIOS clock while unpowered.' }
    ],
    overview: {
      description:
        'The motherboard rear I/O panel connects mice, keyboards, network cables, and audio hardware. The platform chipset manages these peripheral channels without overloading the processor.',
      facts: [
        { icon: 'network', text: 'Provides 2.5 Gbps Ethernet network communication' },
        { icon: 'usb', text: 'USB-C ports deliver up to 20 Gbps data bandwidth' },
        { icon: 'clock', text: 'CR2032 coin battery keeps hardware time settings' }
      ]
    },
    connections: [
      { from: 'Rear I/O Panel', to: 'Chipset', label: 'USB 3.2 and audio bus traces' },
      { from: 'Chipset', to: 'Ethernet PHY', label: 'PCIe 2.5G network controller' },
      { from: 'CMOS Battery', to: 'RTC Circuit', label: '3V constant backup power' }
    ],
    example: {
      language: 'bash',
      code: `# List all connected USB peripheral devices
lsusb -t
# Verify Ethernet network interface link speed
ethtool eth0 | grep "Speed:"`,
      explanation: 'The operating system probes chipset bus controllers to detect attached keyboards, drives, and network links.',
      runAnimation: 'bus'
    },
    specs: [
      { label: 'Ethernet', value: '2.5 Gigabit RJ-45' },
      { label: 'USB ports', value: '2x USB-C, 6x USB-A' },
      { label: 'Audio codec', value: '7.1 High Definition' },
      { label: 'SATA headers', value: '4x SATA 6 Gbps' },
      { label: 'BIOS storage', value: '256 Mb UEFI SPI flash' },
      { label: 'RTC Battery', value: 'CR2032 3V coin cell' }
    ],
    quiz: [
      {
        question: 'What is the purpose of the round CR2032 coin battery on the motherboard?',
        options: [
          'It preserves hardware clock time and BIOS settings when unplugged.',
          'It powers the graphics card when gaming outdoors.',
          'It spins the processor cooling fan during blackouts.',
          'It charges wireless mice connected via Bluetooth.'
        ],
        correctIndex: 0,
        explanation: 'The coin battery keeps the real-time clock (RTC) running and sustains low-power CMOS memory.'
      },
      {
        question: 'What does the motherboard rear I/O panel do?',
        options: [
          'It exposes external ports for keyboard, mouse, network, and audio.',
          'It converts AC wall voltage into 12V DC power.',
          'It mounts the thermal cooling heat pipes.',
          'It stores the operating system files permanently.'
        ],
        correctIndex: 0,
        explanation: 'The I/O (Input/Output) shield brings internal controller ports to the exterior of the PC case.'
      },
      {
        question: 'Why does the motherboard have a chipset rather than connecting all ports to the CPU?',
        options: [
          'It saves CPU pins by aggregating dozens of slower peripheral devices.',
          'The CPU cannot understand USB protocol packets.',
          'Chipsets are required by international radio regulations.',
          'Chipsets eliminate the need for computer RAM memory.'
        ],
        correctIndex: 0,
        explanation: 'Directly wiring every USB, audio, and SATA port to the CPU would require huge, costly sockets.'
      }
    ]
  }
];

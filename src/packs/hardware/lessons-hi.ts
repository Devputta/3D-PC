/**
 * Boardwalk — PC Hardware Pack Lessons (Hindi Localization)
 *
 * Keeps technical terms like Motherboard, CPU, RAM, SSD, GPU, PSU, and PCIe in English letters.
 */

import { LocalizedLesson } from '../types.ts';

export const HARDWARE_LESSONS_HI: Record<string, LocalizedLesson> = {
  'pc-lesson-1': {
    id: 'pc-lesson-1',
    title: 'Motherboard आधार',
    goal: 'जानें कि कैसे printed circuit board सभी कंप्यूटर hardware को जोड़ता है।',
    callouts: [
      { partId: 'motherboard', title: 'MAIN PCB', line: 'तांबे के signal traces ले जाता है।' },
      { partId: 'chipset', title: 'CHIPSET CONTROLLER', line: 'धीमे peripheral buses का traffic संभालता है।' },
      { partId: 'power', title: '24-PIN POWER', line: 'Power supply से DC बिजली लेता है।' }
    ],
    overview: {
      description:
        'Motherboard मुख्य printed circuit board (PCB) है जो कंप्यूटर के हर हिस्से को जोड़ता है। यह बारीक copper traces के जरिए बिजली और data signals पहुंचाता है।',
      facts: [
        { icon: 'circuit', text: '6 से 12 तांबे की signal परतें जोड़ता है' },
        { icon: 'layers', text: 'ATX standard 305 × 244 mm माप का होता है' },
        { icon: 'bolt', text: 'Standby मोड में केवल 2.5 वाट बिजली लेता है' }
      ]
    },
    connections: [
      { from: 'Power Supply', to: 'Motherboard', label: '24-pin ATX power harness' },
      { from: 'Motherboard', to: 'Chipset', label: 'Direct Media Interface bus' },
      { from: 'Chipset', to: 'SATA Ports', label: '6 Gbps serial storage links' }
    ],
    example: {
      explanation: 'DMI tables सीधे firmware में Motherboard के model और revision नंबर रखते हैं।'
    },
    specs: [
      { label: 'Form factor', value: 'Standard ATX' },
      { label: 'PCB layers', value: '8 copper layers' },
      { label: 'PCIe version', value: 'PCIe 5.0 ready' },
      { label: 'Standby draw', value: '2.5 W quiescent' }
    ],
    quiz: [
      {
        question: 'Motherboard का मुख्य कार्य क्या है?',
        options: [
          'यह सभी कंप्यूटर components को जोड़ता और बिजली देता है।',
          'यह केवल 3D graphics rendering चलाता है।',
          'यह स्थाई रूप से फाइलों को store करता है।',
          'यह दीवार से AC बिजली बनाता है।'
        ],
        explanation: 'Motherboard हर component को जोड़ता है और copper traces से signal पहुंचाता है।'
      },
      {
        question: 'यदि PCB के अंदरूनी तांबे का trace टूट जाए तो क्या होगा?',
        options: [
          'कंप्यूटर केवल आधी गति पर चलेगा।',
          'Board रुक-रुक कर काम करेगा या ऑन होना बंद हो जाएगा।',
          'केवल स्क्रीन की चमक कम हो जाएगी।',
          'सभी फाइलें text में बदल जाएंगी।'
        ],
        explanation: 'आंतरिक traces टूटने से बिजली या clock signal कट जाते हैं, जिससे boot नहीं हो पाता।'
      },
      {
        question: 'Processor को Motherboard chipset से कौन सा bus जोड़ता है?',
        options: [
          'DMI (Direct Media Interface)',
          'HDMI audio return channel',
          'VGA analogue cable',
          'SATA optical ribbon'
        ],
        explanation: 'DMI, CPU और chipset के बीच का dedicated high-speed link है।'
      }
    ]
  },

  'pc-lesson-2': {
    id: 'pc-lesson-2',
    title: 'Central Processor',
    goal: 'समझें कि CPU कैसे software code को चलाता है और गणनाएं करता है।',
    callouts: [
      { partId: 'cpu', title: 'CPU DIE', line: 'प्रति सेकंड अरबों गणनाएं करता है।' },
      { partId: 'vrm', title: 'VOLTAGE REGULATOR', line: '12V को सुरक्षित processor voltage में बदलता है।' }
    ],
    overview: {
      description:
        'Central Processing Unit (CPU) कंप्यूटर का दिमाग है जो software instructions को समझता और चलाता है। यह कई independent silicon cores में गणितीय और तार्किक कार्य करता है।',
      facts: [
        { icon: 'cpu', text: 'एक ही चिप पर अरबों microscopic transistors होते हैं' },
        { icon: 'gauge', text: 'Clock speed 3.2 से 5.8 GHz के बीच चलती है' },
        { icon: 'flame', text: 'भारी काम के दौरान 65 से 253 वाट बिजली लेता है' }
      ]
    },
    connections: [
      { from: 'VRM Module', to: 'CPU Socket', label: '1.2V core power rail' },
      { from: 'CPU', to: 'RAM Slots', label: '128-bit dual-channel memory bus' },
      { from: 'CPU', to: 'PCIe x16', label: '16 direct high-speed graphics lanes' }
    ],
    example: {
      explanation: 'Operating system hardware registers से CPU cores और frequency की स्थिति पढ़ता है।'
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
        question: 'Processor core का मूल कार्य क्या है?',
        options: [
          'Software instructions को fetch, decode और execute करना।',
          'बिजली बंद होने पर तस्वीरों को स्थाई सुरक्षित रखना।',
          'DC voltage को AC wall power में बदलना।',
          'Metal heat pipes पर ठंडी हवा फेंकना।'
        ],
        explanation: 'CPU मेमोरी से निर्देश लेता है, decode करता है और execute करता है।'
      },
      {
        question: 'CPU को Voltage Regulator Module (VRM) की आवश्यकता क्यों होती है?',
        options: [
          'केवल laptops में battery life बढ़ाने के लिए।',
          '12V बिजली को सुरक्षित sub-1.4V में बदलने के लिए।',
          'Hard drives को NTFS में format करने के लिए।',
          'Wi-Fi antennas को जोड़ने के लिए।'
        ],
        explanation: '12V सीधे मिलने पर CPU के संवेदनशील transistors जल जाएंगे।'
      },
      {
        question: 'Processor में clock speed (GHz) क्या मापती है?',
        options: [
          'Copper heat spreader का कुल वजन।',
          'प्रति सेकंड कितने clock cycles होते हैं।',
          'Audio output का अधिकतम volume।',
          'जुड़े हुए USB devices की संख्या।'
        ],
        explanation: 'एक GHz का अर्थ है प्रति सेकंड एक अरब आंतरिक synchronization pulses।'
      }
    ]
  },

  'pc-lesson-3': {
    id: 'pc-lesson-3',
    title: 'System Memory',
    goal: 'जानें कि RAM चालू software के लिए बहुत तेज़ अस्थायी कार्यस्थल कैसे प्रदान करती है।',
    callouts: [
      { partId: 'ram', title: 'DDR5 DIMM', line: 'चालू programs को nanoseconds में पढ़ता है।' },
      { partId: 'cpu', title: 'MEMORY CONTROLLER', line: 'RAM के read और write का समन्वय करता है।' }
    ],
    overview: {
      description:
        'Random Access Memory (RAM) चालू software और operating system फाइलों को तुरंत इस्तेमाल के लिए रखती है। यह volatile memory है, यानी बिजली बंद होते ही इसका सारा data मिट जाता है।',
      facts: [
        { icon: 'zap', text: '60 nanoseconds से कम समय में प्रतिक्रिया देती है' },
        { icon: 'activity', text: '5600 MT/s की दर से data transfer करती है' },
        { icon: 'refresh', text: 'प्रति सेकंड हजारों बार refresh की जाती है' }
      ]
    },
    connections: [
      { from: 'RAM Sticks', to: 'CPU Socket', label: 'Dual 64-bit DDR5 memory channels' },
      { from: 'Motherboard', to: 'RAM Slot', label: '1.1V PMIC electrical power rail' }
    ],
    example: {
      explanation: 'free कमांड memory buffers और cached disk pages की जानकारी दिखाता है।'
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
        question: 'कंप्यूटर hardware में volatile memory का क्या अर्थ है?',
        options: [
          'Data हमेशा के लिए flash chips में सुरक्षित रहता है।',
          'बिजली बंद होते ही सारा data मिट जाता है।',
          'Data फिंगरप्रिंट से सुरक्षित रहता है।',
          'Memory चिप्स भारी लोड में जल जाती हैं।'
        ],
        explanation: 'RAM cells में विद्युत आवेश होता है जो बिजली कटते ही समाप्त हो जाता है।'
      },
      {
        question: 'एक की जगह दो matched RAM sticks लगाना बेहतर क्यों है?',
        options: [
          'यह dual-channel मोड चालू कर bus width दोगुनी कर देता है।',
          'यह मॉनिटर की चमक बढ़ा देता है।',
          'यह पंखे की आवाज़ को बंद कर देता है।',
          'यह दो अलग Wi-Fi routers से जोड़ता है।'
        ],
        explanation: 'Dual-channel मोड 64 से 128 bits चौड़ा रास्ता बनाकर speed दोगुनी कर देता है।'
      },
      {
        question: 'SSD की तुलना में DDR5 RAM कितनी तेज़ होती है?',
        options: [
          'RAM, SSD से दस गुना धीमी होती है।',
          'RAM और SSD दोनों की गति बराबर होती है।',
          'RAM nanoseconds में काम करती है, हजारों गुना तेज़।',
          'RAM की गति केवल internet ping पर निर्भर करती है।'
        ],
        explanation: 'RAM लगभग 50 nanoseconds में उत्तर देती है, जबकि NVMe SSD 50,000 nanoseconds लेता है।'
      }
    ]
  },

  'pc-lesson-4': {
    id: 'pc-lesson-4',
    title: 'Graphics Acceleration',
    goal: 'देखें कि GPU कैसे 3D graphics को तेज करता है और डिस्प्ले को चलाता है।',
    callouts: [
      { partId: 'gpu', title: 'GRAPHICS CARD', line: 'हजारों pixels को एक साथ process करता है।' },
      { partId: 'power', title: 'PCIE POWER', line: 'Graphics card को उच्च 12V बिजली देता है।' }
    ],
    overview: {
      description:
        'Graphics Processing Unit (GPU) 3D graphics, physics और video output को रेंडर करता है। इसमें हजारों छोटे cores होते हैं जो एक साथ लाखों pixels पर एक जैसा गणितीय कार्य करते हैं।',
      facts: [
        { icon: 'grid', text: '5,000 से अधिक parallel shader execution cores' },
        { icon: 'layers', text: 'हाई-स्पीड dedicated GDDR6 video RAM शामिल है' },
        { icon: 'monitor', text: 'DisplayPort 2.1 और HDMI 2.1 video signals बनाता है' }
      ]
    },
    connections: [
      { from: 'CPU', to: 'GPU PCIe Slot', label: '16 high-speed PCIe 5.0 data lanes' },
      { from: 'PSU', to: 'GPU Aux Header', label: '12VHPWR 450W power connector' },
      { from: 'GPU', to: 'Computer Monitor', label: 'DisplayPort video output stream' }
    ],
    example: {
      explanation: 'Modern graphics cards PCIe के जरिए तापमान और बिजली खपत की जानकारी भेजते हैं।'
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
        question: 'Dedicated graphics card होने पर मॉनिटर केबल कहाँ जोड़नी चाहिए?',
        options: [
          'सीधे graphics card के अपने ports में।',
          'Motherboard के ऊपर वाले HDMI port में।',
          'Front panel के किसी भी USB port में।',
          'दीवार के बिजली बोर्ड में।'
        ],
        explanation: 'Motherboard में जोड़ने से धीमा integrated graphics चलने लगता है।'
      },
      {
        question: 'GPU की संरचना CPU से किस प्रकार भिन्न है?',
        options: [
          'GPU में कुछ तेज़ cores होते हैं, CPU में हजारों धीमे cores।',
          'GPU में हजारों cores parallel गणित के लिए बने होते हैं।',
          'GPU कोई भी संख्या नहीं गिन सकता।',
          'GPU केवल Wi-Fi बंद होने पर काम करता है।'
        ],
        explanation: 'GPU parallel गणित में माहिर है ताकि लाखों pixels एक साथ रेंडर हो सकें।'
      },
      {
        question: 'Graphics card किस slot में लगाया जाता है?',
        options: [
          'PCIe x16 expansion slot',
          'SATA optical drive bay',
          'M.2 Wi-Fi slot',
          'DDR5 RAM socket'
        ],
        explanation: 'PCIe x16 में 16 तेज lanes होती हैं जो 3D frames को बिना रुकावट भेजती हैं।'
      }
    ]
  },

  'pc-lesson-5': {
    id: 'pc-lesson-5',
    title: 'Solid State Storage',
    goal: 'जानें कि NVMe SSDs बिना किसी हिलने वाले हिस्से के डेटा कैसे सुरक्षित रखती हैं।',
    callouts: [
      { partId: 'ssd', title: 'NVME M.2 SSD', line: 'Flash memory में फाइलों को स्थाई रखता है।' },
      { partId: 'cpu', title: 'PCIE LANES', line: 'सीधे processor तक storage data ले जाता है।' }
    ],
    overview: {
      description:
        'Solid State Drive (SSD) operating system और फाइलों को बिना बिजली के भी सुरक्षित रखती है। क्योंकि इसमें कोई घूमने वाला हिस्सा नहीं होता, यह फाइलों को तुरंत खोलती है।',
      facts: [
        { icon: 'save', text: 'बिना बिजली के भी फाइलों को सुरक्षित रखता है' },
        { icon: 'zap', text: 'Sequential read गति 7,000 MB/s तक पहुंचती है' },
        { icon: 'shield', text: 'झटकों से खराब नहीं होता क्योंकि कोई moving head नहीं है' }
      ]
    },
    connections: [
      { from: 'M.2 Socket', to: 'CPU', label: '4 dedicated PCIe 4.0 data lanes' },
      { from: 'Motherboard', to: 'M.2 SSD', label: '3.3V power and ground traces' }
    ],
    example: {
      explanation: 'NVMe protocol बिना किसी SATA रुकावट के सीधे CPU PCIe lanes से जुड़ता है।'
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
        question: 'NVMe SSDs पुरानी hard drives से बहुत तेज़ क्यों होती हैं?',
        options: [
          'SSDs में मोटर दोगुनी तेज़ घूमती है।',
          'SSDs बिना घूमने वाले पुर्जों के इलेक्ट्रॉनिक रूप से flash पढ़ती हैं।',
          'SSDs केवल छोटी text फाइलें रखती हैं।',
          'SSDs बाहरी USB केबल से जुड़ती हैं।'
        ],
        explanation: 'Mechanical drives में डिस्क घूमने का इंतज़ार होता है; SSDs में बिजली से तुरंत पढ़ा जाता है।'
      },
      {
        question: 'Non-volatile storage का क्या अर्थ है?',
        options: [
          'बिजली बंद होने के बाद भी फाइलें सुरक्षित रहती हैं।',
          'फाइलें हर 10 मिनट में अपने आप मिट जाती हैं।',
          'ड्राइव को फटने से बचाने के लिए पानी चाहिए।',
          'केवल admin ही फाइलों को खोल सकते हैं।'
        ],
        explanation: 'Non-volatile flash cells बिना बिजली के भी electrons को रोके रखती हैं।'
      },
      {
        question: 'Modern NVMe SSDs Motherboard के किस slot में लगाई जाती हैं?',
        options: [
          'M.2 slot',
          'VGA 15-pin port',
          '3.5mm headphone jack',
          'RJ-45 Ethernet socket'
        ],
        explanation: 'M.2 slot छोटी SSD पट्टी को सीधे Motherboard की सतह पर लगाता है।'
      }
    ]
  },

  'pc-lesson-6': {
    id: 'pc-lesson-6',
    title: 'Power Delivery',
    goal: 'समझें कि PSU दीवार की बिजली को कंप्यूटर के लिए सुरक्षित DC में कैसे बदलता है।',
    callouts: [
      { partId: 'power', title: 'POWER SUPPLY', line: 'दीवार की AC बिजली को स्थिर DC में बदलता है।' },
      { partId: 'vrm', title: 'VRM CHOKES', line: 'संवेदनशील पुर्जों के लिए करंट को स्थिर करता है।' }
    ],
    overview: {
      description:
        'Power Supply Unit (PSU) दीवार की 220V AC बिजली को सुरक्षित DC में बदलता है। यह कंप्यूटर के विभिन्न भागों को +12V, +5V और +3.3V की साफ बिजली प्रदान करता है।',
      facts: [
        { icon: 'shield', text: '80 PLUS rating कम से कम 85% दक्षता की गारंटी देती है' },
        { icon: 'bolt', text: '12V रेल पर 50-ampere तक भारी करंट प्रदान करता है' },
        { icon: 'check', text: 'Short-circuit और over-voltage से सुरक्षा प्रदान करता है' }
      ]
    },
    connections: [
      { from: 'Wall Outlet', to: 'PSU Input', label: '120V / 240V AC alternating current' },
      { from: 'PSU', to: 'Motherboard', label: '24-pin ATX +12V, +5V, +3.3V harness' },
      { from: 'PSU', to: 'CPU EPS Socket', label: '8-pin dedicated +12V processor cable' }
    ],
    example: {
      explanation: 'Motherboard sensors जांचते हैं कि voltage तय सीमा के भीतर बना रहे।'
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
        question: 'Computer power supply का मुख्य कार्य क्या है?',
        options: [
          'दीवार की खतरनाक AC बिजली को सुरक्षित कम-voltage DC में बदलना।',
          'अस्थायी browser tabs को memory में रखना।',
          'Games के लिए 3D lighting calculate करना।',
          'Wi-Fi router को radio तरंगें भेजना।'
        ],
        explanation: 'Computer चिप्स को स्थिर DC चाहिए, जबकि दीवार के सॉकेट में AC आता है।'
      },
      {
        question: 'यदि graphics card के लिए PSU wattage कम हो तो क्या होगा?',
        options: [
          'भारी लोड में PC तुरंत अपने आप बंद हो जाएगा।',
          'स्क्रीन का रंग हमेशा के लिए हरा हो जाएगा।',
          'कीबोर्ड के अक्षर उल्टे टाइप होने लगेंगे।',
          'Internet की download speed शून्य हो जाएगी।'
        ],
        explanation: 'Over-current protection सक्रिय होकर आग लगने से बचाने के लिए PC बंद कर देता है।'
      },
      {
        question: 'CPU और modern graphics cards को कौन सी voltage rail बिजली देती है?',
        options: [
          '+12V DC rail',
          '-220V AC line',
          '+1.5V pencil battery',
          '+48V phantom audio header'
        ],
        explanation: '12V रेल सबसे ज्यादा current देती है जिसकी processors को जरूरत होती है।'
      }
    ]
  },

  'pc-lesson-7': {
    id: 'pc-lesson-7',
    title: 'Thermal Cooling',
    goal: 'देखें कि heatsinks, heat pipes और fans ओवरहीटिंग को कैसे रोकते हैं।',
    callouts: [
      { partId: 'cooler', title: 'CPU COOLER', line: 'सिलिकॉन चिप से गर्मी को दूर खींचता है।' },
      { partId: 'cpu', title: 'HEAT SPREADER', line: 'गर्मी को cooler के copper base तक फैलाता है।' }
    ],
    overview: {
      description:
        'Computer चिप्स भारी काम के दौरान बहुत गर्म हो जाती हैं। Cooler तांबे की heat pipes और aluminium fins के जरिए गर्मी खींचकर पंखे से बाहर निकाल देता है।',
      facts: [
        { icon: 'wind', text: 'कूलिंग सतह के क्षेत्रफल को पचास गुना बढ़ा देता है' },
        { icon: 'droplet', text: 'Heat pipes में तरल भाप बनकर गर्मी ले जाता है' },
        { icon: 'thermometer', text: 'CPU तापमान को 100°C की सीमा से नीचे रखता है' }
      ]
    },
    connections: [
      { from: 'CPU Heat Spreader', to: 'Cooler Base', label: 'Thermal paste conductive layer' },
      { from: 'Cooler Base', to: 'Aluminium Fins', label: 'Phase-change copper heat pipes' },
      { from: 'Motherboard', to: 'Cooler Fan', label: '4-pin PWM fan speed signal' }
    ],
    example: {
      explanation: 'Motherboard का PWM सर्किट तापमान बढ़ने पर पंखे की गति तेज़ कर देता है।'
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
        question: 'CPU और cooler के बीच thermal paste क्यों लगाई जाती है?',
        options: [
          'यह हवा के बारीक खाली स्थानों को भरकर गर्मी पहुंचाती है।',
          'यह cooler को हमेशा के लिए चिपका देती है।',
          'यह करंट लगने से बचाती है।',
          'यह case के अंदर सजावट के लिए लगाई जाती है।'
        ],
        explanation: 'फंसी हुई हवा गर्मी को रोकती है; thermal paste गर्मी को तेज़ी से ट्रांसफर करती है।'
      },
      {
        question: 'Processors में Thermal Throttling क्या होती है?',
        options: [
          'अधिक गर्म होने से बचने के लिए CPU अपनी speed घटा लेता है।',
          'कमरे को गर्म करने के लिए पंखा उल्टा घूमने लगता है।',
          'Hard drive सारा data हमेशा के लिए मिटा देती है।',
          'Power supply DC से वापस AC में बदल जाती है।'
        ],
        explanation: 'सिलिकॉन को खराब होने से बचाने के लिए चिप 95°C से ऊपर अपनी गति धीमी कर लेती है।'
      },
      {
        question: 'तांबे की heat pipes गर्मी को इतनी तेज़ी से कैसे ले जाती हैं?',
        options: [
          'अंदर का तरल गर्म होकर भाप बनता है और ठंडे सिरे पर ठंडा हो जाता है।',
          'छोटे electric pumps पानी को आगे-पीछे फेंकते हैं।',
          'चुंबक के जरिए गर्मी खींची जाती है।',
          'वे बाहर की ठंडी हवा सीधे चिप के अंदर खींच लेती हैं।'
        ],
        explanation: 'तरल का भाप बनना और संघनित होना भारी मात्रा में गर्मी को तेज़ी से स्थानांतरित करता है।'
      }
    ]
  },

  'pc-lesson-8': {
    id: 'pc-lesson-8',
    title: 'Chipset and Ports',
    goal: 'Motherboard I/O और expansion ports के जरिए बाहरी कनेक्शन को समझें।',
    callouts: [
      { partId: 'io', title: 'REAR I/O', line: 'बाहरी USB, network और audio उपकरण जोड़ता है।' },
      { partId: 'chipset', title: 'CHIPSET CONTROLLER', line: 'SATA, USB और audio का प्रबंधन करता है।' },
      { partId: 'battery', title: 'CMOS BATTERY', line: 'बिजली न होने पर BIOS घड़ी चलाती है।' }
    ],
    overview: {
      description:
        'Motherboard का rear I/O पैनल माउस, कीबोर्ड, नेटवर्क और ऑडियो तारों को जोड़ता है। Chipset इन सभी रास्तों को संभालता है ताकि processor पर फालतू बोझ न पड़े।',
      facts: [
        { icon: 'network', text: '2.5 Gbps Ethernet network संचार प्रदान करता है' },
        { icon: 'usb', text: 'USB-C ports 20 Gbps तक data bandwidth देते हैं' },
        { icon: 'clock', text: 'CR2032 coin battery समय और settings याद रखती है' }
      ]
    },
    connections: [
      { from: 'Rear I/O Panel', to: 'Chipset', label: 'USB 3.2 and audio bus traces' },
      { from: 'Chipset', to: 'Ethernet PHY', label: 'PCIe 2.5G network controller' },
      { from: 'CMOS Battery', to: 'RTC Circuit', label: '3V constant backup power' }
    ],
    example: {
      explanation: 'Operating system chipset controllers से जुड़े कीबोर्ड और नेटवर्क तारों की पहचान करता है।'
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
        question: 'Motherboard पर लगी गोल CR2032 सिक्का battery का क्या काम है?',
        options: [
          'तार निकालने पर भी घड़ी का समय और BIOS settings बनाए रखना।',
          'बाहर खेलने के दौरान graphics card को बिजली देना।',
          'बिजली जाने पर पंखे को चालू रखना।',
          'Bluetooth से जुड़े wireless mouse को charge करना।'
        ],
        explanation: 'सिक्का battery Real-Time Clock (RTC) को हमेशा चालू रखती है।'
      },
      {
        question: 'Motherboard rear I/O पैनल का क्या काम है?',
        options: [
          'कीबोर्ड, माउस, नेटवर्क और ऑडियो के बाहरी ports देना।',
          'दीवार की AC बिजली को 12V DC में बदलना।',
          'Thermal cooling heat pipes लगाना।',
          'Operating system फाइलों को स्थाई सुरक्षित रखना।'
        ],
        explanation: 'I/O शील्ड कंप्यूटर केस के पीछे सभी बाहरी तारों के पोर्ट प्रदान करता है।'
      },
      {
        question: 'सभी पोर्ट्स सीधे CPU से न जोड़कर chipset क्यों लगाया जाता है?',
        options: [
          'दर्जनों धीमी peripheral devices को जोड़कर CPU के pins बचाना।',
          'CPU USB protocol को समझ नहीं सकता।',
          'अंतरराष्ट्रीय रेडियो नियमों के अनुसार यह जरूरी है।',
          'Chipset लगाने से RAM की जरूरत खत्म हो जाती है।'
        ],
        explanation: 'हर पोर्ट को सीधे CPU से जोड़ने पर socket बहुत बड़ा और महंगा हो जाएगा।'
      }
    ]
  }
};

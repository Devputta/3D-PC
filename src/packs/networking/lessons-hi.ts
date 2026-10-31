/**
 * Boardwalk — Computer Networking Pack Lessons (Hindi Localization)
 *
 * Keeps technical terms like Client, Switch, Router, Subnet, IP, MAC, DNS, DHCP, Firewall, Server in English letters.
 */

import { LocalizedLesson } from '../types.ts';

export const NETWORKING_LESSONS_HI: Record<string, LocalizedLesson> = {
  'net-lesson-1': {
    id: 'net-lesson-1',
    title: 'Client Device',
    goal: 'जानें कि उपयोगकर्ता उपकरण कैसे नेटवर्क कनेक्शन शुरू करते हैं और वेब अनुरोध भेजते हैं।',
    callouts: [
      { partId: 'laptop', title: 'CLIENT LAPTOP', line: 'बाहरी TCP नेटवर्क सॉकेट शुरू करता है।' },
      { partId: 'switch', title: 'ETHERNET PORT', line: 'स्थानीय फ्रेम को तांबे की तार से ले जाता है।' }
    ],
    overview: {
      description:
        'Client वह कंप्यूटर, फोन या लैपटॉप है जहां से कार्य शुरू होता है। जब आप कोई वेब URL टाइप करते हैं, तो client TCP/IP पैकेट बनाता है और उन्हें भेजने के लिए तैयार करता है।',
      facts: [
        { icon: 'monitor', text: 'ब्राउज़र से बाहर जाने वाले HTTP अनुरोध शुरू करता है' },
        { icon: 'shield', text: '48-bit का अनूठा हार्डवेयर MAC पता रखता है' },
        { icon: 'zap', text: 'Ethernet या Wi-Fi 6 पर 1000 Mbps से जुड़ता है' }
      ]
    },
    connections: [
      { from: 'Web Browser', to: 'Operating System', label: 'Local socket API call' },
      { from: 'Laptop NIC', to: 'Network Switch', label: 'Cat6 copper twisted pair cable' }
    ],
    example: {
      explanation: 'Operating system नेटवर्क स्टैक IP सॉकेट को आपके नेटवर्क कार्ड (NIC) से जोड़ता है।'
    },
    specs: [
      { label: 'Network role', value: 'Client endpoint' },
      { label: 'Physical link', value: '1 Gbps Full-Duplex' },
      { label: 'Addressing', value: 'IPv4, IPv6, MAC' },
      { label: 'Socket buffer', value: '128 KB kernel buffer' },
      { label: 'Latency to LAN', value: '< 1 ms round trip' }
    ],
    quiz: [
      {
        question: 'Computer network में Client की क्या भूमिका होती है?',
        options: [
          'यह दूरस्थ servers से जानकारी और सेवाएं मांगता है।',
          'यह दीवार की तारों में बिजली बनाता है।',
          'यह ऑप्टिकल रोशनी को करंट में बदलता है।',
          'यह सार्वजनिक मोबाइल टावरों को रेडियो आवृत्ति देता है।'
        ],
        explanation: 'Clients अनुरोध शुरू करते हैं; servers सुनकर उत्तर भेजते हैं।'
      },
      {
        question: 'MAC address क्या होता है?',
        options: [
          'Network कार्ड में स्थाई रूप से दर्ज 48-bit भौतिक पता।',
          'Google खाते में लॉग इन करने का गुप्त पासवर्ड।',
          'केवल Apple लैपटॉप का मॉडल नंबर।',
          'वेबसाइट का देश कोड।'
        ],
        explanation: 'MAC पता नेटवर्क कार्ड का 48-bit भौतिक हार्डवेयर पहचानकर्ता होता है।'
      },
      {
        question: 'वेब ब्राउज़र के लिए सुरक्षित और विश्वसनीय डेटा कौन सा प्रोटोकॉल लाता है?',
        options: [
          'TCP (Transmission Control Protocol)',
          'MIDI संगीत उपकरण नियंत्रक',
          'VGA एनालॉग डिस्प्ले केबल',
          'FAT32 हार्ड ड्राइव प्रारूप'
        ],
        explanation: 'TCP सुनिश्चित करता है कि सभी पैकेट बिना छूटे सही क्रम में पहुंचें।'
      }
    ]
  },

  'net-lesson-2': {
    id: 'net-lesson-2',
    title: 'Network Switch',
    goal: 'समझें कि Layer 2 Switch स्थानीय नेटवर्क के अंदर डेटा कैसे भेजता है।',
    callouts: [
      { partId: 'switch', title: 'LAN SWITCH', line: 'MAC पते देखकर Ethernet फ्रेम आगे भेजता है।' },
      { partId: 'laptop', title: 'CONNECTED CLIENT', line: 'Switch के पोर्ट से जुड़ता है।' }
    ],
    overview: {
      description:
        'Network Switch एक ही स्थानीय नेटवर्क (LAN) में जुड़े कई कंप्यूटरों को जोड़ता है। यह आने वाले फ्रेम के गंतव्य MAC पते को पढ़कर उसे केवल सही पोर्ट पर भेजता है।',
      facts: [
        { icon: 'cpu', text: 'OSI मॉडल के Layer 2 (Data Link) पर काम करता है' },
        { icon: 'layers', text: 'हार्डवेयर ASIC में हजारों MAC पते याद रखता है' },
        { icon: 'zap', text: 'Full-duplex में बिना टकराव के डेटा ट्रांसफर करता है' }
      ]
    },
    connections: [
      { from: 'Laptop Port 1', to: 'Switch Matrix', label: '802.3 Gigabit Ethernet link' },
      { from: 'Switch Uplink', to: 'Router LAN', label: 'Trunk line to default gateway' }
    ],
    example: {
      explanation: 'ARP तालिका स्थानीय IP पतों को भौतिक MAC पतों से जोड़ती है।'
    },
    specs: [
      { label: 'OSI Layer', value: 'Layer 2 (Data Link)' },
      { label: 'Port density', value: '8 to 48 Gigabit ports' },
      { label: 'Forwarding rate', value: '16 Gbps non-blocking' },
      { label: 'MAC table capacity', value: '8,192 hardware entries' },
      { label: 'Forwarding latency', value: '< 2.5 microseconds' }
    ],
    quiz: [
      {
        question: 'Switch को कैसे पता चलता है कि पैकेट किस पोर्ट पर भेजना है?',
        options: [
          'यह अपनी सीखी हुई MAC address तालिका देखता है।',
          'यह अंदाजे से किसी भी पोर्ट पर भेज देता है।',
          'यह सभी जुड़े हुए पोर्ट्स पर एक साथ चिल्लाता है।',
          'यह वेबसाइट का नाम अंग्रेजी में पढ़ता है।'
        ],
        explanation: 'Switch हर पोर्ट से जुड़े MAC पते की एक तालिका बनाकर रखता है।'
      },
      {
        question: 'Switch पुराने Hub से बेहतर क्यों है?',
        options: [
          'Switch पैकेट टकराव रोकता है और दोनों तरफ एक साथ डेटा भेजता है।',
          'Switch तार को हल्का और पतला बना देता है।',
          'Switch में बिजली की जरूरत नहीं होती।',
          'Switch ऑडियो को वीडियो में बदल देता है।'
        ],
        explanation: 'Hub सभी पोर्ट्स पर टकराव फैलाता था, जबकि Switch केवल सही पोर्ट पर भेजता है।'
      },
      {
        question: 'Ethernet Switch OSI मॉडल के किस स्तर पर कार्य करता है?',
        options: [
          'Layer 2 (Data Link Layer)',
          'Layer 7 (Application Layer)',
          'Layer 12 (Quantum Layer)',
          'Layer 4 (Transport Layer)'
        ],
        explanation: 'Layer 2 भौतिक MAC पतों के जरिए स्थानीय फ्रेम वितरण संभालता है।'
      }
    ]
  },

  'net-lesson-3': {
    id: 'net-lesson-3',
    title: 'Wi-Fi Router',
    goal: 'देखें कि Router घर के निजी नेटवर्क को बाहरी इंटरनेट से कैसे जोड़ता है।',
    callouts: [
      { partId: 'router', title: 'WAN ROUTER', line: 'NAT करता है और नेटवर्कों के बीच मार्ग बनाता है।' },
      { partId: 'switch', title: 'LAN INTERFACE', line: 'दफ्तर के अंदरूनी उपकरणों को जोड़ता है।' }
    ],
    overview: {
      description:
        'Router दो अलग-अलग नेटवर्कों को जोड़ता है, जैसे आपके घर का नेटवर्क और इंटरनेट प्रदाता (ISP)। यह NAT का उपयोग करता है ताकि कई उपकरण एक ही सार्वजनिक IP साझा कर सकें।',
      facts: [
        { icon: 'globe', text: 'OSI Layer 3 (Network) पर IP पतों से मार्ग चुनता है' },
        { icon: 'shield', text: 'NAT तकनीक से निजी IP पतों को सुरक्षित रखता है' },
        { icon: 'zap', text: 'DHCP सर्वर से अपने आप नए उपकरणों को IP देता है' }
      ]
    },
    connections: [
      { from: 'Switch', to: 'Router LAN Port', label: 'Internal private 192.168.1.1 subnet' },
      { from: 'Router WAN Port', to: 'ISP Optical Gateway', label: 'Public internet routable IP link' }
    ],
    example: {
      explanation: 'बाहरी IP पतों पर जाने वाले पैकेट Router के default gateway पर भेजे जाते हैं।'
    },
    specs: [
      { label: 'OSI Layer', value: 'Layer 3 (Network)' },
      { label: 'Routing protocols', value: 'Static, RIP, OSPF, BGP' },
      { label: 'NAT table', value: '4,096 concurrent sessions' },
      { label: 'WAN uplink', value: '2.5 Gigabit Ethernet' },
      { label: 'Subnet format', value: '192.168.1.0/24' }
    ],
    quiz: [
      {
        question: 'Router और Switch में मुख्य अंतर क्या है?',
        options: [
          'Router अलग नेटवर्कों को जोड़ता है; Switch एक ही नेटवर्क में उपकरण जोड़ता है।',
          'Router केवल संगीत के लिए होता है; Switch वीडियो के लिए।',
          'Router बिना बिजली के काम करता है।',
          'Switch सार्वजनिक IP पते बांटता है।'
        ],
        explanation: 'Switches एक LAN के अंदर जोड़ते हैं; Routers अलग-अलग IP नेटवर्कों के बीच मार्ग बनाते हैं।'
      },
      {
        question: 'Network Address Translation (NAT) का क्या काम है?',
        options: [
          'कई निजी उपकरणों को एक सार्वजनिक IP साझा करने देना।',
          'वेबसाइट का स्पैनिश से हिंदी में अनुवाद करना।',
          'पंखा दोगुना तेज़ घुमाना।',
          'फोन की तांबे की तार को कांच में बदलना।'
        ],
        explanation: 'NAT घर के निजी पतों (192.168.x.x) को एक मुख्य इंटरनेट IP में बदलता है।'
      },
      {
        question: 'Default Gateway क्या होता है?',
        options: [
          'Router का स्थानीय IP जो बाहरी पैकेट को इंटरनेट की तरफ भेजता है।',
          'लैपटॉप की बैटरी का सीरियल नंबर।',
          'ईमेल इनबॉक्स का मास्टर पासवर्ड।',
          'गूगल क्रोम का सर्च इंजन पता।'
        ],
        explanation: 'जब लक्ष्य उपकरण स्थानीय नेटवर्क से बाहर होता है, तो पैकेट Default Gateway को दिया जाता है।'
      }
    ]
  },

  'net-lesson-4': {
    id: 'net-lesson-4',
    title: 'Subnetting and IP',
    goal: 'जानें कि IP पते और Subnet Masks उपकरणों को व्यवस्थित समूहों में कैसे बांटते हैं।',
    callouts: [
      { partId: 'switch', title: 'LOCAL SUBNET', line: 'प्रसारण संदेशों को एक ही समूह तक सीमित रखता है।' },
      { partId: 'router', title: 'GATEWAY BOUNDARY', line: 'प्रसारण को इंटरनेट में लीक होने से रोकता है।' }
    ],
    overview: {
      description:
        'IP पता नेटवर्क पर हर उपकरण की पहचान करता है, जबकि Subnet Mask यह बताता है कि पते का कितना हिस्सा नेटवर्क का है और कितना उपकरण का। इससे नेटवर्क तेज और सुरक्षित रहता है।',
      facts: [
        { icon: 'code', text: 'IPv4 पता 32 bits का होता है जिसे 4 हिस्सों में लिखा जाता है' },
        { icon: 'shield', text: '255.255.255.0 जैसा Subnet Mask कुल उपकरणों की सीमा तय करता है' },
        { icon: 'layers', text: '/24 जैसी CIDR संख्या आगे के नेटवर्क bits दर्शाती है' }
      ]
    },
    connections: [
      { from: 'Host IP', to: 'Subnet Mask', label: 'Logical bitwise AND calculation' },
      { from: 'Subnet 192.168.1.0/24', to: 'Broadcast 192.168.1.255', label: 'Local broadcast boundary' }
    ],
    example: {
      explanation: '/24 सबनेट पहला पता नेटवर्क के लिए और अंतिम पता ब्रॉडकास्ट के लिए आरक्षित रखता है।'
    },
    specs: [
      { label: 'Address format', value: 'IPv4 32-bit dotted decimal' },
      { label: 'CIDR prefix', value: '/24 (255.255.255.0)' },
      { label: 'Usable endpoints', value: '254 host computers' },
      { label: 'Private ranges', value: '10.0.0.0, 192.168.0.0' },
      { label: 'Loopback IP', value: '127.0.0.1' }
    ],
    quiz: [
      {
        question: '/24 subnet में कंप्यूटरों के लिए कितने IP पते उपलब्ध होते हैं?',
        options: [
          '254 उपयोगी पते (256 में से नेटवर्क और ब्रॉडकास्ट घटाकर)।',
          'ठीक 1000 पते।',
          'केवल 2 पते।',
          '4 अरब से अधिक पते।'
        ],
        explanation: '256 कुल मानों में से 0 नेटवर्क पहचान है और 255 ब्रॉडकास्ट है।'
      },
      {
        question: 'Subnet Mask का मूल उद्देश्य क्या है?',
        options: [
          'IP पते के नेटवर्क हिस्से और उपकरण हिस्से को अलग करना।',
          'फाइलों को पासवर्ड से छुपाना।',
          'Router को पानी के नुकसान से बचाना।',
          'आंधी में इंटरनेट स्पीड बढ़ाना।'
        ],
        explanation: 'Subnet Mask बताता है कि कोई उपकरण पास में है या Router के जरिए जाना होगा।'
      },
      {
        question: 'इनमें से कौन सा एक निजी (Private) IP पता है?',
        options: [
          '192.168.1.50',
          '8.8.8.8',
          '1.1.1.1',
          '142.250.190.46'
        ],
        explanation: '192.168.x.x, 10.x.x.x और 172.16.x.x केवल निजी घर या दफ्तर के लिए आरक्षित हैं।'
      }
    ]
  },

  'net-lesson-5': {
    id: 'net-lesson-5',
    title: 'Switch versus Router',
    goal: 'Layer 2 फ्रेम डिलीवरी और Layer 3 पैकेट रूटिंग के अंतर को समझें।',
    callouts: [
      { partId: 'switch', title: 'LAYER 2 SWITCH', line: 'LAN के अंदर MAC पते देखकर भेजता है।' },
      { partId: 'router', title: 'LAYER 3 ROUTER', line: 'अलग-अलग सबनेट्स के बीच IP से भेजता है।' }
    ],
    overview: {
      description:
        'Switch एक कमरे या इमारत के अंदर MAC पतों से डेटा पहुंचाता है। Router दुनिया भर के अलग-अलग नेटवर्कों के बीच IP पतों के सहारे पैकेट्स को एक छोर से दूसरे छोर भेजता है।',
      facts: [
        { icon: 'layers', text: 'Switch मूल IP पैकेट के हेडर में कोई बदलाव नहीं करता' },
        { icon: 'globe', text: 'Router हर छलांग (hop) पर TTL की गिनती एक कम करता है' },
        { icon: 'shield', text: 'Router तूफानी ब्रॉडकास्ट को बाहर जाने से रोकता है' }
      ]
    },
    connections: [
      { from: 'Client Frame', to: 'Switch Port', label: 'Layer 2 MAC address forwarding' },
      { from: 'Switch Port', to: 'Router Gateway', label: 'Layer 3 IP packet routing' }
    ],
    example: {
      explanation: 'Traceroute कमांड पैकेट के TTL को बढ़ाकर रास्ते के हर Router की पहचान करता है।'
    },
    specs: [
      { label: 'Switch domain', value: 'Single broadcast domain' },
      { label: 'Router domain', value: 'Separates broadcast domains' },
      { label: 'Switch protocol', value: 'Ethernet 802.3 MAC' },
      { label: 'Router protocol', value: 'IPv4 / IPv6 / BGP' },
      { label: 'Switch lookup', value: 'MAC address table (CAM)' },
      { label: 'Router lookup', value: 'IP routing table' }
    ],
    quiz: [
      {
        question: 'क्या साधारण Switch आपके पैकेट के अंदर के IP पते को बदलता है?',
        options: [
          'नहीं, Switch केवल MAC पता देखता है और IP को नहीं छूता।',
          'हाँ, Switch सभी IP पते मिटाकर शून्य कर देता है।',
          'हाँ, Switch अपने आप IPv4 को IPv6 बना देता है।',
          'केवल यदि केबल 5 मीटर से अधिक लंबी हो।'
        ],
        explanation: 'Layer 2 Switch केवल बाहरी MAC लिफाफा देखता है और अंदर का IP सुरक्षित रखता है।'
      },
      {
        question: 'पैकेट को अनंत चक्रव्यूह में घूमने से कौन सी तकनीक रोकती है?',
        options: [
          'हर Router पर TTL (Time To Live) संख्या एक घटती है और शून्य पर नष्ट हो जाती है।',
          'Router की बैटरी खत्म हो जाती है।',
          'कंप्यूटर अपने आप शटडाउन हो जाता है।',
          'इंटरनेट कंपनी कनेक्शन काट देती है।'
        ],
        explanation: 'TTL शून्य होते ही पैकेट को हटाकर त्रुटि संदेश भेज दिया जाता है।'
      },
      {
        question: 'फोन को इंटरनेट वेबसाइट से जोड़ने के लिए कौन सा उपकरण अनिवार्य है?',
        options: [
          'Router',
          'मैकेनिकल रिले स्विच',
          'पुराना टेलीफोन डायल-अप मॉडम',
          'प्रिंटर केबल'
        ],
        explanation: 'Router बाहरी इंटरनेट की सीमाओं को पार कराने के लिए आवश्यक है।'
      }
    ]
  },

  'net-lesson-6': {
    id: 'net-lesson-6',
    title: 'DNS and DHCP',
    goal: 'स्वचालित IP वितरण और वेबसाइट नामों के अनुवाद की प्रक्रिया समझें।',
    callouts: [
      { partId: 'dns', title: 'DNS RESOLVER', line: 'वेबसाइट नाम को संख्यात्मक IP पते में बदलता है।' },
      { partId: 'router', title: 'DHCP SERVER', line: 'आने वाले उपकरणों को अपने आप IP किराए पर देता है।' }
    ],
    overview: {
      description:
        'DHCP नए उपकरणों को अपने आप IP पता और सेटिंग्स देता है। DNS (Domain Name System) इंटरनेट की फोन-डायरी है जो google.com जैसे नामों को मशीनी IP पते में बदलती है।',
      facts: [
        { icon: 'book', text: 'DNS खोज 15 से 30 मिलीसेकंड में उत्तर देती है' },
        { icon: 'refresh', text: 'DHCP चार चरणों वाली DORA प्रक्रिया का उपयोग करता है' },
        { icon: 'zap', text: 'खोजे गए IP पते स्थानीय मेमोरी में TTL तक सुरक्षित रहते हैं' }
      ]
    },
    connections: [
      { from: 'Client Laptop', to: 'DHCP Server', label: 'UDP ports 67/68 auto-config request' },
      { from: 'Client Resolver', to: 'DNS Server', label: 'UDP port 53 hostname query' }
    ],
    example: {
      explanation: 'DNS रिज़ॉल्वर A रिकॉर्ड (IPv4) देता है ताकि ब्राउज़र सीधे TCP कनेक्शन बना सके।'
    },
    specs: [
      { label: 'DNS port', value: 'UDP / TCP port 53' },
      { label: 'DHCP port', value: 'UDP ports 67 and 68' },
      { label: 'Common records', value: 'A, AAAA, CNAME, MX' },
      { label: 'DHCP sequence', value: 'Discover, Offer, Request, ACK' },
      { label: 'Typical TTL', value: '300 to 86,400 seconds' }
    ],
    quiz: [
      {
        question: 'जब आप वेबसाइट का नाम लिखते हैं, तो DNS सर्वर क्या करता है?',
        options: [
          'उस नाम से जुड़ा संख्यात्मक IP पता लौटाता है।',
          'वेबकैम वीडियो को पासवर्ड से लॉक करता है।',
          'हार्ड ड्राइव को फॉर्मेट करता है।',
          'वेब पेज को प्रिंटर पर छापता है।'
        ],
        explanation: 'DNS इंटरनेट की फोन-बुक है जो नामों को IP पतों से जोड़ती है।'
      },
      {
        question: 'Router में DHCP का क्या फायदा है?',
        options: [
          'यह अपने आप IP पता देता है ताकि हाथ से न भरना पड़े।',
          'यह स्क्रीन को झिलमिलाने से रोकता है।',
          'यह बैंक खाते से पैसे काटता है।',
          'यह कागज़ को PDF में स्कैन करता है।'
        ],
        explanation: 'DHCP नेटवर्क में जुड़ते ही बिना किसी परेशानी के उपकरण को सेटिंग्स सौंप देता है।'
      },
      {
        question: 'जब DNS रिकॉर्ड का Time To Live (TTL) पूरा हो जाता है तो क्या होता है?',
        options: [
          'कंप्यूटर ताज़ा IP पते के लिए दोबारा DNS सर्वर से पूछता है।',
          'वेबसाइट का नाम हमेशा के लिए मिट जाता है।',
          'ब्राउज़र कोई भी टैब खोलने से मना कर देता है।',
          'Router को फैक्ट्री रीसेट करना पड़ता है।'
        ],
        explanation: 'TTL शून्य होते ही पुराना रिकॉर्ड मिट जाता है और नई ताज़ा जानकारी मांगी जाती है।'
      }
    ]
  },

  'net-lesson-7': {
    id: 'net-lesson-7',
    title: 'Security Firewall',
    goal: 'देखें कि Firewall अनधिकृत ट्रैफिक को कैसे रोकता है और नेटवर्क की रक्षा करता है।',
    callouts: [
      { partId: 'firewall', title: 'SPI FIREWALL', line: 'पोर्ट्स की जांच करता है और हमलों को रोकता है।' },
      { partId: 'webserver', title: 'PROTECTED SERVER', line: 'Port 443 पर केवल सुरक्षित अनुरोध लेता है।' }
    ],
    overview: {
      description:
        'Firewall सुरक्षा चौकीदार की तरह आने-जाने वाले पैकेटों की जांच करता है। Stateful Packet Inspection याद रखता है कि आपने क्या मांगा था, ताकि केवल सही उत्तर अंदर आ सके और अज्ञात हमले रुक जाएं।',
      facts: [
        { icon: 'shield', text: 'अज्ञात बाहरी कनेक्शन प्रयासों को तुरंत खारिज करता है' },
        { icon: 'check', text: 'उपयोगकर्ता द्वारा शुरू किए गए वैध कनेक्शनों की सूची रखता है' },
        { icon: 'zap', text: 'एक मिलीसेकंड से भी कम समय में पैकेटों की जांच करता है' }
      ]
    },
    connections: [
      { from: 'Public Internet', to: 'Firewall Outside', label: 'Unfiltered inbound packet stream' },
      { from: 'Firewall Filter', to: 'Internal Servers', label: 'Verified packets matching rule policy' }
    ],
    example: {
      explanation: 'Firewall उन सभी पोर्ट्स को बंद रखता है जिनकी स्पष्ट अनुमति नहीं दी गई है।'
    },
    specs: [
      { label: 'Inspection mode', value: 'Stateful Packet Inspection (SPI)' },
      { label: 'Default inbound', value: 'Drop all unsolicited traffic' },
      { label: 'Inspected fields', value: 'IP, Port, TCP flags, state' },
      { label: 'Filtering rate', value: '2.5 Gbps wire-speed' },
      { label: 'Encrypted traffic', value: 'TLS 1.3 pass-through' }
    ],
    quiz: [
      {
        question: 'सुरक्षित Firewall की आने वाले अनजान ट्रैफिक के लिए क्या नीति होती है?',
        options: [
          'सभी अनचाहे बाहरी कनेक्शन प्रयासों को तुरंत ब्लॉक (Drop) करना।',
          'हर किसी को बिना जांचे अंदर आने देना।',
          'हर पैकेट के लिए उपयोगकर्ता को ईमेल भेजना।',
          'हर सुबह Router की सेटिंग मिटा देना।'
        ],
        explanation: 'Default-deny नीति बिना अनुमति वाले किसी भी बाहरी पैकेट को अंदर नहीं आने देती।'
      },
      {
        question: 'Stateful Firewall को कैसे पता चलता है कि कौन सा वापस आने वाला पैकेट सही है?',
        options: [
          'यह बाहर भेजे गए अनुरोधों को याद रखता है और मेल खाने वाले उत्तर आने देता है।',
          'यह फाइल में कृपया शब्द ढूंढता है।',
          'यह केवल दिन के उजाले में काम करता है।',
          'यह तार से उंगलियों के निशान लेता है।'
        ],
        explanation: 'Stateful निरीक्षण TCP पोर्ट और क्रम संख्या मिलाकर सही उत्तर पहचानता है।'
      },
      {
        question: 'सुरक्षित एन्क्रिप्टेड वेब ट्रैफिक आमतौर पर किस पोर्ट का उपयोग करता है?',
        options: [
          'Port 443 (HTTPS)',
          'Port 21 (FTP)',
          'Port 25 (SMTP)',
          'Port 80 (Unencrypted HTTP)'
        ],
        explanation: 'Port 443 TLS द्वारा सुरक्षित HTTPS वेबसाइटों का मानक पोर्ट है।'
      }
    ]
  },

  'net-lesson-8': {
    id: 'net-lesson-8',
    title: 'Complete Network',
    goal: 'लैपटॉप ब्राउज़र से क्लाउड सर्वर तक पूरी वेब यात्रा का पता लगाएं।',
    callouts: [
      { partId: 'laptop', title: 'CLIENT BROWSER', line: 'HTTPS GET वेब अनुरोध भेजता है।' },
      { partId: 'router', title: 'GATEWAY ROUTER', line: 'पैकेट को इंटरनेट के जरिए आगे बढ़ाता है।' },
      { partId: 'webserver', title: 'CLOUD SERVER', line: 'HTTP 200 के साथ वेब पेज लौटाता है।' }
    ],
    overview: {
      description:
        'जब आप वेबसाइट खोलते हैं, तो आपका कंप्यूटर मिलीसेकंड में स्विचिंग, रूटिंग, DNS खोज, फ़ायरवॉल सुरक्षा और एन्क्रिप्शन का समन्वय करता है। सर्वर आपके अनुरोध को स्वीकार कर वेब पेज भेजता है।',
      facts: [
        { icon: 'globe', text: 'पूरी वैश्विक यात्रा 20 से 60 मिलीसेकंड में पूरी होती है' },
        { icon: 'lock', text: 'TLS 1.3 एन्क्रिप्शन डेटा को चोरी होने से बचाता है' },
        { icon: 'check', text: 'ब्राउज़र इंजन मिले हुए HTML, CSS और कोड को दिखाता है' }
      ]
    },
    connections: [
      { from: 'Laptop', to: 'Switch', label: 'Ethernet frame delivery' },
      { from: 'Switch', to: 'Router', label: 'NAT default gateway transit' },
      { from: 'Router', to: 'DNS Server', label: 'Domain to IP address lookup' },
      { from: 'Router', to: 'Web Server', label: 'TLS 1.3 encrypted HTTPS request' }
    ],
    example: {
      explanation: 'सर्वर HTTP 200 OK स्टेटस के साथ वेब पेज का कोड ब्राउज़र को भेजता है।'
    },
    specs: [
      { label: 'Full latency', value: '25 ms average round-trip' },
      { label: 'Transport protocol', value: 'TCP with TLS 1.3' },
      { label: 'Application layer', value: 'HTTP/2 and HTTP/3' },
      { label: 'Packet loss', value: '0.0% on clean links' },
      { label: 'Security cipher', value: 'AES-256-GCM encryption' }
    ],
    quiz: [
      {
        question: 'वेबसाइट का नाम टाइप करने पर कंप्यूटर सबसे पहला नेटवर्क कदम क्या उठाता है?',
        options: [
          'यह DNS से उस वेबसाइट का संख्यात्मक IP पता पूछता है।',
          'यह पंखे को पूरी गति से चला देता है।',
          'यह फाइल सीधे प्रिंटर पर भेज देता है।',
          'यह ऑपरेटिंग सिस्टम को रिकवरी में डालता है।'
        ],
        explanation: 'बिना IP पते के कंप्यूटर यह नहीं जान सकता कि इंटरनेट पर सर्वर कहां स्थित है।'
      },
      {
        question: 'HTTP 200 OK स्टेटस कोड का क्या मतलब है?',
        options: [
          'सर्वर ने अनुरोध को सफलतापूर्वक समझा और सामग्री भेज दी।',
          'सर्वर ने वेब पेज हमेशा के लिए मिटा दिया।',
          'कंप्यूटर की इंटरनेट केबल निकल गई है।',
          'उपयोगकर्ता ने गलत पासवर्ड डाला है।'
        ],
        explanation: 'HTTP 200 OK वेब अनुरोध की सफलता का मानक अंतरराष्ट्रीय कोड है।'
      },
      {
        question: 'इंटरनेट चलाते समय TLS एन्क्रिप्शन क्यों जरूरी है?',
        options: [
          'यह डेटा को कोड में बदल देता है ताकि पासवर्ड कोई चुरा न सके।',
          'यह गूगल क्रोम की RAM कम करता है।',
          'यह बिना इंटरनेट के भी वेबसाइट चलाता है।',
          'यह वीडियो को काला-सफेद कर देता है।'
        ],
        explanation: 'TLS सुनिश्चित करता है कि रास्ते में कोई भी आपके पासवर्ड और निजी डेटा को न पढ़ सके।'
      }
    ]
  }
};

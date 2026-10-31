/**
 * Boardwalk — Computer Networking Pack Lessons
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

export const NETWORKING_LESSONS: Lesson[] = [
  {
    id: 'net-lesson-1',
    number: 1,
    title: 'Client Device',
    goal: 'Learn how end-user devices initiate network connections and send web requests.',
    highlightParts: ['laptop', 'switch'],
    callouts: [
      { partId: 'laptop', title: 'CLIENT LAPTOP', line: 'Initiates outbound TCP network sockets.' },
      { partId: 'switch', title: 'ETHERNET PORT', line: 'Carries local frames over copper cable.' }
    ],
    overview: {
      description:
        'A client device is the personal computer, laptop, or phone where user actions begin. When you type a web URL, the client creates TCP/IP socket packets and addresses them for transmission.',
      facts: [
        { icon: 'monitor', text: 'Originates outbound HTTP web client requests' },
        { icon: 'shield', text: 'Holds unique hardware 48-bit MAC address' },
        { icon: 'zap', text: 'Connects at 1000 Mbps over Ethernet or Wi-Fi 6' }
      ]
    },
    connections: [
      { from: 'Web Browser', to: 'Operating System', label: 'Local socket API call' },
      { from: 'Laptop NIC', to: 'Network Switch', label: 'Cat6 copper twisted pair cable' }
    ],
    example: {
      language: 'bash',
      code: `# View local network interface IP and MAC address
ip addr show eth0
# Test local gateway loopback connection
ping -c 3 127.0.0.1`,
      explanation: 'The operating system network stack binds IP sockets to your physical network interface card (NIC).',
      runAnimation: 'packet'
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
        question: 'What is the role of a client in a computer network?',
        options: [
          'It requests resources and services from remote servers.',
          'It powers the electricity inside the wall cables.',
          'It converts fibre optic light into alternating current.',
          'It assigns radio frequencies to public cell towers.'
        ],
        correctIndex: 0,
        explanation: 'Clients originate requests; servers listen for incoming connections and respond.'
      },
      {
        question: 'What is a MAC address?',
        options: [
          'A hardware address hardcoded into the network interface card.',
          'A password used to sign into Google accounts.',
          'The brand name of Apple laptops only.',
          'The country code where the website is hosted.'
        ],
        correctIndex: 0,
        explanation: 'The Media Access Control (MAC) address is a unique 48-bit physical hardware identifier.'
      },
      {
        question: 'Which protocol handles reliable stream transport for web browsers?',
        options: [
          'TCP (Transmission Control Protocol)',
          'MIDI music instrument synthesizer',
          'VGA analogue color synchronizer',
          'FAT32 storage allocation table'
        ],
        correctIndex: 0,
        explanation: 'TCP ensures packets arrive reliably in the correct order without missing chunks.'
      }
    ]
  },

  {
    id: 'net-lesson-2',
    number: 2,
    title: 'Network Switch',
    goal: 'Understand how Layer 2 switches forward traffic inside a local area network.',
    highlightParts: ['switch', 'laptop', 'router'],
    callouts: [
      { partId: 'switch', title: 'LAN SWITCH', line: 'Forwards Ethernet frames using MAC addresses.' },
      { partId: 'laptop', title: 'CONNECTED CLIENT', line: 'Plugs into switch access port.' }
    ],
    overview: {
      description:
        'A network switch connects multiple wired devices inside the same Local Area Network (LAN). It inspects the destination MAC address of incoming frames to deliver them only to the intended recipient port.',
      facts: [
        { icon: 'cpu', text: 'Operates at Layer 2 (Data Link) of the OSI model' },
        { icon: 'layers', text: 'Stores thousands of MAC addresses in ASIC tables' },
        { icon: 'zap', text: 'Enables full-duplex communication with zero collisions' }
      ]
    },
    connections: [
      { from: 'Laptop Port 1', to: 'Switch Matrix', label: '802.3 Gigabit Ethernet link' },
      { from: 'Switch Uplink', to: 'Router LAN', label: 'Trunk line to default gateway' }
    ],
    example: {
      language: 'bash',
      code: `# View local Address Resolution Protocol table
arp -a
# Check Ethernet link negotiation status
ethtool eth0 | grep -E "Speed|Duplex"` ,
      explanation: 'ARP tables map local IP addresses to hardware MAC addresses so switches forward frames accurately.',
      runAnimation: 'packet'
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
        question: 'How does a switch know which port to send a packet to?',
        options: [
          'It checks its MAC address table learned from previous frames.',
          'It guesses randomly until the target machine beeps.',
          'It sends all packets to every single connected port.',
          'It reads the website domain name in plain English.'
        ],
        correctIndex: 0,
        explanation: 'Switches maintain a MAC-to-port lookup table to isolate traffic to the target port.'
      },
      {
        question: 'Why are switches superior to old network hubs?',
        options: [
          'Switches prevent packet collisions and allow full duplex.',
          'Switches make Ethernet cables thinner and lighter.',
          'Switches eliminate the need for computer power cords.',
          'Switches automatically translate audio into video.'
        ],
        correctIndex: 0,
        explanation: 'Hubs broadcast collisions to all ports, while switches forward dedicated point-to-point frames.'
      },
      {
        question: 'Which OSI model layer describes Ethernet network switching?',
        options: [
          'Layer 2 (Data Link Layer)',
          'Layer 7 (Application Layer)',
          'Layer 12 (Quantum Layer)',
          'Layer 4 (Transport Layer)'
        ],
        correctIndex: 0,
        explanation: 'Layer 2 defines frame delivery across local physical media using hardware MAC addresses.'
      }
    ]
  },

  {
    id: 'net-lesson-3',
    number: 3,
    title: 'Wi-Fi Router',
    goal: 'Discover how routers connect private home networks to the global internet.',
    highlightParts: ['router', 'switch', 'firewall'],
    callouts: [
      { partId: 'router', title: 'WAN ROUTER', line: 'Performs NAT and routes between networks.' },
      { partId: 'switch', title: 'LAN INTERFACE', line: 'Connects internal office devices.' }
    ],
    overview: {
      description:
        'A router connects two separate networks together, typically linking your local home network to your Internet Service Provider (ISP). It uses Network Address Translation (NAT) so many devices can share one public IP address.',
      facts: [
        { icon: 'globe', text: 'Operates at Layer 3 (Network Layer) using IP addresses' },
        { icon: 'shield', text: 'Translates private IP ranges through NAT firewalls' },
        { icon: 'zap', text: 'Contains built-in DHCP server for auto IP allocation' }
      ]
    },
    connections: [
      { from: 'Switch', to: 'Router LAN Port', label: 'Internal private 192.168.1.1 subnet' },
      { from: 'Router WAN Port', to: 'ISP Optical Gateway', label: 'Public internet routable IP link' }
    ],
    example: {
      language: 'bash',
      code: `# Show kernel routing table and default gateway
ip route show
# View public WAN IP address assigned by ISP
curl -s https://api.ipify.org`,
      explanation: 'Packets destined for external IP addresses are directed to the router default gateway.',
      runAnimation: 'packet'
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
        question: 'What is the key difference between a router and a switch?',
        options: [
          'A router connects different networks; a switch connects devices on one network.',
          'A router is only used for music; a switch is used for video.',
          'A router requires no electricity to function.',
          'A switch assigns public internet IP addresses.'
        ],
        correctIndex: 0,
        explanation: 'Switches connect devices within a single subnet; routers route packets between distinct IP networks.'
      },
      {
        question: 'What does Network Address Translation (NAT) accomplish?',
        options: [
          'It lets multiple local devices share one public IP address.',
          'It translates website pages from Spanish to English.',
          'It doubles the mechanical speed of the cooling fan.',
          'It turns analog phone cables into fiber optic glass.'
        ],
        correctIndex: 0,
        explanation: 'NAT maps private home addresses (192.168.x.x) to a single ISP-assigned public IP address.'
      },
      {
        question: 'What is the default gateway in your computer network settings?',
        options: [
          'The router local IP address that forwards outbound packets.',
          'The serial number printed on the laptop battery.',
          'The master password to your home email inbox.',
          'The search engine URL used by Google Chrome.'
        ],
        correctIndex: 0,
        explanation: 'When a target address is outside the local network, the client forwards it to the default gateway.'
      }
    ]
  },

  {
    id: 'net-lesson-4',
    number: 4,
    title: 'Subnetting and IP',
    goal: 'Learn how IP addresses and subnet masks organize devices into logical networks.',
    highlightParts: ['switch', 'router', 'laptop'],
    callouts: [
      { partId: 'switch', title: 'LOCAL SUBNET', line: 'Confines broadcast traffic to one department.' },
      { partId: 'router', title: 'GATEWAY BOUNDARY', line: 'Prevents broadcasts leaking into the internet.' }
    ],
    overview: {
      description:
        'An IP address uniquely identifies each device on a network, while a subnet mask divides the address into network and host portions. Subnetting keeps broadcast traffic organized and enhances local security.',
      facts: [
        { icon: 'code', text: 'IPv4 addresses consist of 32 bits divided into 4 octets' },
        { icon: 'shield', text: 'Subnet masks like 255.255.255.0 define host limits' },
        { icon: 'layers', text: 'CIDR notation (/24) specifies prefix bit length' }
      ]
    },
    connections: [
      { from: 'Host IP', to: 'Subnet Mask', label: 'Logical bitwise AND calculation' },
      { from: 'Subnet 192.168.1.0/24', to: 'Broadcast 192.168.1.255', label: 'Local broadcast boundary' }
    ],
    example: {
      language: 'python',
      code: `import ipaddress
# Calculate usable host range for /24 network
net = ipaddress.IPv4Network('192.168.1.0/24')
print(f"Netmask: {net.netmask}")
print(f"Usable Hosts: {net.num_addresses - 2}")`,
      explanation: 'A /24 subnet reserves the first address for the network ID and the last for network broadcast.',
      runAnimation: 'packet'
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
        question: 'How many usable host IP addresses are available in a /24 subnet?',
        options: [
          '254 usable addresses (256 minus network and broadcast).',
          'Exactly 1000 addresses.',
          'Only 2 addresses.',
          'Over 4 billion addresses.'
        ],
        correctIndex: 0,
        explanation: 'A /24 network has 256 total IP values; the network ID and broadcast address cannot be used by hosts.'
      },
      {
        question: 'What is the purpose of a subnet mask?',
        options: [
          'It separates the network portion of an IP from the host portion.',
          'It hides computer files from unauthorized users.',
          'It protects the router from physical water damage.',
          'It speeds up download speeds during stormy weather.'
        ],
        correctIndex: 0,
        explanation: 'The subnet mask tells devices whether a destination IP is local or requires a router gateway.'
      },
      {
        question: 'Which of the following is a reserved private IP address?',
        options: [
          '192.168.1.50',
          '8.8.8.8',
          '1.1.1.1',
          '142.250.190.46'
        ],
        correctIndex: 0,
        explanation: 'Addresses starting with 192.168.x.x, 10.x.x.x, and 172.16.x.x are reserved for private LANs.'
      }
    ]
  },

  {
    id: 'net-lesson-5',
    number: 5,
    title: 'Switch versus Router',
    goal: 'Contrast Layer 2 frame switching against Layer 3 packet routing.',
    highlightParts: ['router', 'switch'],
    callouts: [
      { partId: 'switch', title: 'LAYER 2 SWITCH', line: 'Forwards inside one LAN using MAC addresses.' },
      { partId: 'router', title: 'LAYER 3 ROUTER', line: 'Routes between distinct subnets using IP.' }
    ],
    overview: {
      description:
        'Switches operate at Layer 2 using hardware MAC addresses to move data inside a single building or room. Routers operate at Layer 3 using IP addresses to pass packets between distinct networks across the globe.',
      facts: [
        { icon: 'layers', text: 'Switches do not modify original IP packet headers' },
        { icon: 'globe', text: 'Routers decrement TTL counters on each network hop' },
        { icon: 'shield', text: 'Routers isolate broadcast storms between networks' }
      ]
    },
    connections: [
      { from: 'Client Frame', to: 'Switch Port', label: 'Layer 2 MAC address forwarding' },
      { from: 'Switch Port', to: 'Router Gateway', label: 'Layer 3 IP packet routing' }
    ],
    example: {
      language: 'bash',
      code: `# Trace each router hop between your PC and a server
traceroute -m 5 8.8.8.8
# Hop 1: 192.168.1.1 (Local Router)
# Hop 2: 10.50.0.1 (ISP Gateway)`,
      explanation: 'Traceroute reveals each router gateway along the path by incrementing packet TTL (Time To Live).',
      runAnimation: 'packet'
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
        question: 'Does a standard network switch change the IP addresses in your packet?',
        options: [
          'No, switches only look at MAC addresses and leave IP untouched.',
          'Yes, switches rewrite all IP addresses to zero.',
          'Yes, switches convert IPv4 into IPv6 automatically.',
          'Only if the Ethernet cable is longer than 5 metres.'
        ],
        correctIndex: 0,
        explanation: 'Layer 2 switches deliver frames using physical MAC headers without altering IP payload data.'
      },
      {
        question: 'What stops packets from circulating forever in infinite routing loops?',
        options: [
          'The TTL (Time To Live) field decrements at each router until dropped.',
          'The router battery runs out of electrical power.',
          'The computer shuts down automatically.',
          'The internet provider cancels the user subscription.'
        ],
        correctIndex: 0,
        explanation: 'Each router subtracts 1 from the TTL field; when it hits 0, the packet is discarded with an ICMP alert.'
      },
      {
        question: 'Which device is required to connect your phone to a website on the internet?',
        options: [
          'A router',
          'A mechanical relay switch',
          'An analogue telephone modem',
          'A printer cable'
        ],
        correctIndex: 0,
        explanation: 'A router is essential to forward traffic across network boundaries to the internet.'
      }
    ]
  },

  {
    id: 'net-lesson-6',
    number: 6,
    title: 'DNS and DHCP',
    goal: 'Understand automated IP configuration and domain name translation.',
    highlightParts: ['dns', 'router', 'laptop'],
    callouts: [
      { partId: 'dns', title: 'DNS RESOLVER', line: 'Converts domain names into numeric IP addresses.' },
      { partId: 'router', title: 'DHCP SERVER', line: 'Leases local IP addresses automatically.' }
    ],
    overview: {
      description:
        'DHCP automatically assigns IP addresses and gateways to devices joining the network. DNS (Domain Name System) translates human-friendly website names like example.com into machine-routable numeric IP addresses.',
      facts: [
        { icon: 'book', text: 'DNS queries resolve in 15 to 30 milliseconds' },
        { icon: 'refresh', text: 'DHCP uses the 4-step DORA leasing sequence' },
        { icon: 'zap', text: 'DNS answers are cached locally using Time To Live' }
      ]
    },
    connections: [
      { from: 'Client Laptop', to: 'DHCP Server', label: 'UDP ports 67/68 auto-config request' },
      { from: 'Client Resolver', to: 'DNS Server', label: 'UDP port 53 hostname query' }
    ],
    example: {
      language: 'bash',
      code: `# Look up the numeric IP address of a website name
nslookup example.com 8.8.8.8
# Query DNS A record directly
dig +short google.com`,
      explanation: 'DNS resolvers return the A record (IPv4 address) so browsers can initiate direct TCP connections.',
      runAnimation: 'packet'
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
        question: 'What does a DNS server do when you type a web URL?',
        options: [
          'It returns the numeric IP address matching that domain name.',
          'It encrypts your webcam video with a password.',
          'It formats the computer hard drive.',
          'It prints the web page on a local laser printer.'
        ],
        correctIndex: 0,
        explanation: 'DNS functions as the phonebook of the internet, mapping names like example.com to IP addresses.'
      },
      {
        question: 'What is the purpose of DHCP in home routers?',
        options: [
          'It assigns IP addresses automatically so you do not set them by hand.',
          'It prevents computer monitors from flickering.',
          'It charges monthly credit card subscription fees.',
          'It scans paper documents into PDF format.'
        ],
        correctIndex: 0,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically distributes IP parameters to arriving devices.'
      },
      {
        question: 'What happens when a DNS record Time To Live (TTL) expires?',
        options: [
          'The computer asks the DNS server again for an updated IP address.',
          'The website domain is permanently deleted forever.',
          'The internet browser refuses to open any tabs.',
          'The router requires a complete factory reset.'
        ],
        correctIndex: 0,
        explanation: 'Once TTL counts down to 0, cached records are flushed so fresh IP lookups occur.'
      }
    ]
  },

  {
    id: 'net-lesson-7',
    number: 7,
    title: 'Security Firewall',
    goal: 'Learn how firewalls filter unwanted traffic and protect network perimeters.',
    highlightParts: ['firewall', 'router', 'webserver'],
    callouts: [
      { partId: 'firewall', title: 'SPI FIREWALL', line: 'Inspects ports and drops malicious probes.' },
      { partId: 'webserver', title: 'PROTECTED SERVER', line: 'Accepts filtered HTTPS requests on port 443.' }
    ],
    overview: {
      description:
        'A firewall inspects incoming and outgoing network traffic against defined security rules. Stateful packet inspection tracks active connections to allow legitimate responses while dropping unsolicited intrusion attempts.',
      facts: [
        { icon: 'shield', text: 'Blocks unauthorized incoming port connection attempts' },
        { icon: 'check', text: 'Maintains state tables of established user requests' },
        { icon: 'zap', text: 'Performs packet filtering with sub-millisecond overhead' }
      ]
    },
    connections: [
      { from: 'Public Internet', to: 'Firewall Outside', label: 'Unfiltered inbound packet stream' },
      { from: 'Firewall Filter', to: 'Internal Servers', label: 'Verified packets matching rule policy' }
    ],
    example: {
      language: 'bash',
      code: `# Inspect active firewall rules on Linux
sudo iptables -L -n -v
# Simple rule: allow established traffic, drop rogue inbound
# Rule: ALLOW tcp port 443 (HTTPS)
# Rule: DROP all other unsolicited incoming packets`,
      explanation: 'Firewalls enforce the principle of least privilege by blocking all ports except explicitly approved services.',
      runAnimation: 'packet'
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
        question: 'What is the default policy of a secure firewall for inbound traffic?',
        options: [
          'Drop all unsolicited inbound connection attempts.',
          'Allow every hacker to connect without verification.',
          'Send an email to the user for every single packet.',
          'Format the router configuration every morning.'
        ],
        correctIndex: 0,
        explanation: 'Default-deny drops unexpected incoming probes while permitting outbound client traffic.'
      },
      {
        question: 'How does a stateful firewall know which return packets to allow?',
        options: [
          'It remembers outbound requests and allows matching reply packets.',
          'It checks if the file name contains the word please.',
          'It only permits connections made during daylight hours.',
          'It inspects user fingerprints through the network cable.'
        ],
        correctIndex: 0,
        explanation: 'Stateful inspection tracks TCP sequence numbers and port pairs to verify matching responses.'
      },
      {
        question: 'Which port does secure encrypted web traffic typically use?',
        options: [
          'Port 443 (HTTPS)',
          'Port 21 (FTP)',
          'Port 25 (SMTP)',
          'Port 80 (Unencrypted HTTP)'
        ],
        correctIndex: 0,
        explanation: 'Port 443 is the standard dedicated port for HTTPS web traffic encrypted with TLS.'
      }
    ]
  },

  {
    id: 'net-lesson-8',
    number: 8,
    title: 'Complete Network',
    goal: 'Trace an end-to-end web request from laptop browser to cloud web server.',
    highlightParts: ['laptop', 'switch', 'router', 'dns', 'firewall', 'webserver'],
    callouts: [
      { partId: 'laptop', title: 'CLIENT BROWSER', line: 'Sends HTTPS GET web request.' },
      { partId: 'router', title: 'GATEWAY ROUTER', line: 'Forwards packet to internet transit.' },
      { partId: 'webserver', title: 'CLOUD SERVER', line: 'Returns HTTP 200 HTML payload.' }
    ],
    overview: {
      description:
        'When you visit a website, your computer coordinates local switching, NAT routing, DNS resolution, firewall filtering, and TLS encryption in milliseconds. The cloud web server receives your request and streams back the HTML document.',
      facts: [
        { icon: 'globe', text: 'Completes global round-trip journeys in 20 to 60 milliseconds' },
        { icon: 'lock', text: 'TLS 1.3 protocol encrypts all content against interception' },
        { icon: 'check', text: 'Browser engine parses returned HTML, CSS, and scripts' }
      ]
    },
    connections: [
      { from: 'Laptop', to: 'Switch', label: 'Ethernet frame delivery' },
      { from: 'Switch', to: 'Router', label: 'NAT default gateway transit' },
      { from: 'Router', to: 'DNS Server', label: 'Domain to IP address lookup' },
      { from: 'Router', to: 'Web Server', label: 'TLS 1.3 encrypted HTTPS request' }
    ],
    example: {
      language: 'bash',
      code: `# Fetch server response headers over HTTPS
curl -I https://example.com
# HTTP/2 200 OK
# content-type: text/html
# strict-transport-security: max-age=31536000`,
      explanation: 'The server returns an HTTP 200 OK status header followed by the webpage document.',
      runAnimation: 'packet'
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
        question: 'What is the first network action your computer takes when you type a web URL?',
        options: [
          'It checks DNS cache or queries a DNS resolver for the IP address.',
          'It turns on the cooling fans at maximum speed.',
          'It sends the HTML file directly to the laser printer.',
          'It switches the operating system into recovery mode.'
        ],
        correctIndex: 0,
        explanation: 'Before initiating a TCP connection, the computer must discover the server IP address via DNS.'
      },
      {
        question: 'What does an HTTP 200 OK status code indicate?',
        options: [
          'The server successfully understood the request and returned the content.',
          'The webpage was deleted permanently by the server.',
          'The computer network cable is unplugged.',
          'The user entered an invalid password.'
        ],
        correctIndex: 0,
        explanation: 'HTTP 200 OK is the standard success status code for HTTP web requests.'
      },
      {
        question: 'Why is TLS encryption essential when browsing websites?',
        options: [
          'It scrambles traffic so eavesdroppers cannot steal passwords or data.',
          'It reduces the amount of RAM used by Google Chrome.',
          'It allows websites to work without an internet connection.',
          'It makes videos load in black and white.'
        ],
        correctIndex: 0,
        explanation: 'Transport Layer Security (TLS) ensures confidentiality and data integrity across the internet.'
      }
    ]
  }
];

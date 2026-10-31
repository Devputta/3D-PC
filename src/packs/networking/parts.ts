/**
 * Boardwalk — Networking Pack Data
 *
 * Catalog of 6 network infrastructure devices and the 6-step journey:
 * "What happens when you type a web address".
 */

import { JourneyStep, PartData } from '../types.ts';

export const NETWORKING_PARTS: Record<string, PartData> = {
  laptop: {
    id: 'laptop',
    number: 1,
    name: 'Laptop (Client)',
    summary: 'The client computer where the user enters a web address and renders the response.',
    body: [
      'The client machine initiates network connections by creating TCP/IP socket requests and packaging application data into packets. When you type an address into the browser, the operating system checks its local cache before creating an outbound DNS query.',
      'Every outbound network packet carries both the sender’s local private IP address and MAC hardware address in its Ethernet frame header. Once the remote server responds, the laptop’s browser engine parses the returned HTML, styles the layout, and executes JavaScript.'
    ],
    specs: [
      { label: 'Role', value: 'Client requester' },
      { label: 'Network link', value: 'Wi-Fi 6 (802.11ax) or 1 Gbps Ethernet' },
      { label: 'Socket buffer', value: '64 to 256 KB typical' },
      { label: 'Local latency', value: '< 2 ms to router' }
    ],
    fails: 'The browser displays "No internet access", usually caused by an unplugged network cable, incorrect Wi-Fi password, or misconfigured default gateway.',
    clue: 'Click the client computer with a keyboard and screen where the web request begins.'
  },

  switch: {
    id: 'switch',
    number: 2,
    name: 'Network switch',
    summary: 'Directs Ethernet frames between devices within the same local network using MAC addresses.',
    body: [
      'Operates at layer 2 (Data Link layer), reading the destination MAC hardware address of every incoming Ethernet frame to forward it only to the specific physical port where that device is plugged in.',
      'Unlike old-fashioned network hubs that broadcasted collisions across every port, modern full-duplex switches prevent packet collisions completely and maintain high-speed forwarding tables in dedicated ASIC hardware.'
    ],
    specs: [
      { label: 'Port count', value: '8 to 48 Gigabit Ethernet ports' },
      { label: 'Forwarding rate', value: '16 to 96 Gbps non-blocking' },
      { label: 'MAC table', value: '8192 MAC address entries' },
      { label: 'Frame latency', value: 'Under 3 microseconds' }
    ],
    fails: 'All connected office computers lose wired network access when a network loop causes a broadcast packet storm.',
    clue: 'Click the metal box with rows of flashing Ethernet port LEDs that connects wired devices.'
  },

  router: {
    id: 'router',
    number: 3,
    name: 'Wi-Fi router',
    summary: 'Directs packets between your home local area network and the external internet service provider.',
    body: [
      'Performs Network Address Translation (NAT) so all devices inside your home share a single public IP address assigned by your internet provider. It assigns local private IP addresses to devices using DHCP.',
      'A router inspects destination IP addresses at layer 3 and consults routing tables to decide the best next-hop gateway. When internet packets return, it translates the destination address back to the specific laptop that asked for it.'
    ],
    specs: [
      { label: 'NAT capacity', value: 'Over 4000 concurrent sessions' },
      { label: 'Uplink interface', value: 'Gigabit or 2.5G WAN port' },
      { label: 'Local subnet', value: '192.168.1.0/24 typical' },
      { label: 'Switching delay', value: '< 1 ms routing latency' }
    ],
    fails: 'Devices keep a strong Wi-Fi connection but websites refuse to load, usually caused by an expired ISP DHCP lease or corrupted gateway routing table.',
    clue: 'Click the central box with antennas that routes local traffic out to the internet.'
  },

  dns: {
    id: 'dns',
    number: 4,
    name: 'DNS server',
    summary: 'Translates human-readable domain names into machine-routable numeric IP addresses.',
    body: [
      'When you type a web address, your computer cannot reach it until a Domain Name System server resolves the letters into a numeric IPv4 or IPv6 address.',
      'DNS resolvers query root, top-level domain (.org, .com), and authoritative name servers in sequence. Once discovered, the numeric IP address is stored in local cache with a Time To Live (TTL) value so repeated visits need no lookup.'
    ],
    specs: [
      { label: 'Query protocol', value: 'UDP / TCP port 53' },
      { label: 'Typical latency', value: '10 to 35 ms recursive query' },
      { label: 'Record types', value: 'A, AAAA, CNAME, MX, TXT' },
      { label: 'Cache TTL', value: '300 to 86400 seconds' }
    ],
    fails: 'Browsers display "Server IP address could not be found" (DNS_PROBE_FINISHED_NXDOMAIN) while direct IP addresses continue to ping normally.',
    clue: 'Click the server that turns human-readable website names into numeric IP addresses.'
  },

  firewall: {
    id: 'firewall',
    number: 5,
    name: 'Firewall',
    summary: 'Inspects network packets against security policies to drop unauthorised and malicious traffic.',
    body: [
      'Acts as a digital checkpoint, inspecting layer 4 port numbers, IP headers, and TCP connection state flags to filter traffic before it reaches internal servers.',
      'A stateful firewall tracks active conversations. It allows incoming packets only if they belong to an established outbound request made by an authorized client, dropping unsolicited connection attempts.'
    ],
    specs: [
      { label: 'Throughput', value: '1 to 10 Gbps stateful filtering' },
      { label: 'Port inspection', value: 'TCP/UDP ports 1 to 65535' },
      { label: 'Default rule', value: 'Drop unsolicited inbound' },
      { label: 'Latency overhead', value: '< 0.5 ms per inspection' }
    ],
    fails: 'Legitimate web traffic is silently dropped when a strict firewall rule blocks required network ports or security rate-limiting triggers.',
    clue: 'Click the security gateway that inspects packets and drops forbidden traffic.'
  },

  webserver: {
    id: 'webserver',
    number: 6,
    name: 'Web server',
    summary: 'Hosts web applications and static files, answering HTTP and HTTPS requests from clients.',
    body: [
      'Listens on TCP port 443 with TLS encryption. When a valid request arrives, the web server processes the URL route, executes application logic, and streams back HTML, stylesheets, scripts, and media.',
      'Production web servers handle thousands of concurrent client sockets simultaneously using non-blocking asynchronous event loops, load balancers, and reverse proxy caches.'
    ],
    specs: [
      { label: 'Protocols', value: 'HTTP/2, HTTP/3 (QUIC), TLS 1.3' },
      { label: 'Standard ports', value: 'Port 80 (HTTP) & 443 (HTTPS)' },
      { label: 'Concurrent sockets', value: '10,000 to 100,000+' },
      { label: 'Response latency', value: '20 to 80 ms typical' }
    ],
    fails: 'Visitors receive HTTP 500 Internal Server Error or 502 Bad Gateway when backend worker processes crash or exhaust system memory.',
    clue: 'Click the rackmount server that receives the HTTP request and sends back the website files.'
  }
};

export const NETWORKING_PART_LIST: PartData[] = Object.values(NETWORKING_PARTS);

export const NETWORKING_JOURNEY_STEPS: JourneyStep[] = [
  {
    stepNumber: 1,
    partId: 'laptop',
    title: 'Typing the web address',
    lede: 'The browser creates an HTTP request and prepares to resolve the domain.',
    body: 'When you press Enter on a URL, the web browser checks its local cache. If the site has not been visited recently, the operating system constructs a DNS query packet to discover the destination server’s IP address.'
  },
  {
    stepNumber: 2,
    partId: 'switch',
    title: 'Forwarding across the local LAN',
    lede: 'The switch inspects the destination MAC address to forward frames without collisions.',
    body: 'The laptop transmits an Ethernet frame to the local network switch. The switch reads the frame’s hardware address and immediately forwards it out the port connected to the home router.'
  },
  {
    stepNumber: 3,
    partId: 'router',
    title: 'Routing through NAT to the internet',
    lede: 'The router translates the private IP address into a public address and forwards the packet.',
    body: 'The router replaces the laptop’s private IP address (192.168.1.15) with its public IP address and sends the query onto the internet service provider’s optical backbone.'
  },
  {
    stepNumber: 4,
    partId: 'dns',
    title: 'Resolving the domain name to an IP',
    lede: 'The DNS resolver returns the numeric server address needed to establish a connection.',
    body: 'The DNS server looks up the domain record and responds with the numeric IP address (e.g. 198.51.100.42). The laptop now knows where to send its actual web request.'
  },
  {
    stepNumber: 5,
    partId: 'firewall',
    title: 'Passing through security inspection',
    lede: 'The security gateway validates that the incoming packet matches an authorized port.',
    body: 'Before reaching the destination datacenter, the TCP SYN packet reaches the firewall. The firewall confirms that traffic is addressed to public port 443 (HTTPS) and allows it to pass.'
  },
  {
    stepNumber: 6,
    partId: 'webserver',
    title: 'Serving the web page over HTTPS',
    lede: 'The web server completes the TLS handshake and streams the web page back.',
    body: 'The web server accepts the TCP socket, negotiates encrypted TLS session keys, and responds with HTTP status 200 along with the website’s HTML, CSS, and application data.'
  }
];

export { NETWORKING_LESSONS } from './lessons.ts';


export const NETWORKING_BUILD_SLOTS: import('../types.ts').BuildSlot[] = [
  {
    id: 'slot_wan',
    name: 'WAN Broadband Gateway',
    description: 'Interface connecting local network to internet service provider.',
    acceptedCategory: 'wan',
    installedPartId: null
  },
  {
    id: 'slot_router',
    name: 'Primary Router',
    description: 'Central NAT router providing DHCP leases and routing tables.',
    acceptedCategory: 'router',
    installedPartId: null
  },
  {
    id: 'slot_switch',
    name: 'Core Distribution Switch',
    description: 'High-speed layer 2 Ethernet switch connecting office clients.',
    acceptedCategory: 'switch',
    installedPartId: null
  },
  {
    id: 'slot_client',
    name: 'Client Workstation',
    description: 'User desktop or laptop requesting internet services.',
    acceptedCategory: 'client',
    installedPartId: null
  },
  {
    id: 'slot_firewall',
    name: 'Perimeter Security Firewall',
    description: 'Stateful gateway filtering malicious intrusions and unauthorized ports.',
    acceptedCategory: 'firewall',
    installedPartId: null
  },
  {
    id: 'slot_server',
    name: 'Datacenter Web Server',
    description: 'Dedicated host serving HTTPS web traffic on port 443.',
    acceptedCategory: 'server',
    installedPartId: null
  }
];

export const NETWORKING_TRAY_PARTS: import('../types.ts').BuildPart[] = [
  // WAN options
  {
    id: 'wan_fiber',
    name: 'Fiber ONT 1 Gbps Gateway',
    category: 'wan',
    summary: 'Optical network terminal delivering high-speed symmetrical broadband.',
    specs: [
      { label: 'Speed', value: '1000 Mbps symmetrical' },
      { label: 'Medium', value: 'Single-mode optical fiber' }
    ],
    isCompatible: true,
    modelPartId: 'router'
  },
  {
    id: 'wan_dialup',
    name: '56K V.90 Dial-up Modem',
    category: 'wan',
    summary: 'Legacy telephone line modem with 56 kbps maximum download speed.',
    specs: [
      { label: 'Speed', value: '56 kbps' },
      { label: 'Medium', value: 'Analog copper RJ-11' }
    ],
    isCompatible: false,
    failureSentence: 'A 56 kbps dial-up modem cannot deliver the broadband bandwidth needed for modern gigabit office networking.',
    modelPartId: 'router'
  },

  // Router options
  {
    id: 'router_gigabit',
    name: 'Wi-Fi 6 Gigabit Router',
    category: 'router',
    summary: 'Dual-band router with DHCP server and 4000-session NAT table.',
    specs: [
      { label: 'Throughput', value: '1 Gbps NAT wire speed' },
      { label: 'Subnet', value: '192.168.1.0/24 DHCP pool' }
    ],
    isCompatible: true,
    modelPartId: 'router'
  },
  {
    id: 'router_repeater',
    name: 'Passive Wi-Fi Extender',
    category: 'router',
    summary: 'Simple wireless repeater without routing logic or IP allocation.',
    specs: [
      { label: 'Throughput', value: '300 Mbps half-duplex' },
      { label: 'Routing', value: 'None (Bridge only)' }
    ],
    isCompatible: false,
    failureSentence: 'A simple wireless range extender lacks layer 3 routing logic and DHCP services to manage network subnets.',
    modelPartId: 'router'
  },

  // Switch options
  {
    id: 'switch_managed',
    name: '8-Port Gigabit Switch',
    category: 'switch',
    summary: 'Full-duplex non-blocking switch with 8192 MAC address storage.',
    specs: [
      { label: 'Ports', value: '8 × 1000BASE-T' },
      { label: 'Backplane', value: '16 Gbps non-blocking' }
    ],
    isCompatible: true,
    modelPartId: 'switch'
  },
  {
    id: 'switch_hub',
    name: '10 Mbps Ethernet Hub',
    category: 'switch',
    summary: 'Obsolete repeating hub that broadcasts all packets to every port.',
    specs: [
      { label: 'Speed', value: '10 Mbps shared' },
      { label: 'Duplex', value: 'Half-duplex with collisions' }
    ],
    isCompatible: false,
    failureSentence: 'An unmanaged 10 Mbps hub floods all packets across every port, creating packet collisions and severe slowdowns.',
    modelPartId: 'switch'
  },

  // Client options
  {
    id: 'client_laptop',
    name: 'Client Laptop (Gigabit)',
    category: 'client',
    summary: 'Workstation running modern TCP/IP stack with Wi-Fi 6 and 1Gbps Ethernet.',
    specs: [
      { label: 'NIC', value: 'Intel Gigabit PCIe' },
      { label: 'Stack', value: 'IPv4 / IPv6 dual-stack' }
    ],
    isCompatible: true,
    modelPartId: 'laptop'
  },
  {
    id: 'client_serial',
    name: 'Serial Dummy Terminal',
    category: 'client',
    summary: 'Legacy RS-232 text terminal lacking network hardware.',
    specs: [
      { label: 'Baud', value: '9600 baud' },
      { label: 'Protocol', value: 'Raw ASCII only' }
    ],
    isCompatible: false,
    failureSentence: 'A serial dummy terminal lacks an Ethernet NIC and cannot run modern TCP/IP protocol stacks or render web pages.',
    modelPartId: 'laptop'
  },

  // Firewall options
  {
    id: 'firewall_spi',
    name: 'Stateful Inspection Firewall',
    category: 'firewall',
    summary: 'Dedicated security appliance tracking TCP states and dropping malicious probes.',
    specs: [
      { label: 'Inspection', value: 'Stateful SPI filtering' },
      { label: 'Throughput', value: '2.5 Gbps' }
    ],
    isCompatible: true,
    modelPartId: 'firewall'
  },
  {
    id: 'firewall_bridge',
    name: 'Open Unfiltered Bridge',
    category: 'firewall',
    summary: 'Simple wire bridge passing all traffic without security checks.',
    specs: [
      { label: 'Inspection', value: 'None' },
      { label: 'Filtering', value: 'Allow all' }
    ],
    isCompatible: false,
    failureSentence: 'An unfiltered bridge passes all packets without verifying port rules or dropping unauthorized inbound intrusions.',
    modelPartId: 'firewall'
  },

  // Server options
  {
    id: 'server_web',
    name: 'Rackmount Web Server',
    category: 'server',
    summary: 'High-availability server listening on HTTP port 80 and HTTPS port 443.',
    specs: [
      { label: 'Daemons', value: 'Nginx / Node.js' },
      { label: 'Encryption', value: 'TLS 1.3 RSA/ECC' }
    ],
    isCompatible: true,
    modelPartId: 'webserver'
  }
];


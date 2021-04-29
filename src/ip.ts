import publicIp from 'public-ip';

let serverIpAddress: string;
publicIp.v4().then(ip => serverIpAddress = ip);

/**
 * Returns the public IPv4 address of the machine that the process is operating on.
 * @returns The public IPv4 address of the machine that the process is operating on.
 */
export function getServerIpAddress() { return serverIpAddress; }
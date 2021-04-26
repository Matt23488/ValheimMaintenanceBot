import publicIp from 'public-ip';

let serverIpAddress: string;
publicIp.v4().then(ip => serverIpAddress = ip);

export function getServerIpAddress() { return serverIpAddress; }
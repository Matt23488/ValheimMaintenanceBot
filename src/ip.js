const publicIp = require('public-ip');

let serverIpAddress;
publicIp.v4().then(ip => serverIpAddress = ip);

function getServerIpAddress() { return serverIpAddress; }

module.exports = { getServerIpAddress };
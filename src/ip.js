const publicIp = require('public-ip');

function getExternalIPv4() {
    return publicIp.v4();
}

module.exports = { getExternalIPv4 };
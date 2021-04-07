const _ = require('lodash');

function customizer(objValue, srcValue) {
    if (_.isUndefined(objValue)) return srcValue;
    if (_.isUndefined(srcValue)) return objValue;
    if (typeof objValue === 'object') {
        if (typeof srcValue === 'object') return _.extendWith(objValue, srcValue, customizer);
        else return objValue;
    }
    return srcValue;
}

module.exports = _.extendWith(require('../appsettings.json'), require('../appsecrets.json'), customizer);
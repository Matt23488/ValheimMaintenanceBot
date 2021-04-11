const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * 
     * @param {string} output 
     * @returns {void}
     */
    handleOutput: function (output) {
        const triggers = fs.readdirSync(path.join(__dirname, 'triggers')).map(f => require(path.join(__dirname, 'triggers', f)));

        for (let trigger of triggers) {
            const parsed = trigger.parse(output);
            if (!parsed.canHandle) continue;

            trigger.execute(parsed.data);
        }
    }
};
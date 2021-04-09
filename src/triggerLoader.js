const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * 
     * @param {string} output 
     * @returns {Promise<void>}
     */
    handleOutput: function (output) {
        return new Promise(resolve =>{
            const triggers = fs.readdirSync(path.join(__dirname, 'triggers')).map(f => require(path.join(__dirname, 'triggers', f)));

            for (let trigger of triggers) {
                const index = output.indexOf(trigger.searchText);
                if (index === -1) continue;

                trigger.execute(output, index);
            }

            resolve();
        });
    }
};
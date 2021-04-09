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
            const triggers = fs.readdirSync(__dirname).map(f => require(path.join(__dirname, f)));

            for (let trigger of triggers) {
                const index = output.indexOf(trigger.searchText);
                if (index === -1) continue;

                trigger.execute(output, index);
            }

            resolve();
        });
    }
};

// if (data instanceof Buffer) {
//     const dataString = data.toString();
//     if (dataString.indexOf('Game server connected') > 0 && !startEventSent) {
//         startEventSent = true;
//         resolve();
//     } else if (dataString.indexOf('Got character ZDOID from ') > 0) {
//         const prefix = 'Got character ZDOID from ';
//         const prefixIndex = dataString.indexOf(prefix);
//         const firstColon = dataString.indexOf(':', prefixIndex + prefix.length);
//         const secondColon = dataString.indexOf(':', firstColon + 1);
//         const newPlayer = {
//             id: dataString.slice(firstColon + 1, secondColon).trim(),
//             name: dataString.slice(prefixIndex + prefix.length, firstColon).trim()
//         };

//         // If id is 0 then it was a death, not a new connection.
//         if (newPlayer.id !== '0') {
//             const existingPlayer = this.connectedPlayers.find(p => p.id === newPlayer.id);
//             if (!existingPlayer) {
//                 this.connectedPlayers.push(newPlayer);
//                 playerConnectedListeners.forEach(l => l(newPlayer));
//             }
//         }
//     } else if (dataString.indexOf('Destroying abandoned non persistent zdo ') > 0) {
//         const prefix = 'Destroying abandoned non persistent zdo ';
//         const prefixIndex = dataString.indexOf(prefix);
//         const colon = dataString.indexOf(':', prefixIndex + prefix.length);
//         const id = dataString.slice(prefixIndex + prefix.length, colon).trim();
//         const player = this.connectedPlayers.find(p => p.id === id);
//         if (player) {
//             this.connectedPlayers = this.connectedPlayers.filter(p => p.id !== id);
//             playerDisconnectedListeners.forEach(l => l(player));
//         }
//     }
// }
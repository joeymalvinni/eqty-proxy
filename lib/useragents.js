const users = require('../src/credentials.js');
const randomUseragent = require('random-useragent');
const fs = require('fs');
const fileName = 'users.js';

function main () {
    let final = {};
    users.forEach((user) => {
        let agent = randomUseragent.getRandom();
        final[user.username] = agent;
    })

    let string = `const USERAGENTS = ${JSON.stringify(final, null, 4)}\n\nmodule.exports = USERAGENTS;`

    fs.writeFileSync('./src/users.js', string);

    console.log(string)
}

main()
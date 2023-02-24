![EQTY-Proxy banner](https://raw.githubusercontent.com/joeymalvinni/eqty-proxy/main/imgs/eqty-proxy-banner.png)

# Installation

Clone the `eqty-proxy` github repository:

```bash
git clone https://github.com/joeymalvinni/eqty-proxy.git
cd eqty-proxy
```

Install the modules:

```bash
npm install
```

Now you should be ready to set up the server.


# Setup

Add a `credentials.js` file in the `/src` directory:

```bash
cd src
touch credentials.js
```

Edit this file to follow this structure:

```js
let CREDENTIALS = [
    { username: 'user', password: 'pass' },
    { username: 'user1', password: 'pass1' }
]

module.exports = CREDENTIALS;
```

Create random useragents for each of these users:

```bash
node lib/useragents.js
```

Now you can run the server!

```
npm start
```
# Marvel API Redis Cache Express Server

This is an Express server that interacts with the Marvel API to fetch character, comic, and story data. The fetched data is cached in Redis to improve performance and reduce API calls.

## Marvel API Setup

Before running the server, make sure to sign up for the Marvel API and obtain your public and private keys. You can register and get an API key from the [Marvel Developer Portal](https://developer.marvel.com/).

```javascript
const md5 = require('blueimp-md5');
const publickey = 'your_public_key(API KEY) from Marvel dev portal';
const privatekey = 'your private key from Marvel dev portal';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
```
## Cache Implementation
Data fetched from the Marvel API is cached in Redis for subsequent requests. 
Cached data is served if available, otherwise, a request is made to the Marvel API to fetch the data, which is then stored in the cache for future use.

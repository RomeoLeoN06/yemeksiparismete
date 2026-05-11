const https = require('https');

https.get('https://localhost:7131/api/products/restaurant/1', { rejectUnauthorized: false }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.parse(data).map(p => `${p.name}: ${p.price}`).join('\n'));
  });
});

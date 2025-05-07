const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

console.log('Script started');

(async () => {
  const response = await axios.get('https://tnrodrigues.framer.website/');

  const $ = cheerio.load(response.data);

  const src = $('script[data-framer-bundle]').attr('src');

  const htmlFiles = [
    'index.html',
    'writing.html',
    'projects.html',
    'contact.html',
  ];

  const publicDir = path.resolve(__dirname, './public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  ncp(
    path.resolve(__dirname, './framerusercontent.com'),
    path.resolve(publicDir, './framerusercontent.com')
  );

  htmlFiles.forEach((file) => {
    const html = fs.readFileSync(path.resolve(__dirname, `./${file}`), 'utf8');
    const $yourSite = cheerio.load(html);

    $yourSite('script[data-framer-bundle]').attr('src', src);

    fs.writeFileSync(path.resolve(publicDir, `./${file}`), $yourSite.html());
  });
})();

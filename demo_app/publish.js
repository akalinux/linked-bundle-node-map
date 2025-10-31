var ghpages = require('gh-pages');

ghpages.publish('public',{},msg=>console.log(msg));

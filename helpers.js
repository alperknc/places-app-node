/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `!`;

exports.menu = [
  { slug: '/stores', title: 'Mekânlar', icon: 'store', },
  { slug: '/tags', title: 'Etiketler', icon: 'tag', },
  { slug: '/top', title: 'Favori', icon: 'top', },
  { slug: '/map', title: 'Harita', icon: 'map', },
];


exports.adminMenu = [
  { slug: '/admin', title: 'Mekânlar', icon: 'store2', },
  { slug: '/admin/users', title: 'Kullanıcılar', icon: 'pencil', },
  { slug: '/admin/reviews', title: 'Yorumlar', icon: 'review', },
  { slug: '/admin/business', title: 'Başvurular', icon: 'map', }
];
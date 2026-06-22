const oldTestament = require('./otBooks.js');
const newTestament = require('./ntBooks.js');

module.exports = [...oldTestament, ...newTestament];

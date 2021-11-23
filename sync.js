if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/sync.production.js');
} else {
  module.exports = require('./dist/sync.development.js');
}

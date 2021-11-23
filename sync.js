if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/sync.production.min.js');
} else {
  module.exports = require('./dist/sync.development.js');
}

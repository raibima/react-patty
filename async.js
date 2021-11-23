if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/async.production.js');
} else {
  module.exports = require('./dist/async.development.js');
}

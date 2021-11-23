if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/index.production.min.js');
} else {
  module.exports = require('./dist/index.development.js');
}

'use strict';
if (parseInt(process.versions.node.split('.')[0]) < 10) throw new Error('joyce requires Node.js version 10 or newer.');

module.exports = require('./lib/compile');

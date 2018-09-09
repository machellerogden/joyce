'use strict';

const fs = require('fs');
const YAML = require('js-yaml');
const Module = require('module');

const yml = (filePath) => YAML.safeLoad(fs.readFileSync(filePath, 'utf8'));
const json = (filePath) => Module._load(filePath);

const reader = {
    yml,
    yaml: yml,
    json
};

module.exports = reader;


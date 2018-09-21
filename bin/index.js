#!/usr/bin/env node
'use strict';

const data = require('fs').readFileSync(0, 'utf8');

if (data != null) {
    try {
        process.stdout.write(JSON.stringify(require('../lib/compile')(JSON.parse(data)), null, 4));
    } catch (e) {
        process.stderr.write('{"error":"invalid JSON"}');
    }
}

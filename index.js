#!/usr/bin/env node
'use strict';

const compile = require('./lib/compile');

if (!process.stdin.isTTY) {
    const data = require('fs').readFileSync(0, 'utf8');
    if (data != null) {
        try {
            process.stdout.write(JSON.stringify(compile(JSON.parse(data)), null, 4));
        } catch {
            process.stderr.write('{"error":"invalid JSON"}');
        }
    }
}

module.exports = compile;

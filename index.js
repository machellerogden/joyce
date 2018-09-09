'use strict';

module.exports = load;

const path = require('path');
const callsites = require('callsites');
const globby = require('globby');
const untildify = require('untildify');
const reader = require('./lib/reader');
const parse = require('./lib/parse');

function load(givenPatterns, searchFromRoot = false) {

    const patterns = Array.isArray(givenPatterns)
        ? givenPatterns.map(p => untildify(p))
        : untildify(givenPatterns);

    const dir = searchFromRoot
        ? '/'
        : path.dirname(callsites()[1].getFileName());

    const paths = globby.sync(patterns, { cwd: dir });

    return paths.reduce((acc, currentFile) => {

        const file = {
            ...path.parse(currentFile),
            path: path.resolve(currentFile)
        };

        const key = file.ext.startsWith('.')
            ? file.ext.slice(1)
            : file.ext;

        if (Object.keys(reader).includes(key)) acc.push({
            name: file.name,
            file: file.path,
            data: parse(reader[key](file.path))
        });

        return acc;
    }, []);
}

'use strict';

const evaluate = require('./evaluate');
const { Literal } = require('forast').nodes;

const Template = (template, ...args) => {
    template = evaluate(`context.template\`${template}\``, {
        template: (strings, ...values) =>
            strings.reduce((acc, part, i) => {
                const idx = values[i];
                const v = idx == null
                    ? ''
                    : args[idx];
                return acc + part + v;
            }, '')
    });
    return Literal(template);
};

module.exports = Template;

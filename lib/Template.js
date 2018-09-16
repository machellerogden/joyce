'use strict';

const evaluate = require('./evaluate');

const Template = (template, ...args) => {
    template.value = evaluate(`template\`${template.value}\``, {
        template: (strings, ...values) =>
            strings.reduce((acc, part, i) => {
                const idx = values[i];
                const v = idx == null
                    ? ''
                    : args[idx].value;
                return acc + part + v;
            }, '')
    });
    return template;
};

module.exports = Template;

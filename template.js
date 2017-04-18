'use strict';
const tmpl = (strings, ...keys) => {
    return (function(...values) {
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function(key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}
module.exports = {
    'test': tmpl`<div>${'greeting'} This is a <b>${'test'}</b> page.</div>`,
    'helloworld': '<h1>Welcome to Middle Layer!</h1><div>{{ user }}</div>' 
}

module.exports = function setup(options, imports, register) {

    var http = imports.http;
    var auth = imports.auth;

    var ops = {
        add: function (a,b) { return a + b; },
        subtract: function (a, b) { return a - b; },
        multiply: function (a, b) { return a * b; },
        divide: function (a, b) { return a / b; },
    }


};

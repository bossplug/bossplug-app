define(function () {

    motherboard.provides = ["motherboard"];
    return motherboard;

    function motherboardPlugin(options, imports, register) {
        register(null, {motherboard: {
            add: function (a,b) { return a + b; },
            subtract: function (a, b) { return a - b; },
            multiply: function (a, b) { return a * b; },
            divide: function (a, b) { return a / b; }
        }});
    }

});

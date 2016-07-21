"use strict";

const foo = function foo(request, response) {

    console.log(request);
    console.log(response);

};

exports.foo = foo;

var jshintConfig = {
    maxerr: 100,            // the maximum amount of warnings JSHint will produce before giving up
    undef: true,            // prohibits the use of explicitly undeclared variables
    unused: true,           // warns when you define and never use your variables
    globals: {},             // specify a white list of global variables that are not formally defined
    bitwise: true,          // prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others
    curly: true,            // requires you to always put curly braces around blocks in loops and conditionals
    eqeqeq: true,           // prohibits the use of == and != in favor of === and !==.
    esversion: 6,           // to tell JSHint that your code uses ECMAScript 6 specific syntax
    forin: true,            // requires all for in loops to filter object's items
    freeze: true,           // prohibits overwriting prototypes of native objects such as Array, Date and so on
    futurehostile: true,    // enables warnings about the use of identifiers which are defined
    // in future versions of JavaScript
    latedef: 'nofunc',      // prohibits the use of a variable before it was defined
    maxparams: 3,           // lets you set the max number of formal parameters allowed per function
    maxdepth: 3,            // lets you control how nested do you want your blocks to be
    maxcomplexity: 5,       // lets you control cyclomatic complexity throughout your code.
    // Cyclomatic complexity measures the number of linearly independent paths
    // through a program's source code
    noarg: true,            // prohibits the use of arguments.caller and arguments.callee
    nocomma: true,          // prohibits the use of the comma operator
    nonew: true,            // prohibits the use of constructor functions for side-effects
    // more info: http://jshint.com/docs/options/#maxerr

    asi: true,              // This option suppresses warnings about missing semicolons.
    boss: true,             // This option suppresses warnings about the use of assignments
    // in cases where comparisons are expected
    expr: true,             // This option suppresses warnings about the use of expressions
    // where normally you would expect to see assignments or function calls
    lastsemic: true,        // This option suppresses warnings about missing semicolons,
    // but only when the semicolon is omitted for the last statement in a one-line block
    node: true              // This option defines globals available
    // when your code is running inside of the Node runtime environment
};

module.exports = jshintConfig;

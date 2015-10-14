// Create the functions we will use for the test case.
function injectTestRig(scope) {
    scope.jasmine = {
        createSpy: function(){
            var spy = function(){
                spy.invoked++;
                spy.lastArguments = arguments;
                return spy.result;
            };
            spy.isSpy = true;
            spy.invoked = 0;
            spy.lastArguments = undefined;
            spy.result = undefined;
            spy.and = {
                returnValue: function(result){
                    spy.result = result;
                    return spy;
                }
            };

            return spy;
        }
    };

    scope.presenters = [];
    scope.hookPresenter = function (presenter) {
        scope.presenters.push(presenter);
    };

    scope.assert = function (expectation, actual, message) {
        if (!scope.deepEqual(expectation, actual)) {
            throw new Error("Expected [" + expectation + "] and received [" + actual + "] [message: " + message + "]");
        }
    };

    scope.it = function (name, f) {
        env.testCases[name] = f;
    };

    scope.beforeEach = function(f){
        env.beforeEach.push(f);
    };

    scope.expect = function (actual) {
        var currScope = scope;
        return {
            toBe: function (expectation) {
                currScope.assert.call(env, expectation, actual);
            },
            toHaveBeenCalled: function(){
                currScope.assert.call(actual, true, actual.isSpy, "This function is not a spy");
                currScope.assert.call(actual, true, actual.invoked > 0, "Expected function to be invoked.  ");
            },
            toHaveBeenCalledWith: function(scope){
                currScope.assert.call(actual, true, actual.isSpy, "This function is not a spy");
                currScope.assert.call(actual, [scope], actual.lastArguments, "Expected arguments to match.  ");
            },
            toThrow: function(){
                var hasThrown = false;
                try {
                    actual.apply(env);
                } catch(e){
                    hasThrown = true;
                }
                currScope.assert.call(null, hasThrown, true, "Expected function to throw an error. ");
            }
        }
    };

    scope.describe = function (name, f) {
        var result = {
            name: name,
            status: true,
            tests: []
        };

        var testSuite = new TestSuite(name);
        scope.env = testSuite;
        f.apply(testSuite);

        Object.keys(testSuite.testCases).forEach(function (name) {
            var context = {};
            testSuite.beforeEach.forEach(function(f){
                f.bind(context)();
            });

            var test = testSuite.testCases[name];
            try {
                test.bind(context)();
                result.tests.push({name: name, status: true, error: null});
            } catch (e) {
                if (e instanceof String){
                    result.tests.push({name: name, status: false, error: JSON.stringify(e)});
                } else {
                    result.status = false;
                    result.tests.push({name: name, status: false, error: e});
                }
            }
        });

        scope.presenters.forEach(function (presenter) {
            presenter.render(result);
        });
        scope.env = null;
        return result;

    };

    function TestSuite(name) {
        this.name = name;
        this.testCases = {};
        this.beforeEach = [];
    }

}

// Inject on the window.
injectTestRig(window);
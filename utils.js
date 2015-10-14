'use strict';

function injectUtils(scope){
    scope.deepEqual = function(a, b) {
        if (a === b) return true;

        if (a == null || typeof a != "object" ||
            b == null || typeof b != "object")
            return false;

        var propsInA = 0, propsInB = 0;

        for (var prop in a)
            propsInA += 1;

        for (var prop in b) {
            propsInB += 1;
            if (!(prop in a) || !deepEqual(a[prop], b[prop]))
                return false;
        }

        return propsInA == propsInB;
    };
    scope.range = function(count){
        var arr = [];
        for(var i = 0; i < count; i++){
            arr.push(i);
        }
        return arr;
    };
    scope.times = function(times, f) {
        for(var i =0; i < times; i++){
            f(i);
        }
    };
}


// Inject Utils.
injectUtils(window);
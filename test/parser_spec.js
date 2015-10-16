'use strict';

describe("Parse", function(){

    it("can parse an integer", function(){
        var fn = parse('42');
        expect(fn).toBeDefined();
        expect(fn()).toBe(42);
    });


});
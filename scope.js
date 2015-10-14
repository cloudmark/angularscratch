'use strict';
function initWatchVal() { }
function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatch = null;
}
Scope.prototype = {
    $watch: function (watchFn, listenerFn) {
        var watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn || function(){},
            last: initWatchVal
        };
        this.$$watchers.push(watcher);
    },
    $$digestOnce: function(){
        var self = this;
        var newValue, oldValue;
        var dirty = false;
        var toBreak = false;
        this.$$watchers.forEach(function(watcher){
            if (!toBreak) {
                newValue = watcher.watchFn(self);
                oldValue = watcher.last;
                if (newValue !== oldValue) {
                    self.$$lastDirtyWatch = watcher;
                    watcher.last = newValue;
                    watcher.listenerFn(newValue, (oldValue === initWatchVal ? newValue : oldValue), self);
                    dirty = true;
                } else if (self.$$lastDirtyWatch === watcher) {
                    dirty = false;
                    toBreak = true;
                }
            }
        });
        return dirty;
    },
    $digest: function () {
        var ttl = 10;
        var dirty;
        this.$$lastDirtyWatch = null;
        do {
            dirty = this.$$digestOnce();
            if(dirty && !(ttl--)){
                throw "10 digests iteration reached";
            }
        } while(dirty);

    }
};
'use strict';
define(function(){
    return {
        bind: function(ev, callback) {
            var calls = this.callbacks || (this.callbacks = {});
            (this.callbacks[ev] || (this.callbacks[ev] = [])).push(callback);
            return this;
        },
        trigger: function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var ev = args.shift ();
            var list, calls, i, l;

            if (!(calls = this.callbacks)) return this;
            if (!(list = this.callbacks[ev])) return this;
            for (i = 0, l = list.length; i < l; i++){
                list[i].apply (this, args);
            }
            return this;
        },
        unbind: function(ev){
            delete this.callbacks[ev]
        }
    };
});
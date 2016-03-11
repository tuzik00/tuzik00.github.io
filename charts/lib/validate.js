'use strict';
define(function(){
    return {
        config: {},
        type: {},
        _validate: function(data, val){
            var i, type, checker, result_ok;
            this.messages = {};
            if(typeof val !== 'undefined'){
                var obj = {};
                obj[data] = val;
                data = obj;
            }
            for(i in data){
                if(data.hasOwnProperty(i)){

                    type = this.config[i];
                    checker = this.type[type];
                    if(!type) continue;
                    if(!checker){
                        throw {
                            name: 'ValidationError',
                            message: 'Messages'
                        }
                    }

                    result_ok = checker.validate.call(this, data[i]);
                    if(typeof result_ok == 'string'){
                        this.messages[i] = result_ok
                    }
                }
            }
            this.trigger('validate', this.messages);
            return this._hasErrors();
        },
        _hasErrors: function(){
            var keys = [];
            for (var i in this.messages) {
                if (this.messages.hasOwnProperty(i)) {
                    keys.push(i);
                }
            }
            return keys.length === 0;
        }
    };
});
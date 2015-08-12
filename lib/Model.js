'use strict';
define([
    'jquery',
    './observer',
    './validate'
], function($, observer, validate){

    function guid(){
        return 'C4yyx'.replace(/[xy]/g, function (c) {
            var r = Math.random () * 16|0, v = c == 'x' ? r : (r&0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }

    var Model = function(collection){
        this.id = guid();
        this.records[this.id] = collection || {};
        this.init.apply(this, arguments);
    };

    $.extend(Model.prototype, observer, validate, {
        init: function(){},
        records: {},
        get: function(id){
            if(typeof id === 'undefined'){
                return this.records[this.id];
            } else {
                return this.records[this.id][id];

            }
        },
        set: function(key, value){
            if(typeof key === 'undefined') return false;

            var record = this.records[this.id],
                attrs;

            if(typeof value === 'undefined'){
                attrs = key;
            } else {
                if(typeof key !== 'object'){
                    attrs = value
                } else {
                    (attrs = {})[key] = value;
                }
            }

            if(!this._validate(attrs) ) return false;

            if(typeof value === 'undefined'){
                $.extend(record, key);
            } else {
                (record[key] || (record[key] = [])).push( attrs )
            }

            for(key in this.callbacks){
                var prop = key.split(':')[1];
                if(record[prop] || key[prop]){

                    this.trigger('change:'+ prop, record[prop] || key[prop]);
                }
            }

            this.trigger('change', record);

            return this;
        },
        remove: function(id, options){
            var records = this.records[this.id];
            if(typeof options == 'undefined'){
                delete records[id];
                this.trigger('change:'+id, records)
                    .trigger('change', records);
            } else {
                if(options.hasOwnProperty('arrayPos')){
                    records[id].splice(options.arrayPos, 1);
                    this.trigger('change:'+id, records[id])
                        .trigger('change', records);
                }
            }
            return this;
        }
    });

    return Model;
});
'use strict';
define(['jquery', './delegateEvents'], function($, events){
    var Ctrl = function(props){
        props = props || {};
        this.model = props.model;
        this.element = props.element;
        this.template = props.template;
        this.init.apply(this, arguments);
        this.delegateEvents.call(this);
    };

    $.extend(Ctrl.prototype, events,{
        init: function(){},
        templater: function(str, data) {
            var fn =  new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj||{}){p.push('" +
                String(str)
                    .replace(/[\r\t\n]/g, " ")
                    .split("{%").join("\t")
                    .replace(/((^|%})[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%}/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%}").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

            return data ? fn( data ) : fn;
        },
        listen: function(event, model, callback){
            var events = event.split(' '),
                i, len = events.length;
            for(i= 0; i<len; i++){
                model.bind(events[i], $.proxy(callback, this))
            }
        },
        unbind: function(event, model){
            model.unbind(event)
        }
    });

    return Ctrl;
});
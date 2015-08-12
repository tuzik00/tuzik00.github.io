'use strict';
define([
    'jquery',
    './Ctrl',
    './Model'
], function($, Ctrl, Model){
    var Core = {};

    Core.Model = Model;
    Core.Ctrl = Ctrl;

    Ctrl.create = Model.create = function(props){
        props = props || {};
        var parent = this;
        function child(){ return parent.apply(this, arguments) }
        function Surrogate(){ this.constructor = parent}

        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        $.extend(child.prototype, props);

        return child
    };

    return Core;
});
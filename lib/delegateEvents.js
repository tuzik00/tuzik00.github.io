define(['jquery'], function($){
    return {
        events: {},
        eventSplitter: /^(\w+)\s*(.*)$/,
        delegateEvents: function(){
            for (var key in this.events) {
                var methodName = this.events[key],
                    method = $.proxy( this[methodName], this),
                    match = key.match(this.eventSplitter),
                    eventName = match[1], selector = match[2];
                if (selector === '') {
                    this.element.on(eventName, method)
                } else {
                    this.element.on(eventName,selector, method);
                }
            }
        }
    }
});
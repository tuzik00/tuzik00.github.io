function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createElement(tagName, className, cssProps) {
    var el;
    var addCssProp = function (cssProps) {
        var propValue, prop;

        for (prop in cssProps) {
            propValue = cssProps[prop];

            el.style[prop] = propValue;
        }
    };

    if (typeof tagName === 'undefined') {
        throw new Error('не задан tagName ' + createElement);
    }

    el = document.createElement(tagName);

    if (typeof className === 'string') {
        el.className = className;
    } else if (typeof className === 'object') {
        addCssProp(className);
    }

    if (tagName && className && cssProps) {
        addCssProp(cssProps);
    }

    return el;
}

function bind(fn, contex) {
    return function () {
        return fn.apply(contex, arguments);
    }
}

function inherit(child, parent) {
    var surogat = function () {
    };

    surogat.prototype = parent.prototype;
    child.super = parent;
    child.prototype = new surogat;
    child.prototype.constructor = child;
}

if (!Object.create) {
    Object.create = function (o) {
        function F() {}

        F.prototype = o;
        return new F();
    };
}

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

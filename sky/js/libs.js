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
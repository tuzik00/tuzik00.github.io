var Flower = (function () {

    var Flower = function (options) {
        options || (options = {});

        this.el = null;
        this.x = options.x;
        this.y = options.y;

        this.initialize.apply(this, arguments);
    };

    Flower.prototype.initialize = function () {
    };

    Flower.prototype.remove = function () {
        this.el.remove();
    };

    Flower.prototype.create = function () {
    };

    return Flower;
}());


var Cactus = (function () {

    var Cactus = function () {
        Cactus.super.apply(this, arguments);
    };

    inherit(Cactus, Flower);

    Cactus.prototype.create = function () {

        var wrap = this.el = createElement('div', 'cactus', {
            left: this.x + 'px',
            top: this.y - 100 + 'px'
        });


        var thorn1 = createElement('div', 'cactus__thorn1');
        var thorn2 = createElement('div', 'cactus__thorn2');
        var thorn3 = createElement('div', 'cactus__thorn3');
        var thorn4 = createElement('div', 'cactus__thorn4');

        wrap.appendChild(thorn1);
        wrap.appendChild(thorn2);
        wrap.appendChild(thorn3);
        wrap.appendChild(thorn4);

        return wrap;
    };

    return Cactus;
}());


var Chamomile = (function () {

    var Chamomile = function () {
        Chamomile.super.apply(this, arguments);
    };

    inherit(Chamomile, Flower);

    Chamomile.prototype.create = function () {

        var wrap = this.el = createElement('div', 'cactus', {
            left: this.x + 'px',
            top: this.y - 120 + 'px'
        });

        var thorn1 = createElement('div', 'cactus__thorn1');
        var thorn2 = createElement('div', 'cactus__thorn2');
        var thorn3 = createElement('div', 'cactus__thorn3');
        var thorn4 = createElement('div', 'cactus__thorn4');

        wrap.appendChild(thorn1);
        wrap.appendChild(thorn2);
        wrap.appendChild(thorn3);
        wrap.appendChild(thorn4);

        return wrap;
    };

    return Chamomile;
}());


var Rose = (function () {

    var Rose = function () {
        Rose.super.apply(this, arguments);
    };

    inherit(Rose, Flower);

    Rose.prototype.create = function () {

        var wrap = this.el = createElement('div', 'rose', {
            left: this.x + 'px',
            top: this.y - 100 + 'px'
        });

        var stem = createElement('div', 'rose__stem');
        var petaltopcenter = createElement('div', 'rose__petaltopcenter');
        var petalbottomright = createElement('div', 'rose__petalbottomright');
        var petalbottomleft = createElement('div', 'rose__petalbottomleft');
        var centerleaf = createElement('div', 'rose__centerleaf');

        wrap.appendChild(stem);
        wrap.appendChild(petaltopcenter);
        wrap.appendChild(petalbottomright);
        wrap.appendChild(petalbottomleft);
        wrap.appendChild(centerleaf);

        return wrap;
    };

    return Rose;

}());


var Tree = (function () {

    var Tree = function () {
        Tree.super.apply(this, arguments);
    };

    inherit(Tree, Flower);

    Tree.prototype.create = function () {

        var wrap = this.el = createElement('div', 'tree', {
            left: this.x + 'px',
            top: this.y - 185 + 'px'
        });

        var layer1 = createElement('div', 'tree__layer');
        var layer2 = createElement('div', 'tree__layer tree__layer_2');
        var layer3 = createElement('div', 'tree__layer tree__layer_3');
        var log = createElement('div', 'tree__log');

        wrap.appendChild(layer1);
        wrap.appendChild(layer2);
        wrap.appendChild(layer3);
        wrap.appendChild(log);

        return wrap;
    };

    return Tree;

}());

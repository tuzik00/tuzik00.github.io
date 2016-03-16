var FlowerFactory = (function () {
    var FlowerFactory = function () {};

    FlowerFactory.create = function (name, options) {
        if (typeof this.prototype[name] == 'function') {
            return new this.prototype[name](options);
        }
    };

    FlowerFactory.prototype = {
        cactus: Cactus,
        chamomile: Chamomile,
        rose: Rose,
        tree: Tree
    };

    return FlowerFactory;

}());
var Earth = (function () {

    var Earth = function () {
        this.el = null;
        this.dx = 0;
        this.dy = WINDOW_HEIGHT - EARTH_HEIGHT;

        this.initialize.apply(this, arguments);
    };

    Earth.prototype.initialize = function(){
        SYS_collisionManager.add('Earth', this, this.collide);
    };

    Earth.prototype.create = function () {
        var el;
        el = this.el = createElement('div', 'earth', {
            position: 'absolute',
            height: EARTH_HEIGHT + 'px',
            width: 100 + '%',
            top: this.dy + 'px',
            left: this.dx,
            background: "#7B6940"
        });

        return el;
    };

    Earth.prototype.collide = function () {

    };

    return Earth;

}());
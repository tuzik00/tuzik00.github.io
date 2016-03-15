var Rain = (function () {
    var indentLeft = 50,
        indentTop = 120;

    var Rain = function (dx, dy, zIndex) {
        this.el = null;
        this.dx = dx + indentLeft;
        this.dy = dy + indentTop;
        this.dt = 0.4;
        this.velo = 1;
        this.accel = 1;
        this.zIndex = zIndex;
        this.removed = false;

        this.initialize.apply(this, arguments);
    };

    Rain.prototype.initialize = function () {
        this.create();

        SYS_collisionManager.add('Rain', this, this.collide);
    };

    Rain.prototype.create = function () {
        var rain;

        this.el = createElement('div', 'rain', {
            zIndex: this.zIndex
        });

        for (var i = 0; i < RAIN; i++) {
            rain = createElement('span', 'rain__item');
            this.el.appendChild(rain)
        }

    };

    Rain.prototype.move = function () {
        this.dy += this.velo * this.dt;
        this.updateStyle();
    };

    Rain.prototype.updateStyle = function () {
        this.el.style.top = this.dy + 'px';
        this.el.style.left = this.dx + 'px';
    };

    Rain.prototype.collide = function () {
        this.el.remove();
        this.removed = true;
    };

    return Rain;
}());


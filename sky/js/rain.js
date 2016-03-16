var Rain = (function () {
    var indentLeft = 45,
        indentTop = 108;

    var Rain = function (x, y, zIndex) {
        this.el = null;
        this.x = x + indentLeft;
        this.y = y + indentTop;
        this.dt = 0.4;
        this.velo = 0;
        this.force = 0;
        this.mass = 3;
        this.zIndex = zIndex;
        this.removed = false;

        this.initialize.apply(this, arguments);
    };

    Rain.prototype.initialize = function () {
        this.create();

        Core.collisionManager.add('Rain', this, this.collide);
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

    Rain.prototype.calcForce = function () {
        this.force = this.mass * GRAVITY - RESISTANCE * this.velo;
    };

    Rain.prototype.updateAccel = function () {
        this.acc = this.force / this.mass;
    };

    Rain.prototype.updateVelo = function () {
        this.velo = this.velo + this.acc * this.dt;
    };

    Rain.prototype.move = function () {
        this.y = this.y + this.velo * this.dt;

        this.calcForce();
        this.updateAccel();
        this.updateVelo();
        this.updateStyle();
    };

    Rain.prototype.updateStyle = function () {
        this.el.style.top = this.y + 'px';
        this.el.style.left = this.x + 'px';
    };

    Rain.prototype.collide = function () {
        this.el.remove();
        this.removed = true;
    };

    return Rain;
}());


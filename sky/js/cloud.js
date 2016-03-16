var Cloud = (function () {
    var zIndex = 0;

    var Cloud = function (options) {
        options || (options = {});

        this.x = options.x;
        this.y = options.y;
        this.dt = 0.4;
        this.velo = options.velo;
        this.progressBar = Object.create(ProgressBar);
        this.zIndex = ++zIndex;

        this._rainReay = false;
        this._rainAmount = 0;
        this._rainRandomValue = null;

        this.updateRainRandomValue();
    };

    Cloud.prototype.create = function () {
        var wrap, head, boy;

        wrap = this.el = createElement('div', 'cloud', {
            zIndex: this.zIndex,
            width: CLOUDS_WIDTH + 'px',
            height: CLOUDS_HEIGHT + 'px'
        });

        head = createElement('div', 'cloud__head');
        boy = createElement('div', 'cloud__body');

        wrap.appendChild(head);
        wrap.appendChild(boy);
        wrap.appendChild(this.progressBar.create());

        return wrap;
    };

    Cloud.prototype._rainAccumulate = function () {
        if (!this._rainReay) {
            if (this.getRainAmount() >= 100) {
                this._rainReay = true;
                this._rainStart();
            } else {
                this.setRainAmount(this._rainRandomValue);
            }
        }
    };

    Cloud.prototype._rainStart = function () {
        var count = 0, timer;

        timer = setInterval(function () {
            if (count < RAIN_STACK) {
                var rain = new Rain(this.x, this.y, this.zIndex);

                Core.processor.add(rain);

                container.appendChild(rain.el);
                this.setRainAmount(-(100 / RAIN_STACK));

                ++count;
            } else {
                clearInterval(timer);
                setTimeout(this._rainStop.bind(this), getRandomInt(5000, 10000));

                this.setRainAmount(0);
            }
        }.bind(this), 50)
    };

    Cloud.prototype._rainStop = function () {
        this.updateRainRandomValue();
        this._rainReay = false;
    };

    Cloud.prototype.setRainAmount = function (value) {
        if (typeof value !== 'number') return;

        if (this._rainAmount > 100) {
            this._rainAmount = 100
        } else if (this._rainAmount < 0) {
            this._rainAmount = 0;
        }

        this._rainAmount += value;
    };

    Cloud.prototype.getRainAmount = function () {
        return this._rainAmount;
    };

    Cloud.prototype.updateRainRandomValue = function () {
        this._rainRandomValue = Math.random() * 0.5;
    };

    Cloud.prototype._updateProgressBar = function () {
        this.progressBar.setValue(this.getRainAmount());
    };

    Cloud.prototype._checkBoundaries = function () {
        if (this.x > WINDOW_WIDTH + PROGRESS_BAR_WIDTH) {
            this.x = -CLOUDS_WIDTH;
        }
    };

    Cloud.prototype.move = function () {
        this.x += this.velo * this.dt;

        this._rainAccumulate();
        this._checkBoundaries();
        this._updateStyle();
        this._updateProgressBar();
    };

    Cloud.prototype._updateStyle = function () {
        this.el.style.left = this.x + 'px';
        this.el.style.top = this.y + 'px';
    };

    return Cloud;
}());
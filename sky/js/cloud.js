var Cloud = (function () {
    var zIndex = 0;

    var Cloud = function (options) {
        this.options = options;
        this.dx = getRandomInt(0, WINDOW_WIDTH - CLOUDS_WIDTH);
        this.dy = getRandomInt(0, WINDOW_HEIGHT / 2);
        this.dt = 0.4;
        this.velo = Math.random();
        this.accel = 1;
        this.progressBar = Object.create(ProgressBar);
        this.zIndex = ++zIndex;

        this._rainReady = false;
        this._rainAmount = 0;
        this._rainRandomValue = null;

        this.updateRainRandomValue();
    };

    Cloud.prototype.create = function () {
        var wrap, head, body;

        wrap = this.el = createElement('div', 'cloud', {
            zIndex: this.zIndex,
            width: CLOUDS_WIDTH + 'px',
            height: CLOUDS_HEIGHT + 'px'
        });

        head = createElement('div', 'cloud__head');
        body = createElement('div', 'cloud__body');

        wrap.appendChild(head);
        wrap.appendChild(body);
        wrap.appendChild(this.progressBar.create());

        return wrap;
    };

    Cloud.prototype._rainAccumulate = function () {
        if (!this._rainReady) {
            if (this.getRainAmount() >= 100) {
                this._rainReady = true;
                this._rainStart();
            } else {
                this.setRainAmount(this._rainRandomValue);
                this._updateProgressBar();
            }
        }
    };

    Cloud.prototype._rainStart = function () {
        var count = 0, timer;

        timer = setInterval(function () {
            if (count < RAIN_STACK) {
                var rain = new Rain(this.dx, this.dy, this.zIndex);
                SYS_process.add(rain);
                container.appendChild(rain.el);

                this.setRainAmount(-RAIN_STACK);
                this._updateProgressBar();

                ++count;

            } else {
                clearInterval(timer);
                this._rainStop()
            }
        }.bind(this), 500)
    };

    Cloud.prototype._rainStop = function () {
        this.setRainAmount(0);
        this.updateRainRandomValue();
        this._rainReady = false;
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

    Cloud.prototype.updateRainRandomValue = function(){
        this._rainRandomValue = Math.random() * 0.5;
    };

    Cloud.prototype._updateProgressBar = function () {
        this.progressBar.setValue(this.getRainAmount());
    };

    Cloud.prototype._checkBoundaries = function () {
        if (this.dx > WINDOW_WIDTH + PROGRESS_BAR_WIDTH) {
            this.dx = -CLOUDS_WIDTH;
        }
    };

    Cloud.prototype._updateVelo = function(){

    };

    Cloud.prototype.move = function () {
        this.dx += this.velo * this.dt;

        this._rainAccumulate();
        this._checkBoundaries();
        this._updateStyle();
        this._updateVelo();
    };

    Cloud.prototype._updateStyle = function () {
        this.el.style.left = this.dx + 'px';
        this.el.style.top = this.dy + 'px';
    };

    return Cloud;
}());
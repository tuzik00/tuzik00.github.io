var Earth = {
    el: null,
    x: 0,
    y: WINDOW_HEIGHT - EARTH_HEIGHT,
    width: WINDOW_WIDTH,
    height: EARTH_HEIGHT,
    kDrought: 1,
    plantingDensity: 10,
    _rainCount: 0,
    _droughtIndex: 1,
    _flowerIndex: 0,
    flowerName: {'10': 'cactus', '5': 'rose', '2': 'tree'},
    flowersList: [],
    propgressBar: Object.create(ProgressBar),
    initialize: function () {
        Core.collisionManager.add('Earth', this, this.collide);
        this._createFlowers('cactus');

        return this;
    },

    create: function () {
        var earth = this.el = createElement('div', 'earth', {
            width: this.width + 'px',
            height: this.height + 'px',
            top: this.y + 'px',
            left: this.x + 'px'
        });

        var progressBar = this.propgressBar.create();
        progressBar.style.left = '10px';

        earth.appendChild(progressBar);

        this._updateStyle();

        return earth;
    },

    _createFlowers: function (name) {
        var flower;

        this._clearFlowers();

        for (var i = 0; i < this.plantingDensity; i++) {

            flower = FlowerFactory.create(name, {
                x: getRandomInt(50, WINDOW_WIDTH),
                y: getRandomInt(this.y, this.y + EARTH_HEIGHT)
            });

            this.flowersList.push(flower);

            container.appendChild(flower.create());
        }
    },

    _clearFlowers: function () {

        if (!this.flowersList.length) return;

        var i = 0, len = this.flowersList.length;

        for (; i < len; i++) {
            this.flowersList[i].remove();
        }

        this.flowersList = [];

    },

    _checkFlowers: function () {
        var flowerIndex = ('' + this.getDroughtIndex() % 1)[2];
        var flowerName = this.flowerName[flowerIndex];

        if (flowerIndex && this._flowerIndex !== flowerIndex && flowerName) {
            this._createFlowers(flowerName);
            this._flowerIndex = flowerIndex;
        }
    },

    getRainCount: function () {
        return Math.round(this._rainCount);
    },

    setRainCount: function (index) {
        if (this._rainCount < 0) {
            this._rainCount = 0;
        }

        this._rainCount += index;
    },

    getDroughtIndex: function () {
        return this._droughtIndex;
    },

    _updateDroughtIndex: function () {
        var progress = this.getRainCount() * 0.001;

        this._droughtIndex = (1 - progress).toFixed(3);
        this.propgressBar.setValue(100 * progress)
    },

    move: function () {
        this.setRainCount(-this.kDrought / 5);

        this._checkFlowers();
        this._updateStyle();
        this._updateDroughtIndex();
    },

    collide: function () {
        this.setRainCount(this.kDrought);
    },

    _updateStyle: function () {
        this.el.style.background = 'rgb(' + 250 * this.getDroughtIndex() + ', 170, 0)'
    }
};
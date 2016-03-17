(function () {

    var CLOUDS = 3;
    var RAIN = 20;
    var GRAVITY = 6;
    var RESISTANCE = 0.5;
    var CLOUDS_WIDTH = 400;
    var CLOUDS_HEIGHT = 120;
    var RAIN_STACK = 150;
    var EARTH_HEIGHT = 100;
    var PROGRESS_BAR_WIDTH = 16;
    var WINDOW_WIDTH = window.innerWidth;
    var WINDOW_HEIGHT = window.innerHeight;
    var container;

    var processor = {
        _objectsList: [],
        _addedItems: [],
        add: function (object) {
            this._addedItems.push(object)
        },
        process: function () {
            var newProcessList = [],
                len = this._objectsList.length;

            for (var i = 0; i < len; i++) {
                if (!this._objectsList[i].removed) {
                    this._objectsList[i].move();
                    newProcessList.push(this._objectsList[i]);
                }
            }
            this._objectsList = newProcessList.concat(this._addedItems);
            this._addedItems = [];
        }
    };


    var collisionManager = {
        _checkListIndex: 0,
        _checkList: {},
        _checkCollisions: function (obj1, obj2) {
            var XColl = false;
            var YColl = false;

            if ((obj1.x <= obj2.x)) XColl = true;
            if ((obj1.y <= obj2.y + 15)) YColl = true;

            if (XColl & YColl) return true;
        },
        add: function (colliderFlag, obj, callback) {
            var checkIndex;

            var colliderObj = {
                colliderFlag: colliderFlag,
                colliderObj: obj,
                callback: bind(callback, obj)
            };

            checkIndex = '' + this._checkListIndex++;
            this._checkList[checkIndex] = colliderObj;

        },
        checkCollisions: function () {
            for (var idx1 in this._checkList) {
                if (this._checkList[idx1].hasOwnProperty('colliderFlag')) {
                    for (var idx2 = idx1 + 1 in this._checkList) {
                        if (this._checkList[idx2] && this._checkList[idx1]) {
                            if (this._checkList[idx1].colliderFlag !== this._checkList[idx2].colliderFlag) {
                                if (this._checkCollisions(this._checkList[idx1].colliderObj, this._checkList[idx2].colliderObj)) {
                                    this._checkList[idx1].callback();
                                    this._checkList[idx2].callback();

                                    if (this._checkList[idx2].colliderObj.hasOwnProperty('removed')) {
                                        delete this._checkList[idx2];
                                    }

                                    if (this._checkList[idx1].colliderObj.hasOwnProperty('removed')) {
                                        delete this._checkList[idx1];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    var ProgressBar = {
        create: function () {
            var wrap = createElement('div', 'progress', {
                    width: PROGRESS_BAR_WIDTH + 'px'
                }),
                bar = this.bar = createElement('div', 'progress__bar');

            wrap.appendChild(bar);

            return wrap;
        },
        setValue: function (value) {
            this.bar.style.height = value + '%';
        }
    };


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

    var FlowerFactory = (function () {
        var FlowerFactory = function () {
        };

        FlowerFactory.create = function (name, options) {
            if (typeof this.prototype[name] == 'function') {
                return new this.prototype[name](options);
            }
        };

        FlowerFactory.prototype = {
            cactus: Cactus,
            rose: Rose,
            tree: Tree
        };

        return FlowerFactory;

    }());


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


    var Core = {
        processor: processor,
        collisionManager: collisionManager,
        initialize: function () {
            var that = this;
            container = document.getElementById('container');

            requestAnimationFrame(function animate() {

                that.processor.process();
                that.collisionManager.checkCollisions();

                requestAnimationFrame(animate);
            });

            this.addedObjects();
        },
        addedObjects: function () {
            Earth.initialize();
            this.processor.add(Earth);

            container.appendChild(Earth.create());

            for (var i = 0; i < CLOUDS; i++) {

                var cloud = new Cloud({
                    x: getRandomInt(10, WINDOW_WIDTH - CLOUDS_WIDTH),
                    y: getRandomInt(10, WINDOW_HEIGHT / 2),
                    velo: Math.random() * 3
                });

                this.processor.add(cloud);

                container.appendChild(cloud.create());
            }
        }
    };

    window.onload = function () {
        Core.initialize();
    }

}());
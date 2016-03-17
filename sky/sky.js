(function () {
    var CLOUDS = 3;
    var RAIN = 20;
    var GRAVITY = 6;
    var RESISTANCE = 0.5;
    var CLOUDS_WIDTH = 400;
    var RAIN_STACK = 150;
    var RAIN_TIME = 0.7;
    var EARTH_HEIGHT = 100;
    var PROGRESS_BAR_WIDTH = 16;
    var WINDOW_WIDTH = window.innerWidth;
    var WINDOW_HEIGHT = window.innerHeight;
    var container;
    var zIndex = 0;

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

    var Obj = createClass({
        el: null,
        x: 0,
        y: 0,
        velo: 0,
        dt: 0,
        force: 0,
        mass: 0,
        zIndex: 0,
        removed: false,
        _updateStyle: function () {
            this.el.style.top = this.y + 'px';
            this.el.style.left = this.x + 'px';
        },
        collide: function () {
            this.el.remove();
            this.removed = true;
        }
    });

    var Rain = createClass(Obj, {
        initialize: function (x, y, zIndex) {
            this.dt = 0.4;
            this.mass = 3;
            this.x = x + 45;
            this.y = y + 108;
            this.zIndex = zIndex;

            this.create();

            Core.collisionManager.add('Rain', this, this.collide);
        },
        create: function () {
            this.el = createElement('div', 'rain', {
                zIndex: this.zIndex
            });

            for (var i = 0; i < RAIN; i++) {
                this.el.appendChild(
                    createElement('span', 'rain__item')
                )
            }
        },
        calcForce: function () {
            this.force = this.mass * GRAVITY - RESISTANCE * this.velo;
        },
        updateAccel: function () {
            this.acc = this.force / this.mass;
        },
        updateVelo: function () {
            this.velo = this.velo + this.acc * this.dt;
        },
        move: function () {
            this.y = this.y + this.velo * this.dt;

            this.calcForce();
            this.updateAccel();
            this.updateVelo();
            this._updateStyle();
        }
    });

    var Cloud = createClass(Obj, {
        _rainReady: false,
        _rainAmount: 0,
        isRainPaused: false,
        initialize: function (options) {
            this.x = options.x;
            this.y = options.y;
            this.velo = options.velo;
            this.zIndex = ++zIndex;
            this.dt = 0.4;

            this._rainRandomValue = Math.random() * RAIN_TIME;
            this.progressBar = Object.create(ProgressBar);

            PubSub.subscribe('rainPaused', this.rainPaused.bind(this));
            PubSub.subscribe('rainResume', this.rainResume.bind(this));

        },
        create: function () {
            var wrap, head, body;

            wrap = this.el = createElement('div', 'cloud', {
                zIndex: this.zIndex
            });

            head = createElement('div', 'cloud__head');
            body = createElement('div', 'cloud__body');

            wrap.appendChild(head);
            wrap.appendChild(body);
            wrap.appendChild(this.progressBar.create());

            return wrap;
        },
        rainResume: function () {
            this.isRainPaused = false;
        },
        rainPaused: function () {
            this.isRainPaused = true;
        },
        _rainAccumulate: function () {
            if (!this._rainReady && !this.isRainPaused) {
                if (this.getRainAmount() >= 100) {
                    this._rainReady = true;
                    this._rainStart();

                } else {
                    this.setRainAmount(this._rainRandomValue);
                }
            }
        },
        _rainStart: function () {
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
                    this._rainReady = false;
                }
            }.bind(this), 50)
        },
        setRainAmount: function (value) {
            if (this._rainAmount > 100) {
                this._rainAmount = 100
            } else if (this._rainAmount < 0) {
                this._rainAmount = 0;
            }
            this._rainAmount += value;
        },
        getRainAmount: function () {
            return this._rainAmount;
        },
        _updateProgressBar: function () {
            this.progressBar.setValue(this.getRainAmount());
        },
        _checkBoundaries: function () {
            if (this.x > WINDOW_WIDTH + PROGRESS_BAR_WIDTH) {
                this.x = -CLOUDS_WIDTH;
            }
        },
        move: function () {
            this.x += this.velo * this.dt;

            this._rainAccumulate();
            this._checkBoundaries();
            this._updateStyle();
            this._updateProgressBar();
        }
    });


//=================================
    var Flower = createClass({
        initialize: function (params) {
            this.x = params.x;
            this.y = params.y;
        },
        remove: function () {
            this.el.remove();
        }
    });

    var Cactus = createClass(Flower, {
        create: function () {
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
        }
    });


    var Rose = createClass(Flower, {
        create: function () {
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
        }
    });

    var Tree = createClass(Flower, {
        create: function () {
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
        }
    });

    var itemNumb = 0;
    var SouthPark = createClass(Flower, {
        create: function () {
            this.el = createElement('div', 'southPark__item' + itemNumb++, {
                left: this.x + 'px',
                top: this.y - 80 + 'px'
            });

            return this.el;
        }
    });


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
            tree: Tree,
            southPark: SouthPark
        };

        return FlowerFactory;
    }());

    var Earth = createClass(Obj, {
        initialize: function () {
            this.y = WINDOW_HEIGHT - EARTH_HEIGHT;
            this.width = WINDOW_WIDTH;
            this.height = EARTH_HEIGHT;
            this.kDrought = 1;
            this.plantingDensity = 10;
            this._rainCount = 0;
            this._droughtIndex = 1;
            this._flowerIndex = 0;
            this.flowerName = {'9': 'cactus', '5': 'rose', '2': 'tree', '0': 'southPark'};
            this.flowersList = [];
            this.propgressBar = Object.create(ProgressBar);

            Core.collisionManager.add('Earth', this, this.collide);
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

            this._clearFlowers();

            for (var i = 0; i < this.plantingDensity; i++) {
                var flower = FlowerFactory.create(name, {
                    x: getRandomInt(50, WINDOW_WIDTH),
                    y: getRandomInt(this.y, this.y + EARTH_HEIGHT)
                });

                this.flowersList.push(flower);
                container.appendChild(flower.create());
            }
        },
        _clearFlowers: function () {
            if (!this.flowersList.length) return;
            var len = this.flowersList.length;

            while (len--)this.flowersList[len].remove();

            this.flowersList = [];
        },
        _checkFlowers: function () {
            var flowerIndex = ('' + this.getDroughtIndex() % 1)[2];
            var flowerName = this.flowerName[flowerIndex];

            if (flowerIndex == '1') PubSub.publish('rainPaused');
            if (flowerIndex == '9') PubSub.publish('rainResume');

            if (flowerIndex && this._flowerIndex !== flowerIndex && flowerName) {
                this._createFlowers(flowerName);
                this._flowerIndex = flowerIndex;
            }
        },
        getRainCount: function () {
            return Math.round(this._rainCount);
        },
        setRainCount: function (index) {
            if (this._rainCount < 0)  this._rainCount = 0;

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
    });


    var timeInfo = function (goalFPS) {
        var oldTime, paused = true, iterCount = 0, totalFPS = 0;
        return {
            getInfo: function () {

                if (paused === true) {
                    paused = false;
                    oldTime = +new Date();
                    return {elapsed: 0, coeff: 0, FPS: 0, averageFPS: 0};
                }

                var newTime = +new Date();
                var elapsed = newTime - oldTime;
                oldTime = newTime;
                var FPS = 1000 / elapsed;
                iterCount++;
                totalFPS += FPS;
                return {
                    elapsed: elapsed,
                    coeff: goalFPS / FPS,
                    FPS: FPS,
                    averageFPS: totalFPS / iterCount
                };
            }
        };
    };


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


    var PubSub = {
        handlers: {},
        subscribe: function (event, handler) {
            if (this.handlers[event] === undefined)  this.handlers[event] = [];
            this.handlers[event].push(handler);
        },
        publish: function (event) {
            if (this.handlers[event] === undefined) return;
            var i = 0, len = this.handlers[event].length;
            for (i; i < len; i++) {
                this.handlers[event][i](arguments[i + 1]);
            }
        }
    };


    var Core = {
        timer: timeInfo(40),
        processor: processor,
        collisionManager: collisionManager,
        initialize: function () {
            var that = this;
            container = document.getElementById('container');
            var info1 = document.getElementById('info1');
            var info2 = document.getElementById('info2');
            var info3 = document.getElementById('info3');

            requestAnimationFrame(function animate() {
                var timeData = that.timer.getInfo();

                info1.innerText = 'FPS: ' + Math.floor(timeData.FPS);
                info2.innerText = 'Средняя FPS: ' + Math.floor(timeData.averageFPS);
                info3.innerText = 'Коэффициент времени: ' + timeData.coeff.toFixed(2);

                that.processor.process();
                that.collisionManager.checkCollisions();

                requestAnimationFrame(animate);
            }.bind(this));

            this.addedObjects();
        },
        addedObjects: function () {
            var earth = new Earth();

            for (var i = 0; i < CLOUDS; i++) {
                var cloud = new Cloud({
                    x: getRandomInt(10, WINDOW_WIDTH - CLOUDS_WIDTH),
                    y: getRandomInt(10, WINDOW_HEIGHT / 2),
                    velo: Math.random() * 3
                });

                this.processor.add(cloud);
                container.appendChild(cloud.create());
            }

            this.processor.add(earth);
            container.appendChild(earth.create());
        }
    };

    window.onload = function () {
        Core.initialize();
    }
}());
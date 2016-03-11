(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define("imageEffect", [], function () {
            return factory(global, true);
        });
    } else {
        factory(global);
    }

}(typeof window !== "undefined" ? window : this, function (global, noGlobal) {

    function extend(child, parent) {
        for (var key in parent) {
            child[key] = parent[key];
        }
        return child;
    }

    function eachArr(arr, fn) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (!Array.isArray(arr[i])) fn(arr[i]);
            eachArr(arr[i], fn);
        }
    }

    function trigger(event, element) {
        var e = new MouseEvent(event, {});
        element.dispatchEvent(e);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    if (typeof MouseEvent !== 'function') {
        global.MouseEvent = function (type, dict) {
            dict = dict | {};
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent(
                type,
                (typeof dict.bubbles == 'undefined') ? true : !!dict.bubbles,
                (typeof dict.cancelable == 'undefined') ? false : !!dict.cancelable,
                dict.view || window,
                dict.detail | 0,
                dict.screenX | 0, dict.screenY | 0,
                dict.clientX | 0, dict.clientY | 0,
                !!dict.ctrlKey, !!dict.altKey, !!dict.shiftKey,
                !!dict.metaKey, dict.button | 0,
                dict.relatedTarget || null
            );
            return event;
        }
    }

    (function () {

        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            global.requestAnimationFrame = global[vendors[x] + 'RequestAnimationFrame'];
            global.cancelAnimationFrame = global[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!global.requestAnimationFrame) {
            global.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = global.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!global.cancelAnimationFrame) {
            global.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

    }());


    var Obj = (function () {

        var Obj = function (ops) {
            this.el = (ops.el) ? ops.el : undefined;
            this.w = this.checkProperty(ops.w, 20);
            this.h = this.checkProperty(ops.h, 20);
            this.mass = this.checkProperty(ops.mass, 1);
            this.radius = this.checkProperty(ops.radius, 0);
            this.diameter = this.checkProperty(ops.radius * 2, 0);
            this.x = 0;
            this.y = 0;
            this.vx = 0;
            this.vy = 0;
            this.hx = 0;
            this.hy = 0;
            this.ex = 0;
            this.ey = 0;
        };

        Obj.prototype = {
            get home() {
                return new Vector(this.hx, this.hy);
            },

            set home(home) {
                this.hx = home.x;
                this.hy = home.y;
            },

            get pos() {
                return new Vector(this.x, this.y);
            },

            set pos(pos) {
                this.x = pos.x;
                this.y = pos.y;
            },

            get velo() {
                return new Vector(this.vx, this.vy);
            },

            set velo(velo) {
                this.vx = velo.x;
                this.vy = velo.y;
            },

            get end() {
                return new Vector(this.ex, this.ey);
            },

            set end(end) {
                this.ex = end.x;
                this.ey = end.y;
            },

            checkProperty: function (param, val) {
                var newParam = param;
                if (typeof(newParam) === 'undefined') {
                    newParam = val;
                }

                return newParam;
            },
            changeStyles: function () {
                this.el.style.left = this.x + 'px';
                this.el.style.top = this.y + 'px';
            }
        };

        return Obj;

    }());


    var Vector = (function () {

        var Vector = function (x, y) {
            this.x = x;
            this.y = y;
        };

        Vector.prototype = {
            lengthSquared: function () {
                return this.x * this.x + this.y * this.y;
            },

            length: function () {
                return Math.sqrt(this.lengthSquared());
            },

            greater: function (vec) {

                if (this.x >= vec.x &&
                    this.y >= vec.y) {
                    return true;
                }

                return false;
            },

            addScaled: function (vec, k) {
                return new Vector(this.x + k * vec.x, this.y + k * vec.y);
            },

            subtract: function (vec) {
                return new Vector(this.x - vec.x, this.y - vec.y);
            },

            setBoundaries: function (bonX, bonY, radius) {
                if (this.x < bonX.minX) {
                    this.x = bonX.minX;
                }

                if (this.x > bonX.maxX - radius) {
                    this.x = bonX.maxX - radius;
                }

                if (this.y < bonY.minY) {
                    this.y = bonY.minY;

                }

                if (this.y > bonY.maxY - radius) {
                    this.y = bonY.maxY - radius;
                }

                return new Vector(this.x, this.y);
            },

            multiply: function (k) {
                return new Vector(k * this.x, k * this.y);
            },

            divide: function (k) {
                return new Vector(this.x / k, this.y / k);
            },

            isChangeDirection: function (vec, direction, axis) {
                var newDirection;

                if ((this[axis] < vec[axis] && direction !== 'firstSide') ||
                    (this[axis] > vec[axis] && direction !== 'secondSide')) {
                    return true;
                } else if (this[axis] >= vec[axis]) {
                    return false;
                }
            },

            add: function (vec) {
                return new Vector(this.x + vec.x, this.y + vec.y);
            },

            addScalar: function (k) {
                this.x += k;
                this.y += k;
            },

            negate: function () {
                this.x = -this.x;
                this.y = -this.y;
            },

            incrementBy: function (vec) {
                this.x += vec.x;
                this.y += vec.y;
            },

            perp: function (u, anticlockwise) {
                if (typeof(anticlockwise) === 'undefined') {
                    anticlockwise = true;
                }
                var length = this.length();
                var vec = new Vector(this.y, -this.x);
                if (length > 0) {
                    if (anticlockwise) { // anticlockwise with respect to canvas coordinate system
                        vec.scaleBy(u / length);
                    } else {
                        vec.scaleBy(-u / length);
                    }
                } else {
                    vec = new Vector(0, 0);
                }
                return vec;
            },

            projection: function (vec) {
                var length = this.length();
                var lengthVec = vec.length();
                var proj;
                if ((length == 0) || (lengthVec == 0)) {
                    proj = 0;
                } else {
                    proj = (this.x * vec.x + this.y * vec.y) / lengthVec;
                }
                return proj;
            },

            unit: function () {
                var length = this.length();

                if (length > 0) {
                    return new Vector(this.x / length, this.y / length);
                } else {
                    return new Vector(0, 0);
                }
            },

            dotProduct: function (vec) {
                return this.x * vec.x + this.y * vec.y;
            },

            scaleBy: function (k) {
                this.x *= k;
                this.y *= k;
            },

            transfer: function (k) {
                var vec = new Vector(this.x, this.y);
                var unitVec = vec.unit();
                unitVec.scaleBy(k);

                return unitVec;
            },

            para: function (u, positive) {
                if (typeof(positive) === 'undefined') {
                    positive = true;
                }
                var length = this.length();
                var vec = new Vector(this.x, this.y);
                if (positive) {
                    vec.scaleBy(u / length);
                } else {
                    vec.scaleBy(-u / length);
                }
                return vec;
            },
            project: function (vec) {
                return vec.para(this.projection(vec));
            }
        };

        Vector.add = function (arr) {
            var vectorSum = new Vector(0, 0);
            for (var i = 0; i < arr.length; i++) {
                var vector = arr[i];
                vectorSum.incrementBy(vector);
            }
            return vectorSum;
        };

        Vector.angleBetween = function (vec1, vec2) {
            return Math.acos(vec1.dotProduct(vec2) / (vec1.length() * vec2.length()));
        };

        return Vector;

    }());


    var Effect = (function () {

        var Effect = function (params) {
            this.CLASS_PREFIX = '';
            this.gridMap = params.gridMap;
            this.animate = params.animate;

            this.initialize.apply(this, arguments);
        };

        Effect.prototype.initialize = function () {
            if (this.animate.active && typeof this.draw[this.animate.type] === 'function') {
                this.draw[this.animate.type].call(this)
            } else {
                console.warn('не найдена анимация!')
            }

            eachArr(this.gridMap, this.handlers.bind(this));
        };

        Effect.prototype.animation = function (callback, dt) {
            var animFunc = null, timeStart = new Date().getTime();

            return (function draw() {
                var timeNow = new Date().getTime() - timeStart;

                if (timeNow > dt) {
                    timeStart = new Date().getTime();
                    callback();
                }

                animFunc = requestAnimationFrame(draw)
            }());
        };


        Effect.prototype.draw = {
            random: function () {
                var arrX = this.gridMap.length,
                    arrY = this.gridMap[0].length,
                    element = null, that = this;

                this.animation(function () {
                    var dX = Math.floor(Math.random() * arrX),
                        dY = Math.floor(Math.random() * arrY);

                    if (element) trigger('mouseout', element);

                    element = that.gridMap[dX][dY];

                    trigger('mouseover', element);
                }, this.animate.speed);
            },
            inSeries: function () {
                var that = this, gridMap = this.gridMap;

                for (var i = 0; i < gridMap.length; i++) {
                    (function () {
                        var element = null, coll = gridMap[i];
                        var startPos = 0, length = coll.length;
                        var classList = null;
                        that.animation(function () {
                            if (element) element.className = classList[0] + that.CLASS_PREFIX + 'blur';

                            if (startPos < length) {
                                element = coll[startPos];
                                classList = element.className.split(' ');
                                element.className = classList[0] + that.CLASS_PREFIX + 'hover';
                                startPos += 1;
                            } else {
                                startPos = 0;
                            }
                        }, that.animate.speed)

                    }())
                }
            }
        };

        Effect.prototype.handlers = function (el) {
            var that = this, classList = el.className.split(' ');
            el.onmouseover = function () {
                this.className = classList[0] + that.CLASS_PREFIX + 'hover';
            };

            el.onmouseout = function () {
                this.className = classList[0] + that.CLASS_PREFIX + 'blur';
            };
        };

        return Effect;

    }());


    var EffectDecay = (function () {

        var cursorForceZoomed = 5000;
        var kSpring = 1;
        var m = 1;

        var EffectDecay = function (params) {
            this.gridMap = params.gridMap;
            this.container = params.rootNode;
            this.objs = [];
            this.tiles = null;
            this.cursorPosition = null;
            this.inHome = 0;
            this.dt = null;
            this.displObj = null;
            this.allInHome = false;
            this.cursorForce = null;
            this.cursorPos = new Vector(-1, -1);
            this.displCursor = null;
            this.cursorDistance = null;
            this.animateStart = false;
            this.containerOffset = new Vector(0, 0);


            this.initialize.apply(this, arguments);
        };

        EffectDecay.prototype.initialize = function () {
            this.createObj();
            this.handlers();
        };

        EffectDecay.prototype.animate = function (callback) {
            var that = this;
            var timeStart = performance.now();
            var requestId;
            this.animateStart = true;

            this.animate.stop = function () {
                setTimeout(function () {
                    cancelAnimationFrame(requestId);
                }, 3000)
            };

            return (function draw(time) {
                var timeLeft = time - timeStart;
                callback(timeLeft);

                requestId = requestAnimationFrame(draw);
            }(timeStart))
        };

        EffectDecay.prototype.createObj = function () {
            eachArr(this.gridMap, function (tile) {
                var obj = new Obj({el: tile});
                var x = tile.data.x;
                var y = tile.data.y;

                obj.pos = new Vector(x, y);
                obj.home = new Vector(x, y);
                obj.velo = new Vector(0, 0);
                obj.force = new Vector(0, 0);
                obj.acc = new Vector(0, 0);

                this.objs.push(obj);

            }.bind(this));
        };

        EffectDecay.prototype.handlers = function () {
            this.container.onmouseover = this.mouseOver.bind(this);
            this.container.onmousemove = this.mouseMove.bind(this);
            this.container.onmouseleave = this.mouseLeave.bind(this);
        };

        EffectDecay.prototype.mouseOver = function (e) {
            if (!this.animateStart) {
                var offset = this.container.getBoundingClientRect();
                this.containerOffset = new Vector(offset.left, offset.top);
                this.animate(this.onTimer.bind(this));
            }
        };

        EffectDecay.prototype.mouseMove = function (e) {
            var mousePos = new Vector(e.clientX, e.clientY);
            this.cursorPos = mousePos.subtract(this.containerOffset);
            this.allInHome = false;
        };

        EffectDecay.prototype.mouseLeave = function (e) {
            this.cursorPos = new Vector(-1, -1);
            this.allInHome = false;
            this.animateStart = false;
            this.animate.stop()
        };

        EffectDecay.prototype.onTimer = function () {

            if (!this.objs || this.objs.length == 0) {
                this.animate.stop();
                return;
            }

            if (!this.allInHome) {
                this.dt = 0.18;
                this.move();
            }

        };

        EffectDecay.prototype.move = function () {
            this.inHome = 0;

            for (var i = this.objs.length; i--;) {
                var obj = this.objs[i];

                this.calcForce(obj);
                this.updateAccel(obj);
                this.updateVelo(obj);
                this.moveObjs(obj);
                this.checkObj(obj);
            }

            this.allInHome = this.inHome == this.objs.length;
        };

        EffectDecay.prototype.calcForce = function (obj) {
            this.displObj = obj.pos.subtract(obj.home);

            this.cursorForce = new Vector(0, 0);

            if (this.cursorPos.x >= 0) {
                this.displCursor = obj.pos.subtract(this.cursorPos);

                this.cursorDistance = this.displCursor.length();
                if (this.cursorDistance > 1 && this.cursorDistance <= cursorForceZoomed) {
                    this.cursorForce = this.displCursor.multiply(cursorForceZoomed / (this.cursorDistance * this.cursorDistance));
                }
            }

            var restoring = this.displObj.multiply(-kSpring);
            var damping = obj.velo.multiply(-0.9);

            obj.force = Vector.add([restoring, this.cursorForce, damping]);
        };

        EffectDecay.prototype.updateAccel = function (obj) {
            obj.acc = obj.force.multiply(1 / m);
        };

        EffectDecay.prototype.updateVelo = function (obj) {
            obj.velo = obj.velo.addScaled(obj.acc, this.dt);
        };

        EffectDecay.prototype.moveObjs = function (obj) {
            obj.pos = obj.pos.addScaled(obj.velo, this.dt);
            obj.changeStyles();
        };

        EffectDecay.prototype.checkObj = function (obj) {
            if (Math.abs(obj.x) < 0.5 &&
                Math.abs(obj.y) < 0.5 &&
                Math.abs(obj.vx) < 0.5 &&
                Math.abs(obj.vy) < 0.5) {

                obj.velo = new Vector(0, 0);
                obj.pos = new Vector(obj.hx, obj.hy);

                this.inHome++;
            }
        };

        return EffectDecay;

    }());


    var EffectLive = (function () {

        var EffectLive = function (params) {
            this.gridMap = params.gridMap;
            this.objs = [];
            this.dt = 0.14;
            this.home = [];

            this.initialize.apply(this, arguments)
        };

        EffectLive.prototype.initialize = function (params) {
            params.originalImg.style.display = 'block';
            params.rootNode.style.overflow = 'hidden';

            this.createObj();
            this.animate(this.move.bind(this));
        };

        EffectLive.prototype.createObj = function () {
            var that = this;
            eachArr(this.gridMap, function (tile) {
                var obj = new Obj({el: tile});

                obj.w = tile.data.width;
                obj.h = tile.data.height;
                obj.mass = 1;
                obj.pos = new Vector(getRandomInt(tile.data.x, tile.data.x + 1), getRandomInt(tile.data.y, tile.data.y + 1));
                obj.center = new Vector(tile.data.x, tile.data.y);
                obj.datas = tile.data;
                obj.isIncluded = false;
                obj.changeStyles();

                that.objs.push(obj);
            })

        };

        EffectLive.prototype.animate = function () {
            return EffectDecay.prototype.animate.apply(this, arguments);
        };

        EffectLive.prototype.move = function () {
            for (var i = 0, len = this.objs.length; i < len; i++) {
                var obj = this.objs[i];
                this.moveObject(obj);
                this.calcForce(obj);
                this.updateAccel(obj);
                this.updateVelo(obj);
            }
        };

        EffectLive.prototype.moveObject = function (obj) {
            obj.pos = obj.pos.addScaled(obj.velo, this.dt);
            obj.changeStyles();
        };

        EffectLive.prototype.calcForce = function (obj) {
            var displ = obj.pos.subtract(obj.center);
            var restoring = displ.multiply(-obj.datas.kSpring);
            obj.force = Vector.add([restoring]);
        };

        EffectLive.prototype.updateAccel = function (obj) {
            obj.acc = obj.force.multiply(1 / obj.mass);
        };

        EffectLive.prototype.updateVelo = function (obj) {
            obj.velo = obj.velo.addScaled(obj.acc, this.dt);
        };

        return EffectLive;

    }());

    var EffectDestroy = (function () {

        var EffectDestroy = function () {
            Effect.apply(this, arguments);
            this.CLASS_PREFIX = ' destroy_';
        };

        extend(EffectDestroy.prototype, Effect.prototype);

        return EffectDestroy;
    }());

    var EffectRotate = (function () {

        var EffectRotate = function () {
            Effect.apply(this, arguments);
            this.CLASS_PREFIX = ' rotate_';
        };

        extend(EffectRotate.prototype, Effect.prototype);

        return EffectRotate;
    }());


    var EffectFactory = function () {};

    EffectFactory.create = function (name, params) {
        if (typeof this.prototype[name] == 'function') {
            return new this.prototype[name](params);
        } else {
            console.warn('Указанное свойство не найдено!')
        }
    };

    extend(EffectFactory.prototype, {
        destroy: EffectDestroy,
        rotate: EffectRotate,
        decay: EffectDecay,
        live: EffectLive
    });


    var GridConstructor = (function () {
        var wrapClassName = 'image-effect',
            tileClassName = 'image-effect__item';

        var GridConstructor = function (img, density) {
            this.img = img;
            this.density = Number(density);
            this.imgWidth = null;
            this.imgHeight = null;
            this.imgPath = this.img.src;

            this.initialize.call(this)
        };

        GridConstructor.prototype.initialize = function () {
            this.imgWidth = this.img.width;
            this.imgHeight = this.img.height;
            this.img.style.display = 'none';

            this.append();
        };


        GridConstructor.prototype.append = function () {
            this.parentNode = this.img.parentNode;
            this.wrapElem = this.createWrap();
            this.tiles = this.generateTiles();

            this.wrapElem.insertBefore(this.img, null);
            this.wrapElem.appendChild(this.tiles.fragmentDom);
            this.parentNode.appendChild(this.wrapElem);
        };


        GridConstructor.prototype.generateTiles = function () {
            var density = this.density,
                widthTile = this.imgWidth / density,
                heightTile = this.imgHeight / density,
                fragment = document.createDocumentFragment(),
                gridMap = [];

            for (var i = 0; i < density; i++) {
                var gridMapRow = [];
                for (var j = 0; j < density; j++) {
                    var tile = this.createTile({
                        width: widthTile,
                        height: heightTile,
                        x: widthTile * i,
                        y: heightTile * j
                    });
                    gridMapRow.push(tile);
                    fragment.appendChild(tile);
                }
                gridMap.push(gridMapRow)
            }

            return {
                fragmentDom: fragment,
                gridMap: gridMap
            };
        };

        GridConstructor.prototype.createWrap = function () {
            var wrapElem = document.createElement('div');

            wrapElem.className = wrapClassName;
            wrapElem.style.width = this.imgWidth + 'px';
            wrapElem.style.height = this.imgHeight + 'px';

            return wrapElem;
        };


        GridConstructor.prototype.createTile = function (params) {
            var imgPath = this.imgPath,
                tileItem = document.createElement('span');

            tileItem.data = {
                x: params.x,
                y: params.y,
                width: params.width,
                height: params.height,
                kSpring: getRandomInt(8, 50) / 10,
                kDamping: 0.1
            };

            tileItem.className = tileClassName;
            tileItem.style.width = params.width + 'px';
            tileItem.style.height = params.height + 'px';
            tileItem.style.left = params.x + 'px';
            tileItem.style.top = params.y + 'px';
            tileItem.style.background = 'url(' + imgPath + ')' + -params.x + 'px ' + -params.y + 'px';

            return tileItem;
        };

        return GridConstructor;

    }());

    var ImageEffect = (function () {

        var ImageEffect = function (options) {
            this.img = options.el;
            this.options = extend({
                density: 10,
                effect: 'decay',
                animate: {
                    active: false,
                    speed: 1000,
                    type: 'random'
                }
            }, options);

            this.initialize.call(this);
        };

        ImageEffect.prototype.initialize = function () {
            var imgs;

            try {
                imgs = Array.prototype.slice.call(this.img);
            } catch (e) {
                console.error(new Error('Элемент не найден!'));
                return;
            }

            if (imgs.length) {
                imgs.forEach(this.load).bind(this);
            } else {
                this.load(this.img);
            }
        };


        ImageEffect.prototype.load = function (img) {
            var that = this;
            var density = this.options.density;
            var effect = this.options.effect;

            if(img.data == 'ImageEffect') this.destroy(img);

            var grid = new GridConstructor(img, density);

            EffectFactory.create(effect, {
                gridMap: grid.tiles.gridMap,
                parentNode: grid.parentNode,
                rootNode: grid.wrapElem,
                originalImg: img,
                animate: that.options.animate
            });

            img.data = 'ImageEffect';

        };

        ImageEffect.prototype.destroy = function(img){

        };

        return ImageEffect;

    }());


    if (!noGlobal) {
        window.ImageEffect = ImageEffect;
    }

    return ImageEffect;

}));
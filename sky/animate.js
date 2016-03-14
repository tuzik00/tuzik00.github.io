(function () {
    var CLOUDS_LENGTH = 20;
    var CLOUDS_WIDTH = 400;
    var CLOUDS_HEIGHT = 220;
    var VELO = 0.4;
    var TIME_RAIN = 10;
    var RAINT_DENSITY = 20;
    var SKY_objects;
    var container;
    var win = {
        w: window.innerWidth,
        h: window.innerHeight
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var objects = function () {
        var objectsList = [];

        return {
            add: function (process) {
                objectsList.push(process)
            },
            move: function () {
                var len = objectsList.length;

                for (var i = 0; i < len; i++) {
                    objectsList[i].move();

                    if(objectsList[i].delete){
                        delete objectsList[i]
                    }
                }
            }
        }
    };


    var Rain = (function () {

        var Rain = function (left, top, zIndex) {
            this.left = left + 50;
            this.top = top + 120;
            this.zIndex = zIndex;
            this.delete = false;
        };

        Rain.prototype.updateBoundaries = function(){
            if(this.top > win.h){
                this.el.remove();
            }
        };

        Rain.prototype.move = function () {
            this.top += 1;
            this.updateStyle();
            this.updateBoundaries();
        };

        Rain.prototype.updateStyle = function () {
            this.el.style.top = this.top + 'px';
            this.el.style.left = this.left + 'px';
        };

        Rain.prototype.create = function () {
            var rainCont = this.el = document.createElement('div');
            rainCont.className = 'rain';

            for (var i = 0; i < RAINT_DENSITY; i++) {
                var rain = document.createElement('span');
                rain.className = 'rain__item';
                rainCont.appendChild(rain)
            }

            return rainCont;
        };

        return Rain;
    }());

    var ProgressBar = {
        create: function () {
            var wrap = this.wrap = document.createElement('div');
            wrap.className = 'progress';

            var bar = this.bar = document.createElement('div');
            bar.className = 'progress__bar';

            wrap.appendChild(bar);

            return wrap;
        },
        setValue: function (value) {
            this.bar.style.height = value + '%';
        }
    };

    var Cloud = (function () {
        var zIndex = 0;

        var Cloud = function (options) {
            this.options = options || (options = {});

            this.left = getRandomInt(0, (win.w - CLOUDS_WIDTH));
            this.top = getRandomInt(0, (win.h - CLOUDS_HEIGHT));
            this.velo = Math.random() * VELO;
            this.progressBar = Object.create(ProgressBar);
            this.zIndex = ++zIndex;
            this.rainReady = false;
            this.rainWait = false;
            this.rainLoad = 0;
            this.rainAcc = Math.random() * 0.001;
        };

        Cloud.prototype.create = function () {
            var wrap = this.el = this.createElement('cloud');
            var head = this.createElement('cloud__head');
            var body = this.createElement('cloud__body');

            wrap.style.zIndex =  this.zIndex;

            wrap.appendChild(head);
            wrap.appendChild(body);
            wrap.appendChild(this.progressBar.create());

            return wrap;
        };

        Cloud.prototype.createElement = function (className) {
            var element = document.createElement('div');
            element.className = className;

            return element;
        };


        Cloud.prototype.rainAccumulate = function () {
            if (!this.rainReady && !this.rainWait) {
                if (this.rainLoad > 1) {
                    this.rainLoad = 1;
                    this.rainReady = true;
                    console.log('rainAccumulate')
                } else {
                    this.rainLoad += this.rainAcc;
                    this.updateProgressBar();
                }
            }
        };

        Cloud.prototype.rainStart = function () {
            var count = 0;
            var timer = setInterval(function () {
                if (count < TIME_RAIN) {
                    var rain = new Rain(this.left, this.top,  this.zIndex);
                    SKY_objects.add(rain);
                    container.appendChild(rain.create());

                    ++count;
                    this.progressBar.setValue(100 / count);
                } else {
                    clearInterval(timer);
                    this.rainStop()
                }

            }.bind(this), 1000)
        };

        Cloud.prototype.rainStop = function () {
            this.rainWait = false;
            this.rainLoad = 0;
            this.velo = VELO;
        };

        Cloud.prototype.updateVelo = function () {
            if (this.rainReady) {

                this.rainStart();

                this.rainReady = false;
                this.rainWait = true;
            } else {

            }
        };

        Cloud.prototype.updateProgressBar = function () {
            this.progressBar.setValue(100 * this.rainLoad);
        };

        Cloud.prototype.updateBoundaries = function () {
            if (this.left > win.w + 20)  this.left = -CLOUDS_WIDTH;
        };

        Cloud.prototype.move = function () {
            this.left += this.velo;

            this.rainAccumulate();
            this.updateVelo();
            this.updateBoundaries();
            this.updateStyle();
        };

        Cloud.prototype.updateStyle = function () {
            this.el.style.left = this.left + 'px';
            this.el.style.top = this.top + 'px';
        };

        return Cloud;
    }());


    var SKY = {
        initialize: function () {
            SKY_objects = objects();
            container = document.getElementById('container');

            requestAnimationFrame(function animate() {
                SKY_objects.move();
                requestAnimationFrame(animate);
            });

            this.addedObjects();
        },
        addedObjects: function () {
            while (CLOUDS_LENGTH--) {
                var cloud = new Cloud();
                container.appendChild(cloud.create());
                SKY_objects.add(cloud);
            }
        }
    };


    window.onload = function () {
        SKY.initialize();
    }

}());


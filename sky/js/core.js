var Core = {
    processor: processor,
    collisionManager: collisionManager,
    initialize: function () {
        requestAnimationFrame(function animate() {
            this.processor.process();
            this.collisionManager.checkCollisions();

            requestAnimationFrame(animate);
        }.bind(this));

        this.addedObjects();
    },
    addedObjects: function () {
        var earth = Earth.initialize();
        this.processor.add(earth);

        container.appendChild(earth.create());

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
var Core = {
    initialize: function () {
        SYS_process = processor();
        SYS_collisionManager = collisionManager();

        requestAnimationFrame(function animate() {
            SYS_process.process();
            SYS_collisionManager.checkCollisions();

            requestAnimationFrame(animate);
        });

        this.addedObjects();
    },
    addedObjects: function () {
        var earth = new Earth();
        container.appendChild(earth.create());

        for(var i=0; i < CLOUDS; i++) {
            var cloud = new Cloud();
            SYS_process.add(cloud);
            container.appendChild(cloud.create());
        }
    }
};
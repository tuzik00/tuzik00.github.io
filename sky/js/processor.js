var processor = function () {
    var objectsList = [],
        addedItems = [];

    return {
        add: function (object) {
            addedItems.push(object)
        },
        process: function () {
            var newProcessList = [],
                len = objectsList.length;

            for (var i = 0; i < len; i++) {
                if (!objectsList[i].removed) {
                    objectsList[i].move();
                    newProcessList.push(objectsList[i]);
                }
            }
            objectsList = newProcessList.concat(addedItems);
            addedItems = [];
        }
    }
};

var collisionManager = function () {
    var listIndex = 0,
        checkListIndex = 0,
        grid = [],
        checkList = {};

    var checkCollisions = function (obj1, obj2) {
        var XColl = false;
        var YColl = false;

        if ((obj1.dx <= obj2.dx)) XColl = true;
        if ((obj1.dy <= obj2.dy + 15)) YColl = true;

        if (XColl & YColl) return true;
    };

    return {
        add: function (colliderFlag, obj, callback) {
            var list, indexStr = '' + listIndex++,
                checkIndex;

            var colliderObj = {
                colliderFlag: colliderFlag,
                colliderObj: obj,
                callback: bind(callback, obj)
            };

            checkIndex = '' + checkListIndex++;
            checkList[checkIndex] = colliderObj;

        },
        checkCollisions: function () {

            if(listIndex < 2) return;

            for(var idx in checkList){
                for(var idx2 = idx+1 in checkList){
                    if (checkList[idx].colliderFlag == checkList[idx2].colliderFlag) continue;

                    if (checkList[idx].removed) {
                        delete checkList[idx];
                    }

                    if (checkCollisions(checkList[idx].colliderObj, checkList[idx2].colliderObj)) {
                        checkList[idx].callback();
                        checkList[idx2].callback();
                    }
                }
            }

            console.log(Object.keys(checkList).length)
        }
    }
};
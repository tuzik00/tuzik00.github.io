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

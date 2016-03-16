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

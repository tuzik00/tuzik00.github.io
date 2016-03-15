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

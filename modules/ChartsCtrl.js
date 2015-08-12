'use strict';
define(['lib/Core'], function(Core){
    return Core.Ctrl.create({
        company: undefined,
        init: function(){
            this.listen('change:company', this.model, function(company){
                this.unbind('change:' + this.company, this.model);
                this.company = company;
                this.update(this.model.get(this.company));
                this.listen('change:' + this.company, this.model, this.update);
            });

            this.render();
        },
        render: function(){
            var tmp = this.template.html();

            this.element.html(tmp);
            this.ctx = this.element.find('canvas')[0].getContext('2d');
            this.width = this.element.find('canvas').width();
            this.height = this.element.find('canvas').height();
        },
        update: function(records){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawBg();
            this.drawGraph(records)
        },
        drawBg: function(){
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#42b380';

            for (var y = 0.5; y < this.height; y += 30) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
            }

            this.ctx.stroke();
            this.ctx.closePath();
        },
        drawGraph: function(records){
            var len = records.length;
            var i, step = this.width / len;

            this.ctx.beginPath();

            for(i=0; i < len; i++){
                var x = step * i;
                var y = this.height - (3 * records[i].value);

                this.ctx.lineTo(x, y);
                this.ctx.strokeStyle = '#fff';
                this.ctx.stroke();
                this.drawCircle(x, y);
            }

            this.ctx.closePath();
        },
        drawCircle: function(x, y){
            this.ctx.beginPath();
            this.ctx.arc(x,y,3,0,2*Math.PI);
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
        }
    })
});
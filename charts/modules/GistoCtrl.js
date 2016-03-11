define(['lib/Core'], function(Core){
    return Core.Ctrl.create({
        company: undefined,
        init: function(){
            this.listen('change:company', this.model, function(company){
                this.unbind('change:' + this.company, this.model);
                this.company = company;
                this.listen('change:' + this.company, this.model, this.render);
                this.render(this.model.get(this.company));
            });
        },
        render: function(records){
            var posLeft = this.element.find('.stats').width();
            var tmp = this.templater(this.template.html(), {data:records});
            this.element.html(tmp);

            this.element.find('.row-wrap').scrollLeft(posLeft)
        }
    })
});
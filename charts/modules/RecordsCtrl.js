define(['lib/Core'], function(Core){
    return Core.Ctrl.create({
        events:{
            'click .remove-button': 'remove'
        },
        init: function(){
            this.listen('change:company', this.model, function(company){
                this.company = company;
                this.listen('change:'+company, this.model, this.render);
                this.render(this.model.get(company));
            });
        },
        render: function(records){
            var tmp = this.templater(this.template.html(), {data: records});
            this.element.html( tmp )
        },
        remove: function(e){
            var position = $(e.target).data('position');
            this.model.remove( this.company, {arrayPos: position});
        }
    })
});
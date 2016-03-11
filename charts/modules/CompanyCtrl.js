'use strict';
define(['lib/Core'], function(Core){

    return Core.Ctrl.create({
        events: {
            'click .add-company'   : 'addCompany',
            'click .active-company': 'activeCompany',
            'click .remove-company': 'removeCompany'
        },
        company: undefined,
        init: function(){
            this.listen("change", this.model, this.render);
            this.listen("validate", this.model, this.validate);
            this.render( this.model.get() );
        },
        render: function(records){
            var tmp = this.templater(this.template.html(), {
                company: records,
                currentCompany: this.company
            });

            this.element.html(tmp);
        },
        addCompany: function(){
            var name = this.element.find('input[name="company"]').val();

            if(this.model._validate('company', name)){
                var company = {};
                company[ name ] = [];
                this.model.set(company);
            }
        },
        activeCompany: function(e){
            var li = $(e.target).closest('li');
            this.company = li.data('company');
            this.element.find('.list__item').removeClass('list__item_active');
            this.model.trigger('change:company', this.company );

            li.addClass('list__item_active');
        },
        removeCompany: function(e){
            var name = $(e.target).closest('li').data('company');

            this.model.remove(name);
            this.company = undefined;
            this.model.trigger('change:company', this.company );
        },
        validate: function(msg){
            this.element.find('.company__error').text(msg.company)
        }
    })
});
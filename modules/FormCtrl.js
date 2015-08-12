define(['jquery', 'lib/Core'], function($, Core){
    return Core.Ctrl.create({
        events: {
            'click button': 'addRecord'
        },
        init: function(){
            this.listen('change:company', this.model, function(company){
                this.company = company;
            });
            this.listen('validate change', this.model, this.validate);
            this.render();
        },
        render: function(){
            var tmp = this.template.html();
            this.element.html(tmp);
        },
        addRecord: function(e){
            var obj = {};
            var elements = this.element.find('form').serializeArray();
            $.each(elements, function(index, item){
                obj[item['name']] = item['value'];
            });

            this.model.set(this.company, obj);
            return false;
        },
        validate: function(data){
            var inpMsg = this.element.find('.form__message:first'),
                textMsg = this.element.find('.form__message:last'),
                input = this.element.find('input'),
                textarea = this.element.find('textarea');

            inpMsg.text(data.value || '');
            textMsg.text(data.massage || '');

            if(!data.value && !data.massage){
                input.val('');
                textarea.val('');
            }
        }
    })
});
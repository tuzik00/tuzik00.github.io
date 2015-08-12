define(['lib/Core'], function(Core){
    return Core.Model.create({
        config:{
            massage: 'isEmpty',
            value: 'isNumber',
            company: 'isCompany'
        },
        type: {
            isCompany: {
                validate: function(value){
                    if(!$.trim(value).length){
                        return 'Не заданно имя организации!'
                    } else {
                        if(!isNaN(value)){
                            return 'Название организации не должно состоять из цифр!'
                        } else{
                            if(this.get().hasOwnProperty(value)){
                                return 'Организации с таким именем уже существует!'
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            isEmpty: {
                validate: function(value){
                    if(!$.trim(value).length){
                        return 'Не заданно значение!';
                    } else {
                        if(value.length > 240){
                            return 'Значение не должно превышать 240 символов!';
                        } else {
                            return true;
                        }
                    }
                }
            },
            isNumber: {
                validate: function(value){
                    if(!$.trim(value).length){
                        return 'Не заданно значение!';
                    } else {
                        if(isNaN(value)){
                            return 'Значение должно быть числом!';
                        } else {
                            if(value > 100){
                                return 'Значение не должно превышать 100!';
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    })
});
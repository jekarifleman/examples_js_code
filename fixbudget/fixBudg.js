let globals = {

    iSumm:    'CFV[450789]',

    budget:   'lead_card_budget',

    pVznos:   'CFV[450787]',

    pVznosW:  'CFV[450787]',

    pVznosWO: 'CFV[450795]',

    pVWClone: 'clone_of_CFV[450787]',

    formOfPayment: 'CFV[450785]',

    typeOfPrice: 'CFV[449581]'

};



window.fixBudg.render.push(function(){

    //console.log('Отработало событие render! Ураа!!');

    return true;

});

window.fixBudg.init.push(function(widget){

    if (AMOCRM.widgets.system.area == 'lcard')  {

        functions.readOnly();



        functions.floorSpaces();



    }

    return true;

});

window.fixBudg.bind_actions.push(function(widget){
    console.log('1 proverka');

    if (AMOCRM.widgets.system.area == 'lcard')  {
        console.log('2 proverka');

        $('#card_fields').on('change', '#' + globals.budget, function(e){
            console.log('test change');
        });

        let priceType = $('.linked-form__field__label span:contains("Тип цены")').next().find('ul.control--select--list li');

        $('#card_fields').on('change', 'input[name="' + globals.typeOfPrice + '"]', function(event){
            
            let text = $('input[name="' + globals.typeOfPrice + '"]').parent().find('.control--select--button-inner').text().trim();
            //let text = event.target.textContent.trim();

            console.log('text ' + text);

            if (event.target.value !== '') {

                $('input[name="' + globals.pVznos + '"]').trigger('input').trigger('change');

                functions.changeBudget(text);
            }

        });

        // отслеживание выбора ипотечных вариантов для рассчета суммы ипотеки, если до выбора ипотечных вариантов с поля "форма оплаты", в поле первоначальный взнос уже стоит значение
        $('#card_fields').on('change', 'input[name="' + globals.formOfPayment + '"]', function(event){

            // для проверки, что выбрано значение кроме "Выбрать"
            let text    = $('input[name="' + globals.typeOfPrice + '"]').parent().find('.control--select--button-inner').text().trim();

            if (text == 'Выбрать') {

                console.log('formOfPayment change return false');

                return false;

            } 

            // для хранения текста из поля Тип цены
            let textTypePrice = text;

            console.log('typeOfPrice ' + text);

            // для проверки вариантов со словом ипотека
            text = $('input[name="' + globals.formOfPayment + '"]').parent().find('.control--select--button-inner').text().trim();

            if (text.indexOf('Рассрочка') != -1) {

                console.log('formOfPayment рассрочка === -1 change return false');

                return false;

            }

            functions.changeBudget(textTypePrice);

            // для проверки, что первоначальный взнос указан
            text = $('input[name="' + globals.pVznos + '"]').val();

            // если первоначальный взнос указан, то рассчитываем сумму ипотеки
            if (text !== "" && text !== "Выбрать") {

                let type    = $('.linked-form__field__label span:contains("' + textTypePrice + '")');

                let value   = $(type).parents('.linked-form__field').find('.linked-form__field__value input.text-input').val();

                let iSumm  = document.querySelectorAll('input[name="' + globals.iSumm  + '"]')[0];

                let pVznos = document.querySelectorAll('input[name="' + globals.pVznos + '"]')[0];

                let pVznosWO = document.querySelectorAll('input[name="' + globals.pVznosWO + '"]')[0];

                //value = +value.replace(/\s/g, '');

                functions.changePWOVznos(pVznosW, pVznosWO);

                //functions.changeISum(iSumm, value, pVznos);

            }
        });

        //priceType.on('mouseup', function(event){

            //console.log('3 proverka');

            //let text = event.target.textContent.trim();

            //functions.changeBudget(text);

        //});



        let iSumm  = document.querySelectorAll('input[name="' + globals.iSumm  + '"]')[0];

        let budget = document.getElementById(globals.budget);

        let pVznos = document.querySelectorAll('input[name="' + globals.pVznos + '"]')[0];



        pVznos.addEventListener('change', function(){
            console.log('pVznos 5 proverka');

            let text = $('input[name="' + globals.typeOfPrice + '"]').parent().find('.control--select--button-inner').text().trim();

            let type    = $('.linked-form__field__label span:contains("' + text + '")');

            let value   = $(type).parents('.linked-form__field').find('.linked-form__field__value input.text-input').val();

            console.log('pVznos change text value ' + text + ' , ' + value);
            console.log(type.length);
            console.log($(type).parents('.linked-form__field').find('.linked-form__field__value input.text-input').length);
            console.log(pVznos);

            functions.changeISum(iSumm, value, pVznos);

        });



        /*

         * Убраны пробелы

        pVznos.addEventListener('keyup', function(){

            pVznos.value = functions.addSpaces(pVznos.value);

        });*/



        let saveButton = document.querySelectorAll('button.card-top-save-button')[0];

        saveButton.addEventListener('click', function(){

            setTimeout(functions.readOnly, 5000);

        });



        let pVznosW  = document.querySelectorAll('input[name="' + globals.pVznosW  + '"]')[0];

        let pVznosWO = document.querySelectorAll('input[name="' + globals.pVznosWO + '"]')[0];

        let pVWClone = document.querySelectorAll('input[name="' + globals.pVWClone + '"]')[0];

        pVznosW.addEventListener('change', function(){

            functions.changePWOVznos(pVznosW, pVznosWO);

        });

    }

    return true;

});

window.fixBudg.settings.push(function(){

    return true;

});

window.fixBudg.onSave.push(function(){

    //console.log('Отработало событие onSave');

    return true;

});

window.fixBudg.destroy.push(function(){

    //console.log('Отработало событие destroy');

    return true;

});

window.fixBudg.contacts.push(function(){

    //console.log('Отработало событие contacts');

    return true;

});

window.fixBudg.leads.push(function(){

    //console.log('Отработало событие leads');

    return true;

});

window.fixBudg.tasks.push(function(){

    //console.log('Отработало событие tasks');

    return true;

});



this.functions = {

    changeBudget: function(text){ 

        console.log('change budget :' + text);

        let first   = '927183', 

            second  = '927185', 

            third   = '927187', 

            forth   = '927189', 

            fifth   = '927191',

            sixth   = '898453';   

        let budget  = $('#lead_card_budget');//document.getElementById('lead_card_budget');

        let budgetV = $('input[name="lead[PRICE]"]');//document.querySelectorAll('input[name="lead[PRICE]"]')[0];

        let type    = $('.linked-form__field__label span:contains("' + text + '")');

        let value   = $(type).parents('.linked-form__field').find('.linked-form__field__value input.text-input').val();

        let iSumm  = document.querySelectorAll('input[name="' + globals.iSumm  + '"]')[0];

        let pVznos = document.querySelectorAll('input[name="' + globals.pVznos + '"]')[0];

        let docum   = $('.linked-form__field__label:contains("Формулировка в договоре")').parents('.linked-form__field');

        let documV  = docum.find('.linked-form__field__value input.control--select--input');

        let documB  = docum.find('.linked-form__field__value .control--select--button .control--select--button-inner');

        let docList = docum.find('ul.control--select--list');

        value = +value.replace(/\s/g, '');

        console.log('val ' + value);

        let textField = $('input[name="' + globals.formOfPayment + '"]').parent().find('.control--select--button-inner').text().trim();

        if (textField.indexOf('Рассрочка') === -1) {
            budget.val(value).trigger('input').trigger('change');
            budgetV.val(value).trigger('input').trigger('change');
        }

        if (textField.indexOf('Ипотека') !== -1) functions.changeISum(iSumm, value, pVznos);

        switch ( text ) {

            case 'Цена с ремонтом комфорт': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + second + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(second);

                documB.parent().attr('data-value', second);

                documB.text(context);

                break;

            }

            case 'Базовая цена': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + fifth + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(fifth);

                documB.parent().attr('data-value', fifth);

                documB.text(context);

                break;

            }

            case 'Цена с субсидировнием СБ': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + forth + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(forth);

                documB.parent().attr('data-value', forth);

                documB.text(context);

                break;

            }

            case 'Цена с даром (первоначальный взнос 15%)': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + first + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(first);

                documB.parent().attr('data-value', first);

                documB.text(context);

                break;

            }

            case 'Цена с даром (первоначальный взнос 10%)': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + second + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(second);

                documB.parent().attr('data-value', second);

                documB.text(context);

                break;

            }

            case 'Цена с ремонтом улучшенно социальным': {

                docList.find('li.control--select--list--item-selected').removeClass('control--select--list--item-selected');

                let context = docList.find('li[data-value="' + third + '"]').addClass('control--select--list--item-selected').find('span').text();

                documV.val(third);

                documB.parent().attr('data-value', third);

                documB.text(context);

                break;

            }

            default: break;

        }

    },



    changeISum: function(iSumm, value, pVznos){

        //budget = budget.value.replace(/\s/g, '');
        //budget = budget.replace(/,/g, '.');

        console.log('typeof ' + typeof(value) + ' ' + typeof(pVznos));

        if (typeof(value) == 'string') {
            value = value.replace(/\s/g, '');
            value = value.replace(/,/g, '.');
        }

        value = +value;

        pVznos = pVznos.value.replace(/\s/g, '');
        pVznos = +pVznos.replace(/,/g, '.');

        pVznos = +pVznos;

        console.log('value pVznos ' + value + ' ' + pVznos);

        let valueIsumm = parseInt(value - pVznos);

        $('input[name="' + globals.iSumm + '"]').val(valueIsumm).trigger('input').trigger('change');

    },



    changePWOVznos: function(pVznosW, pVznosWO){

        pVznosW = +pVznosW.value.replace(/\s/g, '');

        let itog = parseInt(pVznosW - 20000);

        console.log('changePWOVznos ' + ' ' + pVznosWO.value + ' ' + pVznosW + ' ' + itog);

        if (pVznosWO.value != itog || pVznosWO.value === '') {

            pVznosWO.value = itog;

            let time = new Date().getTime();

            let data = {

                update:[

                {   

                    id: AMOCRM.data.card_page.id,

                    updated_at: time,

                    custom_fields: [

                        {

                            id: 450795,

                            values: [

                                {

                                    value: itog

                                }

                            ]

                        }

                    ]

                }]

            };



            //$.post(

            //    'https://' + AMOCRM.widgets.system.subdomain + '.amocrm.ru/api/v2/leads',

            //    data,

            //    function( data ) {

            //        console.log( data );

            //    },

            //    "json"

            //);
        }

    },



    readOnly: function(){

        let budget        = document.getElementById('lead_card_budget');

        let currentStatus = AMOCRM.data.current_card.getStatusId();

        let statusClose1  = $('.card-entity-form__top .linked-form__field_status-lead ul.control--select--list li span:contains("Новый интерес")').parent().data('value');

        if ( currentStatus == statusClose1 ) {

            budget.readOnly = false;

        } else {

            budget.readOnly = true;

        }

    },



    calcMetraz: function(){

        let metraz  = document.querySelectorAll('input[name="CFV[232829]"]')[0];

        let remont5 = document.querySelectorAll('input[name="CFV[449577]"]')[0];

        let remont3 = document.querySelectorAll('input[name="CFV[449575]"]')[0];

        let calc1   = (parseFloat(metraz.value) * 5200).toFixed(2);

        let calc2   = (parseFloat(metraz.value) * 3700).toFixed(2);



        if ( (metraz != '') && ( (calc1 != remont5.value) || (calc2 != remont3.value) ) ) {

            functions.postCalc(calc1, calc2);

            remont5.value = functions.addSpaces(calc1);

            remont3.value = functions.addSpaces(calc2);

        }

    },



    floorSpaces: function(){

        let remont5 = document.querySelectorAll('input[name="CFV[449577]"]')[0];

        let remont3 = document.querySelectorAll('input[name="CFV[449575]"]')[0];

        let priceDa = document.querySelectorAll('input[name="CFV[449573]"]')[0];

        let priceSb = document.querySelectorAll('input[name="CFV[449569]"]')[0];



        remont5.value = functions.addSpaces(remont5.value);

        remont3.value = functions.addSpaces(remont3.value);

        priceDa.value = functions.addSpaces(priceDa.value);

        priceSb.value = functions.addSpaces(priceSb.value);

    },



    postCalc: function(calc1, calc2) {

        let time = new Date().getTime();

        let data = {

            update:[

            {   

                id: AMOCRM.data.card_page.id,

                updated_at: time,

                custom_fields: [

                    {

                        id: 1975199,

                        values: [

                            {

                                value: calc1

                            }

                        ]

                    },

                    {

                        id: 1975201,

                        values: [

                            {

                                value: calc2

                            }

                        ]

                    }

                ]

            }]

        };



        $.post(

            'https://' + AMOCRM.widgets.system.subdomain + '.amocrm.ru/api/v2/leads',

            data,

            function( data ) {

                console.log( data );

            },

            "json"

        );

    },



    addSpaces: function(nStr){

        nStr = nStr.replace(/\s/g, '');

        if ( nStr.match(/-?\d+\.\d+/) ) {

            nStr = nStr.match(/-?\d+\.\d+/)[0];

        } else {

            nStr = nStr.toString().replace(/\D/g,'');

        }

        let x = nStr.split('.');

        if (x[1]) {

            x[0] = x[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            return x.join(".");

        } else {

            return nStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        }

    },



    hideInput: function(input1){

        let input2 = input1.clone();



        input2.attr('name', 'clone_of_' + input1.attr('name'))

              .addClass('js-control-pretty-price')

              .val(functions.addSpaces(input2.val()) + ' руб');



        input1.hide()

              .parent()

              .append(input2)

              .addClass('control-price');



        input2.on('change', function(){

            let value = $(this).val();

            value     = value.replace(/[^0-9\.]+/g, '');

            input1.val(value);

        });

    }

}




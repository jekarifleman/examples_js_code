//let self = this;

window.field_mask.render.push(function(widget){
    return true;
});

window.field_mask.init.push(function(widget){ 
    // проверка областей, присваивание переменной значения кастомного поля(значение взято напрямую из объекта AMOCRM)
    if  ((widget.system().area == 'lcard') || (widget.system().area == 'ccard') || (widget.system().area == 'comcard')
    	|| (widget.system().area == 'cucard'))  {
    		let w_code = widget.get_settings().widget_code;
        	let str_widget_settings = AMOCRM['widgets']['list'][w_code]['params']['settings'];

        	// цикл на проверку существования элементов на странице и присваивания им маски
        	for (input in str_widget_settings) {

        	    // проверка существования
        	    if($('input[name="'+input+'"]').length>0) {

        	        // применение к полю маски, функция взята из внешнего jquery-скрипта  https://itproblem.net/dev/team/sumachakov/first_project/libs/jquery.maskedinput.min.js
        	        $('input[name="'+input+'"]').mask(str_widget_settings[input]);
            	}
        	}
    }

    return true;

});

window.field_mask.bind_actions.push(function(widget){

    return true;

});

window.field_mask.settings.push(function(widget){

	// name widget
	var w_code = widget.get_settings().widget_code;

    // создаем массив, в который будем помещать название полей для twig-select
    dop_arr = [];

    //берем список полей из AMOCRM и помещаем в str_widget_settings, если настройки пусты, 
    let str_widget_settings = AMOCRM['widgets']['list'][w_code]['params']['settings'];
    if (str_widget_settings==undefined) str_widget_settings = {};

    // создаем get-запрос для получение списка всех полей
    $.get(
      '/api/v2/account?with=custom_fields',
      function(data){

        //
        let arr_settings = {}; //'CFV[test]':''
        
        arr1 = data['_embedded']['custom_fields']['contacts'];
        arr2 = data['_embedded']['custom_fields']['companies'];
        arr3 = data['_embedded']['custom_fields']['customers'];
        arr4 = data['_embedded']['custom_fields']['leads'];
        dop_arr.push({option: '', id: 'idnone1'});
        dop_arr.push({option: 'Контакты:', id: 'idcontacts'});
        for (key in arr1) {
            if (((arr1[key]['field_type']==2) || (arr1[key]['field_type']==8) || (arr1[key]['field_type']==14) 
                || (arr1[key]['field_type']==1)) && (arr1[key]['is_multiple']==false)) {
                dop_arr.push({option: arr1[key]['name'], id: 'CFV['+ key+']'});
                arr_settings['CFV[' + key + ']'] = str_widget_settings['CFV[' + key + ']'];
            }
        }     
        dop_arr.push({option: 'Компании:', id: 'idcompanies'});
        for (key in arr2) {
            if (((arr2[key]['field_type']==2) || (arr2[key]['field_type']==8) || (arr2[key]['field_type']==14) 
                || (arr2[key]['field_type']==1)) && (arr2[key]['is_multiple']==false)) {
                dop_arr.push({option: arr2[key]['name'], id: 'CFV['+ key+']'});
                arr_settings['CFV[' + key + ']'] = str_widget_settings['CFV[' + key + ']'];
            }
        }   
        dop_arr.push({option: 'Покупатели:', id: 'idcustomers'});
        for (key in arr3) {
            if (((arr3[key]['field_type']==2) || (arr3[key]['field_type']==8) || (arr3[key]['field_type']==14) 
                || (arr3[key]['field_type']==1)) && (arr3[key]['is_multiple']==false)) {
                dop_arr.push({option: arr3[key]['name'], id: 'CFV['+ key+']'});
                arr_settings['CFV[' + key + ']'] = str_widget_settings['CFV[' + key + ']'];
            }
        }   
        dop_arr.push({option: 'Сделки:', id: 'idleads'});
        for (key in arr4) {
            if (((arr4[key]['field_type']==2) || (arr4[key]['field_type']==8) || (arr4[key]['field_type']==14) 
                || (arr4[key]['field_type']==1)) && (arr4[key]['is_multiple']==false)) {
                dop_arr.push({option: arr4[key]['name'], id: 'CFV['+ key+']'});
                if (str_widget_settings['CFV[' + key + ']'] == undefined) {
                    arr_settings['CFV[' + key + ']'] = str_widget_settings['CFV[' + key + ']'];
                } else arr_settings['CFV[' + key + ']'] = '';
            }
        }  

    //устанавливаем задержку для полной прогрузки виджета
    setTimeout(function() {

        //---------------------- начало block 1: Создание checkbox для согласия обработки данных -----------------------------

        //скрытый кастомный инпут
        var hidenField = $('#'+w_code+'_custom');

        //Див обертка в который помещаются поля
        var fieldsDiv = $("#widget_settings__fields_wrapper");

        // Значение чекбокса
        var checked = hidenField.val()==="true";
    
        var checkboxHtml = widget.render(
            {ref: '/tmpl/controls/checkbox.twig'},
            {
                value: true,
                text: "Согласие на обработку персональных данных",
                checked: checked,
                class_name:w_code + "_agree",
                id: w_code + "_agree"
            }
        );

        fieldsDiv.prepend(checkboxHtml);

        // При изменении чекбокса записываем его значение в скрытое поле
        $("#"+w_code +"_agree").change(function(e){
            //hidenField.val(''+$(this).prop('checked')).trigger('change');
            hidenField.trigger('change');
        })

        // При клике на кнопку установить или сохранить
        $('.js-widget-save').on('click',function(){
            //если пользователь не согласился, показать модалку 
            if (!$("#"+w_code +"_agree").prop('checked')) {
                var data = '<html><body>Необходимо согласие на обработку данных</body></html>';
                var modal = new widget.Modal({
                    class_name:'modal_info',
                    init: function($modal_body){
                        var $this = $(this);
                        $modal_body
                        .trigger('modal:loaded')
                        .html(data)
                        .trigger('modal:centrify')
                        .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                    },
                    destroy: function(){
                    }
                });
                return false;
            }
        });
                        
        //---------------------- конец block:1 -----------------------------

        // устанавливаем ширину модального окна
        let modalBody = $('.widget_settings_block').parents('.modal-body');
        modalBody.css({width: "720px"}).trigger('modal:centrify');

        // формируем переменную data с данными для twig-шаблона select
        let data = widget.render(
                {ref: '/tmpl/controls/select.twig'},// объект data в данном случае содержит только ссылку на шаблон
                {
                items: dop_arr,      //данные
                class_name:'subs_w',  //указание класса
                id: 'listadd'   //указание id
                });

        // вставляем div с id="div_id" перед скрытым кастомным инпутом   
        $('<div id="div_id" style="margin-top: 20px;"></div>').insertBefore($('#widget_settings__fields_wrapper'));

        // во всавленный div_id добавляем еще 2 div'а
        $('#div_id').append('<div id="dopdiv_id1" style="float: left; margin-right: 10px;">');
        $('#div_id').append('<div id="dopdiv_id2">');

        // в dopdiv_id1 вставляем label
        $('#dopdiv_id1').append('<label id="labelid1">Поле: </p>');

        // в dopdiv_id2 вставляем label
        $('#dopdiv_id2').append('<label id="labelid2">Маска: </p>');

        // в div_id вставляем twig-шаблон select'а
        $('#dopdiv_id1').append(data);
        //$('#div_id').append('<br>');

        // формируем переменную data1 с данными для twig-шаблона input
        let data1 = widget.render(
            {ref: '/tmpl/controls/input.twig'},// объект data в данном случае содержит только ссылку на шаблон
            {
            items: '',      //данные
            class_name:'input_w',  //указание класса
            id: 'inputadd'   //указание id
            });

        // в div_id2 вставляем twig-шаблон input'а
        $('#dopdiv_id2').append(data1);

        // устанавливаем для twig-шаблонных select и input ширину
        $('.control--select').attr('style','width: 260px;');
        $('.control--select--button').attr('style','width: 260px');
        $('#inputadd').attr('style','width: 260px');

        // устанавливаем на twig-select событие onChange
        $('#listadd').on('change',function(){
            let a = arr_settings[$('#listadd').val()];
            if ((a!='idnone1') && (a!='idcontacts') && (a!='idcompanies') && (a!='idcustomers') && (a!='idleads')) {
            $('#inputadd').val(a);
            } else $('#inputadd').val('');
        });

        // устанавливаем на twig-input событие onChange
        $( "#inputadd" ).on('change',function() {
            let str_symbol = $('#inputadd').val();
            if ((str_symbol.indexOf('?')<0) && (str_symbol.indexOf('&')<0) && (str_symbol.indexOf('{')<0)
                && (str_symbol.indexOf('}')<0) && (str_symbol.indexOf('\'')<0)){
            arr_settings[$('#listadd').val()] = $('#inputadd').val()
            $('input[name="settings"]').val(JSON.stringify(arr_settings));
            $('input[name="settings"]').trigger('change');
            }   else {
                    $('#inputadd').val('');
                    var data1 = '<html><body>В маске нельзя использовать следующие символы(амперсанд,вопрос,фигурные скобки,апостроф): & ? { } &#39; , пожалуйста, используйте вместо них другие.</body></html>';
                    var modal = new widget.Modal({
                        class_name:'modal_info',
                        init: function($modal_body){
                            var $this = $(this);
                            $modal_body
                            .trigger('modal:loaded')
                            .html(data1)
                            .trigger('modal:centrify')
                            .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                        },
                        destroy: function(){
                        }
                    });
            }
        });    

        // скрываем первый элемент twig-select
        $('li[data-value="idnone1"]').hide();

        // добавляем в label с id="labelid1" стиль внутреннего отступа слева - float: left
        $('#labelid1').attr('style','float: left');

        // создаем массив из имен невыбираемых элементов списка twig-select
        let mas = ['li[data-value="idcontacts"]',
                   'li[data-value="idcompanies"]',
                   'li[data-value="idcustomers"]',
                   'li[data-value="idleads"]',
                  ];

        // цикл присваивания невыбираемым элементам списка стилей и событий игнора на действие пользователей
        for (let i=0;i<4;i++){
            $(mas[i]).attr('style','background-color: rgba(230,235,220,1); opacity: 0.5;');
            $(mas[i]).bind('click', function() {
                return false;
            });
           $(mas[i]).bind('mousedown', function() {
                return false;
            });
           $(mas[i]).bind('mouseover', function() {
                return false;
            });
        }

    },200); //время задержки, конец setTimeout()
    }); // 



    return true;
});

window.field_mask.onSave.push(function(widget){

    return true;
});

window.field_mask.destroy.push(function(){
    //TODO
    return true;
});

window.field_mask.contacts.push(function(){
    //TODO
    return true;
});

window.field_mask.leads.push(function(){
    //TODO
    return true;
});

window.field_mask.tasks.push(function(){
    //TODO
    return true;
});

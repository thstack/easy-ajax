// Ajax Usability Packaging
// Author: Simon Luo <xcluo.mr@gmail.com>
// Requirements:
//      jquery, jquery-form, bootstrap, bootstrap-dialog
// Version: v1.0.2
// Install & Deployment:
//      1, Include js file into your web static
//      2, Define bootstrap dialog html named id="Dialog"
//      3, Define dialog title and context named id as "dialog-title", "dialog-context"

function refresh_this(data, params){
    // Reload page
    location.reload();
}

function show_info_dialog(title, context){
    $('#dialog-title').html('Info');
    $('#dialog-context').html(context);
    $('#Dialog').modal('show');
}

function show_alert_dialog(context){
    $('#dialog-title').html('Alert');
    $('#dialog-context').html(context);
    $('#Dialog').modal('show');
}

function show_error_dialog(context){
    $('#dialog-title').html('Error');
    $('#dialog-context').html(context);
    $('#Dialog').modal('show');
}

function ajax_to_div(url, div){
    $('#'+div).html('');
    // Load data to div
    // url: Which url you want to request
    // div: the ID of tag div, you want to load response to
    timeout = typeof timeout !== 'undefined' ? timeout : 800;
    var t = setTimeout("$('#'+div).html('Loading......')", timeout);

    $.ajax({
        url: url,
        dataType: "html",
        success: function(data, textStatus, xhr) {
            clearTimeout(t);
            if (xhr.status == 200) {
                $('#'+div).html(data);
            } else {
                show_alert_dialog(context='data');
            }
        },
        error: function(jqXHR, testStatus, errorThrown) {
            clearTimeout(t);
            console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
        }
    });
}


function ajax_to_dialog(url, title){
    // 加载一个页面，显示到dialog中，dialog只需要关闭按钮，不需要提交按钮
    timeout = typeof timeout !== 'undefined' ? timeout : 800;
    var t = setTimeout("$('#'+div).html('Loading......')", timeout);

    $('#dialog-title').html(title);
    $('#dialog-context').html('');
    $('#Dialog').modal('show');

    $.ajax({
        url: url,
        dataType: "html",
        success: function(data) {
            clearTimeout(t);
            $('#dialog-context').html(data);
        },
        error: function(jqXHR, testStatus, errorThrown) {
            console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
        }
    });
}

function ajax_to_form(url, form_id){
    $('#'+form_id).ajaxSubmit({
        url:url,
        type: 'POST',
        data: $.param($('#'+form_id)),
        success: function(data) {
            if (data == 'Success'){
                refresh_this();
            } else {
                show_alert_dialog(context=data);
            }
        },
        error: function(jqXHR, testStatus, errorThrown) {
            console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
        }
    });

}

function ajax_to_callbackform(url, form_id, callback, params){
    $('#'+form_id).ajaxSubmit({
        url:url,
        type: 'POST',
        data: $.param($('#'+form_id)),
        dataType: 'json',
        success: function(data) {
            callback(data, params);
        },
        error: function(jqXHR, testStatus, errorThrown) {
            console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
        }
    });

}


function ajax_to_dialogform(url, title, callback, params){
    // 第一步： 初始化Dialog，将title参数内容显示到Dialog的Title位置, 并弹出
    // 第二部： Ajax加载url参数所对应页面，成功后将form表单填充到Dialog的内容部分
    // 第三步： 以Ajax方式提交Dialog中的表单
    // 第四步： 刷新(执行callback函数)
    //
    // callback 有两个参数，第一个是form ajax的返回值，第二个是params
    // callback 可以为空
    timeout = typeof timeout !== 'undefined' ? timeout : 800;
    var t = setTimeout("$('#'+div).html('Loading......')", timeout);

    $('#dialog-title').html(title);
    $('#dialog-context').html('');
    $('#dialog-btn-submit').unbind('click');
    $('#Dialog').modal('show');

    $.ajax({
        url: url,
        dataType: "html",
        success: function(data) {
            clearTimeout(t);
            $('#dialog-context').html(data);

            $('#dialog-btn-submit').bind('click', function(event){
                //tinyMCE.triggerSave(true, true);
                $('#dialog-form').ajaxSubmit({
                    url:url,
                    type: 'POST',
                    data: $('#dialog-form').formSerialize(),
                    success: function(data) {
                        if (data == 'Success') {
                            $('#Dialog').modal('hide');
                            callback(data, params);
                        } else {
                            $('#dialog-context').html(data);
                        }
                    },
                    error: function(jqXHR, testStatus, errorThrown) {
                        console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
                    }
                });
            });
        },
        error: function(jqXHR, testStatus, errorThrown) {
            console.log(jqXHR + "['" + testStatus + "'] [" + jqXHR.status + "]" + errorThrown);
        }
    });
}

$(function () {
    $('#messageCentralOpenButton').click(function () {
        $.ajaxExternalModal.load('/MobWeb.MessageCentral/');
    });

    $('a[data-ui-modal="true"]').click(function (evt) {
        evt.preventDefault();
        var url = $(this).attr('href');
        $.ajaxExternalModal.load(url);
    });
});


$(function () {
    $('input[type=text]').addClass('form-control input-sm');
    $('input[type=text]').attr('autocomplete', 'off');
    $('button').addClass('btn btn-xs btn-default');
    $('i').addClass('glyphicon');
    $('select').addClass('form-control input-sm');
});
(function ($) {

    $.extend($, {
        json2form: function (json, form) {
            js2form(form, json, '.');
        }
    });

})(jQuery);

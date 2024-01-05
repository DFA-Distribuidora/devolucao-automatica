(function ($) {

    $.extend($, {
        toJson: function (form) {
            var obj = form2js(form, '.', false);
            return JSON.stringify(obj);
        }
    });

    $.extend($, {
        form2jsonString: function (form) {
            var obj = form2js(form, '.', false);
            return JSON.stringify(obj);
        }
    });

})(jQuery);

(function ($, undefined) {

    $.fn.extend($.inputmask.defaults.aliases, {
        udouble: {
            prefix: '',
            alias: 'currency',
            placeholder: "0",
            separator: '',
            radixPoint: ',',
            groupSeparator: ',',
            digits: 2
        },
        udecimal: {
            prefix: '',
            alias: 'currency',
            placeholder: "0",
            separator: '',
            radixPoint: ',',
            groupSeparator: ',',
            digits: 3
        },
        udecimalfordigits: {
            prefix: '',
            alias: 'currency',
            placeholder: "0",
            separator: '',
            radixPoint: ',',
            groupSeparator: ',',
            digits: 4
        },
        uint: {
            alias: 'integer',
            placeholder: "0"
        }
    });

})(jQuery);
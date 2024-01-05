//Tratamento de valores numéricos e monetários
(function ($, undefined) {
    
    $.extend($, {
        numericValue: function (obj) {
            if (!obj)
                return 0;
            obj = obj.toString();
            obj = obj.replace('.', '').replace(',', '.');
            return parseFloat(obj);
        }
    });

    jQuery.fn.extend({
        numericValue: function () {
            var val = $(this).val();
            if (!val)
                return 0;
            val = val.replace('.', '').replace(',', '.');
            return parseFloat(val);
        }
    });

    jQuery.fn.extend({
        enable: function () {
            $.each(this, function (index, el) {
                if (el.nodeName == "INPUT")
                    $(el).removeAttr('readonly');
                if (el.nodeName == "BUTTON")
                    $(el).removeAttr('disabled');
            });
        },
        disable: function () {
            $.each(this, function (index, el) {
                if (el.nodeName == "INPUT")
                    $(el).attr('readonly', 'readonly');
                if (el.nodeName == "BUTTON")
                    $(el).attr('disabled', 'disabled');
            });
        }
    });
})(jQuery);
(function ($) {
    $.ajaxExternalModal = $.ajaxExternalModal || {};
    $.extend($.ajaxExternalModal, {
        load: function (url) {
            var modal, modalDialog, modalHeader, modalContent, modalBody;
            var modalCloseButton, buttonIcon;
            var iframe;
            modal = $('<div class="modal fade">');
            modalDialog = $('<div class="modal-dialog">');
            modalContent = $('<div class="modal-content">');
            modalHeader = $('<div class="modal-header">');
            modalBody = $('<div class="modal-body">');

            modalCloseButton = $('<button>');
            buttonIcon = $('<i>');
            iframe = $('<iframe>');
            modalCloseButton.attr('type', 'button');
            modalCloseButton.attr('data-dismiss', 'modal');
            modalCloseButton.attr('class', 'close');
            buttonIcon.attr('class', 'glyphicon glyphicon-remove');
            modalCloseButton.append(buttonIcon);
            modal.append(modalDialog);
            modalDialog.append(modalContent);
            modalContent.append(modalHeader);
            modalHeader.append(modalCloseButton);
            modalContent.append(modalBody);
            modalBody.append(iframe);
            iframe.attr('src', url);
            iframe.load(function () {
                $(iframe).contents().find('a[data-dismiss="modal"]').click(function () {
                    modal.modal('hide');
                });

                var title = $(iframe).contents().find('title').html();
                var titleDiv = $('<div>');
                titleDiv.text(title);
                modalHeader.append(titleDiv);
            });
            $('body').append(modal);
            modal.modal('show');
            modal.on('hidden.bs.modal', function () {
                window.location = document.URL;
            });

        }
    });
}(jQuery));

(function ($) {
    $.ajaxModal = $.ajaxModal || {};
    $.extend($.ajaxModal, {
        load: function (html, onHiddenEvent) {
            var modal, modalDialog, modalContent, modalBody;
            var form, saveButton, cancelButton, okButton, responseContent;
            modal = $('<div class="modal fade">');
            modalDialog = $('<div class="modal-dialog">');
            modalContent = $('<div class="modal-content">');
            modalBody = $('<div class="modal-body">');
            modal.append(modalDialog);
            modalDialog.append(modalContent);
            modalContent.append(modalBody);

            var body = $(html).find('.content-placeholder')
            modalBody.append(body);
            form = modal.find('form');
            saveButton = modal.find('button[name="saveButton"]');
            cancelButton = modal.find('button[name="cancelButton"]');
            $('body').append(modal);
            modal.rebindComponents();
            modal.modal('show');

            modal.on('hidden.bs.modal', function () {
                if (typeof (onHiddenEvent) == 'function') {
                    onHiddenEvent(modal);
                }
                modal.remove();
            });

            cancelButton.click(function () {
                modal.modal('hide');
            });

            saveButton.click(function () {
                $.ajax({
                    url: form.attr('action'),
                    method: 'POST',
                    data: form.serialize(),
                    success: function (_html) {
                        modal.modal('hide');
                        $.ajaxModal.load(_html, onHiddenEvent);
                    }
                });
            });

            return modal;
        }
    });
}(jQuery));

$(function () {
    //Define Loading Div
    var loadingDiv = $('<div title="Carregando..." class="loading-div">');
    var loadingImg = $('<img src="/Content/images/loading.svg" />');
    loadingDiv.append(loadingImg);
    $('body').append(loadingDiv);
    loadingDiv.hide();


    $(document).ajaxStart(function (e, t) {
        loadingDiv.show();
    });

    $(document).ajaxStop(function (e, t) {
        loadingDiv.hide();
    });
});

(function ($) {
    $.QueryString = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'))
})(jQuery);


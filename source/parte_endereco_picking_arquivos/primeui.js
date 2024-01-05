//Growl
(function ($) {

    var growl = $('#growl');
    var errorDialog = $('#errorDialog');
    var errorDialogContent = $('#errorDialogContent');
    function defineGrowl(lifeTimer = 5000) {
        if (growl.length == 0) {
            growl = $('<div id="growl">');
            $('body').append(growl);
            growl.puigrowl({ life: lifeTimer });;
        }
    }

    function defineErrorDialog(title = "...") {
        if (errorDialog.length == 0) {
            errorDialog = $('<div id="errorDialog" title="' + title + '">');
            errorDialogContent = $('<div id="errorDialogContent" style: "overflow-y:auto;">');
            errorDialog.appendTo('body');
            errorDialogContent.appendTo(errorDialog);
            errorDialog.puidialog({
                showEffect: 'fade',
                hideEffect: 'fade',
                minimizable: false,
                maximizable: false,
                width: 600,
                height: 400,
                closable: true,
                modal: true,
                buttons: [{
                    text: 'Ok',
                    icon: 'ui-icon-check',
                    click: function () {
                        errorDialog.puidialog('hide');
                    }
                }]
            });
        }
    }
    function errorDialogNoButton(onHideDialog) {
        if (errorDialog.length == 0) {
            errorDialog = $('<div style="width:500px" id="errorDialog" title="Erro!!">');
            errorDialogContent = $('<div  id="errorDialogContent">');
            errorDialog.appendTo('body');
            errorDialogContent.appendTo(errorDialog);
            errorDialog.puidialog({
                showEffect: 'fade',
                width: 500,
                hideEffect: 'fade',
                minimizable: false,
                maximizable: false,
                closable: true,
                modal: true,
                afterHide: function (event) {
                    if (onHideDialog)
                        onHideDialog();
                }
            });
        }

    }
    $.toast = $.toast || {};
    $.extend($.toast, {
        success: function () {
            defineGrowl();
            growl.puigrowl('show', [{ severity: 'warn', summary: $.Resources.Strings.Success, detail: $.Resources.Strings.Success_Operation }]);
        },
        successMessage: function (message) {
            defineGrowl();
            growl.puigrowl('show', [{ severity: 'warn', summary: $.Resources.Strings.Success, detail: message }]);
        },
        warn: function (title, message) {
            defineGrowl();
            growl.puigrowl('show', [{ severity: 'warn', summary: title, detail: message }]);
        },
        info: function (title, message) {
            defineGrowl();
            growl.puigrowl('show', [{ severity: 'info', summary: title, detail: message }]);
        },
        error: function (title, message) {
            defineGrowl(10000);
            growl.puigrowl('show', [{ life: 15000, severity: 'error', summary: title, detail: message }]);
        },
        failure: function (message) {
            defineGrowl();
            growl.puigrowl('show', [{ severity: 'error', summary: $.Resources.Strings.Error, detail: message }]);
        },
        errors: function (response) {
            defineGrowl(10000);
            var res = response.responseJSON;
            var message = "";

            if (res && res.ModelState) {
                for (var key in res.ModelState) {
                    var s = res.ModelState[key];
                    message += s;
                }
            }

            growl.puigrowl('show', [{ severity: 'error', summary: $.Resources.Strings.Error, detail: message }]);
        },
        displayErrors: function (response) {
            defineErrorDialog();
            errorDialogContent.empty();
            var res = response.responseJSON;
            if (res && res.ModelState) {
                for (var key in res.ModelState) {

                    var item = res.ModelState[key];
                    if (Array.isArray(item)) {
                        for (var i in item) {
                            var container = $('<p class="alert alert-danger">');
                            container.append(item[i]);
                            errorDialogContent.append(container);
                        }
                    }
                    else {
                        var container = $('<p class="alert alert-danger">');
                        container.append(s);
                        errorDialogContent.append(container);
                    }
                }
            }
            errorDialog.puidialog('show');

        },
        displayInformation: function (response, title) {
            defineErrorDialog(title);
            errorDialogContent.empty();
            var res = response.responseJSON;
            if (res && res.ModelState) {
                for (var key in res.ModelState) {
                    var item = res.ModelState[key];
                    if (Array.isArray(item)) {
                        var containerItem = $('<div class="alert alert-danger">');

                        for (var i in item) {

                            var containerText = (i === '0') ? $('<h4>') : $('<p>');

                            containerText.append(item[i]);

                            containerItem.append(containerText);
                        }
                        errorDialogContent.append(containerItem);
                    }
                }
            }
            errorDialog.puidialog('show');

        },
        displayErrorsByKey: function (response, Key) {
            defineErrorDialog();
            errorDialogContent.empty();
            var res = response.responseJSON;
            if (res && res.ModelState) {
                for (var key in res.ModelState) {

                    var item = res.ModelState[key];
                    if (Array.isArray(item)) {
                        for (var i in item) {
                            var container = $('<p class="alert alert-danger">');
                            container.append(item[i]);
                            errorDialogContent.append(container);
                        }
                    }
                    else {
                        var container = $('<p class="alert alert-danger">');
                        container.append(s);
                        errorDialogContent.append(container);
                    }
                }
            }
            errorDialog.puidialog('show');

        },
        showErrorsDialog: function (response, onHideDialog) {
            errorDialogNoButton(onHideDialog);
            errorDialogContent.empty();
            var container = $('<p style="font-size:30px;" class="alert alert-dangerMaxFont">');
            container.append(response);
            errorDialogContent.append(container);

            errorDialog.puidialog('show');

        },

    });
}(jQuery));

$(function () {
    /**
    Extensão para atualização da instância do paginador
    */
    $.widget("primeui.puipaginator", $.primeui.puipaginator, {
        updateInstance: function () {
            var newPageCount = this.getPageCount(),
                pageLinksElement = this.paginatorElements['{PageLinks}'].children(),
                oldPageCount = pageLinksElement.length;
            if (newPageCount !== oldPageCount) {
                this.options.page = this.options.page < newPageCount ? this.options.page : (newPageCount - 1);
                this.element.empty();
                this.element.removeClass('pui-paginator ui-widget-header');
                this._create();
            }
        }
    });
    /**
    Extensão para a atualização da fonte de dados
    do datatable
    */
    $.widget("primeui.puidatatable", $.primeui.puidatatable, {
        updateDataSource: function (dataSource) {
            $(this.element).empty();
            this._create();
            this._updateDatasource(dataSource);
        }
    });
    /**
    Extensão para a atualização do valor do spinner
    */
    $.widget('primeui.puispinner', $.primeui.puispinner, {
        updateInstance: function () {
            this._updateValue();
        }
    });
});

/**
 * Constrói um puidatatable
 * @param elementId from jquery selector
 * @param columns array of columns
 * @param initialDataSource
 * @param selectionMode 'multiple' or 'single'
 * @param scrollable false or true
 * @param scrollHeight 'Height of the scrollable body section, can be a fixed value in pixels like 50 or a percentage 50%.'
 * @param caption 'Caption text of the datatable.'
 */
function puidatatable(elementId, columns, datasource, selectionMode, scrollable, scrollHeight, caption, expandable, expandedRowContentDelegate, rowExpandMode, responsive) {
    var _this = this;
    var _columns = columns;
    var element = $(elementId);
    var _dataSource = datasource;
    var _selectionMode = 'single';
    if (selectionMode)
        var _selectionMode = selectionMode;

    if (!_dataSource)
        _dataSource = [];    
    var _responsive = responsive ? responsive : false;
    var _scrollable = scrollable ? scrollable : false;
    var _scrollHeight = scrollHeight ? scrollHeight : null;
    var _caption = caption ? caption : '';
    var _lastData = null;
    var _expandableRows = expandable ? expandable : false;
    var _rowExpandMode = rowExpandMode ? rowExpandMode : 'single';

    element.puidatatable({
        caption: _caption,
        scrollable: _scrollable,
        scrollHeight: _scrollHeight,
        columns: _columns,
        datasource: _dataSource,
        responsive: _responsive,
        selectionMode: _selectionMode,
        expandableRows: _expandableRows,
        expandedRowContent: expandedRowContentDelegate,
        rowExpandMode: _rowExpandMode,
        rowSelect: function (e, data) {
            if (_lastData != data) {
                _lastData = data;
                element.trigger('rowSelect', data);
            }
        }
    });

    /**
    @param datasource Fonte de dados em forma de json array
    */
    this.updateDataSource = function (dataSource) {
        _dataSource = dataSource;
        element.puidatatable('updateDataSource', dataSource);
        element.trigger('updateDataSource', dataSource);
    }

    /**
     * @param selectionMode: single, multiple
     */
    this.setSelectionMode = function (selectionMode) {
        _selectionMode = selectionMode;
    }

    /**
    Vincula um evento ao selecionar um registro.
    @param fn = function(e, data){}
    */
    this.onRowSelect = function (fn) {
        element.on('rowSelect', fn);
    }
    /*
    Atualiza a fonte de dados do datatable
    @param fn = function(e, datasource){}
    */
    this.onUpdateDataSource = function (fn) {
        element.on('updateDataSource', fn);
    }
    /*
    Obtém o registro selecionado da tabela.
    @return JSON
    */
    this.getSelection = function () {
        var selection = element.puidatatable('getSelection');
        if (selection.length > 0)
            return selection[0];
        return null;
    }

    this.getSelectedItems = function () {
        var selection = element.puidatatable('getSelection');
        return selection;
    }

    /*
    Executa uma iteração com todos os itens
    da tabela e seus respectivos elementos html.
    @param fn function(tr, data){}
    */
    this.forEach = function (fn) {
        if (typeof fn == "function") {
            var trs = element.find('tbody tr');
            for (var i = 0; i < trs.length; i++)
                fn.call(trs[i], _dataSource[i]);
        }
    }

    this.selectRowByIndex = function (index) {
        var trs = element.find('tbody tr');
        for (var i = 0; i < trs.length; i++) {
            if (i == index)
                element.puidatatable('selectRow', $(trs[i]));
        }
    }

    this.selectAll = function () {
        var trs = element.find('tbody tr');
        for (var i = 0; i < trs.length; i++) {
            element.puidatatable('selectRow', $(trs[i]));
        }
    }

    this.unselectAll = function () {
        var trs = element.find('tbody tr');
        for (var i = 0; i < trs.length; i++) {
            element.puidatatable('unselectRow', $(trs[i]));
        }
    }

    this.updateDataSource([]);

    return this;
}


/**
Constrói um paginator.
@param elementId id do elemento paginado.
*/
function puipaginator(elementId) {
    var _this = this;
    var element = $(elementId);
    /**
    Vincula um evento a ser invocado quando o paginador mudar 
    a página.
    @param handler (function(event, state){}) event
    handler a ser executado ao paginar
    */
    this.onpaginate = function (handler) {
        element.on('paginate', handler);
    }
    /**
    Atualiza a instância do paginator.
    @param page integer página
    @param rows integer quantidade de linhas por página
    @param totalRecords integer quantidade total de registros do paginador
    */
    this.updateInstance = function (page, rows, totalRecords) {
        element.puipaginator({
            page: page,
            rows: rows,
            totalRecords: totalRecords,
            paginate: function (e, state) {
                element.trigger('paginate', state);
            }
        });
        element.puipaginator('updateInstance');
        element.closest('.row').find('input[name="TotalRecords"]').val(totalRecords);
    }

    this.updateInstance(0, 0, 0);
    return this;
}
/**
Constrói um dialog padrão para salvamento
de dados.
@param elementId string id do elemento a ser definido como dialog
@param width integer largura da dialog
*/
function puisavedialogDraggable(elementId, width) {
    var _this = this;
    var element = $(elementId);
    element.hide();
    draggable = true;
    if (!width)
        width = 350;
    /**
    Evento ao salvar
    @param fn function(event){} função a ser executada
    quando o botão salvar for clicado
    */
    this.onsave = function (fn) {
        element.on('save', fn);
    }
    /**
    Evento ao cancelar
    @param fn function(event){} função a ser executada
    quando o botão cancelar for clicado
    */
    this.oncancel = function (fn) {
        element.on('cancel', fn);
    }
    /**
    Evento ao exibir dialog
    @param fn function(event){} função a ser executada
    quando o dialog for exibido
    */
    this.onShowDialog = function (fn) {
        element.on('showDialog', fn);
    }
    /**
    Evento ao ocultar dialog
    @param fn function(event){} função a ser executada
    quando o dialog for oculto
    */
    this.onHideDialog = function (fn) {
        element.on('hideDialog', fn);
    }
    /**
    Oculta o dialog
    */
    this.hideDialog = function () {
        element.puidialog('hide');
        element.trigger('hideDialog');
    }
    /**
    Exibe o dialog
    */
    this.showDialog = function () {
        element.puidialog('show');
        element.trigger('showDialog');
    }

    element.puidialog({
        draggable: draggable,
        resizable: true,
        location: 'center',
        width: width,
        modal: true,
        buttons: [
            {
                text: $.Resources.Strings.Save, icon: 'ui-icon-check', click: function () {
                    element.trigger('save');
                }
            },
            {
                text: $.Resources.Strings.Cancel, icon: 'ui-icon-close', click: function () {
                    _this.hideDialog();
                    element.trigger('cancel');
                }
            }
        ]
    });
    return this;
}

function puisavedialog(elementId, width, location) {
    var _this = this;
    var element = $(elementId);
    element.hide();
    if (!width)
        width = 350;
    /**
    Evento ao salvar
    @param fn function(event){} função a ser executada
    quando o botão salvar for clicado
    */
    this.onsave = function (fn) {
        element.on('save', fn);
    }
    /**
    Evento ao cancelar
    @param fn function(event){} função a ser executada
    quando o botão cancelar for clicado
    */
    this.oncancel = function (fn) {
        element.on('cancel', fn);
    }
    /**
    Evento ao exibir dialog
    @param fn function(event){} função a ser executada
    quando o dialog for exibido
    */
    this.onShowDialog = function (fn) {
        element.on('showDialog', fn);
    }
    /**
    Evento ao ocultar dialog
    @param fn function(event){} função a ser executada
    quando o dialog for oculto
    */
    this.onHideDialog = function (fn) {
        element.on('hideDialog', fn);
    }
    /**
    Oculta o dialog
    */
    this.hideDialog = function () {
        element.puidialog('hide');
        element.trigger('hideDialog');
    }
    /**
    Exibe o dialog
    */
    this.showDialog = function () {
        element.puidialog('show');
        element.trigger('showDialog');
    }

    element.puidialog({
        draggable: false,
        resizable: false,
        location: location != '' ? location : 'center',
        width: width,
        modal: true,
        buttons: [
            {
                text: $.Resources.Strings.Save, icon: 'ui-icon-check', click: function () {
                    element.trigger('save');
                }
            },
            {
                text: $.Resources.Strings.Cancel, icon: 'ui-icon-close', click: function () {
                    _this.hideDialog();
                    element.trigger('cancel');
                }
            }
        ]
    });
    return this;
}

/**
 * Constrói um dialog padrão com botões largura e botões personalizados
 * @param elementId string id do elemento a ser definido como dialog
 * @param width integer largura do dialog
 * @param buttons Array de { text: 'string',  icon: 'ui-icon', click: handler } para formação dos botões
 */
function puidialog(elementId, width, buttons, location) {
    var _this = this;
    var _width = 350;
    var _location = 'center';
    var element = $(elementId);

    if (width)
        _width = width;

    if (location)
        _location = location;

    element.puidialog({
        draggable: false,
        resizable: false,
        location: _location,
        width: _width,
        modal: true,
        buttons: buttons
    });

    /**
    Evento ao exibir dialog
    @param fn function(event){} função a ser executada
    quando o dialog for exibido
    */
    this.onShowDialog = function (fn) {
        element.on('showDialog', fn);
    }
    /**
    Evento ao ocultar dialog
    @param fn function(event){} função a ser executada
    quando o dialog for oculto
    */
    this.onHideDialog = function (fn) {
        element.on('hideDialog', fn);
    }
    /**
    Oculta o dialog
    */
    this.hideDialog = function () {
        element.puidialog('hide');
        element.trigger('hideDialog');
    }
    /**
    Exibe o dialog
    */
    this.showDialog = function () {
        element.puidialog('show');
        element.trigger('showDialog');
    }

    return this;
}

/**
 * Constrói um dialog padrão com botões largura e botões personalizados
 * @param elementId string id do elemento a ser definido como dialog
 * @param width integer largura do dialog
 * @param buttons Array de { text: 'string',  icon: 'ui-icon', click: handler } para formação dos botões
 * Draggable habilitado
 */

function puidialogDraggable(elementId, width, buttons, location) {
    var _this = this;
    var _width = 350;
    var _location = 'center';
    var element = $(elementId);
    draggable = true;
    if (width)
        _width = width;

    if (location)
        _location = location;

    element.puidialog({
        draggable: draggable,
        resizable: true,
        location: _location,
        width: _width,
        modal: true,
        buttons: buttons
    });

    /**
    Evento ao exibir dialog
    @param fn function(event){} função a ser executada
    quando o dialog for exibido
    */
    this.onShowDialog = function (fn) {
        element.on('showDialog', fn);
    }
    /**
    Evento ao ocultar dialog
    @param fn function(event){} função a ser executada
    quando o dialog for oculto
    */
    this.onHideDialog = function (fn) {
        element.on('hideDialog', fn);
    }
    /**
    Oculta o dialog
    */
    this.hideDialog = function () {
        element.puidialog('hide');
        element.trigger('hideDialog');
    }
    /**
    Exibe o dialog
    */
    this.showDialog = function () {
        element.puidialog('show');
        element.trigger('showDialog');
    }

    return this;
}


/**
 * Constrói um dialog padrão com botões largura e botões personalizados
 * @param elementId string id do elemento a ser definido como dialog
 * @confirmHandler função que vai ser executada quando confirmar 
 * @param width integer largura do dialog
 * @param onHideHandler função que vai ser chamada quando o dialog for ocultado
 */
function puiconfirmdialog(elementId, confirmHandler, width, onHideHandler) {
    var _this = this;
    var element = $(elementId);
    element.hide();

    if (!width)
        width = 350;

    /**
    Evento ao confirmar o dialog.
    @param fn function(event){} função a ser executada
    quando o dialog form confirmado.
    */
    this.onConfirm = function (fn) {
        element.on('confirm', fn);
    }

    this.onCancel = function (fn) {
        element.on('cancel', fn);
    }
    /**
    Evento ao exibir dialog
    @param fn function(event){} função a ser executada
    quando o dialog for exibido
    */
    this.onShowDialog = function (fn) {
        element.on('showDialog', fn);
    }
    /**
    Evento ao ocultar dialog
    @param fn function(event){} função a ser executada
    quando o dialog for oculto
    */
    this.onHideDialog = function (fn) {
        element.on('hideDialog', fn);
    }
    /**
    Oculta o dialog
    */
    this.hideDialog = function () {
        element.puidialog('hide');
        element.trigger('hideDialog');
    }
    /**
    Exibe o dialog
    */
    this.showDialog = function () {
        element.puidialog('show');
        element.trigger('showDialog');
    }

    if (confirmHandler) {
        this.onConfirm(confirmHandler);
    }

    element.puidialog({
        draggable: false,
        resizable: false,
        location: 'center',
        width: width,
        modal: true,
        afterHide: function () {
            if (onHideHandler)
                onHideHandler();
        },

        buttons: [
            {
                text: $.Resources.Strings.Yes, icon: 'ui-icon-check', click: function () {
                    element.trigger('confirm');
                }
            },
            {
                text: $.Resources.Strings.No, icon: 'ui-icon-close', click: function () {
                    _this.hideDialog();
                    element.trigger('cancel');
                }
            }
        ]
    });
    return this;


}
/**
 Cria um Cookie (deve ser passado o nome e o valor)
 */
function createCookie(cookieName, cookieValue) {
    //função universal para criar cookie
    var expires;

    var date;

    date = new Date(); //  criando o COOKIE com a data atual
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = date.toUTCString();
    document.cookie = cookieName + '=' + cookieValue + "; expires=" + expires + "; path=/";
}
/**
 retorna o valor do cookie pelo nome
 se o cookie não existir ele retorna false
 */
function getCookieValue(cookieName) {
    // Adiciona o sinal de = na frente do nome do cookie
    var cname = cookieName + '=';

    // Obtém todos os cookies do documento
    var cookies = document.cookie;

    // Verifica se seu cookie existe
    if (cookies.indexOf(cname) == -1) {
        return false;
    }

    // Remove a parte que não interessa dos cookies
    cookies = cookies.substr(cookies.indexOf(cname), cookies.length);

    // Obtém o valor do cookie até o ;
    if (cookies.indexOf(';') != -1) {
        cookies = cookies.substr(0, cookies.indexOf(';'));
    }

    // Remove o nome do cookie e o sinal de =
    cookies = cookies.split('=')[1];

    // Retorna apenas o valor do cookie
    return cookies;
}
/**
 deleta o cookie pelo nome(nome)
 */
function deleteCookie(cookieName) {
    // Data no passado
    var data = new Date(2010, 0, 01);
    // Converte a data para GMT
    data = data.toGMTString();
    // Apaga o cookie
    document.cookie = cookieName + '=; expires=' + data + '; path=/';
}
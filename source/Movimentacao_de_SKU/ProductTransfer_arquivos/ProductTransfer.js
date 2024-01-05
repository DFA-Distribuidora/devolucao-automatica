//searchForm
$(function () {

    var OriginalAddressType_Picking = $('#OriginalAddressType_Picking');
    var OriginalAddressType_Storage = $('#OriginalAddressType_Storage');
    var OriginalAddressType_Avaria = $('#OriginalAddressType_Avaria');
    var DestinationAddressType_Picking = $('#DestinationAddressType_Picking');
    var DestinationAddressType_Storage = $('#DestinationAddressType_Storage');
    var destinationAddressType_SpecialAddress = $('#DestinationAddressType_SpecialAddress');
    var OriginalAddress_Devolution = $('#OriginalAddress_Devolution');
    var originalAddress_Blocked = $('#OriginalAddress_Blocked');
    var originalAddress_Special = $('#OriginalAddress_Special');
    var extendedBlock = $("#extendedBlock").val();
    var Product_Id = $('#Product_Id');
    var Product_Name = $('#Product_Name');

    var AmmountUnit = $('#AmmountUnit');

    var ProductGrid_Div = $('#ProductGrid_Div');
    ProductGrid_Div.hide();

    OriginalAddressType_Storage.prop('checked', true);
    DestinationAddressType_Picking.prop('checked', true);

    var OriginalAddress_Id = $('#OriginalAddress_Id');
    var OriginalAddress = $('#OriginalAddress');
    var DestinationAddress_Id = $('#DestinationAddress_Id');
    var DestinationAddress = $('#DestinationAddress');
    var PickingType = $('#PickingType');

    var ConfirmDialog = new puiconfirmdialog('#ConfirmDialog');
    var MovingProductForm = $('#MovingProduct');
    var MovingProduct_SubmitButton = $('#MovingProduct_Submit');
    var BarCode = $('#BarCode');
    var validator = MovingProductForm.validate();
    var GetPickingButton = $('#GetPickingButton');

    BarCode.focus();

    var MaxWeight = 0;
    var MaxAmmount = 0;

    function ChangeAddressTypeBySMU(addressType) {
        OriginalAddressType_Picking.prop('checked', false);
        OriginalAddressType_Storage.prop('checked', false);
        OriginalAddressType_Avaria.prop('checked', false);
        OriginalAddress_Devolution.prop('checked', false);
        switch (addressType) {
            case -27:
                OriginalAddressType_Picking.prop('checked', true); break;
            case -28:
                OriginalAddressType_Storage.prop('checked', true); break;
            case -106:
                OriginalAddressType_Avaria.prop('checked', true); break;
            case -108:
                OriginalAddress_Devolution.prop('checked', true); break;
        }
    }

    function GetTypAddressOriginal() {

        if (OriginalAddressType_Picking.is(':checked')) {
            return "-27";
        }
        if (OriginalAddressType_Storage.is(':checked')) {
            return "-28";
        }
        if (OriginalAddressType_Avaria.is(':checked')) {
            return "-106";
        }
        if (OriginalAddress_Devolution.is(':checked')) {
            return "-108";
        }

        return null;
    }

    function getSelectedTypAddressDestination() {

        if (DestinationAddressType_Picking.is(':checked')) {
            return "-27";
        }

        if (DestinationAddressType_Storage.is(':checked')) {
            return "-28";
        }

        return null;
    }

    BarCode.click(function (e) {
        e.preventDefault();
        BarCode.val('');
    });

    function Refresh() {
        $("#Page input:text").val("");
        BarCode.focus();
    }

    $('#MovingProduct_Refresh').click(function (e) {
        e.preventDefault();
        Refresh();
    })

    BarCode.keypress(function (event) {
        if (event.keyCode == 13) {
            var barCode = BarCode.val();
            $.ajax({
                url: '/api/Core/Sku/GetBarCodeOrEntry',
                data: { barCode: barCode },
                type: 'GET',
                contentType: 'application/json',
                success: function (data) {
                    var response = data.IsSMU ? data.Entry : data.SKU;

                    js2form('MovingProduct', response, '.');
                    if (response.Product.DefaultWeight == true)
                        $('#Weight').attr('readonly', true);
                    Product_Id.val(response.Product.Id);
                    Product_Name.val(response.Product.Code + " - " + response.Product.Name);
                    if (response.Product.GridControl == true) {
                        ProductGrid_Div.show();
                    }
                    if (data.IsSMU) {
                        $('#BarCode').val(response.Id);
                        OriginalAddress_Id.val(response.Address.Id);
                        ChangeAddressTypeBySMU(response.Address.AddressType.Id);
                        queryOriginalAddress();
                    } else {
                        OriginalAddress_Id.focus();
                    }
                },
                error: function (e) {
                    validator.showErrors(e.responseJSON.Message);
                }
            });
        };
    });

    function queryOriginalAddress() {

        $('#Address_AddressType_Id').val(GetTypAddressOriginal());
        $('#Address_Id').val($('#OriginalAddress_Id').val());

        $('#Address_BlockedAddress').val(originalAddress_Blocked.is(':checked'));
        $('#Address_SpecialAddress').val(originalAddress_Special.is(':checked'));

        var data = form2js('MovingProduct');

        $.ajax({
            type: "post",
            url: '/api/Core/Stock/GetOriginalAddress',
            data: JSON.stringify(data),
            contentType: 'application/json',
            context: this,
            success: function (data) {
                if (data.length == 1) {
                    var result = data[0];
                    $('#OriginalAddress').val(result.Address.FullAddress);
                    var weightVal = parseFloat(result.Weight.toFixed(2));
                    MaxWeight = weightVal;
                    MaxAmmount = result.Ammount;
                    $('#OriginalAddress_Id').val(result.Address.Id);
                    $('#Ammount').val(result.Ammount);
                    $('#Weight').val(weightVal);
                    if (result.ExpirationDate != null) {
                        $('#ExpirationDate').val(result.ExpirationDate.substring(0, 10));
                    }
                    $('#Lot').val(result.Lot);
                    $('#Factor').val(result.Factor);

                    $('#Ammount').focus();
                }
            },
            error: function (e) {
                $.toast.error(e.responseJSON.Message);
            }
        });
    }

    OriginalAddress_Id.keypress(function (event) {
        if (event.keyCode == 13) {
            queryOriginalAddress();
        };
    });

    DestinationAddress_Id.keypress(function (event) {

        if (event.keyCode == 13) {

            var addressType = getSelectedTypAddressDestination();
            var productId = Product_Id.val();
            var addressId = DestinationAddress_Id.val();
            $.ajax({
                type: "GET",
                url: '/api/Core/Stock/GetDestinationAddress',
                data:
                {
                    addressId: addressId,
                    productId: productId,
                    addressType: addressType
                },
                contentType: 'application/json',
                context: this,
                success: function (data) {
                    DestinationAddress.val(data.FullAddress);
                    DestinationAddress_Id.val(data.Id);

                    MovingProduct_SubmitButton.focus();
                },
                error: function (e) {
                    $.toast.error(e.responseJSON.Message);
                    DestinationAddress_Id.val('');
                    DestinationAddress_Id.focus();
                }
            });
        };
    });

    DestinationAddress.keypress(function (e) {
        if (e.keyCode == 13) {
            MovingProduct_SubmitButton.focus();
        };
    });

    $('#Ammount').keypress(function (event) {
        if (event.keyCode == 13) {
            DestinationAddress_Id.focus();
        };
    });

    $('#MovingProduct_Cancel').click(function (e) {
        MovingProductForm[0].reset();
    });

    var addressMask = extendedBlock == "true" ? "99.99.999.99.999" : "99.99.99.99.999"

    $('#DestinationAddress').inputmask(addressMask);
    MovingProductForm.on('submit', function (e) {
        e.preventDefault();
    });

    var onTransfer = false;

    ConfirmDialog.onConfirm(function (e) {
        if (!onTransfer) {

            onTransfer = true;
            $('#MovingOriginalAddress_Destionation_Id').val(DestinationAddress_Id.val());

            $('#MovingOriginalAddress_BarCode').val(BarCode.val());

            $('#MovingOriginalAddress_Product_Id').val(Product_Id.val());

            var originalAddressType = GetTypAddressOriginal();

            $('#MovingOriginalAddress_AddressType_Id').val(originalAddressType);
            $('#MovingOriginalAddress_AddressStatus').val(!originalAddress_Blocked.is(':checked'));
            $('#MovingOriginalAddress_SpecialAddress').val(originalAddress_Special.is(':checked'));
            $('#MovingOriginalAddress_Stock_Id').val();
            var URL = '';

            if (originalAddressType == -27) {
                URL = '/api/Core/StockMovement/PickingTransfer';
            } else if (originalAddress_Blocked.is(':checked')) {
                URL = '/api/Core/StockMovement/BlockedTransfer';
            } else {
                URL = '/api/Core/StockMovement/Save';
            }

            var data = form2js('MovingOriginalAddress', '.');

            data.Ammount = parseFloat(data.Ammount);

            $.ajax({
                url: URL,
                data: JSON.stringify(data),
                type: 'post',
                contentType: 'application/json',
                success: function (e) {
                    $.toast.success();
                    onTransfer = false;
                    Refresh();
                    ConfirmDialog.hideDialog();
                },
                error: function (e) {
                    if (e.responseJSON.ModelState != null)
                        validator.showErrors(e.responseJSON.ModelState);
                    if (e.responseJSON.ExceptionMessage)
                        $.toast.error($.Resources.Strings.Error, e.responseJSON.ExceptionMessage);
                    onTransfer = false;
                    ConfirmDialog.hideDialog();
                }
            });
        }
    })
    $('#MovingProduct_Submit').on('click', function (e) {

        if ($('#Product_Id').val() == '') {
            $.toast.failure($.Resources.Strings.Error_InvalidProduct);
            return;
        }
        if ($('#OriginalAddress').val() == '') {
            $.toast.failure($.Resources.Strings.InvalidOriginalAddress);
            return;
        }
        if ($('#DestinationAddress').val() == '') {
            $.toast.failure($.Resources.Strings.InvalidDestinationAddress);
            return;
        }
        ConfirmDialog.showDialog();
    });

    $('#Product_Name').dblclick(function () {
        $('#Product_Name').val("");
        $('#Product_Id').val("");
    });

    $('#OriginalAddress').puiautocomplete({
        effect: 'fade',
        effectSpeed: 'fast',
        dropdown: true,
        content: function (data) {
            var ExpirationDate = "";
            if (data.ExpirationDate != null) {
                ExpirationDate = "<br/>Validade: " + data.ExpirationDate.substring(0, 11);
            }
            var Lot = "";
            if (data.Lot != null) {
                Lot = "<br/>Lote: " + data.Lot;
            }
            var PickingType = "";
            if (data.PickingType != null && data.PickingType != "") {
                PickingType = "<br/>Tipo de Picking: " + data.PickingType;
            }

            var addressBlocked = "<br/>Status:";
            if (data.Address.BlockedAddress) {
                addressBlocked = addressBlocked + "<span class='label label-danger'>Bloqueado</span>"
                return "<div><strong>" + data.Address.FullAddress + "</strong> <i class='fa fa-arrow-circle-o-right'></i> <strong><i>" + data.Address.ErpAddress + "</i></strong><div style='padding-left: 10px;margin-top: -10px;'>"
                    + "<br/>Tipo.Endereço: " + data.Address.AddressType.Name                 
                    + "<br/>Qtd.Bloqueada.: " + data.BlockedAmount + data.Unit
                    + ExpirationDate
                    + Lot
                    + addressBlocked + "</div></div>";          
            } else {
                addressBlocked = addressBlocked + "<span class='label label-success'>Liberado</span>"
                return "<div><strong>" + data.Address.FullAddress + "</strong> <i class='fa fa-arrow-circle-o-right'></i> <strong><i>" + data.Address.ErpAddress + "</i></strong><div style='padding-left: 10px;margin-top: -10px;'>"
                    + "<br/>Tipo.Endereço: " + data.Address.AddressType.Name
                    + "<br/>Qtd.: " + data.RealStockAmount + data.Unit
                    + "<br/>Qtd.Disp.: " + data.Ammount + data.Unit
                    + "<br/>Qtd.Bloqueada.: " + data.BlockedAmount + data.Unit
                    + ExpirationDate
                    + Lot
                    + addressBlocked
                    + PickingType + "</div></div>";
            }
        },
        completeSource: function (request, response) {

            var productCode = $('#Product_Name').val();

            if (productCode == "") {
                $.toast.error("Erro", "Digite o codigo do produto.");
                return;
            }

            var originalAddressType = GetTypAddressOriginal();

            $('#Address_FullAddress').val($('#OriginalAddress').val());
            $('#Address_AddressType_Id').val(originalAddressType);

            $('#Address_BlockedAddress').val(originalAddress_Blocked.is(':checked'));
            $('#Address_SpecialAddress').val(originalAddress_Special.is(':checked'));

            $('#OriginalAddress_Id').val('');

            var data = form2js('MovingProduct');

            $.ajax({
                type: "post",
                url: '/api/Core/Stock/GetOriginalAddress',
                data: JSON.stringify(data),
                contentType: 'application/json',
                context: this,
                success: function (data) {
                    response.call(this, data);
                },
                error: function (e) {
                    $.toast.error(e.responseJSON.Message);
                }
            });
        },
        select: function (event, item) {
            $('#OriginalAddress').val(item.data('Address').FullAddress);
            var weightVal = parseFloat(item.data('Weight')).toFixed(2);
            MaxWeight = weightVal;
            MaxAmmount = item.data('Ammount');
            $('#OriginalAddress_Id').val(item.data('Address').Id);
            $('#MovingOriginalAddress_Stock_Id').val(item.data('Stock').Id);           

            $('#Weight').val(weightVal);

            if (item.data('ExpirationDate') != null) {
                $('#ExpirationDate').val(item.data('ExpirationDate').substring(0, 10));
            }
            $('#Lot').val(item.data('Lot'));

            $('#Factor').val(item.data('Factor'));

            var amountUnitText = $.Resources.Strings.Ammount + item.data('Unit');

            AmmountUnit.text(amountUnitText);

            if (originalAddress_Blocked.is(':checked')) {
                $('#Ammount').val(item.data('BlockedAmount'));
            } else {
                $('#Ammount').val(item.data('Ammount'));
            }

            $('#Ammount').prop("readonly", false);
            $('#Ammount').focus();
        }
    });

    $('#DestinationAddress').puiautocomplete({
        effect: 'fade',
        effectSpeed: 'fast',
        dropdown: true,
        content: function (data) {

            if (data.ErpAddress) {
                return data.FullAddress + ' <i class="fa fa-arrow-circle-o-right"></i> <strong><i>' + data.ErpAddress + '</i></strong>';
            } else {
                return data.FullAddress;
            }
        },
        completeSource: function (request, response) {

            if (!request.query)
                request.query = '%';

            var addressType = getSelectedTypAddressDestination();
            var productId = Product_Id.val()
            var pickingType = PickingType.val()
            $.ajax({
                type: "GET",
                url: '/api/Core/Stock/GetAvailableAddressWithType',
                data:
                {
                    term: request.query,
                    productId: productId,
                    addressType: addressType,
                    pickingDefault: false,
                    pickingType: pickingType
                },
                contentType: 'application/json',
                context: this,
                success: function (data) {
                    response.call(this, data);
                }
            });
        },
        select: function (event, item) {
            $('#DestinationAddress').val(item.data('FullAddress'));
            $('#DestinationAddress_Id').val(item.data('Id'));
        }
    });

    $('.DestionationRadioType').click(function (e) {
        ClearDestinationAddressValues();
    });
    $('.OriginalRadioType').click(function (e) {
        ClearOriginalAddressValues();
    });

    GetPickingButton.click(function (e) {
        e.preventDefault();
        if ($('#Product_Name').val() == "")
            $.toast.error("Erro", "Digite o codigo do produto.");
        else
            var productId = $('#Product_Id').val();
        $.ajax({
            type: "GET",
            url: '/api/Core/Picking/GetPickingByProduct',
            data: { productId: productId },
            contentType: 'application/json',
            context: this,
            success: function (data) {
                $('#DestinationAddress').val(data.Address.FullAddress);
            },
            error: function (e) {
                validator.showErrors(e.responseJSON.Ex);
            }
        });
    })

    $('#Product_Name').puiautocomplete({
        effect: 'fade',
        effectSpeed: 'fast',
        dropdown: true,
        content: function (data) {
            return data.Code + " - " + data.Name;
        },
        completeSource: function (request, response) {
            if (!request.query)
                request.query = '%';
            $.ajax({
                type: "GET",
                url: '/api/Core/Product/GetByNameAndCode',
                data: { term: request.query },
                contentType: 'application/json',
                context: this,
                success: function (data) {
                    response.call(this, data);
                }
            });
        },
        select: function (event, item) {
            BarCode.val('');
            var id = item.data('Id');
            var name = item.data('Name');
            var code = item.data('Code');
            var dynamicPicking = item.data('DynamicPicking');

            if (id) {
                $('#Product_Id').val(id);
            }
            if (name) {
                $('#Product_Name').val(code + "-" + name);
            }

            OriginalAddress_Id.focus();

            PickingType.prop("disabled", dynamicPicking === true);
            if (dynamicPicking === true) {
                PickingType.val(-123);
            }
        }
    });

    $('#Ammount').keyup(function () {
        var InputAValue = parseFloat($('#Ammount').val());
        if (InputAValue < 0)
            $('#Ammount').val(0)
    });
    $('#Ammount').keyup(function (e) {
        if (parseFloat(MaxWeight) != 0) {
            var newWeight = (parseFloat(MaxWeight) / (parseFloat(MaxAmmount) / parseFloat($('#Ammount').val()))).toFixed(2);
            $('#Weight').val(newWeight);
        }
    });
    //$('#Ammount').inputmask('currency');
   
    $('#Product_Name').dblclick(function () {
        $('#Product_Name').val("");
        $('#Product_Id').val("");
    });

    $('#DestinationAddress').dblclick(function () {
        ClearDestinationAddressValues();
    });
    $('#DestinationAddress_Id').click(function () {
        ClearDestinationAddressValues();
    });

    $('#OriginalAddress').dblclick(function () {
        ClearOriginalAddressValues();
    });
    $('#OriginalAddress_Id').click(function () {
        ClearOriginalAddressValues();
    });

    function ClearOriginalAddressValues() {
        $('#ExpirationDate').val('');
        $('#OriginalAddress').val("");
        $('#OriginalAddress_Id').val("");
        $('#Lot').val('');
        $('#Factor').val('');
        $('#Ammount').val('');
        $('#Weight').val('');
        $('#Ammount').prop("readonly", true);
        AmmountUnit.text($.Resources.Strings.Ammount);
        applyRuleOriginalTypeAddress();
        OriginalAddress_Id.focus();
    }
    function ClearDestinationAddressValues() {
        $('#DestinationAddress').val("");
        $('#DestinationAddress_Id').val("");
    }

    function applyRuleOriginalTypeAddress() {
        if (originalAddress_Blocked.is(':checked')) {
            DestinationAddressType_Picking.prop("disabled", true);
            DestinationAddressType_Storage.prop("disabled", false);
            destinationAddressType_SpecialAddress.prop("disabled", false);
            destinationAddressType_SpecialAddress.prop('checked', true);
        } else {
            DestinationAddressType_Picking.prop("disabled", false);
            DestinationAddressType_Storage.prop("disabled", false);
            destinationAddressType_SpecialAddress.prop("disabled", false);
        }
    }
});
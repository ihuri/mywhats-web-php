//
// Cookies
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
//
//How to create GUID / UUI
function uuidv4() {
    /*
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    */
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
//
$('document').ready(function() {
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    // Onde estou
    var ResponseURL = window.location.href;
    var domain = ResponseURL.split('/');
    var dir_local = domain[domain.length - 2];
    const dir_link = domain[domain.length - 4];
    console.log('Local: ' + dir_local);
    console.log('Link: ' + dir_link);
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    //Celular
    jQuery.validator.addMethod('celular', function(value, element) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return (this.optional(element) || false);
        } else if (value == '00000000000') {
            return (this.optional(element) || false);
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return (this.optional(element) || false);
        }
        if (value.length < 9 || value.length > 12) {
            return (this.optional(element) || false);
        }
        if (["6", "7", "8", "9"].indexOf(value.substring(2, 3)) == -1) {
            return (this.optional(element) || false);
        }
        return (this.optional(element) || true);
    }, 'Informe um celular válido');

    //Telefone fixo
    jQuery.validator.addMethod('telefone', function(value, element) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return (this.optional(element) || false);
        } else if (value == '00000000000') {
            return (this.optional(element) || false);
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return (this.optional(element) || false);
        }
        if (value.length < 10 || value.length > 11) {
            return (this.optional(element) || false);
        }
        if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
            return (this.optional(element) || false);
        }
        return (this.optional(element) || true);
    }, 'Informe um telefone válido!');

    //
    jQuery.validator.addMethod("filesize_max", function(value, element, param) {
        var isOptional = this.optional(element),
            file;

        if (isOptional) {
            return isOptional;
        }

        if ($(element).attr("type") === "file") {

            if (element.files && element.files.length) {

                file = element.files[0];
                return (file.size && file.size <= param * 1024000);
            }
        }

        return false;
    }, 'O arquivo selecionado deve ser de no máximo {0} MB.');
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendText-form").validate({
        rules: {
            numero: {
                required: true,
                celular: true
            },
            msg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            numero: {
                required: "Informe um numero de telefone.",
                celular: "Informe um celular válido."
            },
            msg: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var data = $("#sendText-form").serialize();
            $.ajax({
                type: 'POST',
                url: 'http://10.10.0.210:9000/sistema/sendText',
                data: data,
                dataType: 'json',
                beforeSend: function() {
                    $("#sendTexto").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response !== false) {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response === false) {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                },
                error: (e) => {
                    $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendImage-form").validate({
        rules: {
            numeroimg: {
                required: true,
                celular: true
            },
            fileimg: {
                required: true,
                extension: "jpg|jpeg|gif|png|bmp",
                filesize_max: 10
            },
            msgimg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            numeroimg: {
                required: "Informe um numero de telefone.",
                celular: "Informe um celular válido."
            },
            fileimg: {
                required: "Selecione o arquivo.",
                extension: "Informe um arquivo do tipo jpg, jpeg, gif, png e bmp.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            },
            msgimg: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var form = $('#sendImage-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://10.10.0.210:9000/sistema/sendImage',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function() {
                    $("#sendImage").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.erro == false && response.status == 'OK') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response.erro == true && response.status == '404') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                },
                error: (e) => {
                    $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });
                }

            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextMassa-form").validate({
        rules: {
            sendTextMassaContato: {
                required: true,
                extension: "txt",
                filesize_max: 2
            },
            msgtxtmass: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            sendTextMassaContato: {
                required: "Selecione o arquivo de contato.",
                extension: "Informe um arquivo do tipo txt.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            },
            msgtxtmass: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var form = $('#sendTextMassa-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://10.10.0.210:9000/sistema/sendTextMult',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function() {
                    $("#sendTextMassa").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                    $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                    var table_success = '';
                    var table_error = '';
                    //
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else {
                        //
                        // ITERATING THROUGH OBJECTS 
                        $.each(response.sendResult, function(key, value) {
                            if (value.erro == false && value.status == 'OK') {
                                //CONSTRUCTION OF ROWS HAVING 
                                // DATA FROM JSON OBJECT 
                                table_success += '<tr>';
                                table_success += '<td>' + value.number + '</td>';
                                table_success += '<td>' + value.menssagem + '</td>';
                                table_success += '</tr>';
                            } else {
                                //CONSTRUCTION OF ROWS HAVING 
                                // DATA FROM JSON OBJECT 
                                table_error += '<tr>';
                                table_error += '<td>' + value.number + '</td>';
                                table_error += '<td>' + value.menssagem + '</td>';
                                table_error += '</tr>';
                            }
                        });
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        $('#sendTextMassaModalCentralizado').modal('show');
                        //INSERTING ROWS INTO TABLE  
                        $('#table_success').append(table_success);
                        //
                        //INSERTING ROWS INTO TABLE  
                        $('#table_error').append(table_error);
                        //
                    }
                },
                error: (e) => {
                    $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });
                }

            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendFileImgMassa-form").validate({
        rules: {
            sendImageMassaContato: {
                required: true,
                extension: "txt",
                filesize_max: 2
            },
            FileImageMassa: {
                required: true,
                extension: "jpg|jpeg|gif|png|bmp",
                filesize_max: 10
            },
            msgimgmass: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            sendImageMassaContato: {
                required: "Selecione o arquivo de contato.",
                extension: "Informe um arquivo do tipo txt.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            },
            FileImageMassa: {
                required: "Selecione o arquivo.",
                extension: "Informe um arquivo do tipo jpg, jpeg, gif, png e bmp.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            },
            msgimgmass: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var form = $('#sendFileImgMassa-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://10.10.0.210:9000/sistema/sendImageMult',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function() {
                    $("#sendFileImgMassa").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                    $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                    var table_success = '';
                    var table_error = '';
                    //
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else {
                        // ITERATING THROUGH OBJECTS 
                        $.each(response.sendResult, function(key, value) {
                            if (value.erro == false && value.status == 'OK') {
                                //CONSTRUCTION OF ROWS HAVING 
                                // DATA FROM JSON OBJECT 
                                table_success += '<tr>';
                                table_success += '<td>' + value.number + '</td>';
                                table_success += '<td>' + value.menssagem + '</td>';
                                table_success += '</tr>';
                            } else {
                                //
                                //CONSTRUCTION OF ROWS HAVING 
                                // DATA FROM JSON OBJECT 
                                table_error += '<tr>';
                                table_error += '<td>' + value.number + '</td>';
                                table_error += '<td>' + value.menssagem + '</td>';
                                table_error += '</tr>';
                            }
                        });
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        $('#sendImageMassaModalCentralizado').modal('show');
                        //INSERTING ROWS INTO TABLE  
                        $('#table_success').append(table_success);
                        //
                        //INSERTING ROWS INTO TABLE  
                        $('#table_error').append(table_error);
                        //
                    }
                },
                error: (e) => {
                    $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });

                }

            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextGrupo-form").validate({
        rules: {
            TextGrupo: {
                required: true
            },
            TextGrupoMsg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            TextGrupo: {
                required: "Selecione um grupo."
            },
            TextGrupoMsg: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var data = $("#sendTextGrupo-form").serialize();
            $.ajax({
                type: 'POST',
                url: 'http://10.10.0.210:9000/sistema/sendTextGrupo',
                data: data,
                dataType: 'json',
                beforeSend: function() {
                    $("#sendTextGrupo").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response !== false) {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response.erro === false) {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                },
                error: (e) => {
                    $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });

                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendFileImgGrupo-form").validate({
        rules: {
            ImgGrupo: {
                required: true
            },
            FileImageGrupo: {
                required: true,
                extension: "jpg|jpeg|gif|png|bmp",
                filesize_max: 10
            },
            msgimggrupo: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            ImgGrupo: {
                required: "Selecione um grupo."
            },
            FileImageGrupo: {
                required: "Selecione o arquivo.",
                extension: "Informe um arquivo do tipo jpg, jpeg, gif, png e bmp.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            },
            msgimggrupo: {
                required: "Informe sua menssagem.",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var form = $('#sendFileImgGrupo-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://10.10.0.210:9000/sistema/sendImageGrupo',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function() {
                    $("#sendFileImgGrupo").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function(response) {
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.erro == false && response.status == 'OK') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response.erro == true && response.status == '404') {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                }
            });
        },
        error: (e) => {
            $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
            //
            Lobibox.notify('info', {
                title: false,
                soundPath: '../public/lobibox/sounds/',
                soundExt: '.ogg',
                sound: true,
                iconSource: "fontAwesome",
                icon: 'fas fa-info-circle',
                size: 'mini',
                delay: 5000,
                msg: 'Erro interno, menssagem não enviada!'
            });

        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#checkNumberStatus-form").validate({
        rules: {
            numero: {
                required: true,
                celular: true
            }
        },
        messages: {
            numero: {
                required: "Informe um numero de telefone.",
                celular: "Informe um celular válido."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var data = $("#checkNumberStatus-form").serialize();
            $.ajax({
                type: 'POST',
                url: 'http://10.10.0.210:9000/sistema/checkNumberStatus',
                data: data,
                dataType: 'json',
                beforeSend: function() {
                    $("#checkNumberStatus").html('<i class="fas fa-spinner fa-spin"></i> Checando...');
                },
                success: function(response) {
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.numberExists == true && response.status == '200') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Contato pode receber mensagem!'
                        });
                        //
                    } else if (response.canReceiveMessage == false && response.status == '404') {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Contato não pode receber mensagem!'
                        });
                        //
                    } else {
                        $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, não foi possivel checar o contato!'
                        });
                        //
                    }
                },
                error: (e) => {
                    $("#checkNumberStatus").html('<i class="fas fa-paper-plane"></i> Checar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });

                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#checkNumberStatusMassa-form").validate({
        rules: {
            checkNumberStatusMassaContato: {
                required: true,
                extension: "txt",
                filesize_max: 2
            }
        },
        messages: {
            checkNumberStatusMassaContato: {
                required: "Selecione o arquivo de contato.",
                extension: "Informe um arquivo do tipo txt.",
                filesize_max: "O arquivo selecionado deve ser de no máximo {0} MB."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            event.preventDefault();
            var form = $('#checkNumberStatusMassa-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://10.10.0.210:9000/sistema/checkNumberStatusMult',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function() {
                    $("#checkNumberStatusMassa").html('<i class="fas fa-spinner fa-spin"></i> Checando...');
                },
                success: function(response) {
                    //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                    $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                    var table_success = '';
                    var table_error = '';
                    //
                    if (response.result == 'error' && response.state == 'NOTFOUND') {
                        $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'STARTING') {
                        $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('warning', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'info' && response.state == 'CLOSED') {
                        $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else if (response.result == 'warning' && response.state == 'QRCODE') {
                        $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '../public/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: response.message
                        });
                        //
                    } else {
                        // ITERATING THROUGH OBJECTS 
                        $.each(response.sendResult, function(key, value) {
                            //CONSTRUCTION OF ROWS HAVING 
                            // DATA FROM JSON OBJECT
                            if (value.number) {
                                if (value.status === 200 && value.canReceiveMessage === true) {
                                    table_success += '<tr>';
                                    table_success += '<td>' + value.number + '</td>';
                                    table_success += '<td>Contato pode receber mensagem!</td>';
                                    table_success += '</tr>';
                                } else {
                                    table_error += '<tr>';
                                    table_error += '<td>' + value.number + '</td>';
                                    table_error += '<td>Contato não pode receber mensagem!</td>';
                                    table_error += '</tr>';
                                }
                            }
                        });
                        $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                        //
                        $('#checkNumberStatusMassaModalCentralizado').modal('show');
                        //INSERTING ROWS INTO TABLE
                        $('#table_success').append(table_success);
                        //
                        //INSERTING ROWS INTO TABLE
                        $('#table_error').append(table_error);
                        //
                    }
                },
                error: (e) => {
                    $("#checkNumberStatusMassa").html('<i class="fas fa-paper-plane"></i> Checar');
                    //
                    Lobibox.notify('info', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-info-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: 'Erro interno, menssagem não enviada!'
                    });
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#fileimg").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#fileName-labe").addClass("selected").html(fileName);
        $('#fileName').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextMassaContato").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#sendTextMassaContato-label").addClass("selected").html(fileName);
        $('#filesendTextMassaContato').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendImageMassaContato").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#sendImageMassaContato-label").addClass("selected").html(fileName);
        $('#fileNamesendImageMassaContato').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#FileImageMassa").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#FileImageMassa-label").addClass("selected").html(fileName);
        $('#FileNameImageMassa').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#FileImageGrupo").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#FileImageGrupo-label").addClass("selected").html(fileName);
        $('#FileNameImageGrupo').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#checkNumberStatusMassaContato").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#checkNumberStatusMassaContato-label").addClass("selected").html(fileName);
        $('#filecheckNumberStatusMassaContato').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#BotaoGrupoText").on("click", function() {
        //https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
        let dropdown = $('#TextGrupo');
        dropdown.empty();
        dropdown.append('<option selected="true" disabled>-- Selecione um Grupo --</option>');
        dropdown.prop('selectedIndex', 0);
        var SessionName = $("#SessionName").val();
        $.ajax({
            type: "POST",
            url: 'http://10.10.0.210:9000/sistema/getAllGroups/',
            data: { "SessionName": SessionName },
            //dataType: 'json',
            beforeSend: function() {
                $("#BotaoGrupoText").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function(response) {
                //
                $("#BotaoGrupoText").html('Carregar Grupos');
                //
                $.each(response, function(key, value) {
                    dropdown.append($('<option></option>').attr('value', value.contact.id.user).text(value.contact.name));
                });
            }
        });
    });
    //
    $("#BotaoGrupoImg").on("click", function() {
        //https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json
        let dropdown = $('#ImgGrupo');
        dropdown.empty();
        dropdown.append('<option selected="true" disabled>-- Selecione um Grupo --</option>');
        dropdown.prop('selectedIndex', 0);
        var SessionName = $("#SessionName").val();
        $.ajax({
            type: "POST",
            url: 'http://10.10.0.210:9000/sistema/getAllGroups/',
            data: { "SessionName": SessionName },
            //dataType: 'json',
            beforeSend: function() {
                $("#BotaoGrupoImg").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function(response) {
                //
                $("#BotaoGrupoImg").html('Carregar Grupos');
                //
                $.each(response, function(key, value) {
                    dropdown.append($('<option></option>').attr('value', value.contact.id.user).text(value.contact.name));
                });
            }
        });
    });
    //
    $("#getBlockList").on("click", function() {
        $('#table_success').html('');
        var SessionName = $("#SessionName").val();
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'http://10.10.0.210:9000/sistema/getBlockList',
            data: { "SessionName": SessionName },
            beforeSend: function() {
                $("#getBlockList").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function(response) {
                //console.log(response);
                //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar contatos bloqueados');
                var table_success = '';
                //
                if (response.result == 'error' && response.state == 'NOTFOUND') {
                    $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar Contatos Bloqueados');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'info' && response.state == 'STARTING') {
                    $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar Contatos Bloqueados');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'warning' && response.state == 'QRCODE') {
                    $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar Contatos Bloqueados');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else {
                    var count = 1;
                    // ITERATING THROUGH OBJECTS
                    table_success += '<table id="org_tabela" class="table table-striped table-hover">';
                    table_success += '<thead class="thead-dark">';
                    table_success += '<tr>';
                    table_success += '<th scope="col">#</th>';
                    table_success += '<th scope="col">Numero</th>';
                    table_success += '<th scope="col">Foto Perfil</th>';
                    table_success += '</tr>';
                    table_success += '</thead>';
                    table_success += '<tbody id="table_success"></tbody>';

                    $.each(response.BlockList, function(key, value) {
                        //CONSTRUCTION OF ROWS HAVING 
                        // DATA FROM JSON OBJECT
                        if (value) {
                            var strData = value.toString().replace('@c.us', '');
                            table_success += '<tr>';
                            table_success += '<td>' + count + '</td>';
                            table_success += '<td>' + strData + '</td>';
                            table_success += '<td><img class="img-fluid" src="../public/imagens/sem-foto.jpg" style="width: 28px; height: 28px"></td>';
                            table_success += '</tr>';
                            count++;
                        }
                    });
                    table_success += '</tbody>';
                    table_success += '</table>';
                    $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar Contatos Bloqueados');
                    //
                    table_success += '</table>';
                    //INSERTING ROWS INTO TABLE
                    $('#table_success').html(table_success);
                    //
                }
            },
            error: (e) => {
                $("#getBlockList").html('<i class="fas fa-paper-plane"></i> Listar Contatos Bloqueados');
                //
                Lobibox.notify('info', {
                    title: false,
                    soundPath: '../public/lobibox/sounds/',
                    soundExt: '.ogg',
                    sound: true,
                    iconSource: "fontAwesome",
                    icon: 'fas fa-info-circle',
                    size: 'mini',
                    delay: 5000,
                    msg: 'Erro interno, não foi possivel listar bloqueados!'
                });

            }

        });
    });
    //
    $("#getAllContacts").on("click", function() {
        $('#table_success').html('');
        var SessionName = $("#SessionName").val();
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'http://10.10.0.210:9000/sistema/getAllContacts',
            data: { "SessionName": SessionName },
            beforeSend: function() {
                $("#getAllContacts").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function(response) {
                //console.log(response);
                //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar contatos');
                var table_success = '';
                //
                if (response.result == 'error' && response.state == 'NOTFOUND') {
                    $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar Contatos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'info' && response.state == 'STARTING') {
                    $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar Contatos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'warning' && response.state == 'QRCODE') {
                    $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar Contatos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else {
                    var count = 1;
                    // ITERATING THROUGH OBJECTS
                    table_success += '<table id="org_tabela" class="table table-striped table-hover">';
                    table_success += '<thead class="thead-dark">';
                    table_success += '<tr>';
                    table_success += '<th scope="col">#</th>';
                    table_success += '<th scope="col">Nome</th>';
                    table_success += '<th scope="col">Numero</th>';
                    table_success += '<th scope="col">Foto Perfil</th>';
                    table_success += '</tr>';
                    table_success += '</thead>';
                    table_success += '<tbody id="table_success"></tbody>';

                    $.each(response, function(key, value) {
                        //CONSTRUCTION OF ROWS HAVING 
                        // DATA FROM JSON OBJECT
                        if (value.isMyContact === true) {
                            table_success += '<tr>';
                            table_success += '<td>' + count + '</td>';
                            table_success += '<td>' + value.name + '</td>';
                            table_success += '<td>' + value.id.user + '</td>';

                            if (!value.profilePicThumbObj.eurl) {
                                table_success += '<td><img class="img-fluid" src="../public/imagens/sem-foto.jpg" style="width: 28px; height: 28px"></td>';
                            } else {
                                table_success += '<td><a href="' + value.profilePicThumbObj.eurl + '" target="_blank" ><img class="img-fluid" src="' + value.profilePicThumbObj.eurl + '" style="width: 28px; height: 28px"></a></td>';
                            }

                            table_success += '</tr>';
                            count++;
                        }

                    });
                    table_success += '</tbody>';
                    table_success += '</table>';
                    $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar Contatos');
                    //
                    table_success += '</table>';
                    //INSERTING ROWS INTO TABLE
                    $('#table_success').html(table_success);
                    //
                }
            },
            error: (e) => {
                $("#getAllContacts").html('<i class="fas fa-paper-plane"></i> Listar Contatos');
                //
                Lobibox.notify('info', {
                    title: false,
                    soundPath: '../public/lobibox/sounds/',
                    soundExt: '.ogg',
                    sound: true,
                    iconSource: "fontAwesome",
                    icon: 'fas fa-info-circle',
                    size: 'mini',
                    delay: 5000,
                    msg: 'Erro interno, não foi possivel listar contatos!'
                });

            }

        });
    });
    //
    $("#getAllGroups").on("click", function() {
        $('#table_success').html('');
        var SessionName = $("#SessionName").val();
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: 'http://10.10.0.210:9000/sistema/getAllGroups',
            data: { "SessionName": SessionName },
            beforeSend: function() {
                $("#getAllGroups").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function(response) {
                console.log(response);
                //https://www.geeksforgeeks.org/how-to-fetch-data-from-json-file-and-display-in-html-table-using-jquery/
                $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                var table_success = '';
                //
                if (response.result == 'error' && response.state == 'NOTFOUND') {
                    $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'info' && response.state == 'STARTING') {
                    $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else if (response.result == 'warning' && response.state == 'QRCODE') {
                    $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                    //
                    Lobibox.notify('warning', {
                        title: false,
                        soundPath: '../public/lobibox/sounds/',
                        soundExt: '.ogg',
                        sound: true,
                        iconSource: "fontAwesome",
                        icon: 'fas fa-times-circle',
                        size: 'mini',
                        delay: 5000,
                        msg: response.message
                    });
                    //
                } else {
                    var count = 1;
                    // ITERATING THROUGH OBJECTS
                    table_success += '<table id="org_tabela" class="table table-striped table-hover">';
                    table_success += '<thead class="thead-dark">';
                    table_success += '<tr>';
                    table_success += '<th scope="col">#</th>';
                    table_success += '<th scope="col">Grupo</th>';
                    table_success += '<th scope="col">Foto Grupo</th>';
                    table_success += '</tr>';
                    table_success += '</thead>';
                    table_success += '<tbody id="table_success"></tbody>';

                    $.each(response, function(key, value) {
                        //CONSTRUCTION OF ROWS HAVING 
                        // DATA FROM JSON OBJECT
                        if (value.isGroup === true) {
                            table_success += '<tr>';
                            table_success += '<td>' + count + '</td>';
                            table_success += '<td>' + value.contact.name + '</td>';
                            if (!value.contact.profilePicThumbObj.eurl) {
                                table_success += '<td><img class="img-fluid" src="../public/imagens/sem-foto.jpg" style="width: 28px; height: 28px"></td>';
                            } else {
                                table_success += '<td><a href="' + value.contact.profilePicThumbObj.eurl + '" target="_blank" ><img class="img-fluid" src="' + value.contact.profilePicThumbObj.eurl + '" style="width: 28px; height: 28px"></a></td>';
                            }
                            table_success += '</tr>';
                            count++;
                        }

                    });
                    table_success += '</tbody>';
                    table_success += '</table>';
                    $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                    //
                    table_success += '</table>';
                    //INSERTING ROWS INTO TABLE
                    $('#table_success').html(table_success);
                    //
                }
            },
            error: (e) => {
                $("#getAllGroups").html('<i class="fas fa-paper-plane"></i> Listar Grupos');
                //
                Lobibox.notify('info', {
                    title: false,
                    soundPath: '../public/lobibox/sounds/',
                    soundExt: '.ogg',
                    sound: true,
                    iconSource: "fontAwesome",
                    icon: 'fas fa-info-circle',
                    size: 'mini',
                    delay: 5000,
                    msg: 'Erro interno, não foi possivel listar grupos!'
                });

            }

        });
    });
    //
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    var Cookie = readCookie('mywhats_cookie')
    if (!Cookie) {
        createCookie('mywhats_cookie', uuidv4(), 1);
    }
    //
    var getCookie = readCookie('mywhats_cookie');
    $("#SessionName").val(getCookie);
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    console.log('Cookie:', getCookie);
    //
});
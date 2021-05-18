//
String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.substr(1); }
    //
function cliStatus(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        type: 'POST',
        url: 'http://10.10.0.210:9000/sistema/Status',
        data: {
            SessionName: SessionName
        },
        dataType: 'json',
        beforeSend: function() {},
        success: function(response) {
            console.log(response);
            if (response.Status.result == "error" && response.Status.state == "NOTFOUND") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
                $("#startVenom").html("Desconectado");
                $("#statusVenon").html("Rodando");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            } else if (response.Status.result == "info" && response.Status.state == "STARTING") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Iniciando");
                getHostDevice(dir_link);
            } else if (response.Status.result == "warning" && response.Status.state == "QRCODE") {
                qrcodeVenon(dir_link);
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Ler QR-Code");
                getHostDevice(dir_link);
            } else if (response.Status.result == "success" && response.Status.state == "CONNECTED" && response.Status.status == "chatsAvailable") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Conectado");
                getHostDevice(dir_link);
            } else if (response.Status.result == "success" && response.Status.state == "CONNECTED" && response.Status.status == "isLogged") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Conectado");
                getHostDevice(dir_link);
            } else if (response.Status.result == "success" && response.Status.state == "CONNECTED" && response.Status.status == "qrReadSuccess") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Conectado");
                getHostDevice(dir_link);
            } else if (response.Status.result == "info" && response.Status.state == "CLOSED" && response.Status.status == "notLogged") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Desconectado");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            } else {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
                $("#statusVenon").html("Parado");
                $("#startVenom").html("Desconectado");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            }
        },
        error: function(xhr, textStatus, error) {
            $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
            $("#statusVenon").html("Parado");
            $("#startVenom").html("Desconectado");
            //
            $("#contatoVenon").html("----------");
            $("#waversaoVenon").html("----------");
            $("#bateriaVenon").html("----------");
            $("#sistemaVenon").html("----------");
            $("#carregadorVenon").html("----------");
        }
    });
    //
}
//
function startVenon(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        method: "POST",
        url: 'http://10.10.0.210:9000/sistema/Start',
        data: {
            SessionName: SessionName
        },
        dataType: 'json',
        beforeSend: function() {},
        success: function(response) {
            if (response.Status.result == "info" && response.Status.state == "STARTING") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Iniciando");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            } else {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
                $("#statusVenon").html("Parado");
                $("#startVenom").html("Desconectado");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            }
        },
        error: function(xhr, textStatus, error) {
            $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
            $("#statusVenon").html("Parado");
            $("#startVenom").html("Desconectado");
            //
            $("#contatoVenon").html("----------");
            $("#waversaoVenon").html("----------");
            $("#bateriaVenon").html("----------");
            $("#sistemaVenon").html("----------");
            $("#carregadorVenon").html("----------");
        }
    }).fail(function(jqXHR, textStatus, msg) {
        $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
        $("#statusVenon").html("Rodando");
        $("#startVenom").html("Desconectado");
        //
        $("#contatoVenon").html("----------");
        $("#waversaoVenon").html("----------");
        $("#bateriaVenon").html("----------");
        $("#sistemaVenon").html("----------");
        $("#carregadorVenon").html("----------");
    });
}
//
function closeVenon(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        method: "POST",
        url: 'http://10.10.0.210:9000/sistema/Close',
        data: {
            SessionName: SessionName
        },
        dataType: 'json',
        beforeSend: function() {},
        success: function(response) {
            if (response.Status.result == "success" && response.Status.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
                $("#startVenom").html("Desconectando");
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            } else {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Sucesso">');
                $("#startVenom").html(response.Status.state);
                //
                $("#contatoVenon").html("----------");
                $("#waversaoVenon").html("----------");
                $("#bateriaVenon").html("----------");
                $("#sistemaVenon").html("----------");
                $("#carregadorVenon").html("----------");
            }
        }
    }).fail(function(jqXHR, textStatus, msg) {
        $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-logo-off.png" class="img-fluid" width="160px" alt="Erro">');
        $("#statusVenon").html("Parado");
        $("#startVenom").html("Desconectado");
        //
        $("#contatoVenon").html("----------");
        $("#waversaoVenon").html("----------");
        $("#bateriaVenon").html("----------");
        $("#sistemaVenon").html("----------");
        $("#carregadorVenon").html("----------");
    });
}
//
function qrcodeVenon(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        method: "POST",
        url: 'http://10.10.0.210:9000/sistema/QRCode',
        data: {
            SessionName: SessionName,
            View: false
        },
        dataType: 'json',
        beforeSend: function() {

        },
        success: function(response) {
            console.log(response);
            if (response.getQRCode.result == "success" && response.getQRCode.state == "QRCODE" || response.getQRCode.state == "UNPAIRED" || response.getQRCode.state == "UNPAIRED_IDLE") {
                console.log("Mostrando QR")
                $("#qrcodeVenon").html('<img src="' + response.getQRCode.qrcode + '" class="img-fluid" width="160px" alt="QR-Code">');
            } else {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Sucesso">');
            }
        }
    });
}
//
function getHostDevice(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        method: "POST",
        url: 'http://10.10.0.210:9000/sistema/getHostDevice',
        data: {
            SessionName: SessionName
        },
        dataType: 'json',
        beforeSend: function() {

        },
        success: function(response) {
            //console.log(response)
            if (response.getHostDevice.HostDevice.connected === true) {
                $("#contatoVenon").html(response.getHostDevice.HostDevice.wid.user);
                $("#waversaoVenon").html(response.getHostDevice.HostDevice.phone.wa_version);
                $("#bateriaVenon").html(response.getHostDevice.HostDevice.battery + ' %');
                $("#sistemaVenon").html(response.getHostDevice.HostDevice.platform.capitalize() + ' ' + response.getHostDevice.HostDevice.phone.os_version);
                var carregador = '';
                if (response.getHostDevice.HostDevice.plugged === true) {
                    carregador = 'Conectado';
                } else {
                    carregador = 'Desonectado';
                }
                $("#carregadorVenon").html(carregador);
            } else {

            }
        }
    });
}
//
function RestartService(dir_link) {
    var SessionName = $("#SessionName").val();
    $.ajax({
        method: "POST",
        url: 'http://10.10.0.210:9000/sistema/restartService',
        data: {
            SessionName: SessionName
        },
        dataType: 'json',
        beforeSend: function() {

        },
        success: function(response) {
            if (response.RestartService === true) {
                $("#qrcodeVenon").html('<img src="../public/imagens/whatsapp-bot.png" class="img-fluid" width="160px" alt="Info">');
                $("#statusVenon").html("Rodando");
                $("#startVenom").html("Reiniciando");
            } else {

            }
        }
    });
}
//
// A $( document ).ready() block.
$(document).ready(function() {
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
    //
    setInterval(function() {
        if (dir_local == "pages") {
            cliStatus(dir_link);
        }
    }, 2000);
    //
    $("#starVenon").on("click", function() {
        startVenon(dir_link);
    });
    //
    $("#restarVenon").on("click", function() {
        RestartService(dir_link);
    });
    //
    $("#desconectarVenon").on("click", function() {
        closeVenon(dir_link);
    });
    //
});
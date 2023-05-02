function SalvarModelo() {
    if (ValidaCampos()) {
        var json = [];
        $(".divCampoContrato").each(function () {
            if ($(this).hasClass("tinymce")) {
                $(this).find(".camposSpan").html($(this).find("textarea").val());
                if ($(this).find("textarea").tinymce() != undefined || $(this).find("textarea").tinymce() != null) {
                    $(this).find("textarea").tinymce().remove();
                }
                $(this).find("textarea").hide();
                $(this).find(".camposSpan").show();
            }
            else{
                $(this).find(".camposSpan").text($(this).find(".campoContrato").val());
                $(this).find(".camposSpan").show();
                $(this).find(".campoContrato").hide();
            }

            json.push({
                id: $(this).find(".campoContrato").attr("id"),
                valor: $(this).find(".campoContrato").val()
            });

            if ($(this).find(".campoContrato").hasClass("valorPorExtenso") == true) {
                $(this).find(".camposSpan").text($(this).find(".campoContrato").val() + " (" + numeroPorExtenso($(this).find(".campoContrato").val().split(".").join(""), true) + ")");
            }

            if ($(this).find(".campoContrato").hasClass("numeroPorExtenso") == true) {
                $(this).find(".camposSpan").text($(this).find(".campoContrato").val() + " (" + numeroPorExtenso($(this).find(".campoContrato").val().split(".").join(""), false) + ")");
            }

            if ($("#atividade").val() == 19 && $(this).find(".campoContrato").attr("id") == "ContratoNumero") {
                $("#CodigoContrato").val($(this).find(".campoContrato").val());
            }

            if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7 || $("#atividade").val() == 15 || $("#atividade").val() == 19) {
                if ($(this).find(".campoContrato").attr("id") == "FornecedorContrato") {
                    $("#Fornecedor").val($(this).find(".campoContrato").val());
                } else if ($(this).find(".campoContrato").attr("id") == "FornecedorCGCCFO") {
                    $("#FornecedorCNPJ").val($(this).find(".campoContrato").val());
                }
            }
        });

        $(".btnRemove").closest("td").remove();
        $("#btnAdicionarEquipamento").hide();
        $("#btnRemoverEquipamento").hide();

        var headers = [];
        $("#tabelaEquipamentos").find("thead").find("th").each(function(){
            headers.push($(this).find(".tableHeader").text());
        });
        var jsonEquipamentos = [];
        $("#tabelaEquipamentos").find("tbody").find("tr").each(function(i){
            if ($(this).hasClass("trEquipamento")) {
                var jsonEqp = {
                    row: i,
                    VALUES:[]
                }

                $(this).find("td").each(function(j){
                    jsonEqp.VALUES.push({
                        "Chave": headers[j],
                        "Valor":  $(this).find(".campoTabelaEquipamentos").val()
                    });
                });
                jsonEquipamentos.push(jsonEqp);
            }
        });
        $(".divCampoTabelaEquipamentos").each(function () {
            $(this).find(".campoTabelaEquipamentosSpan").text($(this).find(".campoTabelaEquipamentos").val());
            $(this).find(".campoTabelaEquipamentosSpan").show();
            $(this).find(".campoTabelaEquipamentos").hide();
        });

        if ($("#idContrato").val() == 19 && $("#checkboxOptRemoverEqp").is(":checked")) {
            var headersRemover = [];
            $("#tabelaRemove").find("thead").find("th").each(function(){
                headersRemover.push($(this).text());
            });

            var jsonEquipamentosRemover = [];
            $("#tabelaRemove").find("tbody").find("tr").each(function(i){
                    var jsonEqp = {
                        row: i,
                        VALUES:[]
                    }
    
                    $(this).find("td").each(function(j){
                        jsonEqp.VALUES.push({
                            "Chave": headersRemover[j],
                            "Valor":  $(this).find(".campoTabelaEquipamentos").val()
                        });
                    });
                    jsonEquipamentosRemover.push(jsonEqp);
                
            });

            $("#equipamentosRemover").val(JSON.stringify(jsonEquipamentosRemover));
        }

        $("#equipamentosPreenchidos").val(JSON.stringify(jsonEquipamentos));
        $("#equipamentosRemover").val();
        $(".divCampoContratoData").hide();
        $("#btnSalvar, #divOpcoesContrato").hide();

        if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7 || $("#atividade").val() == 15 || $("#atividade").val() == 19) {
                var list = [];
                $(".camposSpan").each(function(){
                    list.push($(this).html());
                    $(this).html("");
                });
                $("#SalvaHtmlContrato").val($("#htmlContrato").html());

                $(".camposSpan").each(function(i){
                    $(this).html(list[i]);
                });

            $("#valorCamposContrato").val(JSON.stringify(json));

            if ($("#formMode").val() != "VIEW") {
                $("#btnGerarPDF").show();
                $("#btnEditar").show();
            }
            else{
                $("#btnGerarPDF").hide();
                $("#btnEditar").hide();
            }
     

            var listMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            $("#dataContrato").val($("#Dia").val().toLocaleString({ minimumIntegerDigits: 2 }) + "/" + parseInt(listMes.indexOf($("#Mes").val()) + 1).toLocaleString({ minimumIntegerDigits: 2 }) + "/" + $("#Ano").val());
        }
        if (($("#atividade").val() == 15 || $("#atividade").val() == 19) && $("#formMode").val() != "VIEW") {
            $("#btnEditarClausulas, #btnGerarWord").show();
        }
        else {
            $("#tbodyEquipamentos").find("input").attr("readonly", true);
        }

        $("#isContratoSave").val(1);
        ValidaTerminoTabContrato(true);
        if ($("#formMode").val() == "ADD" && [4,1,11,12,19].includes($("#idContrato").val())) {
            VerificaSeNotaDeRemessaNecessaria();
        }
    }
}
function EditarModelo() {
    return new Promise((resolve, reject)=>{
        var hasTinymce = false;

        $(".divCampoContrato").each(function () {
            if ($(this).hasClass("tinymce")) {
                hasTinymce = true;
                $(this).find(".camposSpan").hide();
                $(this).find(".campoContrato").show();
                $(this).find("textarea").tinymce({
                    plugins: "advlist lists table link preview image",
                    toolbar: "table fontsizeselect bold italic underline forecolor backcolor bullist numlist link preview code align", 
                    imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage",
                    language: 'pt_BR',
                }).then(()=>resolve());
            }else{
                $(this).find(".campoContrato").show();
                $(this).find(".camposSpan").hide();
            }
        
            if ($(this).find(".campoContrato").hasClass("valorPorExtenso") == true) {
                $(this).find(".camposSpan").show();
                $(this).find(".camposSpan").text(" (" + numeroPorExtenso($(this).find(".campoContrato").val().split(".").join(""), true) + ")");
            }
        });
        $(".divCampoTabelaEquipamentos").each(function () {
            $(this).find(".campoTabelaEquipamentosSpan").hide();
            $(this).find(".campoTabelaEquipamentos").show();
        });
        $(".trEquipamento").each(function(){
            $(this).append(
            "<td class='tableTd'>\
                <button class='btn btn-primary btnRemove'><i class='flaticon flaticon-trash icon-md'></i></button>\
            </td>");
        });
        $(".btnRemove").on("click", function(){
            $(this).closest("tr").remove();
        });
        $(".divCampoContratoData").show();
    
        $("#btnAdicionarEquipamento").show();
        $("#btnRemoverEquipamento").show();
        $("#btnEditar, #btnEditarClausulas, #btnGerarPDF, #btnGerarWord").hide();
    
        if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7) {
            $("#tbodyEquipamentos").find("input").attr("readonly", false);
        }
        if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7 || $("#atividade").val() == 15 || $("#atividade").val() == 19) {
            $("#divOpcoesContrato").show();
            MostraOpcoesDoModeloDeContrato($("#idContrato").val());
            $("#SalvaHtmlContrato").val("");
            $("#valorCamposContrato").val("");
            $("#btnSalvar").show();
            $("#isContratoSave").val(0);
            ValidaTerminoTabContrato(false);
        }
        if (hasTinymce == false) {
            resolve();
        }
    });
}
function ValidaCampos() {
    var valida = true;
    $(".campoContrato").each(function () {
        if (($(this).val() == undefined || $(this).val() == null || $(this).val() == "") && ($("[name='radioOptAssinatura']:checked").val() != "Eletronica" || ($(this).attr("id") != "nomeFinal1" && $(this).attr("id") != "nomeFinal2" && $(this).attr("id") != "cpfFinal1" && $(this).attr("id") != "cpfFinal2"))) {
            if (($("#atividade").val() != 19 && $(this).attr("id") == "ContratoNumero") || $("#formMode").val() == "VIEW") {
                
            }
            else if ($(this).attr("id") == "cpfFinal2" || $(this).attr("id") == "nomeFinal2") {
                
            }
            else if($("#idContrato").val() == 19 && ($("#divRemover").css("display") == "none" && ($(this).attr("id") == "ValorSelTempoRemove" || $(this).attr("id") == "ValorSelMoedaRemove"))){

            }
            else if($(this).hasClass("campoContratoGFIP") && ($("#selectOptPretacaoServicosGFIP").val() == "Sem GFIP" || ($("#idContrato").val() != 13 && $("#idContrato").val() != 15))){

            }
            else if(($("#idContrato").val() == 20 || $("#idContrato").val() == 24) && (($("#selectOptAditivoLocImovel").val() == "Com reajuste" && $(this).hasClass("campoContratoSemReajusteValor")) || ($("#selectOptAditivoLocImovel").val() == "Sem reajuste" && $(this).hasClass("campoContratoComReajusteValor")))){

            }
            else if($("#idContrato").val() == 19 && (!$("#checkboxOptAcrescentarEqp").is(":checked") && $("#tabelaEquipamentos").has($(this)).length > 0)){

            }
            else if($("#idContrato").val() == 19 && (!$("#checkboxOptRemoverEqp").is(":checked") && $("#tabelaRemove").has($(this)).length > 0)){

            }
            else{
                $(this).addClass("has-error");
                if (valida == true) {
                    FLUIGC.toast({
                        message: "Campo não preenchido.",
                        type: "warning"
                    });
                    console.log($(this).attr("id"));
                    $([document.documentElement, document.body]).animate({
                            scrollTop: $(this).offset().top - (screen.height * 0.15)
                        },700);
                }
                valida = false;
            }
        }
        else if($(this).attr("id") == "Parametro" && $(this).val() == "R$000 x m³ x Km (000) para transporte de material pétreo em geral (Brita, Pó de Brita e Rachão)"){
            $(this).addClass("has-error");
            if (valida == true) {
                FLUIGC.toast({
                    message: "Campo não preenchido.",
                    type: "warning"
                });

                $([document.documentElement, document.body]).animate(
                    {
                        scrollTop: $(this).offset().top - (screen.height * 0.15)
                    },
                    700
                );
            }
            valida = false;
        }
    });

    $(".campoTabelaEquipamentos").each(function(){
        if (($(this).val() == undefined || $(this).val() == null || $(this).val() == "")) {
            $(this).addClass("has-error");
            if (valida == true) {
                FLUIGC.toast({
                    message: "Campo não preenchido.",
                    type: "warning"
                });

                $([document.documentElement, document.body]).animate(
                    {
                        scrollTop: $(this).offset().top - (screen.height * 0.15)
                    },
                    700
                );
            }
            valida = false;
        }
    });  

    if (($("#equipamentosSel").val() == "" && $("#tbodyEquipamentos").find(".checkboxEqp:checked").length < 1) && ($("#tabelaEquipamentos").find("tbody").find("tr").length < 1) && ([4,1,11,12,19].includes($("#idContrato").val())) ) {
        if (valida == true) {
            FLUIGC.toast({
                message: "Nenhum equipamento selecionado!",
                type: "warning"
            });
            $("#atabEquipamentos").click();
        }
        valida = false;
    }
    return valida;
}
function ModeloContrato() {
    return new Promise((res,rej) =>{
        if ($("#atividade").val() != 19) {
            $("#ContratoNumero").attr("readonly", "readonly");
        } else {
            $("#ContratoNumero").removeAttr("readonly");
            $("#ContratoNumero").on("focus", function () {
                if ($(this).val() == "") {
                    $(this).val(criaCodigoCnt($("#hiddenCodColigada").val(), $("#hiddenCODGCCUSTO").val()) + " - " + $("#numProcess").val());
                }
            });
        }
    
        setTimeout(() => {
            $("input.resize").each(function () {
                resizeInput($(this));
            });
        }, 500);
        $("input.campoContrato, select.campoContrato").css("display", "inline-block");
        $("#ContratoNumero").mask("9.9.999-999/99 - 999999");
       
        $(".campoContrato").on("focus", function () {
            $(this).removeClass("has-error");
        });
        $(".cnpj").mask("99.999.999/9999-99");
        $(".cpf").mask("999.999.999-99");
        $(".cnpj").on("blur", function () {
            if (!validarCNPJ($(this).val())) {
                $(this).val("");
                $(this).addClass("has-error");
                FLUIGC.toast({
                    message: "CNPJ inválido.",
                    type: "success"
                });
            }
        });
        $(".cpf").on("blur", function () {
            if (!validaCPF($(this).val())) {
                $(this).val("");
                $(this).addClass("has-error");
                FLUIGC.toast({
                    message: "CPF inválido.",
                    type: "warning"
                });
            }
        });
        $(".CGCCFO").on("blur", function(){
            if (ValidaFornecedor($(this).val()) == false) {
                $(this).val("");
                $(this).addClass("has-error");
                FLUIGC.toast({
                    message: "Fornecedor não encontrado no RM!",
                    type: "warning"
                });
            }
        });
        $(".valorPorExtenso").mask("999.999.999,99", { reverse: true });
        $(".valorPorExtenso").on("change keyup", function(){
            $(this).siblings(".camposSpan").text(" (" + numeroPorExtenso($(this).val().split(".").join(""), true) + ")");
        });
        $(".numeroPorExtenso").on("change keyup", function(){
            $(this).siblings(".camposSpan").text(" (" + numeroPorExtenso($(this).val().split(".").join(""), false) + ")");
        });
        $("#Fornecedor").on("keyup", function () {
            $("#assinaturaFornecedor").text($(this).val());
        });
        $(".campoDia").on("keyup", function () {
            $(this).val(verificaDia($(this).val()));
        });
        $(".campoDia").on("blur", function () {
            if ($(this).val().length == 1) {
                $(this).val("0" + $(this).val());
                $("#hide").css("font-size", $(this).css("font-size"));
                $("#hide").css("font-family", $(this).css("font-family"));
                $("#hide").css("font-weight", $(this).css("font-weight"));
                if ($(this).val() != "") {
                    $("#hide").text($(this).val());
                } else {
                    $("#hide").text($(this).attr("placeholder"));
                }
                $(this).width($("#hide").width());
            }
        });
        $(".campoMes").on("keyup", function(){
            $(this).val(verificaMes($(this).val()));
        });
        $(".campoMes").on("blur", function () {
            if ($(this).val().length == 1) {
                $(this).val("0" + $(this).val());
                $("#hide").css("font-size", $(this).css("font-size"));
                $("#hide").css("font-family", $(this).css("font-family"));
                $("#hide").css("font-weight", $(this).css("font-weight"));
                if ($(this).val() != "") {
                    $("#hide").text($(this).val());
                } else {
                    $("#hide").text($(this).attr("placeholder"));
                }
                $(this).width($("#hide").width());
            }
        });
        $(".campoAno").on("keyup", function () {
            $(this).val(verificaAno($(this).val()));
        });
        $(".campoAno").on("blur", function () {
            if ($(this).val().length < 4 && $(this).val() != "") {
                $(this).val("1900");
                $("#hide").css("font-size", $(this).css("font-size"));
                $("#hide").css("font-family", $(this).css("font-family"));
                $("#hide").css("font-weight", $(this).css("font-weight"));
                if ($(this).val() != "") {
                    $("#hide").text($(this).val());
                } else {
                    $("#hide").text($(this).attr("placeholder"));
                }
                $(this).width($("#hide").width());
            }
        });
        $(".dia").on("change keyup", function () {
            if (parseInt($(this).val()) > 31) {
                $(this).val(31);
            }
            else if (parseInt($(this).val()) < 1) {
                $(this).val(1);
            }
        });
        $(".mes").on("change keyup", function () {
            if (parseInt($(this).val()) > 12) {
                $(this).val(12);
            }
            else if (parseInt($(this).val()) < 1) {
                $(this).val(1);
            }
        });
        $(".ano").on("change keyup", function () {
            if (parseInt($(this).val()) > 2100) {
                $(this).val(2100);
            }
            else if (parseInt($(this).val()) < 1900 && $(this).val().length == 4 ) {
                $(this).val(1900);
            }
        });
        $("input.resize").on("change", function () {
            resizeInput($(this));
        });
        $("#btnAdicionarEquipamento").on("click", ()=>{
            AdicionaLinhaTabelaEquipamentos("tabelaEquipamentos");
        });
        $("#btnRemoverEquipamento").on("click", ()=>{
            AdicionaLinhaTabelaEquipamentos("tabelaRemove");
        });
        $("#DiaPagamento").on("blur", function(){
            if ($(this).val() != 8 && $(this).val() != 18 && $(this).val() != 28) {
                $(this).val("");
                FLUIGC.toast({
                    message: "Pagamento somente nos dias 8, 18 ou 28.",
                    type: "warning"
                });
            }
        });
        var modelo = jsonModelosDeContrato.find(e=>{
            return e.id == $("#idContrato").val();
        });

        if (modelo.equipamentos == "true") {
            if ($("#atividade").val() == 0 || $("#atividade").val() == 7) {
                geraListEquipamentos();
            }
            else{

            }

            $("#atabEquipamentos").closest("li").show();
        }
        else{
            $("#atabEquipamentos").closest("li").hide();
        }


        if ($("#idContrato").val() == 13 || $("#idContrato").val() == 15) {
            if ($("#selectOptPretacaoServicosGFIP").val() == "Com GFIP") {
                $(".clausulaComGFIP").show();
                $(".clausulaSemGFIP").hide();
            }else{
                $(".clausulaSemGFIP").show();
                $(".clausulaComGFIP").hide();
            }
        }
        else if($("#idContrato").val() == 20){
            if ($("#selectOptAditivoLocImovel").val() == "Com reajuste") {
                $(".clausulaComReajusteValor").show();  
                $(".clausulaSemReajusteValor").hide();
            }
            else{
                $(".clausulaComReajusteValor").hide();  
                $(".clausulaSemReajusteValor").show();
            }
        }
        else if($("#idContrato").val() == 19){
            if ($("#checkboxOptAcrescentarEqp").is(":checked")) {
                $("#divAcrescentar").show();
            }
            else{
                $("#divAcrescentar").hide();
            }

            if ($("#checkboxOptRemoverEqp").is(":checked")) {
                $("#divRemover").show();
            }
            else{
                $("#divRemover").hide();
            }
        }

        if ($(".tinymce").length < 1) {
            res();
        }
        else{
            $(".tinymce").each(function(){
                $(this).find("textarea").tinymce({
                    plugins: "advlist lists table link preview image",
                    toolbar: "table fontsizeselect bold italic underline forecolor backcolor bullist numlist link preview code align", 
                    imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage",
                    language: 'pt_BR'
                }).then(()=>{
                    res();
                });
            });
        }
    });
}
async function gerarContrato() {
    var html = $("#SalvaHtmlContrato").val();
    $("#htmlContrato").html(html);
    if ($("[name='radioOptAssinatura']:checked").val() == "Eletronica") {
        $("#divClausulaAssinaturaE").show();
        $("#divClausulaAssinaturaM").hide();

        $(".printavel").each(function (i) {
            if (i == $(".printavel").length - 1) {
                $(this).hide();
            }
        });
    } else {
        $("#divClausulaAssinaturaE").hide();
        $("#divClausulaAssinaturaM").show();
    }
    if ($("#isMobile").val() != "false") {
        $("#htmlContrato").width($(window).width() * 0.9);
        $("#htmlContrato").find(".text").css("padding", "0px");
        $("#rowNContrato").siblings("div").css("margin", "0px");

        /*if (modelo.equipamentos == "true") {
            $("#tabelaEquipamentos>tbody")
            .find("tr")
            .each(function () {
                $(this)
                    .find("td:nth-of-type(7)")
                    .attr("data-before", "Valor " + "(" + $("#selectValorPeriodo").val() + ")");
            });
        }*/
    }
    await InsereValoresNosCampos();
    await EditarModelo();
    await ModeloContrato();
    if (($("#atividade").val() != 15 && $("#atividade").val() != 19 && $("#atividade").val() != 7) || $("#formMode").val() != "MOD") {
        SalvarModelo();
    }
    else{
        MostraOpcoesDoModeloDeContrato($("#idContrato").val());
    }
}
function InsereValoresNosCampos(){
    return new Promise((resolve,reject) =>{
        var jsonValores = JSON.parse($("#valorCamposContrato").val());
        jsonValores.forEach((campo,i)=>{
            
            $("#" + campo.id).val(campo.valor);
            if (i + 1 == jsonValores.length) {
                var modelo = jsonModelosDeContrato.find(e=>{
                    return e.id == $("#idContrato").val();
                });
                if(modelo.equipamentos == "true"){
                    var jsonEqp = JSON.parse($("#equipamentosPreenchidos").val());
                    for (var i = 0; i < jsonEqp.length; i++) {
                        $("#tabelaEquipamentos").find("tbody").find("tr:nth(" + jsonEqp[i].row + ")").each(function(){
                            $(this).find("td").each(function(j){
                                $(this).find(".campoTabelaEquipamentos").val(jsonEqp[i].VALUES[j].Valor);
                                resizeInput($(this).find(".campoTabelaEquipamentos"));
                            });
                        });
                    }
                }
                else{
                    $("#atabEquipamentos").closest("li").hide();
                }

                if ($("#idContrato").val() == 19 && $("#checkboxOptRemoverEqp").is(":checked")) {
                    var jsonEqpRemover = JSON.parse($("#equipamentosRemover").val());
                    for (var i = 0; i < jsonEqpRemover.length; i++) {

                        $("#tabelaRemove").find("tbody").find("tr:nth(" + jsonEqpRemover[i].row + ")").each(function(){
                            $(this).find("td").each(function(j){
                                $(this).find(".campoTabelaEquipamentos").val(jsonEqpRemover[i].VALUES[j].Valor);
                                resizeInput($(this).find(".campoTabelaEquipamentos"));
                            });
                        });
                    }
                }
                resolve();
            }
        });
    });
}
async function salvarHtml() {
    $("#htmlContrato").prop("outerHTML", $("#areaEditarHtml").tinymce().getContent().split("\n").join("").replace('<link href="SolicitacaoDeContratos.css" rel="stylesheet" />', ""));
    $("#htmlContrato").find(".divCampoContrato").css("color", "");
    $("#divEditaHtml, #btnSalvarClausulas").hide();
    await InsereValoresNosCampos();
    await EditarModelo();
    await ModeloContrato();
    OrdenaClausulasContrato();
    SalvarModelo();


    if (($("#atividade").val() == 19 || $("#atividade").val() == 15) && $("#formMode").val() == "MOD") {
        $("#htmlContrato, #btnEditar, #btnEditarClausulas, #btnGerarPDF").show();
    }
}
function editarHtml() {
    $("#htmlContrato").find(".divCampoContrato").css("color", "red");
    $("#areaEditarHtml").val("<link rel='stylesheet' href='SolicitacaoDeContratos.css' />" + $("#htmlContrato")[0].outerHTML);
    $('#areaEditarHtml').tinymce({
        plugins: "advlist lists table link preview image    ",
        toolbar: "table fontsizeselect bold italic underline forecolor backcolor bullist numlist link preview code align", 
        imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage",
        language: 'pt_BR' ,                  
    });

    $("#divEditaHtml, #btnSalvarClausulas").show();
    $("#htmlContrato, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #btnGerarWord").hide();

    setTimeout(() => {
        $([document.documentElement, document.body]).animate({
                scrollTop: $("#divCollapse").offset().top}, 700
        );
    }, 100);
}
function gerarPDF() {
    loading = FLUIGC.loading(window, {
        textMessage: "Gerando PDF",
        title: null,
        css: {
            margin: 0,
            textAlign: "center",
            color: "#000",
            backgroundColor: "#f5f5f5",
            cursor: "wait",
            position: "fixed",
        },
        overlayCSS: {
            paddingTop: "65%",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            opacity: 1,
            cursor: "wait",
        },
        paddingTop: "25%",
        cursorReset: "default",
        baseZ: 1000,
        centerX: true,
        centerY: true,
        timeout: 0,
        showOverlay: true,
        onBlock: montaPDF,
        onUnblock: null,
        ignoreIfBlocked: false,
    });
    loading.show(); //Ativa tela de carregamento
}
function montaPDF(){
    new Promise((resolve, reject)=>{
        console.log("Inicio Promise CriaPDF");
        $("#htmlContrato").css("width", "210mm");
        if ($("#atividade").val() != 19) {
            $("#htmlContrato").addClass("backgroundInvalido");
            var marcaAgua = null 
            toDataURL("images/SEMvalidade2.png", function (dataURL) {
                marcaAgua = dataURL;
            });
            $("#invalidoSrc").show();
        }
    
        var list = [
            html2canvas($("#logo")[0], { scale: 2 }),
            html2canvas($("#rodape")[0], { scale: 2 }),
            html2canvas($("#vercao")[0])
        ];
    
        $(".printavel").each(function (i) {
            if ($(this).attr("id") == "clausulaREIDI" && !$("#checkboxREIDI").is(":checked")) {
            }
            else if ($("input[name='radioOptAssinatura']:checked").val() == "Manual" || $(".printavel").length - 1 != i) {
                list.push(
                    html2canvas($(this)[0], { scale: 1, backgroundColor: null})   
                );
            }
        });
            
        console.log("Vai inicar a Promise.all");
        resolve(Promise.all(list).then((canvas) => {
            console.log("Inicio Promise.all");
            var options = {
                orientation: "p",
                unit: "mm",
                format: "a4",
                compress: true,
            };
            var doc = new jsPDF(options);
            var cabecalho = canvas[0];
            var rodape = canvas[1];
            var vercao = canvas[2];
            var vetor = [];
            
            for (var i = 3; i < canvas.length; i++) {
                vetor.push(canvas[i]);
            }
    
            if ($("#atividade").val() != 19) {
                doc.addImage(marcaAgua, "PNG", 10, 10, 200, 280, undefined, "FAST");
            }
    
            var Atualheight = 295;
            var imgCabecalho = cabecalho.toDataURL("img/png");
            var heightCabecalho = 14;
            var widthCabecalho = (14 * cabecalho.width) / cabecalho.height;
            doc.addImage(imgCabecalho, "PNG", 215 - widthCabecalho, 12, widthCabecalho, heightCabecalho, undefined, "FAST"); //adiciona o cabecalho na página nova
            Atualheight -= heightCabecalho + 12;
            var marginHeight = 295 - Atualheight;
    
            for (var i = 0; i < vetor.length; i++) {
                //Para cada Promise renderizada
                var img = vetor[i].toDataURL("png");
                var height = vetor[i].height;
                var width = vetor[i].width;
                var imgWidth = 210;
                var marginHeight = 295 - Atualheight;
                var imgHeight = (height * imgWidth) / width; //Calcula o Heigth da imagem
                if (Atualheight - imgHeight - 8 < 0) {
                    //Se (Tamanho restante da página - tamanho do conteudo a ser adicionado - 8mm de margem) for menor que 0 cria uma página nova
                    var imgRodape = rodape.toDataURL("img/png");
                    var rodapeWidth = (rodape.width / ($("#my_mm").height() / 100)) * 0.4;
                    var rodapeHeigth = (rodape.height / ($("#my_mm").height() / 100)) * 0.4;
                    doc.addImage(imgRodape, "PNG", (210 - rodapeWidth) / 2, 288, rodapeWidth, rodapeHeigth, undefined, "FAST"); //adiciona o rodape na ultima página
    
                    var imgVercao = vercao.toDataURL("img/png");
                    var vercaoHeigth = 3;
                    var vercaoWidth = 13;
                    doc.addImage(imgVercao, "PNG", 177, 289, vercaoWidth, vercaoHeigth, undefined, "FAST"); //adiciona a versão do documento no final da página
    
                    doc.addPage(); //inicia uma página nova
                    if ($("#atividade").val() != 19) {
                        doc.addImage(marcaAgua, "PNG", 10, 10, 200, 280, undefined, "FAST");
                    }
    
                    Atualheight = 295;
                    var imgCabecalho = cabecalho.toDataURL("img/png");
                    var heightCabecalho = 14;
                    var widthCabecalho = (14 * cabecalho.width) / cabecalho.height;
                    doc.addImage(imgCabecalho, "PNG", 215 - widthCabecalho, 12, widthCabecalho, heightCabecalho, undefined, "FAST"); //adiciona o cabecalho na página nova
                    Atualheight -= heightCabecalho + 18;
                    var marginHeight = 295 - Atualheight;
                }
                doc.addImage(img, "PNG", 0, marginHeight, imgWidth, imgHeight, undefined, "FAST"); //adiciona o conteudo ao pdf
                Atualheight -= imgHeight; //Diminui do restante da pagina o tamanho do conteudo adicionado
            }
            var imgRodape = rodape.toDataURL("img/png");
            var rodapeWidth = (rodape.width / ($("#my_mm").height() / 100)) * 0.4;
            var rodapeHeigth = (rodape.height / ($("#my_mm").height() / 100)) * 0.4;
    
            doc.addImage(imgRodape, "PNG", (210 - rodapeWidth) / 2, 289, rodapeWidth, rodapeHeigth, undefined, "FAST"); //adiciona o rodape na ultima página
    
            var imgVercao = vercao.toDataURL("img/png");
            var vercaoHeigth = 3;
            var vercaoWidth = 13;
            doc.addImage(imgVercao, "PNG", 177, 289, vercaoWidth, vercaoHeigth, undefined, "FAST"); //adiciona a versão na ultima página
            //Gera o nome do pdf
            var nome = "";
            var NMLocadora = $("#FornecedorContrato").val();
            NMLocadora = NMLocadora.replace(" ", "");
            var numero = $("#CodigoContrato").val();
            if (numero != null && numero != "") {
                numero = numero.replace(" - ", "-") + "-";
            } else numero = "";
            if ($("#idContrato").val() == 1) {
                nome = "LocaçãoEquipamentosS.M.O.-";
            } else if ($("#idContrato").val() == 2) {
                nome = "LocaçãoImóvelPessoaFísica-";
            } else if ($("#idContrato").val() == 3) {
                nome = "LocaçãoImóvelPessoaJurídica-";
            } else if ($("#idContrato").val() == 4) {
                nome = "LocaçãoEquipamentosC.M.O.-";
            } else if ($("#idContrato").val() == 5) {
                nome = "LocaçãoDeContainers-";
            } else if ($("#idContrato").val() == 6) {
                nome = "RescisãoDeLocaçãoDeEquipamentosS/M.O.-";
            } else if ($("#idContrato").val() == 7) {
                nome = "RescisãoDeLocaçãoDeEquipamentosC/M.O.-";
            } else if ($("#idContrato").val() == 8) {
                nome = "RescisãoDeLocaçãoDeImóvel-";
            } else if ($("#idContrato").val() == 9) {
                nome = "RescisãoDePrestaçãoDeServiço-";
            } else if ($("#idContrato").val() == 10) {
                nome = "RescisãoDeTransporteDeMateriais-";
            } else if ($("#idContrato").val() == 11) {
                nome = "TransporteDeMateriaisPrecoFixo-";
            } else if ($("#idContrato").val() == 12) {
                nome = "TransporteDeMateriais-";
            } else if ($("#idContrato").val() == 13) {
                nome = "PrestaçãoDeServiçosPorPreçoUnitário-ComRetenção-ComGFIP-";
            } else if ($("#idContrato").val() == 14) {
                nome = "PrestaçãoDeServiçosPorPreçoUnitário-ComRetenção-SemGFIP-";
            } else if ($("#idContrato").val() == 15) {
                nome = "PrestaçãoDeServiços-ValorTotal-ComRetenção-ComGFIP-";
            } else if ($("#idContrato").val() == 16) {
                nome = "PrestaçãoDeServiços-ValorTotal-ComRetenção-SemGFIP-";
            } else if ($("#idContrato").val() == 17) {
                nome = "LocaçãoDeSanitários-";
            } else if ($("#idContrato").val() == 18) {
                nome = "TransporteDeFuncionários-";
            } else if ($("#idContrato").val() == 19) {
                nome = "AditivoLocaçãoDeEquipamentos-";
            } else if ($("#idContrato").val() == 20) {
                nome = "AditivoLocaçãoDeImóvel-";
            } else if ($("#idContrato").val() == 21) {
                nome = "AditivoLocaçãoDeImóvelComReajuste-";
            } else if ($("#idContrato").val() == 22) {
                nome = "AditivoPrestaçãoDeServiços-";
            } else if ($("#idContrato").val() == 23) {
                nome = "AditivoTransporteDeFuncionários-";
            } else if ($("#idContrato").val() == 24) {
                nome = "AditivoLocaçãoDeImóvel-";
            } else if ($("#idContrato").val() == 25) {
                nome = "RescisãoDeLocaçãoDeImóvel-";
            } else {
                console.log("Gerar PDF idContrato invalido");
            }
            nome += NMLocadora;
            nome = numero + nome + ".pdf";
            nome = nome.split("/");
            nome = nome.join("_");
    
            descricao = nome;
    
            const pages = doc.internal.getNumberOfPages();
            doc.setFontSize(8); //Optional
            for (var j = 1; j < pages + 1; j++) {
                doc.setPage(j);
                doc.text(`${j} de ${pages}`, 177, 287);
            }
    
            doc.save(nome); //gera o PDF
            console.log("Fim Promise.all");

            return [doc.output("dataurlstring").substring("28"), nome];
        }));
        console.log("Fim Promise CriaPDF");
    }).then((resultado)=>{
        loading.hide();
        var nome = resultado[1];
        resultado = resultado[0];

        if ($("#atividade").val() == 19) {
            /*var callback = {
                success: function(dataset){
                    if (!dataset || dataset == "" || dataset == null) {
                        throw "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
                    } else {
                        if (dataset.values[0][0] == "false") {
                            throw "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + dataset.values[0][1];
                        } else {
                            console.log("### GEROU docID = " + dataset.values[0].Resultado);
                            $("#bytesPDF").val(dataset.values[0].Resultado);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                }
            }

            var p1 = DatasetFactory.createConstraint("processo", "", "", ConstraintType.MUST);
            var p2 = DatasetFactory.createConstraint("idRM", "", "", ConstraintType.MUST);
            var p3 = DatasetFactory.createConstraint("conteudo", resultado, resultado, ConstraintType.MUST);
            var p4 = DatasetFactory.createConstraint("nome", nome, nome, ConstraintType.MUST);
            var p5 = DatasetFactory.createConstraint("descricao", nome, nome, ConstraintType.MUST);
            var p6 = DatasetFactory.createConstraint("pasta", 140518, 140518, ConstraintType.SHOULD); //Prod
            //var p6 = DatasetFactory.createConstraint("pasta", 17926, 17926, ConstraintType.SHOULD); //Homolog
            DatasetFactory.getDataset("CriacaoDocumentosFluig", null, [p1, p2, p3, p4, p5, p6], null, callback);*/  
        }
        else{
            if ($("#atividade").val() == 0 || $("#atividade").val() == 1) {
                for (var i = 1; i < 19; i++) {
                    $(".printavel").removeClass("backgroundInvalido");
                }
                $("#invalidoSrc").hide();
            }
        }
    });;
}
function AdicionaLinhaTabelaEquipamentos(IdTable){
    var listTh = $("#" + "tabelaEquipamentos").find("thead>tr").find("th");
    var tr = "<tr class='trEquipamento'>";
        for (var i = 0; i < listTh.length; i++) {
            tr += 
            "<td class='tableTd'>\
                <div class='divCampoTabelaEquipamentos' style='display: contents'>\
                    <input type='text' class='campoTabelaEquipamentos resize form-control' style='display: inline-block;'/>\
                        <span class='campoTabelaEquipamentosSpan'></span>\
                </div>\
            </td>";
        }
        tr+= 
        "<td class='tableTd'>\
            <button class='btn btn-primary btnRemove'><i class='flaticon flaticon-trash icon-md'></i></button>\
        </td>"
    tr += "</tr>";
    $("#" + IdTable).find("tbody").append(tr);
    $("#" + IdTable).find("tbody").find("tr:last").find(".btnRemove").on("click", function(){
        $(this).closest("tr").remove();
    });
    $("#" + IdTable).find("tbody").find("tr:last").find(".campoTabelaEquipamentos").on("focus", function () {
        $(this).removeClass("has-error");
    });
    for (var i = 0; i < listTh.length; i++) {
        if ($(listTh[i]).find("span").text().toLowerCase().includes("prefixo")) {
            $("#" + IdTable).find("tbody").find("tr:last").find("td:eq(" + i + ")").find("input").mask('AA99.999', {
                translation: {
                  'Z': {
                    pattern: /[A-Z]|-/, optional: true
                  }
                }
              });
        }
        if ($(listTh[i]).find("span").text().toLowerCase().includes("valor")) {
            $("#" + IdTable).find("tbody").find("tr:last").find("td:eq(" + i + ")").find("input").mask("000.000.000.000,00", { reverse: true });
        }
    }
    $("#" + IdTable).find("tbody").find("tr:last").find("input.resize").each(function () {
        resizeInput($(this));
    });
    $("#" + IdTable).find("tbody").find("tr:last").find("input.resize").on("change", function () {
        resizeInput($(this));
    });
}
function GeraListaEquipamentosSelecionados() {
    var equipamentosSel = $("#equipamentosSel").val();
    var equipamentosPreenchidos = $("#equipamentosPreenchidos").val();
    if (typeof equipamentosSel != "object" && equipamentosSel != "") {
        equipamentosSel = JSON.parse(equipamentosSel);
    }
    if (typeof equipamentosPreenchidos != "object" && equipamentosPreenchidos != "") {
        equipamentosPreenchidos = JSON.parse(equipamentosPreenchidos);
    }

    var countEquipamentosSel = countEquipamentosPreenchidos = 0;

    for (var i = 0; i < equipamentosSel.length + equipamentosPreenchidos.length; i++) {
        var eqpPreen = "";
        if (equipamentosPreenchidos[countEquipamentosPreenchidos] != null && equipamentosPreenchidos[countEquipamentosPreenchidos] != undefined && equipamentosPreenchidos[countEquipamentosPreenchidos] != "") {
            eqpPreen = equipamentosPreenchidos[countEquipamentosPreenchidos];
            if (typeof eqpPreen != "object") {
                eqpPreen = JSON.parse(eqpPreen);
            }
        }
        if (eqpPreen.row == i) {
            console.log(eqpPreen);
            var prefixo = modelo = descricao = placa = fabricante = fornecedor = valorEquipamento = valor = " - ";
            for (var j = 0; j < eqpPreen.VALUES.length; j++) {
                console.log(eqpPreen.VALUES[j].Chave.toLowerCase());
                if (eqpPreen.VALUES[j].Chave.toLowerCase() == "prefixo") {
                    prefixo = eqpPreen.VALUES[j].Valor;
                } 
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "modelo") {
                    modelo = eqpPreen.VALUES[j].Valor;
                } 
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "descricao" || eqpPreen.VALUES[j].Chave.toLowerCase() == "equipamento" || eqpPreen.VALUES[j].Chave.toLowerCase() == "descrição") {
                    descricao = eqpPreen.VALUES[j].Valor;
                }
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "placa" || eqpPreen.VALUES[j].Chave.toLowerCase() == "serie" || eqpPreen.VALUES[j].Chave.toLowerCase() == "placa/serie") {
                    placa = eqpPreen.VALUES[j].Valor;
                }
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "fabricante" || eqpPreen.VALUES[j].Chave.toLowerCase() == "marca") {
                    fabricante = eqpPreen.VALUES[j].Valor;
                }
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "fornecedor") {
                    fornecedor = eqpPreen.VALUES[j].Valor;
                }
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "valor equipamento" || eqpPreen.VALUES[j].Chave.toLowerCase() == "valor do equipamento") {
                    valorEquipamento = eqpPreen.VALUES[j].Valor;
                }
                else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "valor" || eqpPreen.VALUES[j].Chave.toLowerCase() == "valor de locação" || eqpPreen.VALUES[j].Chave.toLowerCase() == "valor locação") {
                    valor = eqpPreen.VALUES[j].Valor;
                }
            }

            var tr = 
            "<tr>\
                <td>" + prefixo + "</td>\
                <td>" + modelo + "</td>\
                <td>" + descricao + "</td>\
                <td>" + placa + "</td>\
                <td>" + fabricante + "</td>\
                <td>" + fornecedor + "</td>\
                <td>" + valorEquipamento + "</td>\
                <td>R$ " + valor + "</td>\
            </tr>";
            
            $("#tbodyListaEquipamentos").append(tr);

            countEquipamentosPreenchidos++;

        }
        else{
            var eqpSel = equipamentosSel[countEquipamentosSel];
            if (typeof eqpSel != "object") {
                eqpSel = JSON.parse(eqpSel);
            }
    
            var tr = "<tr>\
                <td>" + eqpSel.PREFIXO + "</td>\
                <td>" + eqpSel.MODELO + "</td>\
                <td>" + eqpSel.DESCRICAO + "</td>\
                <td>";
            if (eqpSel.PLACA != null && eqpSel.PLACA != "") {
                tr += eqpSel.PLACA;
            } else {
                tr += eqpSel.CHASSI;
            }
            tr += "</td>\
                <td>" + eqpSel.FABRICANTE + "</td>\
                <td>" + eqpSel.FORNECEDOR + "</td>\
                <td>" + FormataValor(eqpSel.VALOR.split(".").join("").replace(",", ".")) + "</td>\
                <td>" + FormataValor(eqpSel.VALORLOCACAO.split(".").join("").replace(",", ".")) + "</td>\
            </tr>";
    
            $("#tbodyListaEquipamentos").append(tr);
            countEquipamentosSel++;
        }
    }
}
function OrdenaClausulasContrato(){
    var count = 0;
    $(".countClausula").each(function(){
        if ($(this).hasClass("clausulaREIDI")) {
            if ($("#selectREIDI").val() == "Sim") {
                count++;
                $(this).text("CLÁUSULA " + count + "ª");    
            }
        }
        else if ($(this).closest(".clausulaSemReajusteValor").length > 0) {
            if ($("#selectOptAditivoLocImovel").val() == "Sem reajuste") {
                count++;
                $(this).text("CLÁUSULA " + count + "ª");
            }
        }
        else{
            count++;
            $(this).text("CLÁUSULA " + count + "ª");    
        }
    });
}
function MostraOpcoesAnexosDoModelo(id){
    var modelo = jsonModelosDeContrato.find(e=>{
        return e.id == id;
    });

    if (modelo.anexos.includes("CNPJ") || modelo.anexos.includes("QSA")) {
        $("#divAnexoFornecedor").show();
    }else{
        $("#divAnexoFornecedor").hide();
    }

    if (modelo.anexos.includes("DocsAdministrador")) {
        $("#divAnexoRepresentante").show();
        if ($("#DocsAdministrador").val() == "RG e CPF") {
            $("#divAnexoRG, #divAnexoCPF").show();
            $("#divAnexoCNH").hide();
        }
        else{
            $("#divAnexoRG, #divAnexoCPF").hide();
            $("#divAnexoCNH").show();
        }
    }else{
        $("#divAnexoRepresentante").hide();
    }

    if (modelo.anexos.includes("NFRemessa")) {
        $("#divAnexoEquipamentos").show();
    }else{
        $("#divAnexoEquipamentos").hide();
    }

    if (modelo.anexos.includes("TermoDeImovel")) {
        $("#divAnexoImovel").show();
    }else{
        $("#divAnexoImovel").hide();
    }

    if (modelo.anexos.includes("Certidoes")) {
        $("#divAnexoCertidoes").show();
    }else{
        $("#divAnexoCertidoes").hide();
    }
}
function gerarWord() {
    $("#divWord").show();
    $("#divWord").html($("#htmlContrato").html());
    $("#divWord").find(".divCampoContrato").each(function () {
        $(this).prop("outerHTML", $(this).find("span.camposSpan").text());
    });
    $("#divWord").find(".divCampoTabelaEquipamentos").each(function () {
        $(this).prop("outerHTML", $(this).find("span.campoTabelaEquipamentosSpan").text());
    });

    var codcoligada = $("#hiddenCodColigada").val()
    BuscaLogoColigada(codcoligada).then(function (url) {
        $("#divWord").find("#CastilhoLogo").attr("src", url);

        $("#divWord").find("#divClausulaColigada").prop("outerHTML", $("#divClausulaColigada").text());
        $("#divWord").find("#logo").find("img").prop("width", $("#divWord").find("#logo").find("img").width());
        $("#divWord").find("#logo").find("img").prop("height", $("#divWord").find("#logo").find("img").height());

        $("#divWord").find("#indices").append("Página <span class='googoose currentpage'></span> de <span class='googoose totalpage'></span>");
        $("#divWord").find("#idContrato").remove();
        $("#divWord").find("#tabelaEquipamentos").attr("cellspacing", 0);
        $("#divWord").find("#tabelaEquipamentos").find("td").each(function () {
            $(this).attr("style", "border:" + $(this).css("border") + "; padding: 0px; margin:0px;");
        });

        var nome = "";
        var NMLocadora = $("#Fornecedor").val();
        NMLocadora = NMLocadora.replace(" ", "");
        var numero = $("#ContratoNumero").val();
        if (numero != null && numero != "") {
            numero = numero.replace(" - ", "-") + "-";
        } else numero = "";

        if ($("#idContrato").val() == 1) {
            nome = "LocaçãoEquipamentosS.M.O.-";
        } else if ($("#idContrato").val() == 2) {
            nome = "LocaçãoImóvelPessoaFísica-";
        } else if ($("#idContrato").val() == 3) {
            nome = "LocaçãoImóvelPessoaJurídica-";
        } else if ($("#idContrato").val() == 4) {
            nome = "LocaçãoEquipamentosC.M.O.-";
        } else if ($("#idContrato").val() == 5) {
            nome = "LocaçãoDeContainers-";
        } else if ($("#idContrato").val() == 6) {
            nome = "RescisãoDeLocaçãoDeEquipamentosS/M.O.-";
        } else if ($("#idContrato").val() == 7) {
            nome = "RescisãoDeLocaçãoDeEquipamentosC/M.O.-";
        } else if ($("#idContrato").val() == 8) {
            nome = "RescisãoDeLocaçãoDeImóvel-";
        } else if ($("#idContrato").val() == 9) {
            nome = "RescisãoDePrestaçãoDeServiço-";
        } else if ($("#idContrato").val() == 10) {
            nome = "RescisãoDeTransporteDeMateriais-";
        } else if ($("#idContrato").val() == 11) {
            nome = "TransporteDeMateriaisPrecoFixo-";
        } else if ($("#idContrato").val() == 12) {
            nome = "TransporteDeMateriais-";
        } else if ($("#idContrato").val() == 13) {
            nome = "PrestaçãoDeServiçosPorPreçoUnitário-ComRetenção-ComGFIP-";
        } else if ($("#idContrato").val() == 14) {
            nome = "PrestaçãoDeServiçosPorPreçoUnitário-ComRetenção-SemGFIP-";
        } else if ($("#idContrato").val() == 15) {
            nome = "PrestaçãoDeServiços-ValorTotal-ComRetenção-ComGFIP-";
        } else if ($("#idContrato").val() == 16) {
            nome = "PrestaçãoDeServiços-ValorTotal-ComRetenção-SemGFIP-";
        } else if ($("#idContrato").val() == 17) {
            nome = "LocaçãoDeSanitários-";
        } else if ($("#idContrato").val() == 18) {
            nome = "TransporteDeFuncionários-";
        } else if ($("#idContrato").val() == 19) {
            nome = "AditivoLocaçãoDeEquipamentos-";
        } else if ($("#idContrato").val() == 20) {
            nome = "AditivoLocaçãoDeImóvel-";
        } else if ($("#idContrato").val() == 21) {
            nome = "AditivoLocaçãoDeImóvelComReajuste-";
        } else if ($("#idContrato").val() == 22) {
            nome = "AditivoPrestaçãoDeServiços-";
        } else if ($("#idContrato").val() == 23) {
            nome = "AditivoTransporteDeFuncionários-";
        } else if ($("#idContrato").val() == 24) {
            nome = "AditivoLocaçãoDeImóvel-";
        } else if ($("#idContrato").val() == 25) {
            nome = "AditivoLocaçãoDeImóvelComReajuste-";
        } else {
            console.log("Gerar PDF idContrato invalido");
        }
        nome += NMLocadora;
        nome = numero + nome + ".doc";
        nome = nome.split("/");
        nome = nome.join("_"); 

        var file = {
            filename: nome
        };

        $(document).googoose(file);

        $("#divWord").find("#indices").text("");

        $("#divWord").hide();
        $("#divWord").html("");
    });
}
function MostraOpcoesDoModeloDeContrato(id){
    $(".divOptLocImovel, .divOptLocEquipamento, .divOptTransporteMaterial, .divOptPretacaoServicos, .divOptAditivoLocEquipamentos, .divOptAditivoLocImovel, .divSelectREIDI, .divOptRescisaoLocImovel").hide();
    $("#divOpcoesContrato").hide();
    var modelo = jsonModelosDeContrato.find(e=>{
        return e.id == id;
    });
    
    if (modelo.opcoesModelo.length > 0 ) {
        $("#divOpcoesContrato").show();

        modelo.opcoesModelo.forEach(e =>{
            $("." + e).show();
        });
    }
    else{
        $("#divOpcoesContrato").hide();
    }

    if ($("#hiddenObra").val() == 'Obra Conserva Echaporã' && $("#tpCont").val() == 1) {
        $("#divSelectREIDI").show();
        $("#divOpcoesContrato").show();
    }
}
function visualizarContrato(id) {
    return new Promise(function (resolve, reject) {
        var campos = [];
        $(".campoContrato").each(function () {
            campos.push({ "id": $(this).attr("id"), "Valor": $(this).val() });
        });

        $.ajax({
            //Requisição do arquivo selecionado
            type: "GET",
            contentType: "application/json",
            url: "/api/public/ecm/document/activedocument/" + id,
            success: function (retorno) {
                if (retorno.content.type == "2") {
                    url = retorno.content.fileURL;
                    $.ajax({
                        async: true,
                        type: "GET",
                        contentType: "txt",
                        url: url,
                        success: function (retorno2) {
                            $("#htmlContrato").html(retorno2);
                            $("#idModeloContrato").val($("#idContrato").val());
                            $("input.campoContrato, select.campoContrato").css("display", "inline-block");

                            for (var i = 0; i < campos.length; i++) {
                                $("#" + campos[i].id).val(campos[i].Valor);
                            }
                            $("#assinaturaFornecedor").text($("#Fornecedor").val());


                            if ($("#atividade").val() == 1 || $("#atividade").val() == 0 || $("#atividade").val() == 7) {
                                $(".checkboxEqp:checked").each(function () {
                                    var id = $(this).attr("id");
                                    id = id.split("checkboxEqp")[1];
                                    var json = JSON.parse($(this).siblings("input").val());
                                    var tr =
                                        "<tr class='linhaEquipamento" + id + "'>\
                                            <td class='tableTd'>" + json.PREFIXO + "</td>\
                                            <td class='tableTd'>" + json.DESCRICAO + "</td>\
                                            <td class='tableTd'>" + json.FABRICANTE + "</td>\
                                            <td class='tableTd'>" + json.MODELO + "</td>\
                                            <td class='tableTd'>" + json.ANO + "</td>\
                                            <td class='tableTd'>";
                                    if (json.PLACA != "") {
                                        tr += json.PLACA;
                                    } else {
                                        tr += json.CHASSIS;
                                    }
                                    tr += "</td>\
                                            <td class='tableTd'>" + FormataValor(json.VALORLOCACAO) + "</td>\
                                        </tr>";
                                    $("#tbody").append(tr);
                                });
                            }
                            else {
                                var values = JSON.parse($("#equipamentosSel").val());
                                for (var i = 0; i < values.length; i++) {
                                    var tr =
                                        "<tr class='linhaEquipamento" + values[i].PREFIXO.replace(".", "") + "'>\
                                            <td class='tableTd'>" + values[i].PREFIXO + "</td>\
                                            <td class='tableTd'>" + values[i].DESCRICAO + "</td>\
                                            <td class='tableTd'>" + values[i].FABRICANTE + "</td>\
                                            <td class='tableTd'>" + values[i].MODELO + "</td>\
                                            <td class='tableTd'>" + values[i].ANO + "</td>\
                                            <td class='tableTd'>";
                                    if (values[i].PLACA != "") {
                                        tr += values[i].PLACA;
                                    } else {
                                        tr += values[i].CHASSIS;
                                    }
                                    tr += "</td>\
                                            <td class='tableTd'>" + FormataValor(values[i].VALORLOCACAO.split(".").join("").replace(",", ".")) + "</td>\
                                        </tr>";
                                    $("#tbody").append(tr);
                                }
                            }

                            if ($("#selectREIDI").val() == "Não") {
                                $("#clausulaREIDI").hide();
                            }
                            else{
                                $("#clausulaREIDI").show();
                            }

                            OrdenaClausulasContrato();
                            BuscaDadosContrato();
                            ModeloContrato();
                            MostraOpcoesAnexosDoModelo($("#idContrato").val());
                            MostraOpcoesDoModeloDeContrato($("#idContrato").val());
                            resolve(true);
                        },
                        error: function (retorno2) {
                            reject(retorno2);
                        }
                    });
                }
            },
            error: function (retorno) {
                reject(retorno);
            }
        });
    });
}
function BuscaDadosContrato() {
    var coligada = $("#hiddenCodColigada").val();
    var retorno = null;

    if ($("#tpCont").val() == 1) {
        retorno = jsonClausulasColigadas.find((obj) => {
            return obj.coligada == coligada;
        });
        $("#divClausulaColigada").html(retorno.clausula);
        $("#logo").html(retorno.logo);
        $("#assinaturaColigada").html(retorno.nome);
        $("#rodape").html(retorno.rodape);
    }
    else if ($("#tpCont").val() == 3) {
        retorno = jsonClausulasColigadasRescisao.find((obj) => {
            return obj.coligada == coligada;
        });

        if ($("#idContrato").val() == 7 || $("#idContrato").val() == 9 || $("#idContrato").val() == 10) {
            $("#divClausulaColigada").html(retorno.nome + " inscrita no CNPJ do MF sob nº " + retorno.CNPJ);
        }
        else if($("#idContrato").val() == 6 || $("#idContrato").val() == 8 || $("#idContrato").val() == 25){
            $("#divClausulaColigada").html(
                "<span style='display: contents'>\
                    <b>" + retorno.nome + "</b>\
                </span>\
                <br>\
                <div style='width: 50px; display: inline-block'></div>\
                    CNPJ:\
                    <span style='display: contents'>\
                        " + retorno.CNPJ + "\
                    </span>\
                </div>");
        }


        $("#logo").html(retorno.logo);
        $("#assinaturaColigada").html(retorno.nome);
        $("#rodape").html(retorno.rodape);
    }
    else if ($("#tpCont").val() == 4) {
        retorno = jsonClausulasColigadasAditivo.find((obj) => {
            return obj.coligada == coligada;
        });
        $("#divClausulaColigada").html(retorno.clausula);
        $("#logo").html(retorno.logo);
        $("#assinaturaColigada").html(retorno.nome);
        $("#rodape").html(retorno.rodape);
    }

  

    var representante = null;
    if (coligada == "6") {
        representante = "Augusto";
    } else if (coligada == "5") {
        representante = "Servulo";
    } else if (coligada == "8") {
        representante = "Augusto";
    } else if (coligada == "9") {
        representante = "Barbieri";
    } else if (coligada == "10") {
        representante = "Barbieri";
    } else {
        if ($("#idContrato").val() == 3 || $("#idContrato").val() == 2) {//Contratos Loc. Imovel
            representante = "Padilha";
        } else {
            if ($("#hiddenCODGCCUSTO").val().split(".")[1] == "3") {//Contratos da Reg. Norte 
                representante = "Marcio";
            }
            else{
                representante = "Augusto";
            }
        }
    }

    representante = jsonRepresentantes.find((obj) => {
        return obj.id == representante;
    });
    $("#divRepresentante").append(representante.Clausula);
}
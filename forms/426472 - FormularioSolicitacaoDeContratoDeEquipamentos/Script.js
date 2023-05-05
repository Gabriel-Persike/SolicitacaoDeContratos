myAutocomplete = null;
loading = null;
$(document).ready(function () {
    console.clear();
    var atividade = $("#atividade").val();
    var formMode = $("#formMode").val();

    if (formMode == "ADD") {
        $("#radioOptAssinaturaAssinado").closest("div").hide();
        dataTable = $("#tableEquipamentos").DataTable({
            pageLength: 50,
            columns: [
                { data: "PREFIXO" },
                { data: "MODELO" },
                { data: "DESCRICAO" },
                {
                    data: "PLACA",
                    render: function (data, type, row) {
                        if (data != "") {
                            return data;
                        } else {
                            return row.CHASSIS;
                        }
                    },
                },
                { data: "FABRICANTE" },
                { data: "FORNECEDOR" },
                {
                    data: "VALORLOCACAO",
                    render: function (data, type, row) {
                        return FormataValor(data);
                    },
                },
                {
                    data: "STATUS",
                    render: function (data, type, row, meta) {
                        if (data == 1) {
                            return "<input type='checkbox' class='checkboxEqp' id='checkboxEqp" + row.PREFIXO.replace(".", "") + "'>\
                            <input type='hidden' value='" + JSON.stringify(row) + "'>";
                        } else if (data == 2) {
                            return "<a target='_blank' class='btn btn-primary' href='http://fluig.castilho.com.br:1010/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + row.IDSOLICITACAO + "'>Em andamento</a>";
                        } else {
                            return "";
                        }
                    },
                },
            ],
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json",
            },
        });
        dataTableContratoPrincipal = $("#tableContratoPrincipal").DataTable({
            pageLength: 50,
            columns: [
                {
                    data: "CODIGOCONTRATO",
                    render: function (data, type, row) {
                        return "<span style='white-space:nowrap'>" + data + "</span>"
                    }
                },
                { data: "FORNECEDOR" },
                { data: "CGCCFO" },
                { data: "DESCRICAOCONTRATO" },
                { data: "TIPOCONTRATO" },
                { data: "STATUS" },
                {
                    render: function (data, type, row) {
                        return "<label style='white-space:nowrap'>\
                                    <input type='checkbox' class='checkboxSelecionaAditivo'>\
                                    Aditivo\
                                </label>";
                    }
                },
                {
                    render: function (data, type, row) {
                        return "<label style='white-space:nowrap'>\
                                    <input type='checkbox' class='checkboxSelecionaRescicao'>\
                                    Rescisão\
                                </label>";
                    }
                }
            ],
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json",
            }
        });
        dataTableContratoPrincipal.on("draw", () => {
            $(".checkboxSelecionaAditivo, .checkboxSelecionaRescicao").on("click", function () {
                if ($(this).is(":checked")) {
                    $(".checkboxSelecionaAditivo, .checkboxSelecionaRescicao").prop("checked", false);
                    $(this).prop("checked", true);
                    var tr = $(this).closest("tr");
                    var row = dataTableContratoPrincipal.row(tr);
                    var values = row.data();
                    $("#JSONContratoPrincipal").val(JSON.stringify(values));

                    if (values.TIPOCONTRATO == "Prestação de Serviços" || values.TIPOCONTRATO == "Prestação de Serviços - Sub-Empreiteiros" || values.TIPOCONTRATO == "Prestação de Serviços - Vigilância" || values.TIPOCONTRATO == "Prestação de Serviços - Sub/Retenção") {
                        if ($(this).hasClass("checkboxSelecionaAditivo")) {
                            $("#tpCont").val(4);
                            //visualizarContrato(22847).then(() => {//Homolog
                            visualizarContrato(514783).then(() => {//Prod
                            });
                        }
                        else {
                            $("#tpCont").val(3);
                            //visualizarContrato(22866).then(() => {//Homolog
                            visualizarContrato(514796).then(() => {//Prod
                            });
                        }
                    }
                    else if (values.TIPOCONTRATO == "Locação de Imóvel") {
                        if ($(this).hasClass("checkboxSelecionaAditivo")) {
                            $("#tpCont").val(4);
                            //visualizarContrato(22850).then(() => {//Homolog
                            visualizarContrato(514784).then(() => {//Prod
                                if ($("#selectOptAditivoLocImovel").val() == "Com reajuste") {
                                    $(".clausulaComReajusteValor").show();  
                                    $(".clausulaSemReajusteValor").hide();
                                }
                                else{
                                    $(".clausulaComReajusteValor").hide();  
                                    $(".clausulaSemReajusteValor").show();
                                }

                            });
                        }
                        else {
                            $("#tpCont").val(3);
                            //visualizarContrato(22864).then(() => {//Homolog
                            visualizarContrato(514794).then(() => {//Prod
                            });
                        }
                    }
                    else if (values.TIPOCONTRATO == "Locação de Equipamentos - S/M.O.") {
                        if ($(this).hasClass("checkboxSelecionaAditivo")) {
                            $("#tpCont").val(4);
                            //visualizarContrato(22851).then(() => {//Homolog
                            visualizarContrato(514793).then(() => {//Prod
                            });
                        }
                        else {
                            $("#tpCont").val(3);
                            //visualizarContrato(22865).then(() => {//Homolog
                            visualizarContrato(514790).then(() => {//Prod
                            });
                        }
                    }
                    else if (values.TIPOCONTRATO == "Locação de Equipamentos - C/M.O.") {
                        if ($(this).hasClass("checkboxSelecionaAditivo")) {
                            $("#tpCont").val(4);
                            //visualizarContrato(22851).then(() => {//Homolog
                            visualizarContrato(514793).then(() => {//Prod
                            });
                        }
                        else {
                            $("#tpCont").val(3);
                            //visualizarContrato(22863).then(() => {//Homolog
                            visualizarContrato(514787).then(() => {//Prod
                            });
                        }
                    }
                    else if (values.TIPOCONTRATO == "Transporte de Material - S/M.O.") {
                        if ($(this).hasClass("checkboxSelecionaAditivo")) {
                            $("#tpCont").val(4);
                            //visualizarContrato(22849).then(() => {//Homolog
                            visualizarContrato(514781).then(() => {//Prod
                            });
                        }
                        else {
                            $("#tpCont").val(3);
                            //visualizarContrato(22867).then(() => {//Homolog
                            visualizarContrato(514782).then(() => {//Prod
                            });
                        }
                    }
                    ValidaTerminoTabContratoPrincipal();
                }
                else {
                    $(this).removeAttr("checked");
                    $("#JSONContratoPrincipal").val("");
                    ValidaTerminoTabContratoPrincipal();
                }
            });
        });

        showPanelAssinaturas();
        BuscaObras();
        CarregaListaAssinantes();

        $("#divCollapse, #btnEditar, #btnGerarPDF, #btnEditarClausulas, #myFileDiv, #divDecisao, #divEditaHtml, #btnSalvarClausulas, #tableEquipamentosListaEquipamentos, #contolAnexaContrato, #divLinhaQuadroStatus, #btnEnviar, #ContratoPDF, #contolAnexaContrato, #btnGerarWord, #avisoContratoAnexado, #divSelectOptSolic, #divListaModelosContrato, #divContratoForaPadrao, #divSelectOptAnexos, #divContratoPrincipal2, #divDownloadModelos").hide();
        $("#atabCamposRM").closest("li").hide();
        $("#atabContratoPrincipal").closest("li").hide();
        $("#inputFileNF").closest("div").hide();
    } else if (formMode == "MOD") {
        $("#tableEquipamentos, #divLinhaQuadroStatus, #myFileDiv, #btnEnviar, #ContratoPDF, #contolAnexaContrato, #divOpcoesContrato, #avisoContratoAnexado, #btnGerarWord, #divSelectOptSolic, #divListaModelosContrato, #divSelectOptAnexos, #divSelectOptSolic, .btnModeloContrato, #divDownloadModelos").hide();
        $("#myFile").closest(".row").hide();
        $("#atabAnexos, #atabAssinatura, #atabCamposRM, #atabContratoPrincipal").closest("li").hide();
        ValidaTerminoTabEquipamentos(true);
        $("#atabContrato").click();
        $("#coltabs").find("li:eq(3)").hide();
        $("#obra").closest("div").hide();

        if ($("#tpCont").val() == 1) {
            $("#divOpcoesContrato, #btnSalvar, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #divContratoForaPadrao, #divEditaHtml, #btnSalvarClausulas, #contolAnexaContrato, #avisoContratoAnexado").hide();
            $("#aTabtabContrato").click();
            gerarContrato();
        }
        else if ($("#tpCont").val() == 2) {
            var div =
                "<div>\
                    <div style='display:inline-block; margin-right:10px;'><label>Fornecedor:</label> " + $("#Fornecedor").val() + "</div>\
                    <div style='display:inline-block; margin-right:10px;'><label>CPF/CNPJ:</label> " + $("#FornecedorCNPJ").val() + "</div>\
                </div>";
            $("#divContratoForaPadrao").find(".panel-body").append(div)

            $("#ContratoPDF").show();
            $("#zoomFornecedor").closest(".row").hide();
            if (atividade == 21 || atividade == 25 || atividade == 27) {
                // BuscaUrlDoc($("#idDocContrato").val());
            }
            else {
                $("#ContratoPDF").hide();
            }
            $("#avisoContratoAnexado").show();
            $("#divHtmlContrato").hide();
        }
        else if ($("#tpCont").val() == 3) {
            $("#divOpcoesContrato, #btnSalvar, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #divContratoForaPadrao, #divEditaHtml, #btnSalvarClausulas, #contolAnexaContrato, #avisoContratoAnexado").hide();
            $("#aTabtabContrato").click();
            $("#atabContratoPrincipal").closest("li").show();

            var values = JSON.parse($("#JSONContratoPrincipal").val());

            var div =
                "<div class='row'>\
                    <div class='col-md-3'>\
                        <label>Codigo: </label>\
                        " + values.CODIGOCONTRATO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Fornecedor: </label>\
                        " + values.FORNECEDOR + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>CNPJ: </label>\
                        " + values.CGCCFO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Descrição: </label>\
                        " + values.DESCRICAOCONTRATO + "\
                        <br><br>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='col-md-3'>\
                        <label>Tipo: </label>\
                        " + values.TIPOCONTRATO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Centro de Custo: </label>\
                        " + values.CODCCUSTO + " - " + values.CCUSTO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Valor Contrato: </label>\
                        " + FormataValor(values.VALORCONTRATO) + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Status: </label>\
                        " + values.STATUS + "\
                        <br><br>\
                    </div>\
                </div>";
            $("#divContratoPrincipal2").find(".panel-body").append(div);
            ValidaTerminoTabContratoPrincipal(true);
            $("#divContratoPrincipal").hide();
            gerarContrato();
            $("#atabContratoPrincipal").show();
        }
        else if ($("#tpCont").val() == 4) {
            $("#divOpcoesContrato, #btnSalvar, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #divContratoForaPadrao, #divEditaHtml, #btnSalvarClausulas, #contolAnexaContrato, #avisoContratoAnexado").hide();
            $("#aTabtabContrato").click();
            $("#atabContratoPrincipal").closest("li").show();

            var values = JSON.parse($("#JSONContratoPrincipal").val());

            var div =
                "<div class='row'>\
                    <div class='col-md-3'>\
                        <label>Codigo: </label>\
                        " + values.CODIGOCONTRATO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Fornecedor: </label>\
                        " + values.FORNECEDOR + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>CNPJ: </label>\
                        " + values.CGCCFO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Descrição: </label>\
                        " + values.DESCRICAOCONTRATO + "\
                        <br><br>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='col-md-3'>\
                        <label>Tipo: </label>\
                        " + values.TIPOCONTRATO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Centro de Custo: </label>\
                        " + values.CODCCUSTO + " - " + values.CCUSTO + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Valor Contrato: </label>\
                        " + FormataValor(values.VALORCONTRATO) + "\
                        <br><br>\
                    </div>\
                    <div class='col-md-3'>\
                        <label>Status: </label>\
                        " + values.STATUS + "\
                        <br><br>\
                    </div>\
                </div>";
            $("#divContratoPrincipal2").find(".panel-body").append(div);
            ValidaTerminoTabContratoPrincipal(true);
            $("#divContratoPrincipal").hide();
            gerarContrato();
            $("#atabContratoPrincipal").show();
        }

        if (($("#equipamentosPreenchidos").val() == "" || $("#equipamentosPreenchidos").val() == null) && ($("#equipamentosSel").val() == "" || $("#equipamentosSel").val() == null) && ($("#alteracoesEquipamentos").val() == "" || $("#alteracoesEquipamentos").val() == null)) {
            $("#atabEquipamentos").closest("li").hide();
        } else {
            GeraListaEquipamentosSelecionados();
            $("#atabEquipamentos").closest("li").show();
        }

        if (atividade == 7) {
            //Inicio
            $("#divDecisao").hide();
            $("#radioOptAssinaturaAssinado").closest("div").hide();
            $("#atabAssinatura").closest("li").show();
            $("#tableEquipamentos").show();
            $("#tableEquipamentosListaEquipamentos").hide();

            CarregaListaAssinantes();
            showPanelAssinaturas();

            dataTable = $("#tableEquipamentos").DataTable({
                pageLength: 50,
                columns: [
                    { data: "PREFIXO" },
                    { data: "MODELO" },
                    { data: "DESCRICAO" },
                    {
                        data: "PLACA",
                        render: function (data, type, row) {
                            if (data != "") {
                                return data;
                            } else {
                                return row.CHASSIS;
                            }
                        },
                    },
                    { data: "FABRICANTE" },
                    { data: "FORNECEDOR" },
                    {
                        data: "VALORLOCACAO",
                        render: function (data, type, row) {
                            return FormataValor(data);
                        },
                    },
                    {
                        data: "STATUS",
                        render: function (data, type, row, meta) {
                            if (data == 1) {
                                return "<input type='checkbox' class='checkboxEqp' id='checkboxEqp" + row.PREFIXO.replace(".", "") + "'>\
                                            <input type='hidden' value='" + JSON.stringify(row) + "'>";
                            } else if (data == 2) {
                                var prefixos = [];


                                var equipamentos = $("#equipamentosSel").val();

                                if (equipamentos != "" && equipamentos != null) {
                                    var equipamentos = JSON.parse(equipamentos);
                                    for (var i = 0; i < equipamentos.length; i++) {
                                        prefixos.push(equipamentos[i].PREFIXO);
                                    }
                                }
                                if (prefixos.includes(row.PREFIXO)) {
                                    return "<input type='checkbox' class='checkboxEqp' id='checkboxEqp" + row.PREFIXO.replace(".", "") + "'>\
                                                     <input type='hidden' value='" + JSON.stringify(row) + "'>"
                                }
                                else {
                                    return "<a target='_blank' class='btn btn-primary' href='http://fluig.castilho.com.br:1010/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + row.IDSOLICITACAO + "'>Em andamento</a>";
                                }

                            } else {
                                return "";
                            }
                        },
                    },
                ],
                language: {
                    url: "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Portuguese-Brasil.json",
                },
            });
            var prefixos = [];
            setTimeout(() => {
                var equipamentos = $("#equipamentosSel").val();
                if (equipamentos != "" && equipamentos != null) {
                    equipamentos = JSON.parse(equipamentos);
                    for (var i = 0; i < equipamentos.length; i++) {
                        console.log("checkboxEqp" + equipamentos[i].PREFIXO);
                        $(".linhaEquipamento" + equipamentos[i].PREFIXO.replace(".", "")).remove();
                        $("#checkboxEqp" + equipamentos[i].PREFIXO.replace(".", "")).click();
                    }
                }
            }, 1500);
            ValidaTerminoTabAssinatura();
            $("#tableEquipamentos").css("width", "100%");
        } else if (atividade == 15) {
            //Juridico
            $("#decisaoContRetornoJuridico, #decisaoContRetornoControl, #decisaoContRetornoObra, #decisaoContEncerramento").closest("div").hide();
            $("#aTabtabCAssinatura").closest("li").hide();

            if ($("#tpCont").val() == 1) {
                $("#btnSalvar, #divOpcoesContrato").show();
            }

        } else if (atividade == 19) {
            //Controladoria
            $("#atabAssinatura").closest("li").show();
            if ($("#tpCont").val() == 1 || $("#tpCont").val() == 2) {
                $("#atabCamposRM").closest("li").show();
            }

            CarregaListaAssinantes();
            showPanelAssinaturas();
            VerificaSeContratoCriadoRm();
            ValidaTerminoTabAssinatura();
            $("#decisaoContRetornoControl, #decisaoContCorrecao").closest("div").hide();
            $("#btnGerarWord").hide();
            $("#btnEnviar").show();
            if ($("#tpCont").val() == 1) {
                $("#btnSalvar, #divOpcoesContrato").show();
            }
            if ($("#codColigada").val() == "") {
                selecionaColigada();
            }
            $("[name='decisaoCont']").on("change", function () {
                if ($(this).val() == 1) {
                    $("#contolAnexaContrato").show();
                } else {
                    $("#contolAnexaContrato").hide();
                }
            });

            if ($("#hiddenCodColigada").val() == "6") {
                $("#selectAssinanteCastilho").val("Augusto Lyra");
            } else if ($("#hiddenCodColigada").val() == "5") {
                $("#selectAssinanteCastilho").val("Servulo Sanches Correa");
            } else if ($("#hiddenCodColigada").val() == "8") {
                $("#selectAssinanteCastilho").val("Augusto Lyra");
            } else if ($("#hiddenCodColigada").val() == "9") {
            } else if ($("#hiddenCodColigada").val() == "10") {
            } else {
                if ($("#idContrato").val() == 3 || $("#idContrato").val() == 2) {//Contratos Loc. Imovel
                    $("#selectAssinanteCastilho").val("Emanuel Mascarenhas Padilha Junior");
                } else {
                    if ($("#hiddenCODGCCUSTO").val().split(".")[1] == "3") {//Contratos da Reg. Norte 
                        $("#selectAssinanteCastilho").val("Marcio Rinaldo Guinossi");
                    }
                    else {
                        $("#selectAssinanteCastilho").val("Augusto Lyra");
                    }
                }
            }
        } else if (atividade == 21) {
            $("#decisaoContRetornoObra, #decisaoContEncerramento, #decisaoContCorrecao").closest("div").hide();
            $("#atabAssinatura").closest("li").show();
            $("#divSelectAssinaturaRepresentante").hide();
            $("#radioOptAssinaturaDigital, #radioOptAssinaturaEletronica, #radioOptAssinaturaAssinado").on("click", function () { return false; });
            ValidaTerminoTabAssinatura();
            ValidaTerminoTabContrato(true);
            ValidaTerminoTabEquipamentos(true);
            if ($("[name='radioOptAssinatura']:checked").val() == "Eletronica") {

                incluiListDiretor();
                var json = JSON.parse($("#jsonAssinaturaEletronica").val());

                for (var i = 0; i < json.length; i++) {
                    var nome = json[i].nome;
                    var email = json[i].email;
                    var cpf = json[i].cpf;
                    InsereCardDeAssinanteNoPainelDeAssinantes(nome + " | " + email + " | " + cpf, "divListAssinantes");
                }

                $("#divListAssinantes").find("button").remove();
                $("#divSelectAssinante").hide();
            }
            else {
                $("#divAssinaturaEletronica").hide();

            }
            ValidaTerminoTabAssinatura(null);

        } else if (atividade == 30) {
            $("#atabAssinatura").closest("li").show();
            $("#divLinhaQuadroStatus").show();
            $("#panelOptAssinaturas").hide();
            inserirLinhaQuadroStatus();
            $("#decisaoContRetornoJuridico, #decisaoContRetornoObra, #decisaoContEncerramento, #decisaoContRetornoControl").closest("div").hide();
        }
        else if ([9, 10, 17, 23, 25, 27].includes(parseInt(atividade))) {
            //Atividades aprovação
            $("#decisaoContRetornoJuridico, #decisaoContRetornoObra, #decisaoContEncerramento, #decisaoContRetornoControl").closest("div").hide();
            ValidaTerminoTabContrato(true);
            ValidaTerminoTabEquipamentos(true);
        }
        else if (atividade == 32 || atividade == 33 || atividade == 34 || atividade == 35) {
            $("#divDecisao").hide();
        }
    } else {
        $("#tableEquipamentos, #divLinhaQuadroStatus, #myFileDiv, #btnEnviar, #ContratoPDF, #contolAnexaContrato, #divOpcoesContrato, #avisoContratoAnexado, #btnGerarWord, #divDecisao, #divSelectOptAnexos, #divSelectOptSolic, .btnModeloContrato, #divDownloadModelos").hide();
        $("#myFile").closest(".row").hide();
        $("#atabAnexos, #atabAssinatura, #atabCamposRM").closest("li").hide();
        GeraListaEquipamentosSelecionados();
        ValidaTerminoTabEquipamentos(true);
        $("#atabContrato").click();
        $("#coltabs").find("li:eq(3)").hide();
        $("#obra").closest("div").hide();
        if ($("#tpCont").val() == 1) {
            $("#divOpcoesContrato, #btnSalvar, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #divContratoForaPadrao, #divEditaHtml, #btnSalvarClausulas, #contolAnexaContrato, #avisoContratoAnexado").hide();
            $("#aTabtabContrato").click();
            gerarContrato();
        }
        else if ($("#tpCont").val() == 4) {
            $("#divOpcoesContrato, #btnSalvar, #btnEditar, #btnEditarClausulas, #btnGerarPDF, #divContratoForaPadrao, #divEditaHtml, #btnSalvarClausulas, #contolAnexaContrato, #avisoContratoAnexado").hide();
            $("#aTabtabContrato").click();
            gerarContrato();
        }
        else {
            $("#divContratoForaPadrao, #ContratoPDF").show();
            if (atividade == 21 || atividade == 23 || atividade == 25 || atividade == 27) {
                //BuscaUrlDoc($("#idDocContrato").val());
                $("#avisoContratoAnexado").show();
                $("#ContratoPDF").hide();
            }
            else {
                $("#avisoContratoAnexado").show();
                $("#ContratoPDF").hide();
            }
            $("#divHtmlContrato").hide();
        }
    }

    if ($("#tpCont").val() == 1 || $("#tpCont").val() == 2) {
        $("#atabContrato").text("Contrato");

    }
    else if ($("#tpCont").val() == 3) {
        $("#atabContrato").text("Rescisão");
    }
    else if ($("#tpCont").val() == 4) {
        $("#atabContrato").text("Aditivo");
    }

    $("[name='decisaoCont']").prop("checked", false);
    $(".campoRM").on("blur", function () {
        ValidaTerminoTabRM();
    });
    $("#selectTipoContrato").on("change", function () {
        $("#atabContratoPrincipal").closest("li").hide();

        if ($(this).val() == "Com Mão de Obra") {
            visualizarContrato(514799).then(function () {//Prod
            //visualizarContrato(22871).then(function () {//Homolog
            }, function (x) {
                FLUIGC.toast({
                    message: x,
                    type: "warning"
                });
            });
            $("#divHtmlContrato").show();
            $("#divContratoForaPadrao").hide();
            $("#tpCont").val(1);
        } else if ($(this).val() == "Sem Mão de Obra") {
            visualizarContrato(514798).then(function () {//Prod
                //visualizarContrato(22869).then(function () {//Homolog

            }, function (x) {
                FLUIGC.toast({
                    message: x,
                    type: "warning"
                });
            });
            $("#htmlContrato").parent().show();
            $("#divContratoForaPadrao").hide();
            $("#tpCont").val(1);
        } else if ($(this).val() == "Transporte de Material") {
            visualizarContrato(514803).then(function () {//Prod
                //visualizarContrato(22872).then(function () {//Homolog
                for (var i = 0; i < campos.length; i++) {
                    $("#" + campos[i].id).val(campos[i].Valor);
                }
                if ($("#atividade").val() == 1 || $("#atividade").val() == 0 || $("#atividade").val() == 7) {
                    $(".checkboxEqp:checked").each(function () {
                        var id = $(this).attr("id");
                        id = id.split("checkboxEqp")[1];
                        var json = JSON.parse($(this).siblings("input").val());
                        var tr =
                            "<tr class='linhaEquipamento" + id + "'>\
                                    <td class='tableTd'>" +
                            json.PREFIXO +
                            "</td>\
                                    <td class='tableTd'>" +
                            json.DESCRICAO +
                            "</td>\
                                    <td class='tableTd'>" +
                            json.FABRICANTE +
                            "</td>\
                                    <td class='tableTd'>";
                        if (json.PLACA != "") {
                            tr += json.PLACA;
                        } else {
                            tr += json.CHASSIS;
                        }
                        tr += "</td>\
                                    <td class='tableTd'>" +
                            json.ANO +
                            "</td>\
                                </tr>";

                        $("#tbody").append(tr);
                    });
                }
                else {
                    var values = JSON.parse($("#equipamentosSel").val());
                    for (var i = 0; i < values.length; i++) {
                        var tr =
                            "<tr class='linhaEquipamento" + id + "'>\
                                    <td class='tableTd'>" +
                            values[i].PREFIXO +
                            "</td>\
                                    <td class='tableTd'>" +
                            values[i].DESCRICAO +
                            "</td>\
                                    <td class='tableTd'>" +
                            values[i].FABRICANTE +
                            "</td>\
                                    <td class='tableTd'>";
                        if (values[i].PLACA != "") {
                            tr += values[i].PLACA;
                        } else {
                            tr += values[i].CHASSIS;
                        }
                        tr += "</td>\
                                    <td class='tableTd'>" +
                            values[i].ANO +
                            "</td>\
                                </tr>";

                        $("#tbody").append(tr);
                    }
                }
            }, function (x) {
                FLUIGC.toast({
                    message: x,
                    type: "warning"
                });
            });
            $("#htmlContrato").parent().show();
            $("#divContratoForaPadrao").hide();
            $("#tpCont").val(1);
        } else if ($(this).val() == "Fretes e Carretos") {
            visualizarContrato(514800).then(function () {//Prod
            //visualizarContrato(22873).then(function () {//Homolog


            }, function (x) {
                FLUIGC.toast({
                    message: x,
                    type: "warning"
                });
            });
            $("#htmlContrato").parent().show();
            $("#divContratoForaPadrao").hide();
            $("#tpCont").val(1);
        } else if ($(this).val() == "Aditivo Locação de Equipamento") {
            visualizarContrato(514793).then(function () {//Prod
                //visualizarContrato(22851).then(function () {//Homolog

                $("#divRemover").hide();
                $("#atabContratoPrincipal").closest("li").show();
                BuscaContratos();
            }, function (x) {
                FLUIGC.toast({
                    message: x,
                    type: "warning"
                });
            });
            $("#htmlContrato").parent().show();
            $("#divContratoForaPadrao").hide();
            $("#tpCont").val(4);
        } else if ($(this).val() == "Fora do padrão Castilho") {
            $("#htmlContrato").parent().hide();
            $("#divContratoForaPadrao").show();
            if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7) {
                $("#myFileDiv").show();
            }
            else {
                $("#myFileDiv").hide();
                $("#avisoContratoAnexado").show();
            }
            $("#tpCont").val(2);
        }
    });
    $("#dataContratoRM").mask("99/99/9999");
    $("#btnGerarPDF").on("click", function () {
        //Funcao gerarPDF bindada no onBlock
        loading = FLUIGC.loading(window, {
            textMessage: "Gerando PDF",
            title: null,
            css: {
                margin: 0,
                textAlign: "center",
                color: "#000",
                backgroundColor: "#f5f5f5",
                cursor: "wait",
                position: "fixed"
            },
            overlayCSS: {
                paddingTop: "65%",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                opacity: 1,
                cursor: "wait"
            },
            paddingTop: "25%",
            cursorReset: "default",
            baseZ: 1000,
            centerX: true,
            centerY: true,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: true,
            onBlock: gerarPDF,
            onUnblock: null,
            ignoreIfBlocked: false
        });
        loading.show();
    });
    $("#btnSalvar").on("click", function () {
        SalvarModelo();
    });
    $("#btnEditar").on("click", function () {
        EditarModelo();
    });
    $("#btnSalvarClausulas").on("click", function () {
        salvarHtml();
    });
    $("#btnEditarClausulas").on("click", function () {
        editarHtml();
    });
    $("#DocsAdministrador").on("change", function () {
        if ($(this).val() == "RG e CPF") {
            $("#inputFileCNH").closest("div.col-md-4").hide();
            $("#inputFileRG").closest("div.col-md-4").show();
            $("#inputFileCPF").closest("div.col-md-4").show();
        } else {
            $("#inputFileCNH").closest("div.col-md-4").show();
            $("#inputFileRG").closest("div.col-md-4").hide();
            $("#inputFileCPF").closest("div.col-md-4").hide();
        }
        ValidaTerminoTabAnexos(null);
    });
    $("[name='radioOptAssinatura']").on("change", function () {
        showPanelAssinaturas();
    });
    $("#codColigada").on("change", function () {
        selecionaColigada();
    });
    $("#codFilial").on("change", function () {
        selecionaFilial();
    });
    $("#codCCusto").on("change", function () {
        $("#codContrato").val(criaCodigoCnt($("#codColigada").val(), $("#codCCusto").val()));
        $("#locEstoque").val($("#locEstoque").find("option:contains('" + $("#codCCusto").find("option:selected").text().split(" - ")[1] + "')")[0].value);
    });
    $("#tipoFaturamentoContratoRM").on("change", function () {
        if ($(this).val() == 1) {
            $("#diaFaturamentoContratoRM,#QtdeFaturamentos").attr("readonly", false);
        }
        else {
            $("#diaFaturamentoContratoRM,#QtdeFaturamentos").attr("readonly", true);
        }
    });
    $("#btnEnviar").on("click", function () {

        loading = FLUIGC.loading(window, {
            textMessage: "Enviando...",
            title: null,
            css: {
                margin: 0,
                textAlign: "center",
                color: "#000",
                backgroundColor: "#f5f5f5",
                cursor: "wait",
                position: "fixed"
            },
            overlayCSS: {
                paddingTop: "65%",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                opacity: 1,
                cursor: "wait"
            },
            paddingTop: "25%",
            cursorReset: "default",
            baseZ: 1000,
            centerX: true,
            centerY: true,
            fadeIn: 200,
            fadeOut: 400,
            timeout: 0,
            showOverlay: true,
            onBlock: EnviaSolicitacao,
            onUnblock: null,
            ignoreIfBlocked: false
        });
        loading.show();
    });
    $("#inputFileContrato").on("change", function () {
        $("#idDocContrato").val("");
        $(this).siblings("div").html($("#inputFileContrato")[0].files[0].name);
    });
    $("#checkboxNFRemessa").on("click", function () {
        if ($(this).is(":checked")) {
            $("#inputFileNF").closest("div").show();
        } else {
            $("#inputFileNF").closest("div").hide();
        }
        ValidaTerminoTabAnexos(null);
    });
    $("#selectAssinanteCastilho").on("change", function () {
        incluiListDiretor();
        ValidaTerminoTabAssinatura(null);
    });
    $("[name='radioOptAssinatura']").on("change", function () {
        ValidaTerminoTabAssinatura();
    });
    $("#btnItensContratoRM").on("click", function () {
        IncluirItemContrato();
    });
    $("#btnGerarWord").on("click", function () {
        gerarWord();
    });
    $("input[type='file']").on("change", function () {
        $("#idDoc" + $(this).attr("id").split("inputFile")[1]).val("");

        if ($(this)[0].files.length == 0) {
            $(this).siblings("div").html("Nenhum arquivo selecionado");
        } else if ($(this)[0].files.length == 1) {
            if ($(this).attr("id") != "inputFileContrato") {
                $(this).siblings("div").html("Carregando...");
                CriaDocFluig($(this).attr("id"));
            }
        } else {
            if ($(this).attr("id") != "inputFileContrato") {
                $(this).siblings("div").html("Carregando...");
                CriaDocFluig($(this).attr("id"));
            }
        }
        ValidaTerminoTabAnexos(null);
    });
    $("#selectREIDI").on("change", function () {
        if ($(this).val() == "Não") {
            $("#clausulaREIDI").hide();
        }
        else {
            $("#clausulaREIDI").show();
        }
        OrdenaClausulasContrato();
    });
    $("#tpCont").on("change", function () {
        if ($(this).val() == 1 || $(this).val() == 2) {
            $("#atabContrato").text("Contrato");
        }
        else if ($(this).val() == 3) {
            $("#atabContrato").text("Rescisão");
        }
        else if ($(this).val() == 4) {
            $("#atabContrato").text("Aditivo");
        }
    });
    $("#obra").on("change", function () {
        $("#obra").closest("div").hide();
        var nm = $(this).val().split(" - ");
        $("#hiddenCodColigada").val(nm[0]);
        $("#hiddenCODGCCUSTO").val(nm[1]);
        $("#hiddenObra").val(nm[2]);
        $("#divSelectOptSolic").show();
        atribuicaoEngCoord();


        /*   $("#divCollapse").show();
           //visualizarContrato(426770).then(function () {//Prod
           visualizarContrato(22871).then(function () {//Homolog
               ModeloContrato();
           });
           geraListEquipamentos();
           $("#tpCont").val(1);
           $("#divContratoForaPadrao").hide();*/
    });
    $("#btnContratoModeloCastilho").on("click", () => {
        $("#divListaModelosContrato").show();
        $("#divSelectOptSolic").hide();
        $("#tpCont").val(1);
    });
    $(".btnModeloContrato").on("click", function () {
        $("#divCollapse").show();
        $("#atabContrato").trigger("click");
        $("#divAnexosImovel, #divAnexosEquipamento, #divAnexosAdministrador").hide();


        switch ($(this).text()) {
            case "Locação de Equipamento":
                $("#modeloContrato").val("Locação de Equipamento");
                //visualizarContrato(22871).then(() => {//Homolog
                visualizarContrato(514799).then(() => {//Prod
                    $("#divAnexosEquipamento, #divAnexosAdministrador").show();
                });
                break;
            case "Locação de Imóvel":
                $("#modeloContrato").val("Locação de Imóvel");
                //visualizarContrato(22870).then(() => {//Homolog
                visualizarContrato(514801).then(() => {//Prod
                    $("#divAnexosImovel").show();
                });
                break;
            case "Prestação de Serviços":
                $("#modeloContrato").val("Prestação de Serviços");
                //visualizarContrato(22877).then(() => {//Homolog
                visualizarContrato(514805).then(() => {//Prod
                    $("#divAnexosImovel").show();
                });
                break;
            case "Transporte de Material":
                $("#modeloContrato").val("Transporte de Material");
                //visualizarContrato(22873).then(() => {//Homolog
                visualizarContrato(514803).then(() => {//Prod

                });
                break;
            case "Transporte de Funcionários":
                $("#modeloContrato").val("Transporte de Funcionários");
                //visualizarContrato(22858).then(() => {//Homolog
                visualizarContrato(514795).then(() => {//Prod

                });
                break;
            case "Locação de Container":
                $("#modeloContrato").val("Locação de Container");
                //visualizarContrato(22860).then(() => {//Homolog
                visualizarContrato(514797).then(() => {//Prod

                });
                break;
            case "Locação de Sanitários":
                $("#modeloContrato").val("Transporte de Sanitários");
                //visualizarContrato(22859).then(() => {//Homolog
                visualizarContrato(514788).then(() => {//Prod

                });
                break;
            default:
                break;
        }
        $("#divListaModelosContrato").hide();
    });
    $("#selectOptLocImovel").on("change", function () {
        if ($(this).val() == "Pessoa Física") {
            //visualizarContrato(22870).then(() => {//Homolog
            visualizarContrato(514801).then(() => {//Prod
            });
        }
        else if ($(this).val() == "Pessoa Jurídica") {
            //visualizarContrato(22870).then(() => {//Homolog
            visualizarContrato(514802).then(() => {//Prod
            });
        }
    });
    $("#selectOptLocEquipamento").on("change", function () {
        if ($(this).val() == "Com Mão de Obra") {
            //visualizarContrato(22871).then(() => {//Homolog
            visualizarContrato(514799).then(() => {//Prod
            });
        }
        else if ($(this).val() == "Sem Mão de Obra") {
            //visualizarContrato(22869).then(() => {//Homolog
            visualizarContrato(514798).then(() => {//Prod
            });
        }
    });
    $("#selectOptPretacaoServicos").on("change", function () {
        if ($(this).val() == "Valor Total") {
            //visualizarContrato(22874).then(() => {//Homolog
            visualizarContrato(514805).then(() => {//Prod
            });
        }
        else if ($(this).val() == "Valor Unitário") {
            //visualizarContrato(22874).then(() => {//Homolog
            visualizarContrato(514804).then(() => {//Prod
            });
        }
    });
    $("#selectOptTransporteMaterial").on("change", function () {
        if ($(this).val() == "Valor Fixo") {
            //visualizarContrato(22872).then(() => {//Homolog
            visualizarContrato(514803).then(() => {//Prod
            });
        }
        else if ($(this).val() == "Valor por Parâmetro") {
            //visualizarContrato(22873).then(() => {//Homolog
            visualizarContrato(514800).then(() => {//Prod
            });
        }
    });
    $("#selectOptAditivoNatLocImovel").on("change", function () {
        if ($(this).val() == "Pessoa Física") {
            //visualizarContrato(22848).then(() => {//Homolog
            visualizarContrato(514784).then(() => {//Prod
                if ($("#selectOptAditivoLocImovel").val() == "Com reajuste") {
                    $(".clausulaComReajusteValor").show();
                    $(".clausulaSemReajusteValor").hide();
                }
                else {
                    $(".clausulaComReajusteValor").hide();
                    $(".clausulaSemReajusteValor").show();
                }
            });
        }
        else if ($(this).val() == "Pessoa Jurídica") {
            //visualizarContrato(22850).then(() => {//Homolog
            visualizarContrato(514785).then(() => {//Prod
                if ($("#selectOptAditivoLocImovel").val() == "Com reajuste") {
                    $(".clausulaComReajusteValor").show();
                    $(".clausulaSemReajusteValor").hide();
                }
                else {
                    $(".clausulaComReajusteValor").hide();
                    $(".clausulaSemReajusteValor").show();
                }
            });
        }
    });
    $("#selectOptRescisaoNatLocImovel").on("change", function () {
        if ($(this).val() == "Pessoa Física") {
            //visualizarContrato(22848).then(() => {//Homolog
            visualizarContrato(537456).then(() => {//Prod
            });
        }
        else if ($(this).val() == "Pessoa Jurídica") {
            //visualizarContrato(22850).then(() => {//Homolog
            visualizarContrato(514794).then(() => {//Prod
            });
        }
    });
    $("#selectOptPretacaoServicosGFIP").on("change", function () {
        if ($(this).val() == "Com GFIP") {
            $(".clausulaComGFIP").show();
            $(".clausulaSemGFIP").hide();
        } else {
            $(".clausulaSemGFIP").show();
            $(".clausulaComGFIP").hide();
        }
    });
    $("#btnContratoForaDoModelo").on("click", function () {
        $("#divSelectOptSolic").hide();
        $("#divCollapse").show();
        $("#atabEquipamentos").closest("li").show();
        geraListEquipamentos();
        $("#atabContrato").trigger("click");
        $("#divSelectOptAnexos").show();
        $("#divOpcoesContrato").hide();
        $("#divHtmlContrato").hide();
        $("#divContratoForaPadrao").show();
        if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7) {
            $("#myFileDiv").show();
        }
        else {
            $("#myFileDiv").hide();
            $("#avisoContratoAnexado").show();
        }
        $("#tpCont").val(2);
        MostraOpcoesAnexosDoModelo(1);
    });
    $("#selectOptAnexos").on("change", function () {
        switch ($(this).val()) {
            case "Locação de Equipamentos":
                MostraOpcoesAnexosDoModelo(1);
                break;
            case "Locação de Imóvel - Pessoa Física":
                MostraOpcoesAnexosDoModelo(2);
                break;
            case "Locação de Imóvel - Pessoa Jurídica":
                MostraOpcoesAnexosDoModelo(3);
                break;
            case "Prestação de Serviço":
                MostraOpcoesAnexosDoModelo(13);
                break;
            case "Transporte de Material":
                MostraOpcoesAnexosDoModelo(12);
                break;
            case "Transporte de Funcionários":
                MostraOpcoesAnexosDoModelo(18);
                break;
            case "Locação de Container":
                MostraOpcoesAnexosDoModelo(5);
                break;
            case "Locação de Sanitários":
                MostraOpcoesAnexosDoModelo(17);
                break;
            default:
                break;
        }
    });
    $("#btnContratoAditivoRescisao").on("click", function () {
        BuscaContratos();
        $("#divSelectOptSolic").hide();
        $("#divCollapse").show();
        $("#atabContratoPrincipal").trigger("click");
        $("#atabContratoPrincipal").closest("li").show();
        $("#atabEquipamentos, #atabAnexos").closest("li").hide();
    });
    $("#selectOptAditivoLocImovel").on("change", function () {
        if ($(this).val() == "Com reajuste") {
            $(".clausulaComReajusteValor").show();
            $(".clausulaSemReajusteValor").hide();
        }
        else {
            $(".clausulaComReajusteValor").hide();
            $(".clausulaSemReajusteValor").show();
        }

        OrdenaClausulasContrato();
    });
    $("#checkboxOptAcrescentarEqp").on("change", function () {
        if ($(this).is(":checked")) {
            $("#divAcrescentar").show();
        }
        else {
            $("#divAcrescentar").hide();
        }
    });
    $("#checkboxOptRemoverEqp").on("change", function () {
        if ($(this).is(":checked")) {
            $("#divRemover").show();
        }
        else {
            $("#divRemover").hide();
        }
    });
    $("#btnDownloadModelos").on("click", function () {
        $("#divSelectOptSolic").hide();
        $("#divDownloadModelos").show();
        baixarModelo();
    });
});
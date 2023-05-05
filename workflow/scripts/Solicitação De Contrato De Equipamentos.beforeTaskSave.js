function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    var atv = getValue("WKNumState");
    var contOk = hAPI.getCardValue("decisaoCont");
    var tpcont = hAPI.getCardValue("tpCont");
    var numProcesso = getValue("WKNumProces");
    var usuarioLogado = getValue("WKUser");
    var comentario = getValue("WKUserComment");
    var coligada = hAPI.getCardValue("codColigada");
    if (atv != nextSequenceId) {
        if (contOk == 1 || atv == 0 || atv == 7 || atv == 34) {
            if (atv == 0 || atv == 1 || atv == 7) {
                //Atividade inicio
                if (tpcont == 2) {
                    AnexarDocumento(hAPI.getCardValue("idDocContrato"));
                }

                var idContrato = hAPI.getCardValue("idModeloContrato");
                if (idContrato == 1 || idContrato == 4 || idContrato == 11 || idContrato == 12 || idContrato == 19 || hAPI.getCardValue("tpCont") == 2) {
                    if (hAPI.getCardValue("alteracoesEquipamentos") != "") {
                        EnviaEmailAlteracaoNoEquipamento();//Prod
                    }
                    if (hAPI.getCardValue("checkboxNFRemessa") == "on") {
                        var idsNF = hAPI.getCardValue("idDocNF").split(",");
                        for (var i = 0; i < idsNF.length; i++) {
                            AnexarDocumento(idsNF[i]);
                        }
                        enviarEmailContabilidade();//Prod
                    }
                    atualizaStatusEquipParaEmAndamento();
                }
                AnexaDocumentosInicio();
            } else if (atv == 79) {
                //Atividade adm obra
                //Anexa o arquivo inserido no type=file #myFile
                AnexarDocumento(hAPI.getCardValue("idDocContrato"));

                //Adiciona um complemento com a data de envio das vias informada no campo #inputDtEnvio
                var data = hAPI.getCardValue("inputDtEnvio");
                if (data == "" || data == null || data == undefined) {
                    throw "A data de envio das vias originais não foi informada.";
                }
                var texto = "Data de envio das vias: " + data;
                hAPI.setTaskComments(usuarioLogado, numProcesso, 0, texto);

                //altera o prazo da atividade 148 para 15 dias após a data informada no campo #inputDtEnvio
                var entrega = hAPI.getCardValue("inputDtEnvio");
                entrega = entrega.split("/");
                var date = new Date(entrega[2], entrega[1] - 1, entrega[0]);
                date.setDate(date.getDate() + 15);
                var dia = date.getDate();
                var mes = date.getMonth() + 1;
                var ano = date.getFullYear();
                if (dia < 10) {
                    dia = "0" + dia;
                }
                if (mes < 10) {
                    mes = "0" + mes;
                }
                var prazo = dia + "/" + mes + "/" + ano;
                hAPI.setCardValue("dataExpira", prazo);
            } else if (atv == 19) {
                //Atividade Controladoria
                if (contOk == 1) {
                    AnexarDocumento(hAPI.getCardValue("idDocContrato")); //Anexa na solicitação o contrato gerado ou o arquivo inserido
                    if (coligada != 0 && hAPI.getCardValue("idCntRm") == "") {
                        //Realiza integração com o RM na atividade controladoria
                        exportarContratoProRM();
                    }


                    if (tpcont == 3) {
                        AtualizaStatusContrato("11");
                    }
                    AnexaDocumentosInicio();

                    if (hAPI.getCardValue("radioOptAssinatura") == "Assinado") {
                        atualizaStatusEquipParaEmVigencia();
                    }
                }
            } else if (atv == 21) {
                if (contOk == 1) {
                    if (hAPI.getCardValue("radioOptAssinatura") == "Eletronica") {
                        CriaAssinaturaEletronica();
                    }
                }
            } else if (atv == 30 || atv == 34) {
                if (contOk == 1) {
                    atualizaStatusEquipParaEmVigencia();
                }
                if (tpcont == 3) {
                    AtualizaStatusContrato("03");
                }
            }
        } else {
            //Verifica se caso a solicitação sejá enviada para correção um complemento informando a alteração foi adicionado
            if (atv == 9 || atv == 10 || atv == 19 || atv == 15 || atv == 122 || atv == 64 || atv == 17 || atv == 21 || atv == 23 || atv == 25 || atv == 27 || atv == 177 || atv == 30) {
                // && (contOk == 2 || contOk == 3))
                if (comentario == "") {
                    throw "Obrigatório informar um Complemento com a alteração necessária.";
                }
            }
        }
    }
    else {
        if ((hAPI.getCardValue("tpCont") == 1 || hAPI.getCardValue("tpCont") == 4) && (hAPI.getCardValue("isContratoSave") != 1 || hAPI.getCardValue("SalvaHtmlContrato") == "" || hAPI.getCardValue("valorCamposContrato") == "")) {
            throw "Necessário salvar o contrato.";
        }
    }
}

function AnexaDocumentosInicio() {
    var tpCont = hAPI.getCardValue("tpCont");
    var atividade = getValue("WKNumState");
    if (atividade == 19 || ((atividade == 0 || atividade == 1 || atividade == 7) && tpCont == 2)) {
        AnexarDocumento(hAPI.getCardValue("idDocContrato"));
    }

    if (hAPI.getCardValue("idDocCNPJ") != "" && hAPI.getCardValue("idDocCNPJ") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocCNPJ"));
    }
    if (hAPI.getCardValue("idDocQSA") != "" && hAPI.getCardValue("idDocQSA") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocQSA"));
    }
    if (hAPI.getCardValue("idDocNF") != "" && hAPI.getCardValue("idDocNF") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocNF"));
    }
    if (hAPI.getCardValue("idDocCPF") != "" && hAPI.getCardValue("idDocCPF") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocCPF"));
    }
    if (hAPI.getCardValue("idDocRG") != "" && hAPI.getCardValue("idDocRG") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocRG"));
    }
    if (hAPI.getCardValue("idDocCNH") != "" && hAPI.getCardValue("idDocCNH") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocCNH"));
    }
    if (hAPI.getCardValue("idDocCertidoes") != "" && hAPI.getCardValue("idDocCertidoes") != null) {
        var ids = hAPI.getCardValue("idDocCertidoes").split(",");
        for (var i = 0; i < ids.length; i++) {
            AnexarDocumento(ids[i]);
        }
    }
    if (hAPI.getCardValue("idDocTermoDeImovel") != "" && hAPI.getCardValue("idDocTermoDeImovel") != null) {
        AnexarDocumento(hAPI.getCardValue("idDocTermoDeImovel"));
    }
    if (hAPI.getCardValue("idDocOutros") != "" && hAPI.getCardValue("idDocOutros") != null) {
        var ids = hAPI.getCardValue("idDocOutros").split(",");
        for (var i = 0; i < ids.length; i++) {
            AnexarDocumento(ids[i]);
        }
    }

    /*
    
        if (atividade == 0 || atividade == 1 || atividade == 7) {
            var idContrato = hAPI.getCardValue("idModeloContrato");
    
            if (idContrato == 1 || idContrato == 3 || idContrato == 4 || idContrato == 5 || idContrato == 11 || idContrato == 12 || idContrato == 13 || idContrato == 14 || idContrato == 15 || idContrato == 16 || idContrato == 17 || idContrato == 18) {
                AnexarDocumento(hAPI.getCardValue("idDocCNPJ"));
                AnexarDocumento(hAPI.getCardValue("idDocQSA"));
            }
    
            if (idContrato == 1 || idContrato == 2 || idContrato == 4 || idContrato == 5 || idContrato == 11 || idContrato == 12 || idContrato == 13 || idContrato == 14 || idContrato == 15 || idContrato == 16 || idContrato == 17 || idContrato == 18) {
                var DocsAdministrador = hAPI.getCardValue("DocsAdministrador");
                if (DocsAdministrador == "RG e CPF") {
                    AnexarDocumento(hAPI.getCardValue("idDocCPF"));
                    AnexarDocumento(hAPI.getCardValue("idDocRG"));
                } else if (DocsAdministrador == "CNH") {
                    AnexarDocumento(hAPI.getCardValue("idDocCNH"));
                }
            }
    
            var outros = hAPI.getCardValue("idDocOutros");
            if (outros != null && outros != "") {
                outros = outros.split(",");
                for (var i = 0; i < outros.length; i++) {
                    AnexarDocumento(outros[i]);
                }
            }
        }*/
}

function CriaAssinaturaEletronica() {
    if (hAPI.getCardValue("idDocContrato") != undefined && hAPI.getCardValue("idDocContrato") != null && hAPI.getCardValue("idDocContrato") != "") {
        var docs = hAPI.listAttachments();
        for (var i = 0; i < docs.size(); i++) {
            var doc = docs.get(i);
            if (doc.getDocumentId() == hAPI.getCardValue("idDocContrato")) {


                var arrSigners = JSON.parse(hAPI.getCardValue("jsonAssinaturaEletronica"));
                var ds = DatasetFactory.getDataset("ds_vertsign_assinantes", null, [
                    DatasetFactory.createConstraint("nome", hAPI.getCardValue("selectAssinanteCastilho"), hAPI.getCardValue("selectAssinanteCastilho"), ConstraintType.MUST)
                ], null);
                arrSigners.push({
                    nome: ds.getValue(0, "nome"),
                    email: ds.getValue(0, "email"),
                    cpf: ds.getValue(0, "cpf"),
                    tipo: "E",
                    status: "Pendente",
                });

                var IdArquivo = doc.getDocumentId();
                var versaoArquivo = doc.getVersion();
                var NomeArquivo = doc.getDocumentDescription();
                var CodRemetente = hAPi.getCardValue("solicitante");
                
                var ds = DatasetFactory.getDataset("ds_auxiliar_wesign", null, [
                    DatasetFactory.createConstraint("nmArquivo", NomeArquivo, NomeArquivo, ConstraintType.MUST),
                    DatasetFactory.createConstraint("codArquivo", IdArquivo, IdArquivo, ConstraintType.MUST),
                    DatasetFactory.createConstraint("vrArquivo", versaoArquivo, versaoArquivo, ConstraintType.MUST),
                    DatasetFactory.createConstraint("codPasta", "140518", "140518", ConstraintType.MUST),
                    DatasetFactory.createConstraint("codRemetente", CodRemetente, CodRemetente, ConstraintType.MUST),
                    DatasetFactory.createConstraint("nmRemetente", BuscaNomeUsuario(CodRemetente), BuscaNomeUsuario(CodRemetente), ConstraintType.MUST),
                    DatasetFactory.createConstraint("status", "Enviando para assinatura", "Enviando para assinatura", ConstraintType.MUST),
                    DatasetFactory.createConstraint("metodo", "create", "create", ConstraintType.MUST),
                    DatasetFactory.createConstraint("jsonSigners", JSONUtil.toJSON(arrSigners), JSONUtil.toJSON(arrSigners), ConstraintType.MUST),
                    DatasetFactory.createConstraint("numSolic", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST)
                ], null);

                if (ds.getValue(0, "Result") == "OK") {
                    return true;
                }
                else {
                    log.error(ds.getValue("Erro ao enviar Assinatura Eletronica"));
                    log.error(ds.getValue(0, "mensagem"));
                    throw "Erro ao Criar a Assinatura Eletrôncia!";
                }
            }
        }
    }
}

function AnexarDocumento(id) {
    var attachments = hAPI.listAttachments();
    var isAnexado = false;

    for (var i = 0; i < attachments.size(); i++) {
        if (id == attachments.get(i).getDocumentId()) {
            isAnexado = true;
        }
    }

    if (!isAnexado) {
        hAPI.attachDocument(id);
    }
}

function atualizaStatusEquipParaEmAndamento() {
    var json = hAPI.getCardValue("equipamentosSel");

    if (json != "" && json != null) {
        json = JSON.parse(json);
        for (var i = 0; i < json.length; i++) {
            var c1 = DatasetFactory.createConstraint("OPERACAO", "STATUSPARAANDAMENTO", "STATUSPARAANDAMENTO", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("JSONEQUIPAMENTO", JSON.stringify(json[i]), JSON.stringify(json[i]), ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("IDSOLICITACAO", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST);
            var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2, c3], null);
            log.info("retornoCadastroEquipamentos: " + ds.values[1][0]);
            if (ds.values[1][0] != "com.microsoft.sqlserver.jdbc.SQLServerException: A instrução não retornou um conjunto de resultados.") {
                log.info("Erro: " + ds.values[1][0]);
                log.info("Query: " + ds.values[1][0]);

                throw "Erro ao alterar o status do equipamento: " + ds.values[1][0];
            }
        }
    }
}

function atualizaStatusEquipParaEmVigencia() {
    var json = hAPI.getCardValue("equipamentosSel");

    if (json != "" && json != null) {
        json = JSON.parse(json);
        for (var i = 0; i < json.length; i++) {
            var c1 = DatasetFactory.createConstraint("OPERACAO", "STATUSPARAVIGENCIA", "STATUSPARAVIGENCIA", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("JSONEQUIPAMENTO", JSON.stringify(json[i]), JSON.stringify(json[i]), ConstraintType.MUST);
            var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);

            if (ds.values[1][0] != "com.microsoft.sqlserver.jdbc.SQLServerException: A instrução não retornou um conjunto de resultados.") {
                log.info("Erro: " + ds.values[1][0]);
                log.info("Query: " + ds.values[2][0]);

                throw "Erro ao alterar o status do equipamento: " + ds.values[1][0];
            }
        }
    }
}

function BuscaFornecedor() {
    var c1 = DatasetFactory.createConstraint("CGCCFO", hAPI.getCardValue("FornecedorCNPJ"), hAPI.getCardValue("FornecedorCNPJ"), ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("EnderecoFornecedor", null, [c1], null);
    return ds;
}

function BuscaLocalDeEstoque() {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaLocEstoque", "BuscaLocEstoque", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("LOCALESTOQUE", hAPI.getCardValue("hiddenObra"), hAPI.getCardValue("hiddenObra"), ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2], null);
    return ds;
}

function enviarEmailContabilidade() {
    try {
        if (hAPI.getCardValue("checkboxNFRemessa") == "on") {
            subject = "[FLUIG] Novo contrato de locação de equipamento com nota fiscal de remessa!";
            mensagem = "Novo contrato de locação de equipamento com nota fiscal de remessa!";
        }
        else {
            subject = "[FLUIG] Novo contrato de locação de equipamento sem nota fiscal de remessa!";
            mensagem = "Novo contrato de locação de equipamento sem nota fiscal de remessa!";
        }
        var fornecedor = BuscaFornecedor();
        var obra = hAPI.getCardValue("hiddenObra");
        var localEstoque = BuscaLocalDeEstoque();


        var htmlEmail =
            "<h3>Contrato</h3>\
        <b>Tipo de Contrato: </b><span>" + hAPI.getCardValue("modeloContrato") + "</span><br>\
        <b>Fornecedor: </b><span>" + fornecedor.getValue(0, "NOMEFANTASIA") + "</span><br>\
        <b>Origem/Fornecedor: </b><span>" + fornecedor.getValue(0, "CIDADE") + " - " + fornecedor.getValue(0, "CODETD") + "</span><br>\
        <b>Destino/Obra: </b><span>" + obra;
        if (localEstoque.getValue(0, "CIDADE") != null && localEstoque.getValue(0, "CIDADE") != "" && localEstoque.getValue(0, "CIDADE") != "   -   ") {
            htmlEmail += " - " + localEstoque.getValue(0, "CIDADE");
        }
        if (localEstoque.getValue(0, "CODETD") != null && localEstoque.getValue(0, "CODETD") != "" && localEstoque.getValue(0, "CODETD") != "   -   ") {
            htmlEmail += " - " + localEstoque.getValue(0, "CODETD");
        }
        "</span><br><br>";


        htmlEmail += "<h3>Equipamentos</h3>";


        var equipamentosSel = hAPI.getCardValue("equipamentosSel");
        if (equipamentosSel != "" && equipamentosSel != null) {
            equipamentosSel = JSON.parse(equipamentosSel);
            for (var i = 0; i < equipamentosSel.length; i++) {
                htmlEmail +=
                    "<div>\
                <b>Prefixo: </b><span>" + equipamentosSel[i].PREFIXO + "</span>\
                <br>\
                <b>Fabricante: </b><span>" + equipamentosSel[i].FABRICANTE + "</span>\
                <br>\
                <b>Equipamento: </b><span>" + equipamentosSel[i].DESCRICAO + "</span>\
                <br>\
                <b>Placa: </b><span>" + equipamentosSel[i].PLACA + "</span>\
                <br>\
                <b>Valor: </b><span>" + FormataMoeda(equipamentosSel[i].VALOR.split(".").join("").replace(",", ".")) + "</span>\
                <br><br>\
            </div>";
            }

        }

        var equipamentosPreenchidos = hAPI.getCardValue("equipamentosPreenchidos");
        if (equipamentosPreenchidos != "" && equipamentosPreenchidos != null) {
            equipamentosPreenchidos = JSON.parse(equipamentosPreenchidos);
            //log.info(equipamentosPreenchidos[0].VALUES.find(eqp => eqp.Chave == "Prefixo").Valor);
            for (var i = 0; i < equipamentosPreenchidos.length; i++) {
                var eqpPreen = equipamentosPreenchidos[i];

                var prefixo = modelo = descricao = placa = fabricante = fornecedor = valorEquipamento = valor = " - ";
                for (var j = 0; j < eqpPreen.VALUES.length; j++) {
                    if (eqpPreen.VALUES[j].Chave.toLowerCase() == "prefixo") {
                        prefixo = eqpPreen.VALUES[j].Valor;
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
                    else if (eqpPreen.VALUES[j].Chave.toLowerCase() == "valor equipamento" || eqpPreen.VALUES[j].Chave.toLowerCase() == "valor do equipamento" || eqpPreen.VALUES[j].Chave.toLowerCase() == "valor") {
                        valorEquipamento = eqpPreen.VALUES[j].Valor;
                    }
                }

                htmlEmail +=
                    "<div>\
                    <b>Prefixo: </b><span>" + prefixo + "</span>\
                    <br>\
                    <b>Fabricante: </b><span>" + fabricante + "</span>\
                    <br>\
                    <b>Equipamento: </b><span>" + descricao + "</span>\
                    <br>\
                    <b>Placa: </b><span>" + placa + "</span>\
                    <br>\
                    <b>Valor: </b><span>" + 'R$' + valorEquipamento + "</span>\
                    <br><br>\
                </div>";
            }
        }

        var anexos = [];
        var idAnexos = hAPI.getCardValue("idDocNF").split(",");
        for (var j = 0; j < idAnexos.length; j++) {
            log.info("idAnexos: " + parseInt(idAnexos[j]));
            log.info(fluigAPI.getDocumentService().getActive(parseInt(idAnexos[j])).getDocumentDescription());
            anexos.push({
                "link": fluigAPI.getDocumentService().getDownloadURL(parseInt(idAnexos[j])),
                "description": fluigAPI.getDocumentService().getActive(parseInt(idAnexos[j])).getDocumentDescription()
            });
        }

        var params = {
            "SERVER_URL": "http://fluig.castilho.com.br:1010",
            "TENANT_ID": '1',
            "EQUIPAMENTOS": htmlEmail,
            "SOLICITACAO": getValue("WKNumProces").toString().replace(".", ""),
            "MENSAGEM": mensagem,
            "subject": subject,
            "anexos": anexos
        }

        var data = {
            companyId: getValue("WKCompany").toString(),
            serviceCode: 'ServicoFluig',
            endpoint: '/api/public/alert/customEmailSender',
            method: 'post', // 'delete', 'patch', 'post', 'get'                                        
            timeoutService: '100', // segundos
            params: {
                to: 'gabriel.persike@castilho.com.br; nfcc@castilho.com.br; ' + BuscaEmailUsuario(getValue("WKUser")),//Prod
                //to: 'gabriel.persike@castilho.com.br; ' + BuscaEmailUsuario(getValue("WKUser")),//Homolog
                from: "fluig@construtoracastilho.com.br", //Prod
                //from: "no-reply@construtoracastilho.com.br", //Homolog
                subject: subject,
                templateId: "TPL_EQUIPAMENTOS_NF_REMESSA.html",
                dialectId: "pt_BR",
                param: params
            }
        }

        var clientService = fluigAPI.getAuthorizeClientService();
        var vo = clientService.invoke(JSONUtil.toJSON(data));

        if (vo.getResult() == null || vo.getResult().isEmpty()) {
            throw "Retorno está vazio";
        } else {
            log.info(vo.getResult());
        }
    } catch (error) {
        throw "Erro ao enviar e-mail da NF de remessa: " + error;
    }
}

function exportarContratoProRM() {
    var contexto = "CODSISTEMA=G;CODCOLIGADA=" + hAPI.getCardValue("codColigada") + ";CODUSUARIO=fluig";
    var url = "Contrato: " + hAPI.getCardValue("servidor") + "/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + getValue("WKNumProces");

    var Nome = hAPI.getCardValue("descContrato");
    if (Nome.length() > 40) {
        Nome = Nome.substring(0, 40);
    }

    var idCnt = hAPI.getCardValue("idCnt");
    if (idCnt == "" || idCnt == null || idCnt != undefined) {
        var idCnt = -1;
    }
    var coligada = hAPI.getCardValue("codColigada");
    var filial = hAPI.getCardValue("codFilial");
    var tipoContrato = hAPI.getCardValue("tipoContrato");
    var codNatureza = hAPI.getCardValue("codNatureza");
    var codCCusto = hAPI.getCardValue("codCCusto");
    var locEstoque = hAPI.getCardValue("locEstoque");
    var codContrato = hAPI.getCardValue("codContrato");
    var codFornecedor = hAPI.getCardValue("codFornecedor");
    var representante = hAPI.getCardValue("representante");
    var tipoPagamento = hAPI.getCardValue("tipoPagamento");
    var status = hAPI.getCardValue("codStaCnt");
    var JSONItemContratoRM = JSON.parse(hAPI.getCardValue("JSONItemContratoRM"));
    var dataContrato = hAPI.getCardValue("dataContratoRM");
    var QtdeFaturamentos = hAPI.getCardValue("QtdeFaturamentos");
    var diaFaturamento = hAPI.getCardValue("diaFaturamentoContratoRM");
    var tipoFaturamento = hAPI.getCardValue("tipoFaturamentoContratoRM");

    if (coligada == "" || coligada == null) {
        throw "Coligada inválida!";
    } else if (filial == "" || filial == null) {
        throw "Filial inválida!";
    } else if (tipoContrato == "" || tipoContrato == null) {
        throw "Tipo do contrato inválido!";
    } else if (codNatureza == "" || codNatureza == null) {
        throw "Natureza do contrato inválida!";
    } else if (codCCusto == "" || codCCusto == null) {
        throw "Centro de custo inválido!";
    } else if (locEstoque == "" || locEstoque == null) {
        throw "Local de estoque inválido!";
    } else if (codFornecedor == "" || codFornecedor == null) {
        throw "Fornecedor inválido!";
    } else if (representante == "" || representante == null) {
        throw "Representante inválido!";
    } else if (tipoPagamento == "" || tipoPagamento == null) {
        throw "Condição de pagamento inválida!";
    } else if (status == "" || status == null) {
        throw "Status do contrato inválido!";
    } else if (JSONItemContratoRM == "" || JSONItemContratoRM == null) {
        throw "Nenhum item inserido!";
    } else if (tipoFaturamento == "" || tipoFaturamento == null) {
        throw "Tipo do faturamento não selecionado!";
    } else if ((QtdeFaturamentos == "" || QtdeFaturamentos == null) && tipoFaturamento == 1) {
        throw "Quantidade de faturamentos inválida!";
    } else if ((diaFaturamento == "" || diaFaturamento == null) && tipoFaturamento == 1) {
        throw "Dia do faturamento inválido!";
    } else {
        var xml =
            "<CtrCnt>\
			    <TCnt>\
				    <CODCOLIGADA>" + coligada + "</CODCOLIGADA>\
				    <IDCNT>" + idCnt + "</IDCNT>\
				    <CODCOLCFO>0</CODCOLCFO>\
			        <NOME>" + Nome + "</NOME>\
				    <CODCCUSTO>" + codCCusto + "</CODCCUSTO>\
				    <NATUREZA>" + codNatureza + "</NATUREZA>\
				    <CODTCN>" + tipoContrato + "</CODTCN>\
				    <CODFILIAL>" + filial + "</CODFILIAL>\
				    <CODIGOCONTRATO>" + codContrato + "</CODIGOCONTRATO>\
				    <CODCFO>" + codFornecedor + "</CODCFO>\
				    <CODRPR>" + representante + "</CODRPR>\
				    <CODSTACNT>" + status + "</CODSTACNT>\
				    <CODCPG>" + tipoPagamento + "</CODCPG>\
                    <CODCPGPRAZO>130</CODCPGPRAZO>\
                    <DATACONTRATO>" + setDateXMLFormat(dataContrato) + "</DATACONTRATO>\
				    <DATAINICIO>" + setDateXMLFormat(dataContrato) + "</DATAINICIO>\
				    <DATAFIM>" + CalculaDataFimContrato() + "T00:00:00</DATAFIM>\
				    <CODMOEVALORCONTRATO>R$</CODMOEVALORCONTRATO>\
				    <IMPRIMEMOV>1</IMPRIMEMOV>";
        xml += (diaFaturamento == "" || diaFaturamento == 0 ? "<DIAFATURAMENTO>0</DIAFATURAMENTO>" : "<DIAFATURAMENTO>" + diaFaturamento + "</DIAFATURAMENTO>")
        xml += "<CODUSUARIO>" + getValue("WKUser") + "</CODUSUARIO>";
        xml += (QtdeFaturamentos == "" || QtdeFaturamentos == 0 ? "<QTDEFATURAMENTOS>1</QTDEFATURAMENTOS>" : "<QTDEFATURAMENTOS>" + QtdeFaturamentos + "</QTDEFATURAMENTOS>")
        xml += "</TCnt>\
			    <TCNTHISTORICO>\
			    	<CODCOLIGADA>" + coligada + "</CODCOLIGADA>\
			    	<IDCNT>" + idCnt + "</IDCNT>\
			    	<HISTORICOLONGO>" + url + "</HISTORICOLONGO>\
			    </TCNTHISTORICO>\
			    <TCNTCOMPL>\
			    	<CODCOLIGADA>" + coligada + "</CODCOLIGADA>\
			    	<IDCNT>" + idCnt + "</IDCNT>\
			    </TCNTCOMPL>";

        for (var i = 0; i < JSONItemContratoRM.length; i++) {
            xml +=
                "<TITMCNT>\
					<CODCOLIGADA>" + coligada + "</CODCOLIGADA>\
					<IDCNT>" + idCnt + "</IDCNT>\
					<NSEQITMCNT>" + (i + 1) + "</NSEQITMCNT>\
					<IDPRD>" + JSONItemContratoRM[i].IDPRD + "</IDPRD>\
					<CODFILIALFAT>" + filial + "</CODFILIALFAT>\
					<CODLOCFATURAM>" + locEstoque + "</CODLOCFATURAM>\
					<CODCCUSTO>" + codCCusto + "</CODCCUSTO>\
					<CODCFO>" + codFornecedor + "</CODCFO>\
					<QUANTIDADE>1</QUANTIDADE>\
					<CODCPG>" + tipoPagamento + "</CODCPG>\
					<CODMOEPRECOFATURAMENTO>R$</CODMOEPRECOFATURAMENTO>\
					<CODSTACNT>" + status + "</CODSTACNT>\
					<CODTMV>" + ((tipoContrato == "04") ? "1.1.98" : "1.1.99") + "</CODTMV>\
					<EPERIODICO>" + tipoFaturamento + "</EPERIODICO>\
					<DATAINICIO>" + setDateXMLFormat(dataContrato) + "</DATAINICIO>\
                    <DATAFIM>" + CalculaDataFimContrato() + "T00:00:00</DATAFIM>\
                    <CODCPGPRAZO>130</CODCPGPRAZO>\
					<CODRPR>" + representante + "</CODRPR>";
            xml += (diaFaturamento == "" || diaFaturamento == 0 ? "<DIAFATURAMENTO>0</DIAFATURAMENTO>" : "<DIAFATURAMENTO>" + diaFaturamento + "</DIAFATURAMENTO>")
            xml += "<PRECOFATURAMENTO>" + ValorToFloat(JSONItemContratoRM[i].Valor) + "</PRECOFATURAMENTO>\
					<CODMOEREAJUSTE>R$</CODMOEREAJUSTE>\
					<CODCOLCFODEST>0</CODCOLCFODEST>\
					<CODCFODEST>" + codFornecedor + "</CODCFODEST>";
            xml += (QtdeFaturamentos == "" || QtdeFaturamentos == 0 ? "<QTDEFATURAMENTOS>1</QTDEFATURAMENTOS>" : "<QTDEFATURAMENTOS>" + QtdeFaturamentos + "</QTDEFATURAMENTOS>")
            xml += "</TITMCNT>";

            xml += "<TITMCNTRATCCU>\
					<IDCNT>" + idCnt + "</IDCNT>\
					<CODCOLIGADA>" + coligada + "</CODCOLIGADA> \
					<NSEQITMCNT>" + (i + 1) + "</NSEQITMCNT>\
					<CODCCUSTO>" + codCCusto + "</CODCCUSTO>\
					<PERCENTUAL>100</PERCENTUAL>\
				</TITMCNTRATCCU>";

            for (var j = 0; j < JSONItemContratoRM[i].Rateio.length; j++) {
                xml += "<TITMCNTRATDEP>\
						<CODCOLIGADA>" + coligada + "</CODCOLIGADA>\
						<IDCNT>" + idCnt + "</IDCNT>\
						<NSEQITMCNT>" + (i + 1) + "</NSEQITMCNT>\
						<CODFILIAL>" + filial + "</CODFILIAL>\
						<CODDEPARTAMENTO>" + JSONItemContratoRM[i].Rateio[j].Departamento + "</CODDEPARTAMENTO>\
						<PERCENTUAL>" + JSONItemContratoRM[i].Rateio[j].Percentual + "</PERCENTUAL>\
					</TITMCNTRATDEP>";
            }
        }

        xml += "</CtrCnt>";

        log.info("XML: " + xml);
        var c1 = DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("contexto", contexto, contexto, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("idContrato", idCnt, idCnt, ConstraintType.MUST);
        var c4 = DatasetFactory.createConstraint("coligada", coligada, coligada, ConstraintType.MUST);
        var retorno = DatasetFactory.getDataset("InsereContratoRM", null, [c1, c2, c3, c4], null);

        if (!retorno || retorno == "" || retorno == null) {
            throw "Houve um erro na comunicação com o webservice. Tente novamente!";
        } else {
            if (retorno.values[0][0] == "false") {
                throw "Erro ao gerar contrato. Favor entrar em contato com o administrador do sistema. Mensagem: " + retorno.values[0][1];
            } else if (retorno.values[0][0] == "true") {
                hAPI.setCardValue("idCntRm", retorno.values[0][2]);
            }
        }
    }
}

function setDateXMLFormat(data, sql) {
    // Formata data para inserção no XML
    var retorno = "";
    var n = data.indexOf("/");
    data = data.trim();
    var joinDtHr = "";
    if (sql == 1) {
        joinDtHr = " ";
    } else {
        joinDtHr = "T";
    }
    if (n == -1) {
        var tam = data.length;
        if (tam > 10) {
            retorno = retorno.replace(" ", joinDtHr);
            retorno = retorno + "00";
        } else {
            retorno = retorno + joinDtHr + "00:00:00";
        }
    }

    if (n == 2) {
        var temp = data.split("/");
        retorno = [temp[2], temp[1], temp[0]].join("-");
        retorno = retorno + joinDtHr + "00:00:00";
    }
    if (n == 4) {
        retorno = data.replace("/", "-");
        retorno = retorno + joinDtHr + "00:00:00";
    }
    return retorno;
}

function ValorToFloat(valor) {
    if (valor.split("R$").length > 1) {
        valor = valor.split("R$")[1];
    }
    valor = valor.split(".").join("").split(",").join(".");
    return parseFloat(valor);
}

function CalculaDataFimContrato() {
    var data = hAPI.getCardValue("dataContratoRM").split("/");

    var date = new Date();
    date.setDate(data[0]);
    date.setMonth(data[1]);
    date.setFullYear(data[2]);


    date.setDate(date.getDate() - 1);
    date.setFullYear(date.getFullYear() + 1);


    return date.getFullYear() + "-" + (date.getMonth()) + "-" + date.getDate();
    /*
    var dataContrato = hAPI.getCardValue("dataContratoRM");
    var QtdeFaturamentos = hAPI.getCardValue("QtdeFaturamentos");
    if (QtdeFaturamentos > 0) {

        Date.isLeapYear = function (year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        };

        Date.getDaysInMonth = function (year, month) {
            return [31, Date.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };

        Date.prototype.isLeapYear = function () {
            return Date.isLeapYear(this.getFullYear());
        };

        Date.prototype.getDaysInMonth = function () {
            return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
        };

        Date.prototype.addMonths = function (value) {
            var n = this.getDate();
            this.setDate(1);
            this.setMonth(this.getMonth() + value);
            this.setDate(Math.min(n, this.getDaysInMonth()));
            return this;
        };


        var data = dataContrato.split("/");
        data = new Date(data[2], parseInt(data[1]) - 1, data[0]);

        data.setDate(data.getDate() - 1);
        data.addMonths(QtdeFaturamentos);
        return data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
    }
    else {
        return dataContrato;
    }*/

}

function FormataMoeda(valor) {
    var numero = parseFloat(valor);
    numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

function EnviaEmailAlteracaoNoEquipamento() {
    var json = hAPI.getCardValue("alteracoesEquipamentos");
    if (json != "" && json != null) {
        json = JSON.parse(json);
    }
    var mensagem = "Dados do equipamento alterados no contrato!";

    var equipamentos = "";
    for (var i = 0; i < json.length; i++) {
        equipamentos += "<div>\
            <b>Prefixo:</b> " + json[i].prefixo + "<br>";

        if (json[i].modelo != null && json[i].modelo != undefined) {
            equipamentos += "<b>Modelo: </b>" + json[i].modeloPrev + " => " + json[i].modelo + "<br>";
        }
        if (json[i].descricao != null && json[i].descricao != undefined) {
            equipamentos += "<b>Descricão: </b>" + json[i].descricaoPrev + " => " + json[i].descricao + "<br>";
        }
        if (json[i].valorLocacao != null && json[i].valorLocacao != undefined) {
            equipamentos += "<b>Valor de Locação: </b>" + FormataMoeda(json[i].valorLocacaoPrev) + " => " + FormataMoeda(json[i].valorLocacao) + "<br>";
        }
        if (json[i].valor != null && json[i].valor != undefined) {
            equipamentos += "<b>Valor do Equipamento: </b>" + FormataMoeda(json[i].valorPrev) + " => " + FormataMoeda(json[i].valor) + "<br>";
        }
        if (json[i].placa != null && json[i].placa != undefined) {
            equipamentos += "<b>Placa/Serie: </b>" + json[i].placaPrev + " => " + json[i].placa + "<br>";
        }
        if (json[i].chassi != null && json[i].chassi != undefined) {
            equipamentos += "<b>Chassi: </b>" + json[i].chassiPrev + " => " + json[i].chassi + "<br>";
        }
        if (json[i].fabricante != null && json[i].fabricante != undefined) {
            equipamentos += "<b>Fabricante: </b>" + json[i].fabricantePrev + " => " + json[i].fabricante + "<br>";
        }
        if (json[i].ano != null && json[i].ano != undefined) {
            equipamentos += "<b>Ano de fabricação: </b>" + json[i].anoPrev + " => " + json[i].ano + "<br>";
        }

        equipamentos += "</div><br><br>";
    }
    var param = new java.util.HashMap();
    param.put("EQUIPAMENTOS", equipamentos);
    param.put("MENSAGEM", mensagem);
    param.put("SERVER_URL", "http://fluig.castilho.com.br:1010");
    param.put("TENANT_ID", 1);
    param.put("subject", "[Fluig] Alterações em equipamentos cadastrados!");
    param.put("SOLICITACAO", getValue("WKNumProces"));

    var destinatarios = new java.util.ArrayList();
    destinatarios.add("gabriel.persike@castilho.com.br");

    notifier.notify("FLUIG", "TPL_EQUIPAMENTO_ALTERADO_SISMA", param, destinatarios, "text/html");
}

function BuscaEmailUsuario(usuario) {
    var ds = DatasetFactory.getDataset("colleague", null, [DatasetFactory.createConstraint("colleagueId", usuario, usuario, ConstraintType.MUST)], null);
    return ds.getValue(0, "mail");
}

function AtualizaStatusContrato(CODSTACNT) {
    var JSONContratoPrincipal = hAPI.getCardValue("JSONContratoPrincipal");

    if (JSONContratoPrincipal != "") {
        JSONContratoPrincipal = JSON.parse(JSONContratoPrincipal);

        var xml =
            "<CtrCnt>\
            <TCnt>\
                <CODCOLIGADA>" + JSONContratoPrincipal.CODCOLIGADA + "</CODCOLIGADA>\
                <IDCNT>" + JSONContratoPrincipal.IDCNT + "</IDCNT>\
                <CODSTACNT>" + CODSTACNT + "</CODSTACNT>\
            </TCnt>\
        </CtrCnt>";
        var contexto = "CODSISTEMA=G;CODCOLIGADA=" + JSONContratoPrincipal.CODCOLIGADA + ";CODUSUARIO=fluig";

        log.info("contexto: " + contexto);

        log.info("XML: " + xml);
        var c1 = DatasetFactory.createConstraint("xml", xml, xml, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("contexto", contexto, contexto, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("idContrato", JSONContratoPrincipal.IDCNT, JSONContratoPrincipal.IDCNT, ConstraintType.MUST);
        var c4 = DatasetFactory.createConstraint("coligada", JSONContratoPrincipal.CODCOLIGADA, JSONContratoPrincipal.CODCOLIGADA, ConstraintType.MUST);
        var retorno = DatasetFactory.getDataset("InsereContratoRM", null, [c1, c2, c3, c4], null);

        if (!retorno || retorno == "" || retorno == null) {
            throw "Houve um erro na comunicação com o webservice. Tente novamente!";
        } else {
            if (retorno.values[0][0] == "false") {
                throw "Erro ao gerar contrato. Favor entrar em contato com o administrador do sistema. Mensagem: " + retorno.values[0][1];
            } else if (retorno.values[0][0] == "true") {
                hAPI.setCardValue("idCntRm", retorno.values[0][2]);
            }
        }
    }
    else {
        throw "Contrato não encontrado para alteração no STATUS.";
    }
}

function BuscaNomeUsuario(CodUsuario) {
    var ds = DatasetFactory.getDataset("colleague", ["colleagueName"], [
        DatasetFactory.createConstraint("colleagueId", CodUsuario, CodUsuario, ConstraintType.MUST)
    ], null);

    return ds.getValue(0, "colleagueName");
}

/*  XML Inserção Contrato - RM
  <TCnt>
    <CODCOLIGADA>1</CODCOLIGADA>
    <IDCNT>2697</IDCNT>
    <CODCOLCFO>0</CODCOLCFO>
    <NOME>Residência Engenheiros</NOME>
    <CODCCUSTO>1.2.035</CODCCUSTO>
    <CODCOLIGADA2>1</CODCOLIGADA2>
    <CODDEPARTAMENTO>1.3.01</CODDEPARTAMENTO>
    <COMISSAOVEN2>0.00</COMISSAOVEN2>
    <CODCOLCONTAGER>0</CODCOLCONTAGER>
    <CODTB1FLX>009</CODTB1FLX>
    <CODCOLCXA>0</CODCOLCXA>
    <NATUREZA>1</NATUREZA>
    <QTDEFATURAMENTOS>13</QTDEFATURAMENTOS>
    <CODTCN>04</CODTCN>
    <CODFILIAL>1</CODFILIAL>
    <CODIGOCONTRATO>1.2.035-001/18</CODIGOCONTRATO>
    <CODCFO>013245</CODCFO>
    <CODRPR>01</CODRPR>
    <COMISSAOREPRES>0.00</COMISSAOREPRES>
    <DATACONTRATO>2018-03-20T00:00:00</DATACONTRATO>
    <DATAINICIO>2018-03-05T00:00:00</DATAINICIO>
    <DATAFIM>2019-03-04T00:00:00</DATAFIM>
    <CODSTACNT>01</CODSTACNT>
    <CODCPG>001</CODCPG>
    <CODMOEVALORCONTRATO>R$</CODMOEVALORCONTRATO>
    <DIAFATURAMENTO>0</DIAFATURAMENTO>
    <DIASCARENPARAFAT>0</DIASCARENPARAFAT>
    <DIASCARENCANCFAT>0</DIASCARENCANCFAT>
    <IMPRIMEMOV>1</IMPRIMEMOV>
    <VALORCONTRATO>22750.0000</VALORCONTRATO>
    <CODCPGPRAZO>130</CODCPGPRAZO>
    <COMISSAOVEN>0.00</COMISSAOVEN>
    <CODUSUARIO>Fernando.Barczak</CODUSUARIO>
    <NOMEFANTASIA>LEANDRO BATISTA</NOMEFANTASIA>
    <CGCCFO>043.126.576-37</CGCCFO>
    <RAZAOSOCIAL>LEANDRO BATISTA</RAZAOSOCIAL>
    <ECANCELAMENTO>0</ECANCELAMENTO>
    <FATURAROUNAO>1</FATURAROUNAO>
    <DESCSTACNT>ATIVO</DESCSTACNT>
    <DESCTTCN>Locação de Imóvel</DESCTTCN>
    <NOMEFILIAL>Castilho Engenharia - Matriz</NOMEFILIAL>
    <IMAGEM>0</IMAGEM>
  </TCnt>
  */
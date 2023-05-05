
function InsereCardDeAssinanteNoPainelDeAssinantes(StringAssinante, target) {
    StringAssinante = StringAssinante.split(" | ");

    if (StringAssinante.length == 3) {
        var html =
            "<div class='row'>\
        <div class='card'>\
            <div class='card-body'>\
            <h3 class='card-title'>" +
            StringAssinante[0] +
            "</h3>\
                <label>E-mail: </label>\
                <span>" +
            StringAssinante[1] +
            "</span>\
                <br>\
                <label>CPF: </label>\
                <span>" +
            StringAssinante[2] +
            "</span>\
                <br>\
                <button class='btn btn-danger'" +
            'onclick="$(this).closest(' +
            "'" +
            ".row" +
            "'" +
            ').remove(); ValidaTerminoTabAssinatura(null);"><i class="fluigicon fluigicon-trash icon-sm"></i> Remover</button>\
            </div>\
        </div>\
        </div>';

        $("#" + target).append(html);
    } else {
        alert("Selecione o assinante.");
    }
}
function verificaSeExisteAssinante(cpf) {
    //Se nao retornou nenhuma linha retorna que nao existe nenhum assinante com o CPF passado
    var ds = DatasetFactory.getDataset("ds_wesign_assinantes", null, [DatasetFactory.createConstraint("cpf", cpf, cpf, ConstraintType.MUST)], null);
    if (ds.values.length == 0) {
        return false;
    }
    else {
        return true;
    }
}
function CriaNovoAssinante() {
    if ($("#inputNomeNovoCadastro").val() == "" || $("#inputNomeNovoCadastro").val() == null) {
        alert("Nome inválido.");
    } else if ($("#inputEmailNovoCadastro").val() == null || $("#inputEmailNovoCadastro").val() == "") {
        alert("E-mail inválido.");
    } else if (!validaCPF($("#inputCPFNovoCadastro").val().split(".").join("").replace("-", ""))) {
        alert("CPF inválido.");
    } else if (verificaSeExisteAssinante($("#inputCPFNovoCadastro").val())) {
        alert("CPF já cadastrado.");
    } else {
        var nome = $("#inputNomeNovoCadastro").val().trim();
        var email = $("#inputEmailNovoCadastro").val().trim();
        var cpf = $("#inputCPFNovoCadastro").val().trim();

        var ds = DatasetFactory.getDataset('ds_auxiliar_wesign', null, [
            DatasetFactory.createConstraint("nome", nome, nome, ConstraintType.MUST),
            DatasetFactory.createConstraint("email", email, email, ConstraintType.MUST),
            DatasetFactory.createConstraint("cEmail", email, email, ConstraintType.MUST),
            DatasetFactory.createConstraint("tipo", "E", "E", ConstraintType.MUST),
            DatasetFactory.createConstraint("cpf", cpf, cpf, ConstraintType.MUST),
            DatasetFactory.createConstraint("cCpf", cpf, cpf, ConstraintType.MUST),
            DatasetFactory.createConstraint("titulo", "", "", ConstraintType.MUST),
            DatasetFactory.createConstraint("empresa", "", "", ConstraintType.MUST),
            DatasetFactory.createConstraint("metodo", "createSigner", "createSigner", ConstraintType.MUST)
        ], null);


        if (ds.values[0].Result == "OK") {
            return true;
        }
        else {
            return false;

        }
    }
}
function ModalNovoAssinante() {
    var myModal = FLUIGC.modal({
        title: "Cadastro de assinante",
        content:
            '<label for="inputNomeNovoCadastro">Nome: </label>\
        <input id="inputNomeNovoCadastro" name="inputNomeNovoCadastro" class="form-control">\
        <br><br>\
        <label for="inputEmailNovoCadastro">E-mail: </label>\
        <input id="inputEmailNovoCadastro" name="inputEmailNovoCadastro" class="form-control">\
        <br><br>\
        <label for="inputCPFNovoCadastro">CPF: </label>\
        <input id="inputCPFNovoCadastro" name="inputCPFNovoCadastro" class="form-control">',
        id: "fluig-modal",
        actions: [
            {
                label: "Inserir",
                bind: "InserirAssinante"
            },
            {
                label: "Cancelar",
                autoClose: true
            }
        ]
    }, function (err, data) {
        $("#inputCPFNovoCadastro").mask("000.000.000-00", { reverse: true });
        $("[InserirAssinante]").on("click", function () {
            var retorno = CriaNovoAssinante();
            if (retorno) {
                myModal.remove();
            }
        });
    });
}
function incluiListDiretor() {
    var NomeRepresentanteCastilho = $("#selectAssinanteCastilho").val();
    var ds = DatasetFactory.getDataset("ds_wesign_assinantes", null, [DatasetFactory.createConstraint("nome", NomeRepresentanteCastilho, NomeRepresentanteCastilho, ConstraintType.MUST)], null);

    $("#listRepresentante").html("");

    InsereCardDeAssinanteNoPainelDeAssinantes(ds.values[0]["nome"] + " | " + ds.values[0]["cEmail"] + " | " + ds.values[0]["cCpf"], "listRepresentante");
}
function showPanelAssinaturas() {
    var AssinaturaEletronicaOuManual = $("[name='radioOptAssinatura']:checked").val();

    if (AssinaturaEletronicaOuManual == "Eletronica") {
        $("#divAssinaturaEletronica").show();

        var listaAssinantes = $("#jsonAssinaturaEletronica").val();
        if (listaAssinantes != "" && listaAssinantes != null) {
            listaAssinantes = JSON.parse(listaAssinantes);
            $("#divListAssinantes").html("");

            for (const Assinante of listaAssinantes) {
                InsereCardDeAssinanteNoPainelDeAssinantes(Assinante.nome + " | " + Assinante.email + " | " + Assinante.cpf, "divListAssinantes")
            }
        }

        BuscaListaAssinantes().then(Assinantes => {
            var SalvaValorPreenchido = $("#selectParteAssinatura").val();//Salva o valor preenchido pra não perder o valor quando apagar as opções do campo
            var listAssinantes = Assinantes.map(e => { return e.Nome + " | " + e.Email + " | " + e.Cpf });

            if (myAutocomplete != null) {
                myAutocomplete.destroy();
            }
            myAutocomplete = FLUIGC.autocomplete("#selectParteAssinatura", {
                source: substringMatcher(listAssinantes),
                name: "cities",
                displayKey: "description",
                tagClass: "tag-gray",
                type: "autocomplete"
            });


            $("#selectParteAssinatura").val(SalvaValorPreenchido);
        });

        if ($("#tpCont").val() != 2) {
            //Se é Modelo de Contrato
            $("#divClausulaAssinaturaE").show();
            $("#divClausulaAssinaturaM").hide();
            $(".printavel:last").hide();
        }

        if ($("#atividade").val() == 19) {
            $("#divAssinaturaAdiministrador, #divAssinaturaRepresentante").show();

            if ($("#selectAssinanteCastilho").val() != null && $("#selectAssinanteCastilho").val() != "") {
                incluiListDiretor();
            }
        } else {
            $("#divAssinaturaAdiministrador, #divAssinaturaRepresentante").hide();
        }

        ValidaTerminoTabAssinatura(null);
    } else {
        $("#divClausulaAssinaturaE, #divAssinaturaEletronica").hide();
        $("#divClausulaAssinaturaM").show();
        if ($("#atividade").val() == 19) {
            $("#divAssinaturaAdiministrador").hide();
        }

        if ($("#tpCont").val() != 2) {
            $(".printavel").each(function (i) {
                if (i == $(".printavel").length - 1) {
                    $(this).show();
                }
            });

            if ($("#nomeFinal1").val() == "" || $("#nomeFinal2").val() == "" || $("#cpfFinal1").val() == "" || $("#cpfFinal2").val() == "") {
                EditarModelo();
                ValidaTerminoTabContrato(false);
            }
        }
        ValidaTerminoTabAssinatura(true);
    }
}
function inserirLinhaQuadroStatus() {
    var NumeroSolicitacao = $("#numProcess").val();
    var ds = DatasetFactory.getDataset("ds_form_aux_wesign", null, [DatasetFactory.createConstraint("numSolic", NumeroSolicitacao, NumeroSolicitacao, ConstraintType.MUST)], null);


    var retorno = "";
    for (var i = 0; i < ds.values.length; i++) {
        var Assinantes = JSON.parse(ds.values[i].jsonSigners);

        retorno +=
            "<tr>\
                <td>\
                    <a onClick='BuscaLinkDocEAbreLinkEmNovaAba(" + ds.values[i].codArquivo + ")'>" +
                        ds.values[i].nmArquivo +
                    "</a>\
                </td>\
                <td>\
                    <button class='btn btn-primary btnAtivaModal'>" +
                        Assinantes.length +
                        " assinantes</button>\
                    <input type='hidden' class='hiddenJsonSigners' value='" +
                        ds.values[i].jsonSigners +
                        "'>\
                </td>\
                <td>\
                    <a>" +
                        ds.values[i].dataEnvio +
                    "</a>\
                </td>\
                <td>\
                    <a>" +
                        ds.values[i].horaEnvio +
                    " </a>\
                </td>\
                <td>\
                    <a>" +
                        ds.values[i].nmRemetente +
                    "</a>\
                </td>\
                <td>\
                    <a>" +
                        ds.values[i].statusAssinatura +
                    "</a>\
                </td>";

        if (ds.values[i].statusAssinatura == "Enviando para assinatura" || ds.values[i].statusAssinatura == "Pendente Assinatura") {
            retorno += 
                    "<td>\
                        <button class='btn btn-primary btnCancelaAssinatura'>Cancelar</button>\
                        <input type='hidden' class='hiddenIdCreate' value='" + ds.values[i].idCreate + "'>\
                        <input type='hidden' class='hiddenStatusAssinatura' value='" + ds.values[i].statusAssinatura + "'>\
                        <input type='hidden' class='hiddenMetaId' value='" + ds.values[i]["metadata#id"] + "'>\
                    </td>";
        } 
        else {
            retorno += "<td></td>";
        }

        retorno += "</tr>";
    }

    $("#tbodyLinhaQuadroStatus").html(retorno);

    $(".btnAtivaModal").on("click", function () {
        var signers = $(this).siblings(".hiddenJsonSigners").val();
        ativaModalAssinantes(signers);
    });

    $(".btnCancelaAssinatura").on("click", function () {
        var idCreate = $(this).siblings(".hiddenIdCreate").val();
        var status = $(this).siblings(".hiddenStatusAssinatura").val();
        var metaId = $(this).siblings(".hiddenMetaId").val();

        deleteDocument(idCreate, status, metaId);
    });
}
function ativaModalAssinantes(jsonSigners) {
    jsonSigners = JSON.parse(jsonSigners);
    var html = "<table class='table table-striped table-bordered table-hover'>\
	<thead>\
		<tr>\
			<th>Nome</th>\
			<th>E-mail</th>\
			<th>CPF</th>\
			<th>Status</th>\
			<th>Assinatura</th>\
			<th></th>\
		</tr>\
	</thead>\
	<tbody>";

    for (var i = 0; i < jsonSigners.length; i++) {
        html += "<tr>\
		<td>\
			<a>" + jsonSigners[i].nome + "</a>\
		</td>\
		<td>\
			<a>" + jsonSigners[i].email + "</a>\
		</td>\
		<td>\
			<a>" + jsonSigners[i].cpf + "</a>\
		</td>\
		<td>\
            <span class='btn " + (Assinante.status == "Assinado" ? "btn-success" : "btn-warning") + "'>" + jsonSigners[i].status + "</span>\
		</td>\
		<td>\
			<a target='_blank' href='" + jsonSigners[i].signUrl + "' >\
				" + jsonSigners[i].signUrl + "\
			</a>\
		</td>\
	</tr>";
    }

    html += "</tbody>\
		</table>";

    var myModal = FLUIGC.modal(
        {
            title: "Assinantes",
            size: "full",
            content: html,
            id: "fluig-modal",
            actions: [
                {
                    label: "Close",
                    autoClose: true
                }
            ]
        },
        function (err, data) {
            if (err) {
                // do error handling
            } else {
                // do something with data
            }
        }
    );
}











// function cancelaAssinatura(id, status, cardId) {
//     FLUIGC.message.confirm(
//         {
//             message: "Deseja cancelar a assinatura do documento selecionado?",
//             title: "Cancelar assinatura",
//             labelYes: "Sim",
//             labelNo: "Não"
//         },
//         function (result) {
//             if (result) {
//                 deleteCertisignDocument(id, status, cardId);
//                 inserirLinhaQuadroStatus();
//             }
//         }
//     );
// }
// function deleteCertisignDocument(id, status, cardId) {
//     if (status === "Pendente Assinatura") {
//         deleteDocumentVertsign(id, cardId);
//     } else if (status === "Enviando para assinatura") {
//         changeStatusToCanceled(id, cardId);
//     } else {
//         showAlert("Selecione um documento", "info");
//     }
// }
// function deleteDocumentVertsign(id, cardId) {
//     var dsDelete = DatasetFactory.getDataset("ds_delete_wesign", null, [DatasetFactory.createConstraint("idCreate", id, id, ConstraintType.MUST)], null);
//     if (dsDelete && dsDelete.values) {
//         if (dsDelete.values.length > 0) {
//             if (dsDelete.values[0].Result === "OK") {
//                 changeStatusToCanceled(id, cardId);
//             }
//         } else {
//         }
//     }
// }
// function changeStatusToCanceled(id, cardId) {
//     var idRegistro = {
//         name: "idRegistro",
//         value: cardId
//     };
//     var status = {
//         name: "status",
//         value: "Cancelado"
//     };
//     var metodo = {
//         name: "metodo",
//         value: "cancelDocument"
//     };
//     var constraints = [idRegistro, status, metodo];
//     var c1 = DatasetFactory.createConstraint("idCreate", id, id, ConstraintType.MUST);
//     var dsFormAux = DatasetFactory.getDataset("ds_form_aux_vertsign", null, [c1], null);
//     console.log(dsFormAux);
//     if (dsFormAux.values) {
//         if (dsFormAux.values.length > 0) {
//             var codDocOrigem = dsFormAux.values[0].codArquivo;
//             var verDocOrigem = dsFormAux.values[0].vrArquivo;

//             executeWebservice(constraints, function () {
//                 updateCustomField("Cancelado", codDocOrigem, verDocOrigem);
//                 $("[data-dismiss]").click();
//             });
//         } else {
//         }
//     } else {
//     }
// }
// function updateCustomField(status, id, version) {
//     var campoCustomizado = {
//         name: "campoCustomizado",
//         value: "status_assinatura"
//     };
//     var codArquivo = {
//         name: "codArquivo",
//         value: id
//     };
//     var statusDoc = {
//         name: "status",
//         value: status
//     };
//     var vrArquivo = {
//         name: "vrArquivo",
//         value: version
//     };
//     var metodo = {
//         name: "metodo",
//         value: "customfield"
//     };

//     var constraints = [campoCustomizado, codArquivo, statusDoc, vrArquivo, metodo];
//     console.log(constraints);
//     executeWebservice(constraints);
// }











function ModalReenviaContrato() {
    var html =
        "<input type='hidden' name='jsonSigners' id='jsonSigners'>\
	<input type='hidden' name='idDoc' id='idDoc'>\
	<div class='row'>\
	<div class='col-md-6'>\
		<h2>Documento</h2>\
		<div id='divSelecionaDoc'>\
			<label for=''>Selecione o documento:</label>\
			<br>\
			<a class='file-input-wrapper btn btn-primary'>\
				<i class='flaticon flaticon-upload icon-sm'></i>\
				<span>Publicar documento</span>\
				<input id='fileupload' type='file' name='files' data-url='/ecm/upload'\
					class='btn btn-default btn-sm btn-block' title='Carregar documentos' multiple=''\
					data-file-upload=''>\
			</a>\
		</div>\
		<br><br>\
		<div id='divInfoDoc'>\
		</div>\
	</div>\
	<div class='col-md-6'>\
		<h2>Assinatura</h2>\
		<div id='divSelecionaAssinantes'>\
			<label for='selectParteAssinaturaModal'>Selecione os assinantes:</label>\
			<br>\
			<div style='display: inline-flex; width: 100%;'>\
					<input type='text' class='form-control' id='selectParteAssinaturaModal'\
						name='selectParteAssinaturaModal'>\
				<button class='btn btn-success' style='vertical-align: top;'\
					onclick='insereAssinante()'>Adicionar</button>\
			</div>\
			<br><br>\
		</div>\
		<div id='divInfoAssinatura'>\
		</div>\
	</div>\
</div>";

    myModal = FLUIGC.modal(
        {
            title: "Reenviar contrato",
            content: html,
            size: "full",
            id: "fluig-modal",
            actions: [
                {
                    label: "Enviar",
                    bind: "EnviarAssinaturaEletronica"
                },
                {
                    label: "Cancelar",
                    autoClose: true
                }
            ]
        },
        function (err, data) {
            $("[EnviarAssinaturaEletronica]").on("click", function () {
                criaDocNoFluig();
            });
            BuscaListaAssinantes(true).then(Assinantes => {
                var AssinantesOptions = Assinantes.map(e => { return e.Nome + " | " + e.Email + " | " + e.Cpf })

                myAutocomplete = FLUIGC.autocomplete("#selectParteAssinaturaModal", {
                    source: substringMatcher(AssinantesOptions),
                    name: "cities",
                    displayKey: "description",
                    tagClass: "tag-gray",
                    type: "autocomplete"
                });
            });
        }
    );
}
function CriaAssinaturaEletronica(idDoc, descricao) {
    var dsAux = DatasetFactory.getDataset("ds_auxiliar_wesign", null, [
        DatasetFactory.createConstraint("nmArquivo", descricao, descricao, ConstraintType.MUST),
        DatasetFactory.createConstraint("codArquivo", idDoc, idDoc, ConstraintType.MUST),
        DatasetFactory.createConstraint("vrArquivo", "1000", "1000", ConstraintType.MUST),
        DatasetFactory.createConstraint("codPasta", "140518", "140518", ConstraintType.MUST),
        DatasetFactory.createConstraint("codRemetente", $("#userCode").val(), $("#userCode").val(), ConstraintType.MUST),
        DatasetFactory.createConstraint("nmRemetente", BuscaNomeUsuario($("#userCode").val()), BuscaNomeUsuario($("#userCode").val()), ConstraintType.MUST),
        DatasetFactory.createConstraint("status", "Enviando para assinatura", "Enviando para assinatura", ConstraintType.MUST),
        DatasetFactory.createConstraint("metodo", "create", "create", ConstraintType.MUST),
        DatasetFactory.createConstraint("jsonSigners", hAPI.getCardValue("jsonSigner"), hAPI.getCardValue("jsonSigner"), ConstraintType.MUST),
        DatasetFactory.createConstraint("numSolic", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST)
    ], null);

    if (dsAux.values[0]["Result"] === "OK") {
        FLUIGC.toast({
            message: "Documento enviado.",
            type: "success"
        });
        inserirLinhaQuadroStatus();
        myModal.remove();
    }
}
function BuscaListaAssinantes(ListarRepresentantesDaCastilho = false) {
    return new Promise((resolve, reject) => {
        var constraints = [];
        if (!ListarRepresentantesDaCastilho) {
            constraints.push(
                DatasetFactory.createConstraint("nome", "Emanuel Mascarenhas Padilha Junior", "Emanuel Mascarenhas Padilha Junior", ConstraintType.MUST_NOT),
                DatasetFactory.createConstraint("nome", "Jerson Godoy Leski Jr", "Jerson Godoy Leski Jr", ConstraintType.MUST_NOT),
                DatasetFactory.createConstraint("nome", "Augusto Cesar de Almeida Pereira de Lyra", "Augusto Cesar de Almeida Pereira de Lyra", ConstraintType.MUST_NOT),
                DatasetFactory.createConstraint("nome", "Marcio Rinaldo Guinossi", "Marcio Rinaldo Guinossi", ConstraintType.MUST_NOT));
        }

        DatasetFactory.getDataset("ds_wesign_assinantes", null, constraints, null, {
            success: (ds) => {
                var assinantes = [];
                for (const assinante of ds.values) {
                    assinantes.push({
                        Nome: assinante.nome,
                        Email: hex2a(assinante.email),
                        Cpf: hex2a(assinante.cpf)
                    });
                }
                resolve(assinantes);
            }
        });
    });
}
function hex2a(hexx) {
    var hex = hexx.toString();
    var str = '';
    for (var i = 0;
        (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
async function BuscaLinkDocEAbreLinkEmNovaAba(docId) {
    var infoDoc = await BuscaInfoDoc(docId);

    if (infoDoc.attachments.length > 0) {
        window.open(infoDoc.attachments[0].downloadURL, '_blank').focus();
    } else {
        window.open(infoDoc.fileURL, '_blank').focus();
    }
}

function BuscaInfoDoc(docId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://fluig.castilho.com.br:1010" + "/api/public/ecm/document/" + docId + "/1000", //Prod
            contentType: "application/json",
            method: "GET",
            success: function (retorno) {
                resolve(retorno.content);
            },
            error: function (e, x) {
                FLUIGC.toast({
                    title: "",
                    message: "Erro ao buscar documento: " + e,
                    type: "warning"
                });
                reject();
            }
        });
    });
}



//Codigo Retirado do Componente da Wesign para fazer o cancelamento da assinatura
// Deleta um documento do Portal de Assinaturas da Certisign
function deleteDocument(id, status, cardId) {
    if (status === 'Pendente Assinatura') {
        deleteDocumentPortal(id, cardId);
    } else if (status === 'Enviando para assinatura') {
        changeStatusToCanceledWithoutIntegration(id, cardId);
    } else {
        showAlert("Selecione um documento", 'info');
    }
}

function deleteDocumentPortal(id, cardId) {

    let dsDelete = DatasetFactory.getDataset('ds_delete_wesign', null, [
        DatasetFactory.createConstraint('chaveArquivo', id, id, ConstraintType.MUST)
    ], null);

    if (dsDelete && dsDelete.values) {
        if (dsDelete.values.length > 0) {
            if (dsDelete.values[0].Result === 'OK') {
                changeStatusToCanceled(id, cardId);
            }
        } else {
            showAlert("Erro ao cancelar", 'danger');
        }
    }
}

// Altera o status de um documento para cancelado no formulário Auxiliar
function changeStatusToCanceled(id, cardId) {
    let constraints = [{
        name: 'idRegistro',
        value: cardId
    }, {
        name: 'status',
        value: 'Cancelado'
    }, {
        name: 'metodo',
        value: 'cancelDocument'
    }];

    let dsFormAux = DatasetFactory.getDataset('ds_form_aux_wesign', null, [
        DatasetFactory.createConstraint('chaveArquivo', id, id, ConstraintType.MUST)
    ], null).values;

    if (dsFormAux && dsFormAux.length > 0) {
        executeWebservice(constraints, function () {
            updateCustomField("Cancelado", dsFormAux[0].codArquivo, dsFormAux[0].vrArquivo);
            showAlert("Documento cancelado", 'success');
        });
    }
}

function changeStatusToCanceledWithoutIntegration(id, cardId) {
    var idRegistro = {
        name: 'idRegistro',
        value: cardId
    };
    var status = {
        name: 'status',
        value: 'Cancelado'
    };
    var metodo = {
        name: 'metodo',
        value: 'cancelDocument'
    };
    var constraints = [idRegistro, status, metodo];

    var c1 = DatasetFactory.createConstraint('metadata#id', cardId, cardId, ConstraintType.MUST);
    var dsFormAux = DatasetFactory.getDataset('ds_form_aux_wesign', null, [c1], null);

    if (dsFormAux.values) {
        if (dsFormAux.values.length > 0) {
            var codDocOrigem = dsFormAux.values[0].codArquivo;
            var verDocOrigem = dsFormAux.values[0].vrArquivo;

            executeWebservice(constraints, function () {
                updateCustomField("Cancelado", codDocOrigem, verDocOrigem);
                showAlert("Documento cancelado", 'success');
            });
        }
    }
}

// Altera o campo customizado
function updateCustomField(status, id, version) {
    var campoCustomizado = {
        name: 'campoCustomizado',
        value: 'status_assinatura'
    };
    var codArquivo = {
        name: 'codArquivo',
        value: id
    };
    var statusDoc = {
        name: 'status',
        value: status
    };
    var vrArquivo = {
        name: 'vrArquivo',
        value: version
    };
    var metodo = {
        name: 'metodo',
        value: 'customfield'
    };

    var constraints = [campoCustomizado, codArquivo, statusDoc, vrArquivo, metodo];
    executeWebservice(constraints);
}

// Função responsável por executar os serviços SOAP
function executeWebservice(params, callback) {
    var constraints = [];
    var that = this;

    params.forEach(function (param) {
        constraints.push(DatasetFactory.createConstraint(param.name, param.value, param.value, ConstraintType.MUST));
    });

    if (constraints.length > 0) {
        var dsAux = DatasetFactory.getDataset('ds_auxiliar_wesign', null, constraints, null);

        if (callback) {
            if (dsAux) {
                if (dsAux.values) {
                    if (dsAux.values.length > 0) {
                        if (dsAux.values[0].Result === 'OK') {
                            callback();
                        }
                    }
                } else {
                    that.showAlert(
                        '',
                        "Ocorreu um erro. Tente novamente. Caso o erro persista, consulte o" +
                        "<a target='_blank' href='https://www.wesign.com.br'><strong> manual. </strong></a>",
                        'danger'
                    );
                }
            } else {
                that.showAlert(
                    '',
                    "Ocorreu um erro. Tente novamente. Caso o erro persista, consulte o" +
                    "<a target='_blank' href='https://www.wesign.com.br'><strong> manual. </strong></a>",
                    'danger'
                );
                that.load.hide();
            }
        }
    }
}




function CarregaListaAssinantes() {
    DatasetFactory.getDataset("ds_vertsign_assinantes", null, null, null, {
        success: (dataset) => {
            var userList = [];

            for (var j = 0; j < dataset.values.length; j++) {
                if (dataset.values[j]["nome"] != "Emanuel Mascarenhas Padilha Junior" && dataset.values[j]["nome"] != "Jerson Godoy Leski Junior" && dataset.values[j]["nome"] != "Augusto Lyra") {
                    userList.push(dataset.values[j]["nome"] + "|" + dataset.values[j]["email"] + "|" + dataset.values[j]["cpf"]);
                }
            }
            if (myAutocomplete != null) {
                myAutocomplete.destroy();
            }
            myAutocomplete = FLUIGC.autocomplete("#selectParteAssinatura", {
                source: substringMatcher(userList),
                name: "cities",
                displayKey: "description",
                tagClass: "tag-gray",
                type: "autocomplete"
            });
        },
        error: (error) => {
            FLUIGC.toast({
                title: "Erro ao buscar assinantes: ",
                message: error,
                type: "warning"
            });
        }
    });
}
function insereAssinante() {
    var val = $("#selectParteAssinaturaModal").val();
    val = val.split(" | ");

    if (val.length == 3) {
        var html =
            "<div class='row'>\
        <div class='card'>\
            <div class='card-body'>\
                <h3 class='card-title'>" +
            val[0] +
            "</h3>\
                <label>E-mail: </label>\
                <span>" +
            val[1] +
            "</span>\
                <br>\
                <label>CPF: </label>\
                <span>" +
            val[2] +
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

        $("#divInfoAssinatura").append(html);
    } else {
        alert("Selecione o assinante.");
    }
    $("#selectParteAssinaturaModal").val("");
}
function verificaSeExisteAssinante(cpf) {
    var c1 = DatasetFactory.createConstraint("cpf", cpf, cpf, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("ds_vertsign_assinantes", null, [c1], null);
    if (ds.values.length == 0) return false;
    else return true;
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
        var data = {
            documentDescription: $("#inputNomeNovoCadastro").val() + " - " + $("#inputEmailNovoCadastro").val(),
            parentDocumentId: 139553,
            //parentDocumentId: 13319,
            version: 1000,
            inheritSecurity: true,
            formData: [
                { name: "nome", value: $("#inputNomeNovoCadastro").val() },
                { name: "displayKey", value: $("#inputNomeNovoCadastro").val() + " - " + $("#inputEmailNovoCadastro").val() },
                { name: "email", value: $("#inputEmailNovoCadastro").val() },
                { name: "cpf", value: $("#inputCPFNovoCadastro").val() },
                { name: "tipoAssinatura", value: "E" }
            ]
        };
        var retorno = $.ajax({
            method: "POST",
            url: "/api/public/2.0/cards/create",
            data: JSON.stringify(data),
            contentType: "application/json",
            async: false,
            error: function (x, e) {
                console.error("Cria grupo da obra");
                console.log(x);
                console.log(e);
            },
            success: function () {
                CarregaListaAssinantes();
                FLUIGC.toast({
                    message: "Assinante Cadastrado.",
                    type: "success"
                });
            },
            beforeSend: function () { }
        });
        return true;
    }
}
function ModalNovoAssinante() {
    var myModal = FLUIGC.modal(
        {
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
                    bind: "data-open-modal"
                },
                {
                    label: "Cancelar",
                    autoClose: true
                }
            ]
        },
        function (err, data) {
            if (err) {
                // do error handling
            } else {
                console.log(data);
            }
        }
    );
    $("#inputCPFNovoCadastro").mask("000.000.000-00", { reverse: true });

    $(".modal-footer")
        .find("button")
        .each(function () {
            if ($(this).html() == "Inserir") {
                $(this).on("click", function () {
                    var retorno = CriaNovoAssinante();
                    if (retorno) {
                        myModal.remove();
                    }
                });
            }
        });
}
function BuscaAssinante() {
    var text = $("#selectParteAssinatura").val();
    var c1 = DatasetFactory.createConstraint("nome", "%" + text + "%", "%" + text + "%", ConstraintType.MUST);
}
function incluiListDiretor() {
    var diretor = $("#selectAssinanteCastilho").val();

    var c1 = DatasetFactory.createConstraint("nome", diretor, diretor, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("ds_vertsign_assinantes", null, [c1], null);

    var html =
        '<div class="row" style="margin:0px;">\
        <div class="card">\
            <div class="card-body">\
                <label>Nome: </label>\
                <span>' +
        ds.values[0]["nome"] +
        "</span>\
                <br>\
                <label>E-mail: </label>\
                <span>" +
        ds.values[0]["email"] +
        "</span>\
                <br>\
                <label>CPF: </label>\
                <span>" +
        ds.values[0]["cpf"] +
        "</span>\
                <br>\
            </div>\
        </div>\
    <br>\
    </div>";

    $("#listRepresentante").html(html);
}
function incluiAssinante(obj) {
    obj = obj.split("|");

    if (obj.length != 3) {
        alert("Assinante inválido");
    } else {
        var html = '<div class="row" style="margin:0px;">\
			<div class="card">\
				<div class="card-body">\
					<label>Nome: </label>\
					<span>' + obj[0] + "</span>\
					<br>\
					<label>E-mail: </label>\
					<span>" + obj[1] + "</span>\
					<br>\
					<label>CPF: </label>\
					<span>" + obj[2] + '</span>\
					<br>\
					<button class="btn btn-danger" onclick="$(this).closest(' + "'" + ".row" + "'" + ').remove(); ValidaTerminoTabAssinatura(null);"><i class="fluigicon fluigicon-trash icon-sm"></i> Remover</button>\
				</div>\
			</div>\
		<br>\
		</div>';

        $("#divListAssinantes").append(html);
    }
}
function SalvaJsonAssinatura() {
    var json = [];
    $("#divListAssinantes")
        .find(".row")
        .each(function () {
            var assinante = [];
            $(this)
                .find("span")
                .each(function () {
                    assinante.push($(this).text());
                });

            json.push({
                nome: assinante[0],
                email: assinante[1],
                cpf: assinante[2],
                tipo: "E",
                status: "Pendente"
            });
        });
    if (JSON.stringify(json) == "" || JSON.stringify(json) == "[]" || json == null) {
        return "Nenhuma opção selecionada para outra parte do contrato. " + JSON.stringify(json);
    } else {
        $("#jsonAssinaturaEletronica").val(JSON.stringify(json));
        return true;
    }
}
function showPanelAssinaturas() {
    var optAssinatura = $("[name='radioOptAssinatura']:checked").val();

    if (optAssinatura == "Eletronica") {
        if ($("#tpCont").val() != 2) {
            $("#divClausulaAssinaturaE").show();
            $("#divClausulaAssinaturaM").hide();

            $(".printavel").each(function (i) {
                if (i == $(".printavel").length - 1) {
                    $(this).hide();
                }
            });
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

        $("#divAssinaturaEletronica").show();
        var SalvaOpcao = $("#selectParteAssinatura").val();
        CarregaListaAssinantes();
        $("#selectParteAssinatura").val(SalvaOpcao);

        var listaAssinantes = $("#jsonAssinaturaEletronica").val();
        if (listaAssinantes != "" && listaAssinantes != null) {
            listaAssinantes = JSON.parse(listaAssinantes);
            $("#divListAssinantes").html("");
            for (var i = 0; i < listaAssinantes.length; i++) {
                var html =
                    '<div class="row" style="margin:0px;">\
                    <div class="card">\
                        <div class="card-body">\
                            <label>Nome: </label>\
                            <span>' +
                    listaAssinantes[i].nome +
                    "</span>\
                            <br>\
                            <label>E-mail: </label>\
                            <span>" +
                    listaAssinantes[i].email +
                    "</span>\
                            <br>\
                            <label>CPF: </label>\
                            <span>" +
                    listaAssinantes[i].cpf +
                    '</span>\
                            <br>\
                            <br>\
                            <button class="btn btn-danger" onclick="$(this).closest(' +
                    "'" +
                    ".row" +
                    "'" +
                    ').remove(); ValidaTerminoTabAssinatura(null);"><i class="fluigicon fluigicon-trash icon-sm"></i> Remover</button>\
                        </div>\
                    </div>\
                </div>';
                $("#divListAssinantes").append(html);
            }
        }
    } else {
        $("#divClausulaAssinaturaE").hide();
        $("#divClausulaAssinaturaM").show();
        $("#divAssinaturaEletronica").hide();
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
        if (optAssinatura == "Manual") {
            ValidaTerminoTabAssinatura(true);
        }
    }
}
function gravarJsonSigners() {
    var jsonSigners = [];
    $("#divInfoAssinatura")
        .find(".row")
        .each(function () {
            var signer = [];
            $(this)
                .find("span, h3")
                .each(function () {
                    signer.push($(this).text());
                });

            jsonSigners.push({
                nome: signer[0],
                email: signer[1],
                cpf: signer[2],
                tipo: "E",
                status: "Pendente"
            });

            if (!verificaSeExisteAssinante(signer[2])) {
                throw "Assinante não cadastrado.";
            }
        });

    if (JSON.stringify(jsonSigners) == "[]") {
        throw "Nenhum assinante adicionado.";
    } else {
        $("#jsonSigners").val(JSON.stringify(jsonSigners));
    }
}
function inserirLinhaQuadroStatus() {
    var processo = $("#numProcess").val();
    var c1 = DatasetFactory.createConstraint("numSolic", processo, processo, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("ds_form_aux_vertsign", null, [c1], null);
    var retorno = "";
    for (var i = 0; i < ds.values.length; i++) {
        var json = JSON.parse(ds.values[i].jsonSigners);

        retorno +=
            "<tr>\
	<td>\
		<a target='_blank' href='http://fluig.castilho.com.br:1010/portal/p/1/ecmnavigation?app_ecm_navigation_doc=" +
            ds.values[i].codArquivo +
            "' >" +
            ds.values[i].nmArquivo +
            "</a>\
	</td>\
	<td>\
		<a target='_blank' href='https://vertsign.portaldeassinaturas.com.br/VerificadorAssinaturas/Verificador?codigo=" +
            ds.values[i].chaveArquivo +
            "' >" +
            ds.values[i].chaveArquivo +
            "</a>\
	</td>\
	<td>\
		<button class='btn btn-primary btnAtivaModal'>" +
            json.length +
            " assinantes</button>\
		<input type='hidden' class='hiddenJsonSigners' value='" +
            ds.values[i].jsonSigners +
            "'>\
		<input type='hidden' class='hiddenChaveArquivo' value='" +
            ds.values[i].chaveArquivo +
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
            retorno += "<td>\
			<button class='btn btn-primary btnCancelaAssinatura'>Cancelar</button>\
			<input type='hidden' class='hiddenIdCreate' value='" + ds.values[i].idCreate + "'>\
			<input type='hidden' class='hiddenStatusAssinatura' value='" + ds.values[i].statusAssinatura + "'>\
			<input type='hidden' class='hiddenMetaId' value='" + ds.values[i]["metadata#id"] + "'>\
		</td>";
        } else {
            retorno += "<td></td>";
        }

        retorno += "</tr>";
    }

    $("#tbodyLinhaQuadroStatus").html("");
    $("#tbodyLinhaQuadroStatus").append(retorno);

    $(".btnAtivaModal").on("click", function () {
        var signers = $(this).siblings(".hiddenJsonSigners").val();
        var chave = $(this).siblings(".hiddenChaveArquivo").val();
        ativaModalAssinantes(signers, chave);
    });

    $(".btnCancelaAssinatura").on("click", function () {
        var idCreate = $(this).siblings(".hiddenIdCreate").val();
        var status = $(this).siblings(".hiddenStatusAssinatura").val();
        var metaId = $(this).siblings(".hiddenMetaId").val();

        cancelaAssinatura(idCreate, status, metaId);
    });
}
function ativaModalAssinantes(dados, chave) {
    console.log(dados);
    dados = JSON.parse(dados);
    var html = "<table class='table table-striped table-bordered table-hover'>\
	<thead>\
		<tr>\
			<th>Nome</th>\
			<th>E-mail</th>\
			<th>CPF</th>\
			<th>Tipo de assinatura</th>\
			<th>Status</th>\
			<th>Assinatura</th>\
			<th></th>\
		</tr>\
	</thead>\
	<tbody>";

    for (var i = 0; i < dados.length; i++) {
        html += "<tr>\
		<td>\
			<a>" + dados[i].nome + "</a>\
		</td>\
		<td>\
			<a>" + dados[i].email + "</a>\
		</td>\
		<td>\
			<a>" + dados[i].cpf + "</a>\
		</td>\
		<td>\
			<a>Eletrônica</a>\
		</td>\
		<td>\
			<a style='";
        if (dados[i].status == "Assinado") {
            html += "background-color: #3FDB8C; color: white; padding: 3%; border-radius: 15%;";
        } else if (dados[i].status == "Pendente") {
            html += "background-color: #FDB45C; color: white;  padding: 3%; border-radius: 15%;";
        } else {
            html += "background-color: #686868; color: white;  padding: 3%; border-radius: 15%;";
        }

        html += "'>" + dados[i].status + "</a>\
		</td>\
		<td>\
			<a target='_blank' href='" + dados[i].signUrl + "' >\
				" + dados[i].signUrl + "\
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
function cancelaAssinatura(id, status, cardId) {
    FLUIGC.message.confirm(
        {
            message: "Deseja cancelar a assinatura do documento selecionado?",
            title: "Cancelar assinatura",
            labelYes: "Sim",
            labelNo: "Não"
        },
        function (result) {
            if (result) {
                deleteCertisignDocument(id, status, cardId);
                inserirLinhaQuadroStatus();
            }
        }
    );
}
function deleteCertisignDocument(id, status, cardId) {
    if (status === "Pendente Assinatura") {
        deleteDocumentVertsign(id, cardId);
    } else if (status === "Enviando para assinatura") {
        changeStatusToCanceled(id, cardId);
    } else {
        showAlert("Selecione um documento", "info");
    }
}
function deleteDocumentVertsign(id, cardId) {
    var c1 = DatasetFactory.createConstraint("idCreate", id, id, ConstraintType.MUST);
    var dsDelete = DatasetFactory.getDataset("ds_delete_vertsign", null, [c1], null);
    if (dsDelete && dsDelete.values) {
        if (dsDelete.values.length > 0) {
            if (dsDelete.values[0].Result === "OK") {
                changeStatusToCanceled(id, cardId);
            }
        } else {
        }
    }
}
function changeStatusToCanceled(id, cardId) {
    var idRegistro = {
        name: "idRegistro",
        value: cardId
    };
    var status = {
        name: "status",
        value: "Cancelado"
    };
    var metodo = {
        name: "metodo",
        value: "cancelDocument"
    };
    var constraints = [idRegistro, status, metodo];
    console.log(constraints);
    var c1 = DatasetFactory.createConstraint("idCreate", id, id, ConstraintType.MUST);
    var dsFormAux = DatasetFactory.getDataset("ds_form_aux_vertsign", null, [c1], null);
    console.log(dsFormAux);
    if (dsFormAux.values) {
        if (dsFormAux.values.length > 0) {
            var codDocOrigem = dsFormAux.values[0].codArquivo;
            var verDocOrigem = dsFormAux.values[0].vrArquivo;

            executeWebservice(constraints, function () {
                updateCustomField("Cancelado", codDocOrigem, verDocOrigem);
                $("[data-dismiss]").click();
            });
        } else {
        }
    } else {
    }
}
function updateCustomField(status, id, version) {
    var campoCustomizado = {
        name: "campoCustomizado",
        value: "status_assinatura"
    };
    var codArquivo = {
        name: "codArquivo",
        value: id
    };
    var statusDoc = {
        name: "status",
        value: status
    };
    var vrArquivo = {
        name: "vrArquivo",
        value: version
    };
    var metodo = {
        name: "metodo",
        value: "customfield"
    };

    var constraints = [campoCustomizado, codArquivo, statusDoc, vrArquivo, metodo];
    console.log(constraints);
    executeWebservice(constraints);
}
function executeWebservice(params, callback) {
    var constraints = [];
    params.forEach(function (param) {
        constraints.push(DatasetFactory.createConstraint(param.name, param.value, param.value, ConstraintType.MUST));
    });
    console.log(constraints);
    if (constraints.length > 0) {
        var dsAux = DatasetFactory.getDataset("ds_auxiliar_vertsign", null, constraints, null);
        console.log(dsAux);
        if (dsAux) {
            if (dsAux.values) {
                if (dsAux.values.length > 0) {
                    if (dsAux.values[0].Result == "OK") {
                        FLUIGC.toast({
                            message: "Documento cancelado.",
                            type: "success"
                        });
                    } else {
                        FLUIGC.toast({
                            message: "Erro: " + dsAux.values[0].Result,
                            type: "danger"
                        });
                    }
                }
            } else {
                FLUIGC.toast({
                    message: "Erro: Não foi possivel conectar com o serviço, favor entrar em contato com o administrador.",
                    type: "danger"
                });
            }
        } else {
            FLUIGC.toast({
                message: "Erro: Não foi possivel conectar com o serviço, favor entrar em contato com o administrador.",
                type: "danger"
            });
        }
    }
}
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
                    bind: "data-open-modal"
                },
                {
                    label: "Cancelar",
                    autoClose: true
                }
            ]
        },
        function (err, data) {
            if (err) {
                // do error handling
            } else {
                console.log(data);
            }
        }
    );

    carregaListaDeAssinantes();

    $(".modal-footer")
        .find("button")
        .each(function () {
            if ($(this).html() == "Enviar") {
                $(this).on("click", function () {
                    criaDocNoFluig();
                });
            }
        });
}
function carregaListaDeAssinantes() {
    DatasetFactory.getDataset("ds_vertsign_assinantes", null, [], null,{
        success: (ds)=>{
            var list = [];

            for (var i = 0; i < ds.values.length; i++) {
                list.push(ds.values[i]["nome"] + " | " + ds.values[i]["email"] + " | " + ds.values[i]["cpf"]);
            }
        
            myAutocomplete = FLUIGC.autocomplete("#selectParteAssinaturaModal", {
                source: substringMatcher(list),
                name: "cities",
                displayKey: "description",
                tagClass: "tag-gray",
                type: "autocomplete"
            });
        },
        error: (error)=>{
            FLUIGC.toast({
                title: "Erro ao buscar assinantes: ",
                message: error,
                type: "warning"
            });
        }
    });
}
function CriaAssinaturaEletronica(idDoc, descricao) {
    gravarJsonSigners();
    var horario2 = new Date().toLocaleTimeString("pt-BR");
    var hoje = new Date().toLocaleDateString("pt-BR");
    var arrSigners = JSON.parse($("#jsonSigners").val());
    var cState = 217;
    var idAnexo = idDoc;
    var vrAnexo = 1000;
    var dsAnexo = descricao;

    var nmArquivo = {
        name: "nmArquivo",
        value: dsAnexo
    };
    var codArquivo = {
        name: "codArquivo",
        value: idAnexo
    };
    var vrArquivo = {
        name: "vrArquivo",
        value: vrAnexo
    };
    var codPasta = {
        name: "codPasta",
        value: 140518 //Prod
        //value: 17926 //Homolog
    };
    var codRemetente = {
        name: "codRemetente",
        value: $("#userCode").val()
    };
    var contraint = DatasetFactory.createConstraint("colleagueId", $("#userCode").val(), $("#userCode").val(), ConstraintType.MUST);
    var contraints = [contraint];
    var dataset = DatasetFactory.getDataset("colleague", null, contraints, null);
    var nmRemetente = {
        name: "nmRemetente",
        value: dataset.values[0]["colleagueName"]
    };
    var emails = {
        name: "jsonSigners",
        value: JSON.stringify(arrSigners)
    };
    var formDescription = {
        name: "formDescription",
        value: dsAnexo
    };
    var status = {
        name: "status",
        value: "Enviando para assinatura"
    };
    var metodo = {
        name: "metodo",
        value: "create"
    };
    var dataEnvio = {
        name: "dataEnvio",
        value: hoje
    };
    var horaEnvio = {
        name: "horaEnvio",
        value: horario2
    };
    var numSolic = {
        name: "numSolic",
        value: $("#numProcess").val()
    };
    var choosedState = {
        name: "choosedState",
        value: cState
    };

    var constraints = [nmArquivo, codArquivo, vrArquivo, codPasta, codRemetente, nmRemetente, emails, formDescription, status, metodo, dataEnvio, horaEnvio, numSolic, choosedState];
    var listConstraints = [];
    for (var j = 0; j < constraints.length; j++) {
        listConstraints.push(DatasetFactory.createConstraint(constraints[j].name, constraints[j].value, constraints[j].value, ConstraintType.MUST));
    }
    var dsAux = DatasetFactory.getDataset("ds_auxiliar_vertsign", null, listConstraints, null);
    if (dsAux.values[0]["Result"] === "OK") {
        FLUIGC.toast({
            message: "Documento enviado.",
            type: "success"
        });
        inserirLinhaQuadroStatus();
        myModal.remove();
    }
}
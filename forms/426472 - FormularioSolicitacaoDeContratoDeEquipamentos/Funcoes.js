timer = 0;
dataTable = null;
dataTableContratoPrincipal = null;

function BuscaObras() {
    var c1 = DatasetFactory.createConstraint("colleagueId", $("#userCode").val(), $("#userCode").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("groupId", "Controladoria", "Controladoria", ConstraintType.SHOULD);
    var c3 = DatasetFactory.createConstraint("groupId", "Administrador TI", "Administrador TI", ConstraintType.SHOULD);
    var c4 = DatasetFactory.createConstraint("groupId", "Comprador", "Comprador", ConstraintType.SHOULD);
    var c5 = DatasetFactory.createConstraint("groupId", "Juridico", "Juridico", ConstraintType.SHOULD);
    var ds = DatasetFactory.getDataset("colleagueGroup", null, [c1, c2, c3, c4, c5], null);
    var constraints = [];
    if (ds.values.length > 0) {
        constraints.push(DatasetFactory.createConstraint("permissaoGeral", "true", "true", ConstraintType.MUST));
    }
    constraints.push(DatasetFactory.createConstraint("usuario", $("#userCode").val(), $("#userCode").val(), ConstraintType.MUST));

    var ds = DatasetFactory.getDataset("BuscaPermissaoColigadasUsuario", null, constraints, null);
    if (ds.values.length > 0) {
        $("#obra").html("<option></option>");
        var coligadaGroup = null;
        for (var i = 0; i < ds.values.length; i++) {
            if (coligadaGroup != ds.values[i].NOMEFANTASIA) {
                coligadaGroup = ds.values[i].NOMEFANTASIA;
                $("#obra").append("<optgroup label='" + ds.values[i].CODCOLIGADA + " - " + ds.values[i].NOMEFANTASIA + "'></optgroup>");
            }

            $("#obra")
                .find("optgroup:last")
                .append("<option value='" + ds.values[i].CODCOLIGADA + " - " + ds.values[i].CODCCUSTO + " - " + ds.values[i].perfil + "'>" + ds.values[i].CODCCUSTO + " - " + ds.values[i].perfil + "</option>");
        }
    }
}
function showDetails(values) {
    var html =
        "<div class='row'>\
            <div class='col-md-3'>\
                <b>Modelo: </b><input id='Modelo_" +
        values.PREFIXO.replace(".", "") +
        "' class='form-control campo" +
        values.PREFIXO.replace(".", "") +
        "' value='" +
        values.MODELO +
        "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Descrição: </b><input id='Descricao_" +
        values.PREFIXO.replace(".", "") +
        "' class='form-control campo" +
        values.PREFIXO.replace(".", "") +
        "' value='" +
        values.DESCRICAO +
        "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Valor do Equipamento: </b><input id='Valor_" +
        values.PREFIXO.replace(".", "") +
        "' class='form-control campo" +
        values.PREFIXO.replace(".", "") +
        "' value='" +
        values.VALOR +
        "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Valor de Locação: </b><input id='ValorLocacao_" +
        values.PREFIXO.replace(".", "") +
        "' class='form-control campo" +
        values.PREFIXO.replace(".", "") +
        "' value='" +
        values.VALORLOCACAO +
        "'>\
                <br>\
            </div>\
        </div>\
        <div class='row'>\
            <div class='col-md-3'>\
                <b>Placa/Serie: </b><input id='Placa_" +
        values.PREFIXO.replace(".", "") +
        "' class='form-control campo" +
        values.PREFIXO.replace(".", "") +
        "' value='" +
        values.PLACA +
        "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Chassi: </b><input id='Chassi_" + values.PREFIXO.replace(".", "") + "' class='form-control campo" + values.PREFIXO.replace(".", "") + "' value='" + values.CHASSI + "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Fabricante: </b><input id='Fabricante_" + values.PREFIXO.replace(".", "") + "' class='form-control campo" + values.PREFIXO.replace(".", "") + "' value='" + values.FABRICANTE + "'>\
                <br>\
            </div>\
            <div class='col-md-3'>\
                <b>Ano: </b><input id='Ano_" + values.PREFIXO.replace(".", "") + "' class='form-control campo" + values.PREFIXO.replace(".", "") + "' value='" + values.ANO + "'>\
                <br>\
            </div>\
        </div>";

    return html;
}
function CarregaListaEquipamentos() {
    $(".checkboxEqp").on("click", function () {
        if ($("#isContratoSave").val() == 1) {
            FLUIGC.toast({
                title: "Erro: ",
                message: "Não é possivel incluir ou remover equipamentos com o contrato salvo.",
                type: "warning"
            });
            return false;
        } else {
            var tr = $(this).closest("tr");
            var row = dataTable.row(tr);
            var values = row.data();

            if ($(this).is(":checked")) {
                var valida = true;

                var cnpj = values.CPFCNPJ;
                $(".checkboxEqp:checked").each(function () {
                    if (dataTable.row($(this).closest("tr")).data().CPFCNPJ != cnpj) {
                        valida = false;
                    }
                });

                if (valida) {
                    BuscaFornecedor(values.CPFCNPJ);
                    row.child(showDetails(values)).show();
                    tr.addClass("shown");
                    $(tr).find("td:first").attr("rowspan", 2);
                    $("#tableEquipamentos").find(".form-control").on("blur", function () {
                        ValidaTerminoTabEquipamentos("Valida");
                    });
                    $("#tableEquipamentos").find(".form-control").on("focus touch", function () {
                        $(this).removeClass("has-error");
                    });
                    $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).mask("000.000.000.000,00", { reverse: true });
                    $("#Valor_" + values.PREFIXO.replace(".", "")).mask("000.000.000.000,00", { reverse: true });
                    $("#tableEquipamentos").find(".form-control").off("blur");

                    if ($("#idContrato").val() == 1 || $("#idContrato").val() == 4 || $("#idContrato").val() == 19) {
                        var html =
                            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                        <td class='tableTd'>" + values.PREFIXO + "</td>\
                        <td class='tableTd'>" + values.DESCRICAO + "</td>\
                        <td class='tableTd'>" + values.FABRICANTE + "</td>\
                        <td class='tableTd'>" + values.MODELO + "</td>\
                        <td class='tableTd'>" + values.ANO + "</td>\
                        <td class='tableTd'>";
                        if (values.PLACA != "") {
                            html += values.PLACA;
                        } else {
                            html += values.CHASSIS;
                        }
                        html += "</td>\
                            <td class='tableTd'>";

                        var valor = FormataValor(values.VALORLOCACAO)
                        valor = valor.substring(3, valor.length)

                        html += valor + "</td>\
                        </tr>";
                        console.log(values.VALORLOCACAO);

                        $("#tbody").append(html);

                        $("#Descricao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(2)").text($(this).val());
                        });
                        $("#Fabricante_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(3)").text($(this).val());
                        });
                        $("#Modelo_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(4)").text($(this).val());
                        });
                        $("#Ano_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(5)").text($(this).val());
                        });
                        $("#Placa_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(6)").text($(this).val());
                        });
                        $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(7)").text($(this).val());
                        });
                    }
                    else if ($("#idContrato").val() == 11 || $("#idContrato").val() == 12) {
                        var html =
                            "<tr class='linhaEquipamento" + values.PREFIXO.replace(".", "") + "'>\
                            <td class='tableTd'>" + values.PREFIXO + "</td>\
                            <td class='tableTd'>" + values.DESCRICAO + "</td>\
                            <td class='tableTd'>" + values.FABRICANTE + "</td>\
                            <td class='tableTd'>";
                        if (values.PLACA != "") {
                            html += values.PLACA;
                        } else {
                            html += values.CHASSIS;
                        }
                        html += "</td>\
                            <td class='tableTd'>" + values.ANO + "</td>\
                        </tr>";

                        $("#tbody").append(html);

                        $("#Descricao_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(2)").text($(this).val());
                        });
                        $("#Fabricante_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(3)").text($(this).val());
                        });
                        $("#Placa_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(4)").text($(this).val());
                        });
                        $("#Ano_" + values.PREFIXO.replace(".", "")).on("change", function () {
                            $("#tbody").find("tr.linhaEquipamento" + values.PREFIXO.replace(".", "")).find("td:nth-child(5)").text($(this).val());
                        });
                    }
                } else {
                    FLUIGC.toast({
                        title: "Erro: ",
                        message: "Não é possível escolher equipamentos de fornecedores diferentes.",
                        type: "warning"
                    });
                    return false;
                }
            } else {
                $("#tabelaEquipamentos").find("tbody").find(".linhaEquipamento" + values.PREFIXO.replace(".", "")).remove();

                row.child.hide();
                $(tr).find("td:first").attr("rowspan", 1);
                tr.removeClass("shown");
            }
            ValidaTerminoTabEquipamentos("Valida");
        }
    });
}
function geraListEquipamentos() {
    var obra = $("#hiddenCODGCCUSTO").val();
    var c1 = DatasetFactory.createConstraint("OPERACAO", "SELECTWHEREOBRA", "SELECTWHEREOBRA", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCCUSTO", obra, obra, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);

    dataTable.clear().draw();
    dataTable.rows.add(ds.values); // Add new data
    dataTable.columns.adjust().draw(); // Redraw the DataTable
    $("#tableEquipamentos").css("width", "100%");
    CarregaListaEquipamentos();
}
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || cnpj == "11111111111111" || cnpj == "22222222222222" || cnpj == "33333333333333" || cnpj == "44444444444444" || cnpj == "55555555555555" || cnpj == "66666666666666" || cnpj == "77777777777777" || cnpj == "88888888888888" || cnpj == "99999999999999") return false;

    // Valida DVs
    tamanho = cnpj.length - 2;
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}
function validaCPF(separacpf) {
    // Verificado em 18/05/2017 conforme: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
    // 0: válido; 1: inválido
    separacpf = separacpf.replace(/[^\d]+/g, "");

    var retorno = 0;
    var num1 = separacpf[0];
    var num2 = separacpf[1];
    var num3 = separacpf[2];
    var num4 = separacpf[3];
    var num5 = separacpf[4];
    var num6 = separacpf[5];
    var num7 = separacpf[6];
    var num8 = separacpf[7];
    var num9 = separacpf[8];
    var num10 = separacpf[9];
    var num11 = separacpf[10];
    if (num1 == num2 && num2 == num3 && num3 == num4 && num4 == num5 && num5 == num6 && num6 == num7 && num7 == num8 && num8 == num9 && num9 == num10) {
        return false;
    } else {
        var soma1 = num1 * 10 + num2 * 9 + num3 * 8 + num4 * 7 + num5 * 6 + num6 * 5 + num7 * 4 + num8 * 3 + num9 * 2;
        var resto1 = (soma1 * 10) % 11;
        if (resto1 == 10 || resto1 == 11) {
            resto1 = 0;
        }
        if (num10 != resto1) {
            return false;
        } else {
            var soma2 = num1 * 11 + num2 * 10 + num3 * 9 + num4 * 8 + num5 * 7 + num6 * 6 + num7 * 5 + num8 * 4 + num9 * 3 + num10 * 2;
            var resto2 = (soma2 * 10) % 11;
            if (resto2 == 10 || resto2 == 11) {
                resto2 = 0;
            }
            if (num11 != resto2) {
                return false;
            }
        }
    }
    return true;
}
function resizeInput(thisObj) {
    $("#hide").css("font-size", thisObj.css("font-size"));
    $("#hide").css("font-family", thisObj.css("font-family"));
    $("#hide").css("font-weight", thisObj.css("font-weight"));
    if (thisObj.val() != "") {
        $("#hide").text(thisObj.val());
        thisObj.width($("#hide").width());
    } else if (thisObj.attr("placeholder") != "" && thisObj.attr("placeholder") != undefined && thisObj.attr("placeholder") != null) {
        console.log("elseifou!");
        $("#hide").text(thisObj.attr("placeholder"));
        thisObj.width($("#hide").width());
    }
    else {
        thisObj.width("100%");
    }
}
function verificaDia(dia) {
    if (dia > 3 && dia < 10 && dia.length < 2) dia = "0" + dia;
    else if (dia > 31) dia = 31;
    else if (dia == 0 && dia.length >= 2) dia = "0" + "1";
    else if (dia < 0) dia = "0" + "1";

    if (dia.length > 2) {
        dia = dia.split("");
        dia = dia[dia.length - 2] + dia[dia.length - 1];
    }
    return dia;
}
function verificaMes(mes) {
    if (mes > 1 && mes < 10 && mes.length < 2) {
        mes = "0" + mes;
    }
    else if (mes > 12) {
        mes = 12;
    }
    else if (mes.length > 2) {
        mes = mes.substring(mes.length - 2, mes.length);
    }
    return mes;
}
function verificaAno(ano) {
    if (ano < 1900 && ano.length >= 4) ano = 1900;
    else if (ano > 2099 && ano.length >= 4) ano = 2099;
    return ano;
}
function FormataValor(valor) {
    valor = parseFloat(valor);
    return valor.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
}
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(this.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
}
function BuscaFornecedor(cnpj) {
    $("#FornecedorCNPJ").val(cnpj);
    var c1 = DatasetFactory.createConstraint("CGCCFO", cnpj, cnpj, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("EnderecoFornecedor", null, [c1], null);

    if (ds.values.length > 0) {
        $("#FornecedorContrato").val(ds.values[0].NOMEFANTASIA);
        $("#assinaturaFornecedor").text(ds.values[0].NOMEFANTASIA);
        $("#FornecedorCGCCFO").val(cnpj);
        $("#FornecedorRua").val(ds.values[0].RUA);
        $("#FornecedorNumero").val(ds.values[0].NUMERO);
        $("#FornecedorBairro").val(ds.values[0].BAIRRO);
        $("#FornecedorCidade").val(ds.values[0].CIDADE);
        $("#FornecedorEstado").val(ds.values[0].CODETD);

        $("input.resize").each(function () {
            resizeInput($(this));
        });
    }
}
function numeroPorExtenso(value, centavos) {
    //retorna o numero passado por extenso
    var resposta = "";

    if (value != "" && value != " " && value != null && value != undefined) {
        var unidade = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];

        var dezena = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];

        var centena = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

        list = value.split(",")[0].split("");
        list = list.reverse();
        while (list[list.length - 1] == 0) list.pop();
        for (var i = list.length - 1; i >= 0; i--) {
            if (value == 0) {
                return "zero";
            }
            if (value < 20) {
                return unidade[list.reverse().join("")];
            }
            if (value == "100") {
                return "cem";
            } else if (value == "1000") {
                return "mil";
            } else {
                if (i == 5 || i == 2 || i == 8) {
                    if (list[i] == 1 && list[i - 1] == 0 && list[i - 2] == 0) {
                        resposta += "cem";
                    } else resposta += centena[parseInt(list[i])] + " ";

                    if (list[i - 1] != 0) {
                        resposta += "e ";
                    }
                } else if (i == 4 || i == 1 || i == 7) {
                    if (list[i] < 2 && list[i] > 0) {
                        resposta += unidade[parseInt(list[i] + "" + list[i - 1])];
                    } else {
                        resposta += dezena[list[i]] + " ";
                        if (list[i - 1] != 0) {
                            resposta += "e ";
                        }
                    }
                } else {
                    if ((list[i + 1] >= 2 || list[i + 1] == 0 || list[i + 1] == null) && (i != 3 || list[i] != 1)) {
                        resposta += unidade[list[i]];
                    }
                    if (i == 3) {
                        resposta += " mil ";
                        if (list[2] != 0 && list[1] == 0 && list[0] == 0) {
                            resposta += "e ";
                        }
                    }
                    if (i == 6) {
                        resposta += " milhões ";
                    }
                }
            }
        }
        resposta = resposta.split("  ");
        resposta = resposta.join(" ");

        string = resposta.substring(0, 1);
        if (string == " ") {
            resposta = resposta.substring(1, resposta.length);
        }

        do {
            string = resposta.substring(resposta.length - 1);
            if (string == " " || string == "") {
                resposta = resposta.substring(0, resposta.length - 1);
            }
        } while (string == " ");
        if (centavos) {
            resposta += " reais";
            list = value.split(",")[1].split("");
            if (list[0] != 0 || list[1] != 0) {
                if (list[0] < 2 && list[0] > 0) {
                    resposta += " e " + unidade[list[0] + "" + list[1]] + " centavos";
                } else {
                    if (list[0] > 0) {
                        resposta += " e " + dezena[list[0]];
                    }
                    if (list[1] > 0) {
                        resposta += " e " + unidade[list[1]];
                    }
                    if (list[0] == 0 && list[1] == 1) {
                        resposta += " centavo";
                    } else {
                        resposta += " centavos";
                    }
                }
            }
        }
    }
    return resposta;
}
function CriaDocFluig(idInput, i = 0) {
    var files = $("#" + idInput)[0].files;
    var reader = new FileReader();
    var fileName = "";
    fileName = files[i].name;

    var callback = {
        success: function (dataset) {
            if (!dataset || dataset == "" || dataset == null) {
                throw "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
            } else {
                if (dataset.values[0][0] == "false") {
                    throw "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + dataset.values[0][1];
                } else {
                    console.log("### GEROU docID = " + dataset.values[0].Resultado);


                    if (idInput == "myFile") {//Se o documento que está sendo anexado seja o contrato
                        $("#idDocContrato").val(dataset.values[0].Resultado);
                        ValidaTerminoTabContrato(true);
                    } else if ($("#idDoc" + idInput.split("inputFile")[1]).val() == null || $("#idDoc" + idInput.split("inputFile")[1]).val() == "") {//Se esta sendo anexado somente um documento
                        $("#idDoc" + idInput.split("inputFile")[1]).val(dataset.values[0].Resultado);
                    } else {//Se mais de um documento esta sendo anexado concatena no input os IDs dos documentos
                        $("#idDoc" + idInput.split("inputFile")[1]).val($("#idDoc" + idInput.split("inputFile")[1]).val() + "," + dataset.values[0].Resultado);
                    }

                    if (files.length > i + 1) {//Se tem mais documentos para anexar chama a funcao novamente passando o proximo documento
                        dataset.values[0].Resultado += "," + CriaDocFluig(idInput, i + 1);
                    }
                    else {
                        if (i > 0) {
                            $("#" + idInput)
                                .siblings("div")
                                .html((i + 1) + " Documentos");
                        } else {
                            $("#" + idInput).siblings("div").html(fileName);
                        }
                    }
                }
            }
        },
        error: function (error) {
            console.log("Erro ao criar documento no Fluig: " + error);
            $(this).siblings("div").html("Nenhum arquivo selecionado");
            throw error;
        }
    }

    reader.readAsDataURL(files[i]);
    reader.onload = function (e) {
        var bytes = e.target.result.split("base64,")[1];

        var p1 = DatasetFactory.createConstraint("processo", $("#numProcess").val(), $("#numProcess").val(), ConstraintType.MUST);
        var p2 = DatasetFactory.createConstraint("idRM", "Teste", "Teste", ConstraintType.MUST);
        var p3 = DatasetFactory.createConstraint("conteudo", bytes, bytes, ConstraintType.MUST);
        var p4 = DatasetFactory.createConstraint("nome", fileName, fileName, ConstraintType.SHOULD);
        var p5 = DatasetFactory.createConstraint("descricao", fileName, fileName, ConstraintType.SHOULD);
        var p6 = DatasetFactory.createConstraint("pasta", 140518, 140518, ConstraintType.SHOULD); //Prod
        //var p6 = DatasetFactory.createConstraint("pasta", 17926, 17926, ConstraintType.SHOULD); //Homolog

        DatasetFactory.getDataset("CriacaoDocumentosFluig", null, [p1, p2, p3, p4, p5, p6], null, callback);
    };
}
function CriaDocFluigPromise(idInput, i = 0) {
    return new Promise((resolve, reject)=>{
        var files = $("#" + idInput)[0].files;
        var reader = new FileReader();
        var fileName = "";
        fileName = files[i].name;

        reader.readAsDataURL(files[i]);
        reader.onload = function (e) {
            var bytes = e.target.result.split("base64,")[1];
    
            var p1 = DatasetFactory.createConstraint("processo", $("#numProcess").val(), $("#numProcess").val(), ConstraintType.MUST);
            var p2 = DatasetFactory.createConstraint("idRM", "Teste", "Teste", ConstraintType.MUST);
            var p3 = DatasetFactory.createConstraint("conteudo", bytes, bytes, ConstraintType.MUST);
            var p4 = DatasetFactory.createConstraint("nome", fileName, fileName, ConstraintType.SHOULD);
            var p5 = DatasetFactory.createConstraint("descricao", fileName, fileName, ConstraintType.SHOULD);
            var p6 = DatasetFactory.createConstraint("pasta", 140518, 140518, ConstraintType.SHOULD); //Prod
            //var p6 = DatasetFactory.createConstraint("pasta", 17926, 17926, ConstraintType.SHOULD); //Homolog
    
            DatasetFactory.getDataset("CriacaoDocumentosFluig", null, [p1, p2, p3, p4, p5, p6], null, {
                success: function (dataset) {
                    if (!dataset || dataset == "" || dataset == null) {
                        throw "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
                    } else {
                        if (dataset.values[0][0] == "false") {
                            throw "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + dataset.values[0][1];
                        } else {
                            console.log("### GEROU docID = " + dataset.values[0].Resultado);
                            resolve(dataset.values[0].Resultado);
        
                            if (idInput == "myFile") {//Se o documento que está sendo anexado seja o contrato
                                $("#idDocContrato").val(dataset.values[0].Resultado);
                                ValidaTerminoTabContrato(true);
                            } else if ($("#idDoc" + idInput.split("inputFile")[1]).val() == null || $("#idDoc" + idInput.split("inputFile")[1]).val() == "") {//Se esta sendo anexado somente um documento
                                $("#idDoc" + idInput.split("inputFile")[1]).val(dataset.values[0].Resultado);
                            } else {//Se mais de um documento esta sendo anexado concatena no input os IDs dos documentos
                                $("#idDoc" + idInput.split("inputFile")[1]).val($("#idDoc" + idInput.split("inputFile")[1]).val() + "," + dataset.values[0].Resultado);
                            }
        
                            if (files.length > i + 1) {//Se tem mais documentos para anexar chama a funcao novamente passando o proximo documento
                                dataset.values[0].Resultado += "," + CriaDocFluig(idInput, i + 1);
                            }
                            else {
                                if (i > 0) {
                                    $("#" + idInput)
                                        .siblings("div")
                                        .html((i + 1) + " Documentos");
                                } else {
                                    $("#" + idInput).siblings("div").html(fileName);
                                }
                            }
                        }
                    }
                },
                error: function (error) {
                    console.log("Erro ao criar documento no Fluig: " + error);
                    $(this).siblings("div").html("Nenhum arquivo selecionado");
                    reject();
                    throw error;
                }
            });
        };





    });




}
function VerificaAnexos() {
    var atividade = $("#atividade").val();
    if (atividade == 0 || atividade == 1 || atividade == 7) {
        if ($("#tpCont").val() == 2 && ($("#idDocContrato").val() == null || $("#idDocContrato").val() == "")) {
            return "Contrato não anexado!";
        }
        var id = null;
        if ($("#tpCont").val() != 2) {
            id = $("#idContrato").val();
        }
        else {
            switch ($("#selectOptAnexos").val()) {
                case "Locação de Equipamentos":
                    id = 1;
                    break;
                case "Locação de Imóvel - Pessoa Física":
                    id = 2;
                    break;
                case "Locação de Imóvel - Pessoa Jurídica":
                    id = 3;
                    break;
                case "Prestação de Serviço":
                    id = 13;
                    break;
                case "Transporte de Material":
                    id = 12;
                    break;
                case "Transporte de Funcionários":
                    id = 18;
                    break;
                case "Locação de Container":
                    id = 5;
                    break;
                case "Locação de Sanitários":
                    id = 17;
                    break;
                default:
                    break;
            }
        }
        var found = jsonModelosDeContrato.find(e => {
            return e.id == id;
        });

        if (found.anexos.includes("CNPJ") && ($("#idDocCNPJ").val() == null || $("#idDocCNPJ").val() == "")) {
            return "CNPJ não anexado!";
        }
        else if (found.anexos.includes("QSA") && ($("#idDocQSA").val() == null || $("#idDocQSA").val() == "")) {
            return "QSA não anexado!";
        }
        else if (found.anexos.includes("DocsAdministrador") && ($("#DocsAdministrador").val() == "RG e CPF" && ($("#idDocCPF").val() == null || $("#idDocCPF").val() == ""))) {
            return "CPF não anexado!";
        }
        else if (found.anexos.includes("DocsAdministrador") && ($("#DocsAdministrador").val() == "RG e CPF" && ($("#idDocRG").val() == null || $("#idDocRG").val() == ""))) {
            return "RG não anexado!";
        }
        else if (found.anexos.includes("DocsAdministrador") && ($("#DocsAdministrador").val() == "CNH" && ($("#idDocCNH").val() == null || $("#idDocCNH").val() == ""))) {
            return "CNH não anexada!";
        }
        else if (found.anexos.includes("NFRemessa") && ($("#checkboxNFRemessa").is(":checked") && ($("#idDocNF").val() == null || $("#idDocNF").val() == ""))) {
            return "NF de Remessa não anexada!";
        }
        else if (found.anexos.includes("Certidoes") && ($("#idDocCertidoes").val() == null || $("#idDocCertidoes").val() == "")) {
            return "Certidões não anexadas!";
        }
        else if (found.anexos.includes("TermoDeImovel") && ($("#idDocTermoDeImovel").val() == null || $("#idDocTermoDeImovel").val() == "")) {
            return "Termo de Solicitação de Imóvel não anexado!";
        }
    }
    else if (atividade == 19) {
        if ($("#idDocContrato").val() == null || $("#idDocContrato").val() == "") {
            return "Contrato não anexado!";
        }
    }

    return true;
}
function substringMatcher(strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        matches = [];

        substrRegex = new RegExp(q, "i");

        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push({
                    description: str
                });
            }
        });
        cb(matches);
    };
}
function criaCodigoCnt(coligada, ccusto) {
    if ($("#tpCont").val() == 1 || $("#tpCont").val() == 2) {
        var c0 = DatasetFactory.createConstraint("OPERACAO", "BuscaCodContratoPorCCusto", "BuscaCodContratoPorCCusto", ConstraintType.MUST);
        var c1 = DatasetFactory.createConstraint("CODCOLIGADA", coligada, coligada, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("CCUSTO", ccusto, ccusto, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("ANOCONTRATO", new Date().getFullYear().toString().substring(2), new Date().getFullYear().toString().substring(2), ConstraintType.MUST);
        var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c0, c1, c2, c3], null);

        var codigoContrato = ds.values[0].CODIGOCONTRATO;
        if (codigoContrato != "   -   ") {
            codigoContrato = parseInt(codigoContrato.split("-")[1].split("/")[0]) + 1;
            codigoContrato = ccusto + "-" + ("000" + codigoContrato).slice(-3) + "/" + new Date().getFullYear().toString().substring(2);
        } else {
            codigoContrato = ccusto + "-001" + "/" + new Date().getFullYear().toString().substring(2);
        }
        return codigoContrato;
    }
    else {
        var json = JSON.parse($("#JSONContratoPrincipal").val());
        var codigoContrato = json.CODIGOCONTRATO;
        return codigoContrato;
    }
}
function BuscaFilial() {
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var retorno = DatasetFactory.getDataset("GFILIAL", null, [c1], ["CODFILIAL"]);

    $("#codFilial").html("<option></option>");
    for (var i = 0; i < retorno.values.length; i++) {
        var option = "<option value='" + retorno.values[i].CODFILIAL + "'>" + retorno.values[i].NOMEFANTASIA + "</option>";
        $("#codFilial").append(option);
    }
}
function BuscaTipoDeContrato() {
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var retorno = DatasetFactory.getDataset("TTCN", null, [c1], ["CODTCN"]);

    $("#tipoContrato").html("<option></option>");
    for (var i = 0; i < retorno.values.length; i++) {
        var option = "<option value='" + retorno.values[i].CODTCN + "'>" + retorno.values[i].DESCRICAO + "</option>";
        $("#tipoContrato").append(option);
    }
}
/*
function BuscaCodicaoDePagamento() {
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var retorno = DatasetFactory.getDataset("TCPG", null, [c1], ["CODCPG"]);

    $("#tipoPagamento").html("<option></option>");
    for (var i = 0; i < retorno.values.length; i++) {
        var option = "<option value='" + retorno.values[i].CODCPG + "'>" + retorno.values[i].NOME + "</option>";
        $("#tipoPagamento").append(option);
    }
}*/
function BuscaCentroDeCusto() {
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("ATIVO", "T", "T", ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CODCCUSTO", "1", "1", ConstraintType.MUST_NOT);
    var retorno = DatasetFactory.getDataset("GCCUSTO", null, [c1, c2, c3], ["CODCCUSTO"]);

    retorno.values.sort(compareCODCCUSTO);

    $("#codCCusto").html("<option></option>");
    for (var i = 0; i < retorno.values.length; i++) {
        var option = "<option value='" + retorno.values[i].CODCCUSTO + "'>" + retorno.values[i].CODCCUSTO + " - " + retorno.values[i].NOME + "</option>";
        $("#codCCusto").append(option);
    }
}
function compareCODCCUSTO(a, b) {
    if (a.CODCCUSTO < b.CODCCUSTO) {
        return -1;
    }
    if (a.CODCCUSTO > b.CODCCUSTO) {
        return 1;
    }
    return 0;
}
function BuscaRepresentantes() {
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("INATIVO", "0", "0", ConstraintType.MUST);
    var retorno = DatasetFactory.getDataset("TRPR", null, [c1, c2], ["CODRPR"]);

    $("#representante").html("<option></option>");
    for (var i = 0; i < retorno.values.length; i++) {
        var option = "<option value='" + retorno.values[i].CODRPR + "'>" + retorno.values[i].NOME + "</option>";
        $("#representante").append(option);
    }
}
function BuscaLocalDeEstoque() {
    var c1 = DatasetFactory.createConstraint("clg", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("cdFl", $("#codFilial").val(), $("#codFilial").val(), ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("LocalRM", null, [c1, c2], null);

    $("#locEstoque").html("<option></option>");
    for (var i = 0; i < ds.values.length; i++) {
        var option = "<option value='" + ds.values[i].codloc + "'>" + ds.values[i].codloc + " - " + ds.values[i].nome + "</option>";
        $("#locEstoque").append(option);
    }
}
function selecionaColigada() {
    var codColigada = $("#codColigada").val();
    if (codColigada != "") {
        BuscaFilial();
        $("#codFilial").attr("readonly", false);
    } else {
        $("#codFilial").attr("readonly", true);
        $("#codNatureza,#codContrato,#descContrato,#tipoContrato,#codCCusto,#representante,#tipoPagamento,#locEstoque,#codStaCnt,#tipoFaturamentoContratoRM,#diaFaturamentoContratoRM,#QtdeFaturamentos,#dataContratoRM").attr("readonly", true);
    }
}
function selecionaFilial() {
    if ($("#codFilial").val() != "") {
        BuscaStatusContrato();
        BuscaTipoDeContrato();
        BuscaRepresentantes();
        BuscaStatusContrato();
        BuscaCentroDeCusto();
        BuscaLocalDeEstoque();
        $("#codNatureza,#codContrato,#descContrato,#tipoContrato,#codCCusto,#representante,#tipoPagamento,#locEstoque,#codStaCnt,#tipoFaturamentoContratoRM,#dataContratoRM").attr("readonly", false);

        if ($("#tipoFaturamentoContratoRM").val() == 1) {
            $("#diaFaturamentoContratoRM,#QtdeFaturamentos").attr("readonly", false);
        }
        else {
            $("#diaFaturamentoContratoRM,#QtdeFaturamentos").attr("readonly", true);
        }

        var date = $("#dataContrato").val();
        if (date != "") {
            date = date.split("/");
            date = (date[0] < 10 ? "0" + date[0] : date[0]) + "/" + (date[1] < 10 ? "0" + date[1] : date[1]) + "/" + date[2];
            $("#dataContratoRM").val(date);
        }

    } else {
        $("#codNatureza,#codContrato,#descContrato,#tipoContrato,#codCCusto,#representante,#tipoPagamento,#locEstoque,#codStaCnt,#tipoFaturamentoContratoRM,#dataContratoRM").attr("readonly", true);
    }
}
function BuscaProduto() {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaProduto", "BuscaProduto", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCOLIGADA", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2], null);

    var retorno = "<option></option>";

    for (var i = 0; i < ds.values.length; i++) {
        retorno += "<option value='" + ds.values[i].IDPRD + "'>" + ds.values[i].VISUAL + "</option>";
    }

    return retorno;
}
function BuscaDepartamento() {
    var c1 = DatasetFactory.createConstraint("codcoligada", $("#codColigada").val(), $("#codColigada").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("codfilial", $("#codFilial").val(), $("#codFilial").val(), ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DepartamentosRM", null, [c1, c2], null);
    ds.values.sort(compareNomeDepartamento);

    return ds.values;
}
function compareNomeDepartamento(a, b) {
    if (a.coddepartamento < b.coddepartamento) {
        return -1;
    }
    if (a.coddepartamento > b.coddepartamento) {
        return 1;
    }
    return 0;
}
function BuscaStatusContrato() {
    var coligada = $("#codColigada").val();
    var c1 = DatasetFactory.createConstraint("CODCOLIGADA", coligada, coligada, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("TSTACNT", null, [c1], ["CODSTACNT"]);
    $("#codStaCnt").html("<option></option>");
    for (var i = 0; i < ds.values.length; i++) {
        var option = "<option value='" + ds.values[i].CODSTACNT + "'>" + ds.values[i].CODSTACNT + " - " + ds.values[i].DESCRICAO + "</option>";
        $("#codStaCnt").append(option);
    }
    $("#codStaCnt").val("05");
}
function IncluirRateioItemContrato(countItem) {
    var count2 = $("#tbodyRateioItensContratoRM" + countItem).find("tr").length + 1;
    var html =
        "<tr>\
        <td style='text-align: center; width: 1px; vertical-align: middle;'>" +
        count2 +
        "</td>\
        <td>\
            <select id='selectDepartamentoRateioItensContratoRM" +
        countItem +
        "-" +
        count2 +
        "' class='form-control selectDepartamentoRateioItensContratoRM campoRM'>\
            <option></option>\
            </select>\
        </td>\
        <td>\
            <input id='inputValorRateioItensContratoRM" +
        countItem +
        "-" +
        count2 +
        "' class='form-control inputValorRateioItensContratoRM campoRM'>\
        </td>\
        <td style='text-align: center; width: 1px; vertical-align: middle;'>\
            <button class='btn btn-primary btnRemoveRow' onclick='var tbody = $(this).closest(" +
        '"tbody"' +
        "); $(this).closest(" +
        '"tr"' +
        ").remove(); reordenarRateioItensContratoRM(tbody); ValidaTerminoTabRM();'>\
            <i class='flaticon flaticon-trash icon-sm'></i>\
            </button>\
        </td>\
    </tr>";

    $("#tbodyRateioItensContratoRM" + countItem).append(html);
    $("#inputValorRateioItensContratoRM" + countItem + "-" + count2).mask("000.000.000.000,00", { reverse: true });

    var ds = BuscaDepartamento();
    for (var i = 0; i < ds.length; i++) {
        var option = "<option value='" + ds[i].coddepartamento + "'>" + ds[i].coddepartamento + " - " + ds[i].nome + "</option>";
        $("#selectDepartamentoRateioItensContratoRM" + countItem + "-" + count2).append(option);
    }
    $(".campoRM").off("blur");
    $(".campoRM").on("blur", function () {
        ValidaTerminoTabRM();
    });
}
function IncluirItemContrato() {
    var countItem = $("#divItensContratoRM").find(".rowItem").length + 1;

    var html =
        "<div class='panel panel-primary rowItem'>\
        <div class='panel-heading' style='display:flex; align-items: center;'>\
            <h3 class='panel-title'>Item " +
        countItem +
        "</h3>\
            <button class='btn btn-danger' align='right' style='margin-left: auto;' onclick='" +
        '$(this).closest(".rowItem").remove();' +
        "reordenarItensContratoRM();' ValidaTerminoTabRM();>Remover</button>\
        </div>\
        <div class='panel-body'>\
            <div class='row'>\
                <div class='col-md-4'>\
                    <label style='display:block;'>\
                        Produto:\
                        <select id='inputProdContratoRM" +
        countItem +
        "' name='inputProdContratoRM" +
        countItem +
        "' class='form-control inputProdContratoRM campoRM'>" +
        BuscaProduto() +
        "</select>\
                    </label>\
                </div>\
                <div class='col-md-4'>\
                    <label style='display:block;'>\
                        Valor:\
                        <input id='inputValorContratoRM" +
        countItem +
        "' name='inputValorContratoRM" +
        countItem +
        "' class='form-control inputValorContratoRM campoRM' placeholder='Valor'>\
                    </label>\
                </div>\
            </div>\
            <div class='row'>\
                <div class='col-md-12'>\
                    <h3>Rateio</h3>\
                    <button class='btn btn-primary' onclick='IncluirRateioItemContrato(" +
        countItem +
        ")'>Adicionar</button>\
                    <br>\
                    <table class='table table-bordered' style='background-color: transparent;'>\
                        <thead>\
                            <th style='text-align: center; width: 1px; vertical-align: middle;'>\
                                Rateio\
                            </th>\
                            <th>Departamento</th>\
                            <th>Valor</th>\
                        </thead>\
                        <tbody id='tbodyRateioItensContratoRM" +
        countItem +
        "' class='tbodyRateioItensContratoRM'>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>\
    </div>";

    $("#divItensContratoRM").append(html);
    $("#inputValorContratoRM" + countItem).mask("000.000.000.000,00", { reverse: true });

    /*     $("#inputProdContratoRM" + countItem).on("keyup", function (e) {
        if (e.key == "Enter") {
            var ds = BuscaProduto($(this).val());
            $("#datalistinputFiltro" + countItem).html("");

            for (var i = 0; i < ds.length; i++) {
                var option = "<option value='" + ds[i].CODIGOPRD + "'>" + ds[i].VISUAL + "</option>";
                $("#datalistinputFiltro" + countItem).append(option);
            }
        }
    }); */

    $(".btnRemoveRow").on("click", function () {
        $(this).closest("tr").next().remove();
        $(this).closest("tr").remove();
        var i = 1;
        $("#tableItensContratoRM")
            .find("tbody")
            .find("[class^='trItem']")
            .each(function () {
                $(this).find("td:first").html(i);
                i++;
            });
    });
    $(".campoRM").off("blur");
    $(".campoRM").on("blur", function () {
        ValidaTerminoTabRM();
    });
}
function delay(callback, ms) {
    let timer = 0;
    clearTimeout(timer);
    timer = setTimeout(() => {
        callback();
    }, ms);
}
function JSONItemCntRM() {
    console.log("inicio json");
    $("#JSONItemContratoRM").val("");
    var json = [];

    $("#divItensContratoRM")
        .find(".rowItem")
        .each(function () {
            var json2 = {
                Produto: $(this).find("[id^='inputProdContratoRM']").val(),
                IDPRD: $(this).find("[id^='inputProdContratoRM']").val(),
                Valor: $(this).find("[id^='inputValorContratoRM']").val(),
                Rateio: []
            };
            var totalRateio = 0;
            $(this)
                .find("[id^='tbodyRateioItensContratoRM']")
                .find("tr")
                .each(function () {
                    totalRateio += ValorToFloat($(this).find("td:eq(2)").find("input").val());
                });

            $(this)
                .find("[id^='tbodyRateioItensContratoRM']")
                .find("tr")
                .each(function () {
                    json2.Rateio.push({
                        Departamento: $(this).find("td:eq(1)").find("select").val(),
                        Valor: $(this).find("td:eq(2)").find("input").val(),
                        Percentual: Math.round((ValorToFloat($(this).find("td:eq(2)").find("input").val()) * 100) / totalRateio)
                    });
                });
            json.push(json2);
        });

    $("#JSONItemContratoRM").val(JSON.stringify(json));
    console.log("inicio json");
}
function BuscaIdprd(CODCOLIGADA, CODIGOPRD) {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaProdutoPorCodigo", "BuscaProdutoPorCodigo", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODIGOPRD", CODIGOPRD, CODIGOPRD, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CODCOLIGADA", CODCOLIGADA, CODCOLIGADA, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2, c3], null);
    return ds.values[0].IDPRD;
}
function BuscaPrdPorId(CODCOLIGADA, IDPRD) {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaProdutoPorId", "BuscaProdutoPorId", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("IDPRD", IDPRD, IDPRD, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CODCOLIGADA", CODCOLIGADA, CODCOLIGADA, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2, c3], null);
    return ds.values[0];
}
function ValidaCamposContratoRM() {
    console.log("inicio valida");
    if ($("#codColigada").val() == null || $("#codColigada").val() == undefined || $("#codColigada").val() == "") {
        return "Coligada não selecionada!";
    } else if ($("#codFilial").val() == null || $("#codFilial").val() == undefined || $("#codFilial").val() == "") {
        return "Filial não selecionada!";
    } else if ($("#tipoContrato").val() == null || $("#tipoContrato").val() == undefined || $("#tipoContrato").val() == "") {
        return "Tipo do contrato não selecionado!";
    } else if ($("#codCCusto").val() == null || $("#codCCusto").val() == undefined || $("#codCCusto").val() == "") {
        return "Centro de custo não selecionado!";
    } else if ($("#codContrato").val() == null || $("#codContrato").val() == undefined || $("#codContrato").val() == "") {
        return "Código do contrato não inserido!";
    } else if ($("#locEstoque").val() == null || $("#locEstoque").val() == undefined || $("#locEstoque").val() == "") {
        return "Local de estoque não selecionado!";
    } else if ($("#codStaCnt").val() == null || $("#codStaCnt").val() == undefined || $("#codStaCnt").val() == "") {
        return "Status do contrato não selecionado!";
    } else if ($("#codNatureza").val() == null || $("#codNatureza").val() == undefined || $("#codNatureza").val() == "") {
        return "Natureza do contrato não selecionada!";
    } else if ($("#tipoPagamento").val() == null || $("#tipoPagamento").val() == undefined || $("#tipoPagamento").val() == "") {
        return "Condição de pagamento não selecionada!";
    } else if ($("#descContrato").val() == null || $("#descContrato").val() == undefined || $("#descContrato").val() == "") {
        return "Descrição do contrato não inserida!";
    } else if ($("#representante").val() == null || $("#representante").val() == undefined || $("#representante").val() == "") {
        return "Representante não selecionado!";
    }
    else if ($("#tipoFaturamentoContratoRM").val() == null || $("#tipoFaturamentoContratoRM").val() == undefined || $("#tipoFaturamentoContratoRM").val() == "") {
        return "Tipo de Faturamento não selecionado!";
    }
    else if ($("#tipoFaturamentoContratoRM").val() == 1 && ($("#QtdeFaturamentos").val() == null || $("#QtdeFaturamentos").val() == undefined || $("#QtdeFaturamentos").val() == "")) {
        return "Quantidade de faturamentos não informada!";
    } else if ($("#tipoFaturamentoContratoRM").val() == 1 && ($("#diaFaturamentoContratoRM").val() == null || $("#diaFaturamentoContratoRM").val() == undefined || $("#diaFaturamentoContratoRM").val() == "")) {
        return "Dia do faturamento não informado!";
    } else if ($("#Campofornecedor").val() == null || $("#Campofornecedor").val() == undefined || $("#Campofornecedor").val() == "") {
        return "Fornecedor não informado!";
    } else if (ValidaItensContratoRM() != true) {
        return ValidaItensContratoRM();
    } else {
        console.log("fim valida");
        return true;
    }
}
function ValidaItensContratoRM() {
    var retorno = "Nenhum item inserido!";

    $("#divItensContratoRM")
        .find(".rowItem")
        .each(function (i) {
            retorno = true;
            if ($(this).find("[id^='inputProdContratoRM']").val() == "" || $(this).find("[id^='inputProdContratoRM']").val() == null || $(this).find("[id^='inputProdContratoRM']").val() == undefined) {
                retorno = "Produto do " + (i + 1) + "º item não informado!";
                return false;
            } else if ($(this).find("[id^='inputValorContratoRM']").val() == "" || $(this).find("[id^='inputValorContratoRM']").val() == null || $(this).find("[id^='inputValorContratoRM']").val() == undefined) {
                retorno = "Valor do " + (i + 1) + "º item não informado!";
                return false;
            } else {
                var retorno2 = "Nenhum rateio inserido no " + (i + 1) + "º item!";
                $(this)
                    .find("[id^='tbodyRateioItensContratoRM']")
                    .find("tr")
                    .each(function (j) {
                        retorno2 = true;
                        if ($(this).find("[id^='selectDepartamentoRateioItensContratoRM']").val() == "" || $(this).find("[id^='selectDepartamentoRateioItensContratoRM']").val() == null || $(this).find("[id^='selectDepartamentoRateioItensContratoRM']").val() == undefined) {
                            retorno2 = "Departamento da " + (j + 1) + "ª linha do rateio do " + (i + 1) + "º item não selecionado!";
                            return false;
                        } else if ($(this).find("[id^='inputValorRateioItensContratoRM']").val() == "" || $(this).find("[id^='inputValorRateioItensContratoRM']").val() == null || $(this).find("[id^='inputValorRateioItensContratoRM']").val() == undefined) {
                            retorno2 = "Valor da " + (j + 1) + "ª linha do rateio do " + (i + 1) + "º item não informado!";
                            return false;
                        }
                    });

                if (retorno2 != true) {
                    retorno = retorno2;
                    return false;
                }
            }
        });

    return retorno;
}
function ValorToFloat(valor) {
    if (valor.split("R$").length > 1) {
        valor = valor.split("R$")[1];
    }
    valor = valor.split(".").join("").split(",").join(".");
    return parseFloat(valor);
}
function reordenarItensContratoRM() {
    $(".rowItem").each(function (i) {
        $(this)
            .find(".panel-title")
            .text("Item " + (i + 1));
    });
}
function reordenarRateioItensContratoRM(tbody) {
    console.log(tbody);
    $(tbody)
        .find("tr")
        .each(function (i) {
            console.log($(this));
            $(this)
                .find("td:first")
                .text(i + 1);
        });
}
function ValidaAssinantes() {
    var atividade = $("#atividade").val();

    if (atividade == 0 || atividade == 1 || atividade == 7) {
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
            throw "Nenhuma opção selecionada para outra parte do contrato.";
        } else {
            $("#jsonAssinaturaEletronica").val(JSON.stringify(json));
            return true;
        }
    } else if (atividade == 19) {
        var json = [];

        if ($("#selectAssinanteCastilho").val() == null || $("#selectAssinanteCastilho").val() == "") {
            throw "Representante do contrato não foi informado na assinatura eletrônica!";
        }

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
            throw "Nenhuma opção selecionada para outra parte do contrato.";
        } else {
            $("#jsonAssinaturaEletronica").val(JSON.stringify(json));
            return true;
        }
    }
}
function EnviaSolicitacao() {
    if ($("#atividade").val() == 19) {
        if ($("[name='decisaoCont']:checked").val() == 1) {
            if ($("#inputFileContrato")[0].files.length > 0) {
                $("#idDocContrato").val("");


                CriaDocFluigPromise("inputFileContrato").then(()=>{
                    loading.hide();

                    $("#workflowActions > button:first-child", window.parent.document).click();


                });
       

            } else {
                if ($("#idDocContrato").val() == "" || $("#idDocContrato").val() == null || !confirm("Deseja manter o documento antigo?")) {
                    FLUIGC.toast({
                        message: "Contrato não foi anexado.",
                        type: "warning"
                    });
                    throw "Contrato não foi anexado!";
                } else {
                    $("#workflowActions > button:first-child", window.parent.document).click();
                }
            }
        }
        else {
            $("#workflowActions > button:first-child", window.parent.document).click();
        }
    } else {
        $("#workflowActions > button:first-child", window.parent.document).click();
    }
}
function ValidaFornecedor(CNPJ) {
    var c1 = DatasetFactory.createConstraint("CGCCFO", CNPJ, CNPJ, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("EnderecoFornecedor", null, [c1], null);

    if (ds.values.length > 0) {
        if ($("#Fornecedor").val() != ds.values[0].NOMEFANTASIA || $("#FornecedorRua").val() != ds.values[0].RUA || $("#FornecedorNumero").val() != ds.values[0].NUMERO || $("#FornecedorBairro").val() != ds.values[0].BAIRRO || $("#FornecedorCidade").val() != ds.values[0].CIDADE || $("#FornecedorEstado").val() != ds.values[0].CODETD) {
            if (confirm("Deseja carregar os dados do fornecedor para o contrato?")) {
                $("#FornecedorContrato").val(ds.values[0].NOMEFANTASIA);
                $("#assinaturaFornecedor").text(ds.values[0].NOMEFANTASIA);
                $("#FornecedorCGCCFO").val(CNPJ);
                $("#FornecedorRua").val(ds.values[0].RUA);
                $("#FornecedorNumero").val(ds.values[0].NUMERO);
                $("#FornecedorBairro").val(ds.values[0].BAIRRO);
                $("#FornecedorCidade").val(ds.values[0].CIDADE);
                $("#FornecedorEstado").val(ds.values[0].CODETD);

                $("input.resize").each(function () {
                    resizeInput($(this));
                });
            }
        }
        return true;
    } else {
        return false;
    }
}
function criaDocNoFluig() {
    var file = $("#fileupload");
    if (file[0].files.length == 1) {
        var reader = new FileReader();
        reader.readAsDataURL(file[0].files[0]);
        reader.onload = function () {
            var bytes = reader.result.split("base64,")[1];
            var RMidmov = "Teste";
            var processoFluig = $("#numProcess").val();
            var nome = file[0].files[0].name;
            var descricao = file[0].files[0].name;

            var p1 = DatasetFactory.createConstraint("processo", processoFluig, processoFluig, ConstraintType.MUST);
            var p2 = DatasetFactory.createConstraint("idRM", RMidmov, RMidmov, ConstraintType.MUST);
            var p3 = DatasetFactory.createConstraint("conteudo", bytes, bytes, ConstraintType.MUST);
            var p4 = DatasetFactory.createConstraint("nome", nome, nome, ConstraintType.SHOULD);
            var p5 = DatasetFactory.createConstraint("descricao", descricao, descricao, ConstraintType.SHOULD);
            var p6 = DatasetFactory.createConstraint("pasta", 140518, 140518, ConstraintType.SHOULD); //Prod
            //var p6 = DatasetFactory.createConstraint("pasta", 17926, 17926, ConstraintType.SHOULD); //Homolog

            var constraints = new Array(p1, p2, p3, p4, p5, p6);

            var res = DatasetFactory.getDataset("CriacaoDocumentosFluig", null, constraints, null);

            if (!res || res == "" || res == null) {
                return "Houve um erro na comunicação com o webservice de criação de documentos. Tente novamente!";
            } else {
                if (res.values[0][0] == "false") {
                    return "Erro ao criar arquivo. Favor entrar em contato com o administrador do sistema. Mensagem: " + res.values[0][1];
                } else {
                    console.log("### GEROU docID = " + res.values[0].Resultado);
                    CriaAssinaturaEletronica(res.values[0].Resultado, descricao);
                    return res.values[0].Resultado;
                }
            }
        };
    } else {
        return "Nenhum documento anexado.";
    }
}
function VerificaSeContratoCriadoRm() {
    var idcnt = $("#idCntRm").val();
    if (idcnt != "") {
        $("#btnItensContratoRM").hide();
        $("#codColigada").attr("readonly", "readonly");
        $("#codFilial").attr("readonly", "readonly");
        var filial = $("#codFilial").val();
        BuscaFilial();
        $("#codFilial").val(filial);

        var tpContrato = $("#tipoContrato").val();
        BuscaTipoDeContrato();
        $("#tipoContrato").attr("readonly", "readonly");
        $("#tipoContrato").val(tpContrato);

        $("#codCCusto").attr("readonly", "readonly");
        var codCCusto = $("#codCCusto").val();
        BuscaCentroDeCusto();
        $("#codCCusto").val(codCCusto);

        $("#codContrato").attr("readonly", "readonly");

        $("#locEstoque").attr("readonly", "readonly");
        var locEstoque = $("#locEstoque").val();
        BuscaLocalDeEstoque();
        $("#locEstoque").val(locEstoque);

        $("#codStaCnt").attr("readonly", "readonly");
        var codStaCnt = $("#codStaCnt").val();
        BuscaStatusContrato();
        $("#codStaCnt").val(codStaCnt);

        $("#codNatureza").attr("readonly", "readonly");

        $("#tipoPagamento").attr("readonly", "readonly");
        var tipoPagamento = $("#tipoPagamento").val();
        $("#tipoPagamento").val(tipoPagamento);

        $("#descContrato").attr("readonly", "readonly");

        $("#representante").attr("readonly", "readonly");
        var representante = $("#representante").val();
        BuscaRepresentantes();
        $("#representante").val(representante);

        $("#QtdeFaturamentos").attr("readonly", "readonly");

        $("#diaFaturamentoContratoRM").attr("readonly", "readonly");

        $("#divCampofornecedor").hide();
        var fornecedor = BuscaFornecedorPorId($("#Campofornecedor").val());
        $("#spanForncedor").text(fornecedor.values[0].CGCCFO + " - " + fornecedor.values[0].NOMEFANTASIA);

        $("#tabCamposRM")
            .find("select")
            .each(function () {
                $(this).siblings("span").text($(this).find("option:selected").text());
                $(this).hide();
            });

        var itens = JSON.parse($("#JSONItemContratoRM").val());
        for (var i = 0; i < itens.length; i++) {
            var rateio = itens[i].Rateio;
            var html =
                "<div class='panel panel-primary rowItem'>\
            <div class='panel-heading' style='display:flex; align-items: center;'>\
                <h3 class='panel-title'>Item " +
                (i + 1) +
                "</h3>\
            </div>\
            <div class='panel-body'>\
                <div class='row'>\
                    <div class='col-md-4'>\
                        <label style='display:block;'>\
                            Produto:\
                            <input class='form-control inputProdContratoRM' readonly value='" +
                BuscaPrdPorId($("#hiddenCodColigada").val(), itens[i].Produto).DESCRICAO +
                "'>\
                        </label>\
                    </div>\
                    <div class='col-md-4'>\
                        <label style='display:block;'>\
                            Valor:\
                            <input class='form-control inputValorContratoRM' readonly value='" +
                itens[i].Valor +
                "'>\
                        </label>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='col-md-12'>\
                        <h3>Rateio</h3>\
                        <br>\
                        <table class='table table-bordered' style='background-color: transparent;'>\
                            <thead>\
                                <th style='text-align: center; width: 1px; vertical-align: middle;'>\
                                    Rateio\
                                </th>\
                                <th>Departamento</th>\
                                <th>Valor</th>\
                            </thead>\
                            <tbody>";

            for (var j = 0; j < rateio.length; j++) {
                html += "<tr class='trBlack'>\
                                        <td>" + (j + 1) + "</td>\
                                        <td>" + rateio[j].Departamento + "</td>\
                                        <td>" + rateio[j].Valor + "</td>\
                                    </tr>";
            }

            html += "</tbody>\
                        </table>\
                    </div>\
                </div>\
            </div>\
        </div>";
            $("#divItensContratoRM").append(html);
        }
    } else {
        $("#tabCamposRM").find(".spanReadonly").hide();
    }
}
function BuscaFornecedorPorId(CODCFO) {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaFornecedorPorId", "BuscaFornecedorPorId", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CODCFO", CODCFO, CODCFO, ConstraintType.MUST);
    return DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2], null);
}
function ValidaTerminoTabEquipamentos(condicao) {
    if (condicao == true) {
        $("#atabEquipamentos").addClass("btn-castilho");
    } else if (condicao == "Valida") {
        var valida = "Nenhum equipamento selecionado!";
        $(".checkboxEqp:checked").each(function (i) {
            if (i == 0) {
                valida = true;
            }

            var tr = $(this).closest("tr");
            var row = dataTable.row(tr);
            var values = row.data();

            $(".campo" + values.PREFIXO.replace(".", "")).each(function () {
                if ($(this).val() == "") {
                    if (valida == true) {
                        valida = false;
                    }
                }
            });
        });

        if (valida == true) {
            $("#atabEquipamentos").addClass("btn-castilho");
        } else {
            $("#atabEquipamentos").removeClass("btn-castilho");
        }
    } else {
        var valida = "Nenhum equipamentos selecionado!";

        $(".checkboxEqp:checked").each(function (i) {
            if (i == 0) {
                valida = true;
            }
            var tr = $(this).closest("tr");
            var row = dataTable.row(tr);
            var values = row.data();

            $(".campo" + values.PREFIXO.replace(".", "")).each(function () {
                if ($(this).val() == "") {
                    $(this).addClass("has-error");

                    if (valida == true) {
                        valida = "Campo não preenchido.";
                        $("#atabEquipamentos").click();
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(this).offset().top - screen.height * 0.15
                        },
                            700
                        );
                    }
                }
            });
        });

        if (valida == true) {
            $("#atabEquipamentos").addClass("btn-castilho");
        } else {
            $("#atabEquipamentos").removeClass("btn-castilho");
        }
        return valida;
    }
}
function ValidaTerminoTabContrato(condicao) {
    if (condicao == true) {
        $("#atabContrato").addClass("btn-castilho");
    } else {
        $("#atabContrato").removeClass("btn-castilho");
    }
}
function ValidaTerminoTabRM(condicao) {
    if (condicao == true) {
        $("#atabCamposRM").addClass("btn-castilho");
    } else {
        var valida = true;

        $(".campoRM").each(function () {
            if ($(this).val() == "" && (($(this).attr("id") != "diaFaturamentoContratoRM" && $(this).attr("id") != "QtdeFaturamentos") || $("#tipoFaturamentoContratoRM").val() == 1)) {
                valida = "Campo não preenchido!";
            }
        });

        if ($("#Campofornecedor").val() == "") {
            valida = "Campo não preenchido!";
        }

        if (valida == true) {
            $("#atabCamposRM").addClass("btn-castilho");
        }
        else {
            $("#atabCamposRM").removeClass("btn-castilho");
        }
    }
}
function ValidaTerminoTabAssinatura(condicao) {
    if (condicao == true) {
        $("#atabAssinatura").addClass("btn-castilho");
    } else if (condicao == false) {
        $("#atabAssinatura").removeClass("btn-castilho");
    } else {
        if ($("[name='radioOptAssinatura']:checked").val() == "Eletronica" && $("#divListAssinantes").find(".row").length < 1) {
            $("#atabAssinatura").removeClass("btn-castilho");
        } else if ($("#atividade").val() == 19 && $("[name='radioOptAssinatura']:checked").val() == "Eletronica" && $("#selectAssinanteCastilho").val() == "") {
            $("#atabAssinatura").removeClass("btn-castilho");
        } else {
            $("#atabAssinatura").addClass("btn-castilho");
        }
    }
}
function ValidaTerminoTabAnexos(condicao) {
    if (condicao == true) {
        $("#atabAnexos").addClass("btn-castilho");
    } else if (condicao == false) {
        $("#atabAnexos").removeClass("btn-castilho");
    } else {
        if ($("#inputFileCNPJ").val() == "" || $("#inputFileQSA").val() == "") {
            $("#atabAnexos").removeClass("btn-castilho");
        } else if ($("#DocsAdministrador").val() == "RG e CPF" && ($("#inputFileRG").val() == "" || $("#inputFileCPF").val() == "")) {
            $("#atabAnexos").removeClass("btn-castilho");
        } else if ($("#DocsAdministrador").val() == "CNH" && $("#inputFileCNH").val() == "") {
            $("#atabAnexos").removeClass("btn-castilho");
        } else if ($("#checkboxNFRemessa").is(":checked") && $("#inputFileNF").val() == "") {
            $("#atabAnexos").removeClass("btn-castilho");
        } else {
            $("#atabAnexos").addClass("btn-castilho");
        }
    }
}
function ValidaTerminoTabContratoPrincipal(condicao) {
    if (condicao == true) {
        $("#atabContratoPrincipal").addClass("btn-castilho");
    } else if (condicao == false) {
        $("#atabContratoPrincipal").removeClass("btn-castilho");
    } else {
        if ($(".checkboxSelecionaAditivo:checked, .checkboxSelecionaRescicao:checked").length == 1) {
            $("#atabContratoPrincipal").addClass("btn-castilho");
        }
        else {
            $("#atabContratoPrincipal").removeClass("btn-castilho");
        }
    }
}
function VerificaAlteracaoNoEquipamento() {
    var listDif = [];
    var listEqp = [];
    $("#tbodyEquipamentos")
        .find(".checkboxEqp:checked")
        .each(function () {
            var tr = $(this).closest("tr");
            var row = dataTable.row(tr);
            var values = row.data();

            var json = {
                PREFIXO: values.PREFIXO,
                OBRA: values.OBRA,
                CHASSI: $("#Chassi_" + values.PREFIXO.replace(".", "")).val(),
                PLACA: $("#Placa_" + values.PREFIXO.replace(".", "")).val(),
                CPFCNPJ: values.CPFCNPJ,
                FORNECEDOR: values.FORNECEDOR,
                FABRICANTE: $("#Fabricante_" + values.PREFIXO.replace(".", "")).val(),
                ANO: $("#Ano_" + values.PREFIXO.replace(".", "")).val(),
                MODELO: $("#Modelo_" + values.PREFIXO.replace(".", "")).val(),
                DESCRICAO: $("#Descricao_" + values.PREFIXO.replace(".", "")).val(),
                VALOR: $("#Valor_" + values.PREFIXO.replace(".", "")).val(),
                VALORLOCACAO: $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).val()
            };
            listEqp.push(json);

            var jsonDif = {};
            if ($("#Modelo_" + values.PREFIXO.replace(".", "")).val() != values.MODELO) {
                jsonDif.modelo = $("#Modelo_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.modeloPrev = values.MODELO;
            }
            if ($("#Descricao_" + values.PREFIXO.replace(".", "")).val() != values.DESCRICAO) {
                jsonDif.descricao = $("#Descricao_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.descricaoPrev = values.DESCRICAO;
            }
            if ($("#ValorLocacao_" + values.PREFIXO.replace(".", "")).val().split(".").join("").replace(",", ".") != values.VALORLOCACAO) {
                jsonDif.valorLocacao = $("#ValorLocacao_" + values.PREFIXO.replace(".", "")).val().split(".").join("").replace(",", ".");
                jsonDif.valorLocacaoPrev = values.VALORLOCACAO;
            }
            if ($("#Valor_" + values.PREFIXO.replace(".", "")).val().split(".").join("").replace(",", ".") != values.VALOR) {
                jsonDif.valor = $("#Valor_" + values.PREFIXO.replace(".", "")).val().split(".").join("").replace(",", ".");
                jsonDif.valorPrev = values.VALOR;
            }
            if ($("#Placa_" + values.PREFIXO.replace(".", "")).val() != values.PLACA) {
                jsonDif.placa = $("#Placa_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.placaPrev = values.PLACA;
            }
            if ($("#Chassi_" + values.PREFIXO.replace(".", "")).val() != values.CHASSI) {
                jsonDif.chassi = $("#Chassi_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.chassiPrev = values.CHASSI;
            }
            if ($("#Fabricante_" + values.PREFIXO.replace(".", "")).val() != values.FABRICANTE) {
                jsonDif.fabricante = $("#Fabricante_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.fabricantePrev = values.FABRICANTE;
            }
            if ($("#Ano_" + values.PREFIXO.replace(".", "")).val() != values.ANO) {
                jsonDif.ano = $("#Ano_" + values.PREFIXO.replace(".", "")).val();
                jsonDif.anoPrev = values.ANO;
            }

            if (JSON.stringify(jsonDif) != "{}") {
                jsonDif.prefixo = values.PREFIXO;
                listDif.push(jsonDif);
            }
        });


    if (JSON.stringify(listEqp) != "[]") {
        $("#equipamentosSel").val(JSON.stringify(listEqp));
    }

    if (JSON.stringify(listDif) != "[]") {
        $("#alteracoesEquipamentos").val(JSON.stringify(listDif));
        AtualizaEquipamentos();
    }
}
function SalvaEquipamentosIncluidos() {
    var headers = [];
    $("#tabelaEquipamentos").find("thead").find("th").each(function () {
        headers.push($(this).text());
    })

    var json = [];
    $("#tabelaEquipamentos").find("tbody").find("tr").each(function (i) {
        if ($(this).hasClass("trEquipamento")) {
            json.push({});
        }
    });
}
function AtualizaEquipamentos() {
    var equipamentos = $("#alteracoesEquipamentos").val();
    var c1 = DatasetFactory.createConstraint("OPERACAO", "ATUALIZAEQUIPAMENTO", "ATUALIZAEQUIPAMENTO", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("JSONEQUIPAMENTO", equipamentos, equipamentos, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);
}
function BuscaLogoColigada(coligada) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: "GET",
            url: "http://fluig.castilho.com.br:1010/api/public/ecm/document/listDocument/401359", //Prod
            //url: "http://homologacao.castilho.com.br:2020/api/public/ecm/document/listDocument/24308", //Homolog
            error: function (x, e) {
                console.log(x);
                console.log(e);
                if (x.status == 500) {
                    reject("Busca regionais das obras: Erro Interno do Servidor: entre em contato com o Administrador.");
                }
            },
            success: function (retorno) {
                for (var i = 0; i < retorno.content.length; i++) {
                    if (retorno.content[i].description == "LogoColigada-" + coligada) {
                        resolve(retorno.content[i].fileURL);
                    }
                }
            },
        });
    });
}
function BuscaContratos() {
    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaContratos", "BuscaContratos", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CCUSTO", $("#hiddenCODGCCUSTO").val(), $("#hiddenCODGCCUSTO").val(), ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("CODCOLIGADA", $("#hiddenCodColigada").val(), $("#hiddenCodColigada").val(), ConstraintType.MUST);
    DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2, c3], null, {
        success: (ds) => {
            dataTableContratoPrincipal.clear().draw();
            dataTableContratoPrincipal.rows.add(ds.values);
            setTimeout(() => {
                dataTableContratoPrincipal.columns.adjust().draw(); //Redraw the DataTable 
            }, 400);


            ValidaTerminoTabContratoPrincipal();
        },
        error: (error) => {
            FLUIGC.toast({
                title: "Erro ao buscar contratos: ",
                message: error,
                type: "warning"
            });
        }
    });
}
function atribuicaoEngCoord() {
    if ($("#hiddenCodColigada").val() == 5) {
        $("#engenheiro").val(1);
        $("#coordenador").val("marcelo.passerotti");
        return;
    }

    var c1 = DatasetFactory.createConstraint("paramCodcoligada", $("#hiddenCodColigada").val(), $("#hiddenCodColigada").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("paramLocal", $("#hiddenObra").val(), $("#hiddenObra").val(), ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("paramCodTmv", "1.1.98", "1.1.98", ConstraintType.MUST);
    var c4 = DatasetFactory.createConstraint("paramValorTotal", 1001, 1001, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("verificaAprovador", null, [c1, c2, c3, c4], null);
    var coord = eng = null;

    for (var i = 0; i < ds.values.length; i++) {
        if (ds.values[i].limite > 1000 && ds.values[i].limite <= 20000) {
            var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", ds.values[i].usuarioFLUIG, ds.values[i].usuarioFLUIG, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", "aprovaContratos", "aprovaContratos", ConstraintType.MUST);
            var ds2 = DatasetFactory.getDataset("workflowColleagueRole", null, [c1, c2], null);
            console.log(ds2);
            if (ds2.values.length > 0) {
                if (ds.values[i].usuarioFLUIG == $("#nomeusu").val()) {
                    eng = 1;
                } else {
                    eng = ds.values[i].usuarioFLUIG;
                }
            }
        }
        else if (ds.values[i].limite > 20000 && ds.values[i].limite <= 250000) {
            console.log("ifou2");
            var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", ds.values[i].usuarioFLUIG, ds.values[i].usuarioFLUIG, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", "aprovaContratos", "aprovaContratos", ConstraintType.MUST);
            var ds2 = DatasetFactory.getDataset("workflowColleagueRole", null, [c1, c2], null);
            console.log(ds2);
            if (ds2.values.length > 0) {
                coord = ds.values[i].usuarioFLUIG;
            }
        }
    }

    if (eng != null) {
        $("#engenheiro").val(eng);
    }
    if (coord != null) {
        $("#coordenador").val(coord);
    }
}
function setSelectedZoomItem(selectedItem) {
    if (selectedItem.inputId == "zoomFornecedor") {
        var div =
            "<div class='row'>\
            <div class='col-md-6'><label>Fornecedor:</label> " + selectedItem.NOMEFANTASIA + "</div>\
            <div class='col-md-3'><label>CPF/CNPJ:</label> " + selectedItem.CGCCFO + "</div>\
            <div class='col-md-3'><label>Código:</label> " + selectedItem.Código + "</div>\
        </div>";
        $("#divFornecedorSelected").html(div);

        $("#Fornecedor").val(selectedItem.NOMEFANTASIA);
        $("#FornecedorCNPJ").val(selectedItem.CGCCFO);
        VerificaSeNotaDeRemessaNecessaria();
    }
    else if (selectedItem.inputId == "Campofornecedor") {
        var codigo = selectedItem["CODCFO"];
        $("#codFornecedor").val(codigo);
    }
}
function removedZoomItem(removedItem) {
    if (removedItem.inputId == "zoomFornecedor") {
        $("#Fornecedor").val("");
        $("#FornecedorCNPJ").val("");
    }
    $("#divFornecedorSelected").html("");
}
function VerificaSeFornecedorMesmaCidadeObra() {
    var obra = $("#hiddenObra").val();
    var fornecedorCNPJ = $("#FornecedorCNPJ").val();

    var c1 = DatasetFactory.createConstraint("OPERACAO", "BuscaFornecedorPorCNPJ", "BuscaFornecedorPorCNPJ", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("CNPJ", fornecedorCNPJ, fornecedorCNPJ, ConstraintType.MUST);
    var ds = DatasetFactory.getDataset("DatasetProcessoContratos", null, [c1, c2], null);

    var found = Obras.find(e => e.nome == obra);
    if (found.cidade.includes(ds.values[0].CIDADE)) {
        return true;
    }
    else {
        return false;
    }
}
function VerificaSeNotaDeRemessaNecessaria() {
    var tpcont = $("#selectTipoContrato").val();
    if (tpcont == "Aditivo Locação de Equipamento" || tpcont == "Sem Mão de Obra" || tpcont == "Com Mão de Obra" || tpcont == "Fora do padrão Castilho") {
        if (VerificaSeFornecedorMesmaCidadeObra() == false) {
            if ($("#checkboxNFRemessa").prop("checked") == false) {
                $("#checkboxNFRemessa").click();
            }

            $("#checkboxNFRemessa").off("click");
            $("#checkboxNFRemessa").on("click", () => { return false; });
            return;
        }
    }

    $("#checkboxNFRemessa").off("click");
    $("#checkboxNFRemessa").on("click", function () {
        if ($(this).is(":checked")) {
            $("#inputFileNF").closest("div").show();
        } else {
            $("#inputFileNF").closest("div").hide();
        }
        ValidaTerminoTabAnexos(null);
    });
    return;
}
function ValidaAntesDeEnviar() {
    if ($("#hiddenCodColigada, #hiddenObra, #hiddenCODGCCUSTO").val() == "") {
        return "Obra não selecionada!";
    }
    if (($("[name='decisaoCont']:checked").val() == undefined || $("[name='decisaoCont']:checked").val() == null || $("[name='decisaoCont']:checked").val() == "") && ($("#atividade").val() != 1 && $("#atividade").val() != 0 && $("#atividade").val() != 7 && $("#atividade").val() != 32 && $("#atividade").val() != 33 && $("#atividade").val() != 34 && $("#atividade").val() != 35)) {
        return "Nenhuma decisão selecionada!";
    }

    if ($("#atividade").val() == 0 || $("#atividade").val() == 1 || $("#atividade").val() == 7) {
        if (($("#isContratoSave").val() != 1 || $("#SalvaHtmlContrato").val() == "" || $("#valorCamposContrato").val() == "") && $("#tpCont").val() != 2) {
            $("#atabContrato").click();
            return "Necessário salvar o contrato.";
        }


        if ($("#tpCont").val() == 1) {
            var retorno = ValidaTerminoTabEquipamentos(); //Valida se os dados dos equipamentos estão preenchidos
            if (retorno != true) {
                if ($("#equipamentosPreenchidos").val() == "" || $("#equipamentosPreenchidos").val() == null || $("#equipamentosPreenchidos").val() == undefined) {
                    return retorno;
                }
            }
        }
        else if ($("#tpCont").val() == 2) {
            if ($("#Fornecedor").val() == "" || $("#Fornecedor").val() == null || $("#FornecedorCNPJ").val() == "" || $("#FornecedorCNPJ").val() == null) {
                return "Fornecedor não selecionado!";
            }
        }
        else if ($("#tpCont").val() == 3) {
            if (($("#JSONContratoPrincipal").val() == "")) {
                return "Contrato principal não foi selecionado!";
            }
        }
        else if ($("#tpCont").val() == 4) {
            if (($("#JSONContratoPrincipal").val() == "")) {
                return "Contrato principal não foi selecionado!";
            }
        }

        if ($("[name='radioOptAssinatura']:checked").val() == "Eletronica") {//Valida se assinatura eletrônica for preenchida
            var validacaoAssinantes = ValidaAssinantes();
            if (validacaoAssinantes != true) {
                return validacaoAssinantes;
            }
        }
        else if ($("[name='radioOptAssinatura']:checked").val() != "Assinado" && $("[name='radioOptAssinatura']:checked").val() != "Manual") {
            return "Forma de assinatura não selecionada!";
        }

        if (VerificaAnexos() != true) {//Verifica se os anexos foram incluidos
            return VerificaAnexos();
        }
        VerificaAlteracaoNoEquipamento();//Se houve alteração nos dados de equipamento dispara e-mail avisando

    }
    else if ($("#atividade").val() == 15) {
        if ($("#tpCont").val() != 2 && ($("#isContratoSave").val() != 1 || $("#SalvaHtmlContrato").val() == "" || $("#valorCamposContrato").val() == "")) {
            $("#atabContrato").click();
            return "Necessário salvar o contrato.";
        }
    }
    else if ($("#atividade").val() == 19) {
        if (($("#tpCont").val() != 2 || $("#tpCont").val() == 4) && ($("#isContratoSave").val() != 1 || $("#SalvaHtmlContrato").val() == "" || $("#valorCamposContrato").val() == "")) {
            $("#atabContrato").click();
            return "Necessário salvar o contrato.";
        }

        if ($("[name='decisaoCont']:checked").val() == 1) {
            if ($("#idDocContrato").val() == "") {
                if ($("#userCode").val() == "victor.cardoso") {
                    return "Victor, não gerou o documento, você clicou no enviar certo? Tem que ser no Enviar verde lá de baixo onde você anexa o documento, e não no enviar lá de cima. Da uma olhada ai por favor!";
                }
                else {
                    return "Documento não anexado.";
                }
            }
            if ($("#radioOptAssinaturaEletronica").is(":checked")) {
                var validacaoAssinantes = ValidaAssinantes();
                if (validacaoAssinantes != true) {
                    return validacaoAssinantes;
                }
            }
            if ($("#codColigada").val() != "" && $("#idCntRm").val() == "") {
                if (ValidaCamposContratoRM() == true) {
                    JSONItemCntRM();
                } else {
                    return ValidaCamposContratoRM();
                }
            }

            var json = $("#equipamentosSel").val();
            if (json != "" && json != null) {
                json = JSON.parse(json);
                for (var i = 0; i < json.length; i++) {
                    var temp = json[i];
                    temp.CODIGOCONTRATO = $("#CodigoContrato").val().split(" - ")[0];
                    json[i] = temp;
                }
                $("#equipamentosSel").val(JSON.stringify(json));
            }

        }
    }

    $("#dataEnvio").val(new Date().toLocaleDateString("pt-BR"));
    $("#horaEnvio").val(new Date().toLocaleTimeString("pt-BR"));

    return true;
}
function baixarModelo() {
    $("#divDownloadModelos").show();
    var html = "";
    $.ajax({
        method: "GET",
        url: "http://fluig.castilho.com.br:1010/api/public/ecm/document/listDocument/268184",
        contentType: "application/json",
        async: false,
        success: (retorno=>{
            console.log(retorno);

            html+="<div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h1 class='panel-title'>Contratos</h1>\
            </div>\
            <div class='panel-body'>\
            <div class='row'>";
            for (var i = 0; i < retorno.content.length; i++) {
                if (i % 3 == 0 && i != 0) {
                    html += "</div><br><div class='row'>";
                }
        
                html += "<div class='col-md-4'>\
                    <button class='btn btn-primary btn-block'>" + retorno.content[i].description + "</button>\
                    <a class='hide' target='_blank' href='" + retorno.content[i].fileURL + "' download='" + retorno.content[i].fileURL + "'></a>\
                </div>";
            }
            html += "</div>\
            </div>";

            $("#divDownloadModelos").append(html);
        }),
        error: function (x, e) {
            console.error("Atualizar Descrição");
            console.log(x);
            console.log(e);
            if (x.status == 500) {
                alert("Busca regionais das obras: Erro Interno do Servidor: entre em contato com o Administrador.");
            }
        },
    });

    html = "";
    $.ajax({
        method: "GET",
        url: "http://fluig.castilho.com.br:1010/api/public/ecm/document/listDocument/268185",
        contentType: "application/json",
        async: false,
        success: (retorno=>{
             html += 
             "<div class='panel panel-default'>\
            <div class='panel-heading'>\
                <h1 class='panel-title'>Aditivos</h1>\
            </div>\
            <div class='panel-body'>\
            <div class='row'>";
            for (var i = 0; i < retorno.content.length; i++) {
                if (i % 3 == 0 && i != 0) {
                    html += "</div><br><div class='row'>";
                }
        
                html += "<div class='col-md-4'>\
                    <button class='btn btn-primary btn-block'>" + retorno.content[i].description + "</button>\
                    <a class='hide' target='_blank' href='" + retorno.content[i].fileURL + "' download='" + retorno.content[i].fileURL + "'></a>\
                </div>";
            }
        
            html += "</div>\
            </div>";
        
            $("#divDownloadModelos").append(html);


        }),
        error: function (x, e) {
            console.error("Atualizar Descrição");
            console.log(x);
            console.log(e);
            if (x.status == 500) {
                alert("Busca regionais das obras: Erro Interno do Servidor: entre em contato com o Administrador.");
            }
        },
        beforeSend: function () {},
    });



    $("#divDownloadModelos")
        .find("button")
        .each(function () {
            $(this).on("click", function () {
                $(this).siblings("a")[0].click();
            });
        });
}
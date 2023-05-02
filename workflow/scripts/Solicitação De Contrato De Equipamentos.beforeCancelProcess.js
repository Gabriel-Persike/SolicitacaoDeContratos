function beforeCancelProcess(colleagueId, processId) {
    atualizaStatusEquipParaPendente();
}

function atualizaStatusEquipParaPendente(){
    var json = hAPI.getCardValue("equipamentosSel");
    if(json != "[]" && json != null && json != ""){
        json = JSON.parse(json);
        for (var i = 0; i < json.length; i++) {
            var c1 = DatasetFactory.createConstraint("OPERACAO", "STATUSPARAPENDENTE", "STATUSPARAPENDENTE", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("JSONEQUIPAMENTO", JSON.stringify(json[i]), JSON.stringify(json[i]), ConstraintType.MUST);
            var ds = DatasetFactory.getDataset("CadastroDeEquipamentos", null, [c1, c2], null);
        }
        if (ds.values[1][0] != "com.microsoft.sqlserver.jdbc.SQLServerException: A instrução não retornou um conjunto de resultados.") {
            log.info("Erro: " + ds.values[1][0]);
            log.info("Query: " + ds.values[2][0]);
    
            throw "Erro ao cancelar equipamento: " + ds.values[1][0];
        }
    }
}
/*
var json = [
    {"PREFIXO":"MA01.001"},
    {"PREFIXO":"MA01.002"},
    {"PREFIXO":"MA01.003"},
    {"PREFIXO":"MA01.003"},
    {"PREFIXO":"MA01.004"},
    {"PREFIXO":"MA01.008"},
    {"PREFIXO":"MA01.005"},
    {"PREFIXO":"MA01.006"},
    {"PREFIXO":"MA01.007"},
    {"PREFIXO":"MA01.008"},
    {"PREFIXO":"MA01.009"},
    {"PREFIXO":"MA01.010"},
    {"PREFIXO":"MA01.011"}]

    
    var json =[{"PREFIXO":"MA01.001"},
    {"PREFIXO":"MA01.002"},
    {"PREFIXO":"MA01.003"},
    {"PREFIXO":"MA01.003"},
    {"PREFIXO":"MA01.004"},
    {"PREFIXO":"MA01.008"},
    {"PREFIXO":"MA01.009"},
    {"PREFIXO":"MA01.010"},
    {"PREFIXO":"MA01.011"},
    {"PREFIXO":"MA01.012"},
    {"PREFIXO":"MA01.013"},
    {"PREFIXO":"MA01.014"},
    {"PREFIXO":"MA01.015"},
    {"PREFIXO":"MA01.016"},
    {"PREFIXO":"MA01.017"},
    {"PREFIXO":"MA01.019"},
    {"PREFIXO":"MA01.020"},
    {"PREFIXO":"MA01.018"},
    {"PREFIXO":"MA01.005"},
    {"PREFIXO":"MA01.006"},
    {"PREFIXO":"MA01.007"},
    {"PREFIXO":"MA11.111"},
    {"PREFIXO":"MA02.002"},
    {"PREFIXO":"MA03.003"},
    {"PREFIXO":"MA05.001"},
    {"PREFIXO":"MA06.001"}]*/

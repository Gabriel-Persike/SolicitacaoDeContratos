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
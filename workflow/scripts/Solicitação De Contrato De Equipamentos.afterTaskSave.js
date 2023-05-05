function afterTaskSave(colleagueId,nextSequenceId,userList){
    var atividade = getValue("WKNumState");
    var contOk = hAPI.getCardValue("decisaoCont");

    if (atividade == 21) {
        if (contOk == 1) {
            if (hAPI.getCardValue("radioOptAssinatura") == "Eletronica") {
                return ExecutaIntegracaoAssinaturaEletronicaWeSign();
              
            }
        }
    }
}

function ExecutaIntegracaoAssinaturaEletronicaWeSign(){
    var ds_upload = DatasetFactory.getDataset("ds_upload_wesign_manual", null, [
        DatasetFactory.createConstraint('codArquivo', hAPI.getCardValue("idDocContrato"), hAPI.getCardValue("idDocContrato"), ConstraintType.MUST)
    ], null);
    return true;
}
function displayFields(form, customHTML) {
    var atividade = getValue("WKNumState");
    var numProcess = getValue("WKNumProces");
    var isMobile = form.getMobile();
    var formMode = form.getFormMode();

    form.setValue("atividade", atividade);
    form.setValue("numProcess", numProcess);
    form.setValue("formMode", formMode);
    form.setValue("isMobile", isMobile);
    form.setValue("countBeforeTaskSave", 0);
    form.setValue("userCode", getValue("WKUser"));

    if (atividade == 0 || atividade == 1 || atividade == 7) {
        form.setValue("solicitante", getValue("WKUser"));
    }
}
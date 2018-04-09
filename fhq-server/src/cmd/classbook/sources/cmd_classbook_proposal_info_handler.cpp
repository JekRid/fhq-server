#include <cmd_classbook_proposal_info_handler.h>
#include <QJsonArray>
#include <QSqlError>
#include <log.h>
#include <employ_database.h>

CmdClassbookProposalInfoHandler::CmdClassbookProposalInfoHandler(){

    m_modelCommandAccess.setAccessUnauthorized(false);
    m_modelCommandAccess.setAccessUser(true);
    m_modelCommandAccess.setAccessAdmin(true);

    // validation and description input fields
    m_vInputs.push_back(CmdInputDef("classbook_proposal_id").required().integer_().description("Proposal id"));
}

// ---------------------------------------------------------------------

std::string CmdClassbookProposalInfoHandler::cmd(){
    return "classbook_proposal_info";
}

// ---------------------------------------------------------------------

const ModelCommandAccess & CmdClassbookProposalInfoHandler::access(){
    return m_modelCommandAccess;
}

// ---------------------------------------------------------------------

const std::vector<CmdInputDef> &CmdClassbookProposalInfoHandler::inputs(){
    return m_vInputs;
}

// ---------------------------------------------------------------------

std::string CmdClassbookProposalInfoHandler::description(){
    return "Find and display all proposal data by id";
}

// ---------------------------------------------------------------------

void CmdClassbookProposalInfoHandler::handle(ModelRequest *pRequest){
    EmployDatabase *pDatabase = findEmploy<EmployDatabase>();
    QJsonObject jsonRequest = pRequest->data();
    QJsonObject jsonResponse;

    QSqlDatabase db = *(pDatabase->database());

    QJsonObject data;

    QSqlQuery query(db);
    int classbook_proposal_id = jsonRequest["classbook_proposal_id"].toInt();
    query.prepare("SELECT id FROM classbook_proposal WHERE id = :classbook_proposal_id");
    query.bindValue(":classbook_proposal_id", jsonRequest["classbook_proposal_id"].toInt());
    if(!query.exec()){
        pRequest->sendMessageError(cmd(), Error(500, query.lastError().text()));
        return;
    }
    if(!query.next()){
        pRequest->sendMessageError(cmd(), Error(404, "This proposal doesn't exist"));
        return;
    }

    query.prepare("SELECT classbookid, lang, name, content FROM classbook_proposal WHERE id = :classbook_proposal_id");
    query.bindValue(":classbook_proposal_id", classbook_proposal_id);
    if (!query.exec()){
        pRequest->sendMessageError(cmd(), Error(500, query.lastError().text()));
        return;
    }
    query.next();
    QSqlRecord record = query.record();
    data["classbookid"] = record.value("classbookid").toInt();
    data["id"] = classbook_proposal_id;
    data["lang"] = record.value("lang").toString();
    data["name"] = record.value("name").toString();
    data["content"] = record.value("content").toString();


    jsonResponse["data"] = data;
    pRequest->sendMessageSuccess(cmd(), jsonResponse);
}


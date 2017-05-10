

export default{
    dateFormat(model){
        model.forEach(item => {
            item.created = item.created.replace(/T|\+0800/g," ");
        })
        return model;
    },
    format(row, column){
        return row.caseType==1?'按年计费':
            row.caseType==2?'按月计费':'实时计费';
    },
    formatEndtime(row){
        return row.caseType==3?'- -':row.endtime;
    },
    formatCost(row){
        return row.caseType==1?row.cpCase+"/年":
            row.caseType==2?row.cpCase+"/月":row.cpCase+"/小时";
    }
}
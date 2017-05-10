/**
 * Created by yunrui001 on 2017-04-12.
 */
import {Message,Loading} from 'element-ui';
import Vue from 'vue';
export default{
    get(url,vm,attrOptions){
        vm.$http.get(url).then(response=>{
            if(response.ok==true&&response.status==200){
                for(let attr in attrOptions){
                    vm[attr] = response.body[attrOptions[attr]];
                }
            }else{
                Message({
                    message:'获取数据失败',
                    type:'error'
                });
            }
        },response=>{
            Message({
                message:'服务器错误',
                type:'error'
            });
        })
    },
    post(url,data,vm,attrOptions){
        vm.$http.post(url,data).then(response=>{
            if(response.ok==true&&response.status==200){
                for(let attr in attrOptions){
                    vm[attr] = response.body[attrOptions[attr]];
                }
            }else{
                Message({
                    message:'获取数据失败',
                    type:'error'
                });
            }
        },response=>{
            Message({
                message:'服务器错误',
                type:'error'
            });
        })
    },
    getEmitter(vm,url,loadingMessage,attrOptions){
        let loadingInstance = Loading.service({
            text:loadingMessage
        })
        vm.$http.get(url).then(response=>{
            loadingInstance.close();
            if(response.ok==true&&response.status==200&&response.body.status===1){
                for(let attr in attrOptions){
                    vm[attr] = response.body[attrOptions[attr]];
                }
                Message({
                    message:response.body.message,
                    type:'success'
                });
                vm.tableData = response.body.result;
            }else{
                Message({
                    message:response.body.message,
                    type:'error'
                });
            }
        },response=>{
            loadingInstance.close();
            Message({
                message:'服务器错误',
                type:'error'
            });
        })
    },

    postEmitter(url,data,loadingMessage,successMessage,errorMessage){
        Vue.http.post().then(response=>{

        },response=>{

        })
    },
    handleCurrentChange(select,row){
        if(select.length>1){
            select.splice(0,1);
        }
        this.selectRow = row;
        if(select.length==0){
            this.selectRow = null;
        }
    },
    handleSelectAll(select){
        select.splice(0,select.length);
        this.selectRow = null;
    },
    processTimeChange(value,vm,data){
        vm.timeOptions = value=='month'?data.monthOptions:
            value=='year'?data.yearOptions:vm.timeOptions;
        //this.money = Math.random()*1000;
        if(value=='month'||value=='year'){
            vm.timeValue = '1';
        }
    },
    /*calculationPay(vue){
        let params = {};
        params.cpunum = vue.CPUNum;
        params.memory = vue.CPUCache.cache;
        params.disk = vue.disk;
        params.value = vue.value;
        params.timevalue = vue.timeValue;
        params.bandwidth = vue.bandwidth;
        vue.$http.post('device/QueryBillingPrice.do',params).then(response => {
            vue.money = response.body.cost;
        })
    },*/

    /*
     查询新建是否成功?
     */
    queryAsyncJobResult(vue,jobid,loadingInstance,vmid){
        vue.$http.get('information/queryAsyncJobResult.do?jobid='+jobid).then(response => {
            if(response.ok==true&&response.status==200){
                if(response.body.queryasyncjobresultresponse.jobstatus==0){
                    setTimeout(this.queryAsyncJobResult(vue,jobid,loadingInstance,vmid),1000);
                }else if(response.body.queryasyncjobresultresponse.jobstatus==1){
                    loadingInstance.close();
                    vue.$http.get('information/pay.do?cost='+vue.money+"&vmid="+vmid+"&timeValue="+vue.timeValue+"&timeType="+vue.value).then(response =>{
                        if(response.ok==true&&response.status==200&&response.body.status=='AAAAAAA'){
                            Message({
                                message:'创建成功',
                                type:'success'
                            });
                            vue.tableData = response.body.listvirtualmachinesresponse.virtualmachine;
                            //vue.$http.get('information/')
                        }else{
                            Message({
                                message:'扣费失败!请查询余额',
                                type:'error'
                            });
                        }
                    })
                }else if(response.body.queryasyncjobresultresponse.jobstatus==2){
                    loadingInstance.close();
                    Message({
                        message:'创建失败',
                        type:'error'
                    })
                }
            }
        })
    },

    /*
     查询删除是否成功?
     */
    queryDeleteJobResult(vue,jobid,loadingInstance){
        vue.$http.get('information/queryAsyncJobResult.do?jobid='+jobid).then(response => {
            if(response.ok==true&&response.status==200){
                if(response.body.queryasyncjobresultresponse.jobstatus==0){
                    setTimeout(this.queryDeleteJobResult(vue,jobid,loadingInstance),1000);
                }else if(response.body.queryasyncjobresultresponse.jobstatus==1){
                    loadingInstance.close();
                    Message({
                        message:'删除成功',
                        type:'success'
                    });
                    vue.$http.get('information/listVirtualMachines.do').then(response =>{
                        if(response.ok==true&&response.status==200){
                            vue.tableData = response.body.listvirtualmachinesresponse.virtualmachine;
                        }else{
                            Message({
                                message:'删除成功!但更新列表失败',
                                type:'error'
                            });
                        }
                    })
                }else if(response.body.queryasyncjobresultresponse.jobstatus==2){
                    loadingInstance.close();
                    Message({
                        message:'删除失败',
                        type:'error'
                    })
                }
            }
        })
    },

    /*
     查询停止是否成功?
     */
    queryStopJobResult(vue,jobid,loadingInstance){
        vue.$http.get('information/queryAsyncJobResult.do?jobid='+jobid).then(response => {
            if(response.ok==true&&response.status==200){
                if(response.body.queryasyncjobresultresponse.jobstatus==0){
                    setTimeout(this.queryStopJobResult(vue,jobid,loadingInstance),1000);
                }else if(response.body.queryasyncjobresultresponse.jobstatus==1){
                    loadingInstance.close();
                    Message({
                        message:'停止成功',
                        type:'success'
                    });
                    vue.$http.get('information/listVirtualMachines.do').then(response =>{
                        if(response.ok==true&&response.status==200){
                            vue.tableData = response.body.listvirtualmachinesresponse.virtualmachine;
                        }else{
                            Message({
                                message:'停止成功!但更新列表失败',
                                type:'error'
                            });
                        }
                    })
                }else if(response.body.queryasyncjobresultresponse.jobstatus==2){
                    loadingInstance.close();
                    Message({
                        message:'停止失败',
                        type:'error'
                    })
                }
            }
        })
    },

    /*
     查询启动是否成功?
     */
    queryStartJobResult(vue,jobid,loadingInstance){
        vue.$http.get('information/queryAsyncJobResult.do?jobid='+jobid).then(response => {
            if(response.ok==true&&response.status==200){
                if(response.body.queryasyncjobresultresponse.jobstatus==0){
                    setTimeout(this.queryStartJobResult(vue,jobid,loadingInstance),1000);
                }else if(response.body.queryasyncjobresultresponse.jobstatus==1){
                    loadingInstance.close();
                    Message({
                        message:'启动成功',
                        type:'success'
                    });
                    vue.$http.get('information/listVirtualMachines.do').then(response =>{
                        if(response.ok==true&&response.status==200){
                            vue.tableData = response.body.listvirtualmachinesresponse.virtualmachine;
                        }else{
                            Message({
                                message:'启动成功!但更新列表失败',
                                type:'error'
                            });
                        }
                    })
                }else if(response.body.queryasyncjobresultresponse.jobstatus==2){
                    loadingInstance.close();
                    Message({
                        message:'启动失败',
                        type:'error'
                    })
                }
            }
        })
    }
}
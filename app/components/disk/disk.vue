<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary" @click="createInstance()">创建硬盘</el-button>
            <el-dropdown @command="handleCommand">
                <el-button type="primary">
                    &nbsp;&nbsp;更多&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="currentRow==null||currentRow.mounton!=''" command="mountPrompt">挂载</el-dropdown-item>
                    <el-dropdown-item :disabled="currentRow==null||currentRow.mounton==''" command="unmountPrompt">解挂</el-dropdown-item>
                    <el-dropdown-item :disabled="currentRow==null||currentRow.mountonname==undefined" command="backupPrompt">备份</el-dropdown-item>
                    <el-dropdown-item :disabled="currentRow==null||currentRow.mounton!=''" command="deletePrompt">删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="table">
                <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @select-all="handleSelectAll"
                        @select="handleCurrentChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column
                            prop="diskname"
                            label="磁盘名"
                            width="120"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="disksize"
                            label="磁盘大小(G)"
                            show-overflow-tooltip
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="caseType"
                            label="购买方式"
                            :formatter="formatType">
                    </el-table-column>
                    <el-table-column
                            prop="cpCase"
                            label="费用"
                            :formatter="formatCost">
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="endtime"
                            label="到期时间"
                            :formatter="formatEndtime">
                    </el-table-column>
                    <el-table-column
                            prop="mountonname"
                            label="挂载主机"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="mounton"
                            label="可否备份"
                            show-overflow-tooltip
                            :formatter="format">
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog title="创建磁盘" v-model="dialogVisible" size="small" :modal-append-to-body=false>
                <div style="display:flex;border-top:2px solid #000">
                    <div class="config">

                        <div class="confWapper">
                            <div style="width: 80px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">区域</div>
                            <el-select v-model="zone" placeholder="请选择">
                                <el-option
                                        v-for="item in zoneOptions"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="confWapper">
                            <div style="width: 80px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">磁盘名</div>
                            <div style="width:217px"><el-input v-model="diskName" placeholder="请输入磁盘名"></el-input></div>
                        </div>

                        <div class="confWapper">
                            <div style="width: 80px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">磁盘方案</div>
                            <el-select v-model="disk" placeholder="请选择" @change="calculationPayTo">
                                <el-option
                                        v-for="item in diskOptions"
                                        :label="item.descs"
                                        :value="item.size">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="confWapper">
                            <div style="width:60%;padding-left:13px">
                                <my-slider
                                        v-model="disk"
                                        unit="G"
                                        :points="[30,50]"
                                        @change="calculationPay">
                                </my-slider>
                            </div>
                        </div>
                    </div>

                    <div class="display">


                        <div v-if="value=='current'">
                            <p>按需付费，根据资源的实际使用量收费，精确到秒。先使用后付费。</p>
                        </div>
                        <div v-if="value=='month'">
                            <p>计费单位为月，平均每小时价格低于按量。适用于不间断业务场景。</p>
                        </div>
                        <div v-if="value=='year'">
                            <p>计费单位为年，平均每小时价格低于实时计费。适用于不间断业务场景。</p>
                        </div>
                        <div>
                            <label>计费方式 : </label>
                            <el-select v-model="value" placeholder="请选择" class="eselect" @change="changePay">
                                <el-option
                                        v-for="item in payOptions" :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>购买时长 : </label>
                            <el-select v-model="timeValue" :disabled="value=='current'" placeholder="请选择" class="eselect" @change="changePay">
                                <el-option
                                        v-for="item in timeOptions" :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </div>
                        <div>
                            <label>费用 : ￥ </label>{{money}}<span v-if="value=='current'">/小时</span>

                        </div>
                    </div>
                </div>


                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :disabled="disk==null||diskName==''" @click="finish">创建</el-button>
                </span>
            </el-dialog>

            <el-dialog title="挂载磁盘" v-model="mountPrompt" size="tiny" :modal-append-to-body=false>
                <div class="config">

                    <div class="confWapper">
                        <div style="width: 80px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">挂载主机</div>
                        <el-select v-model="mountVMid" placeholder="请选择">
                            <el-option
                                    v-for="item in mountOptions"
                                    :label="item.computername"
                                    :value="item.computerid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="startPrompt = false">取 消</el-button>
                    <el-button type="primary" :disabled='mountVMid==null' @click="handleMount()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="unmountPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认解挂磁盘?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="stopPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleUnmount()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="backupPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认备份磁盘?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="stopPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleBackup()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="deletePrompt" size="tiny" :modal-append-to-body=false>
                <span>确认删除磁盘?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="backupPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleDelete()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    /*flow*/
    import data from '../host/data.js';
    import util from '../util/util.js';
    import {Message,Loading} from 'element-ui'
    import dateFormatter from '../util/dateFormatter.js'
    export default{
        data(arg:string):object{
            return {
                tableData: [],
                currentRow:null,
                dialogVisible:false,
                zoneOptions:null,
                zone:null,
                diskOptions:null,
                disk:null,
                diskName:'',
                payOptions:data.payOptions,
                value:'current',
                timeOptions:data.monthOptions,
                timeValue:'1',
                money:'0',
                silder:false,

                /*
                 *   以下参数为配合API而设置的固定不变参数
                 */
                bandwidth:0,
                CPUNum:0,
                CPUCache:{cache:0},

                /*
                 是否显示操作确认框
                 */
                mountPrompt:false,
                unmountPrompt:false,
                deletePrompt:false,
                backupPrompt:false,

                mountOptions:[],
                mountVMid:null
            }
        },
        created(){
            this.$http.get('Disk/listDisk.do').then(response => {
                if(response.ok==true&&response.status==200){
                    //console.log(response.body);
                    this.tableData = response.body.result;
                }
            },response => {

            })
        },
        methods:{
            handleCurrentChange(select,row){
                if(select.length>1){
                    select.splice(0,1);
                }
                this.currentRow = row;
                if(select.length==0){
                    this.currentRow = null;
                }
            },
            handleSelectAll(select){
                select.splice(0,select.length);
                this.currentRow = null;
            },
            deleteDisk(){
                this.$http.get('Disk/deleteVolume.do?diskid='+this.currentRow.diskid).then(response => {
                    if(response.ok==true&&response.status==200){
                        //console.log(response.body);
                        this.tableData = response.body.result;
                    }
                },response => {

                })
            },
            handleCommand(type){
                if(type=='mountPrompt'){
                    this.$http.get('information/listVirtualMachines.do').then(response=>{
                        if(response.ok==true&&response.status==200){
                            this.mountOptions = response.body.result;
                        }
                    })
                }
                this[type] = true;
            },
            handleMount(){
                this.mountPrompt = false;
                let loadingInstance = Loading.service({
                    text:'磁盘挂载中...'
                })
                this.$http.get('Disk/attachVolume.do?virtualmachineid='+this.mountVMid+'&diskid='+this.currentRow.diskid).then(response => {
                    if(response.ok==true&&response.status==200){
                        console.log(response.body);
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'挂载成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message: response.body.message,
                                type:'error'
                            });
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'挂载超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            calculationPayTo(dis){
                this.disk = dis;
                this.calculationPay();
            },

            calculationPay(){
                var url = 'device/QueryBillingPrice.do';
                let params = {};
                params.cpunum = this.CPUNum;
                params.memory = this.CPUCache.cache;
                params.disk = this.disk;
                params.value = this.value;
                params.timevalue = this.timeValue;
                params.bandwidth = this.bandwidth;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            handleUnmount(){
                this.unmountPrompt = false;
                let loadingInstance = Loading.service({
                    text:'磁盘解挂中...'
                })
                this.$http.get('Disk/detachVolume.do?diskid='+this.currentRow.diskid+'&virtualmachineid='+this.currentRow.mounton).then(response => {
                    if(response.ok==true&&response.status==200){
                        console.log(response.body);
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'解挂成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });

                        }else{
                            loadingInstance.close();
                            Message({
                                message:'解挂超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            handleBackup(){
                this.backupPrompt = false;
                let loadingInstance = Loading.service({
                    text:'磁盘备份中...'
                })
                this.$http.get('Snapshot/createSnapshot.do?volumeid='+this.currentRow.diskid).then(response => {
                    if(response.ok==true&&response.status==200){
                        //console.log(response.body);
                        loadingInstance.close();
                        if(response.body.status==1){
                            Message({
                                message:'磁盘备份成功',
                                type:'success'
                            });
                        }else if(response.body.status==2){
                            Message({
                                message:response.body.message,
                                type:'error'
                            });

                        }else{
                            Message({
                                message:'备份超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            formatType:dateFormatter.format,
            formatCost:dateFormatter.formatCost,
            formatEndtime:dateFormatter.formatEndtime,
            format(row){
                return row.mountonname==undefined?'不可备份':'可备份';
            },
            handleDelete(){
                this.deletePrompt = false;
                let loadingInstance = Loading.service({
                    text:'磁盘删除中...'
                })
                this.$http.get('Disk/deleteVolume.do?diskid='+this.currentRow.id).then(response => {
                    if(response.ok==true&&response.status==200){
                        console.log(response.body);
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'删除成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'删除超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            createInstance(){
                this.dialogVisible = true;
                this.$http.get('information/zone.do').then(
                    response =>{
                        if(response.ok==true&&response.status==200){
                            this.zoneOptions = response.body.listzonesresponse.zone;
                            this.zone = response.body.listzonesresponse.zone[0].id;
                        }
                    }
                )
                this.$http.get('Disk/listDiskTemplate.do').then(
                    response =>{
                        if(response.ok==true&&response.status==200){
                            if(response.body.status==1){
                                this.diskOptions = response.body.result;
                            }
                            //this.disk = response.body[0].size;
                        }
                    }
                )
            },
            changePay(value){
                if(value == 0){
                    this.silder = true;
                }
                this.timeOptions = value=='month'?data.monthOptions:
                    value=='year'?data.yearOptions:this.timeOptions;
                //this.money = Math.random()*1000;
                if(value=='month'||value=='year'){
                    this.timeValue = '1';
                }
                util.calculationPay(this);
            },
            finish(){
                this.dialogVisible = false;
                let loadingInstance = Loading.service({
                    text:'拼命创建中...'
                })
                this.$http.get('Disk/createVolume.do?size='+this.disk+'&zoneid='+this.zone+'&name='+this.diskName+'&value='+this.value+'&timevalue='+this.timeValue).then(
                    response => {
                        loadingInstance.close();
                        if(response.ok==true&&response.status==200){
                            if(response.body.status==1){
                                Message({
                                    message:'创建成功',
                                    type:'success'
                                });
                                this.tableData = response.body.result;
                            }else{
                                Message({
                                    message: response.body.message,
                                    type:'error'
                                });
                            }

                        }else{
                            Message({
                                message:'创建失败',
                                type:'error'
                            });
                        }
                    },
                    response => {
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                )
            },

        }
    }
</script>

<style scoped>
    .table{
        padding-top:15px;
    }
    .confWapper{
        display:flex;
        padding: 10px 37px;
    }
    .config{
        width:70%;
        margin-top:10px;
    }
    .display{
        background-color: #eaeaea;
        width:30%;
    }
    .display span{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .display div{
        border-bottom:1px solid #dddddd;
    }
    .display label{
        display: inline-block;
        width: 70px;
        height: 50px;
        text-align: right;
        line-height: 50px;
        font-size: 14px;
    }
    .display p{
        padding: 10px 15px;
        color: red;
    }
    .eselect{
        width: 165px;
    }

</style>
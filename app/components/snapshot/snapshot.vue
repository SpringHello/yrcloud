<template>
    <div class="wapper">
        <ul class="select">
            <li class="default" :class="{hover:show=='host'}"><a class="select-item" @click="toggle('host')">主机备份</a></li>
            <li class="default" :class="{hover:show=='disk'}"><a class="select-item" @click="toggle('disk')">硬盘备份</a></li>
        </ul>
        <div class="operStage">

            <div class="host-snapshot" v-if="show == 'host'">
                <el-button type="primary" :disabled="this.currentRow==null" @click="revertHostPrompt = true">恢复主机</el-button>
                <el-button type="primary" :disabled="this.currentRow==null" @click="deleteHostPrompt = true">删除备份</el-button>
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
                                prop="computerid"
                                label="主机编号"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="snapshotid"
                                label="快照id"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="addtime"
                                label="创建时间"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="是否最新"
                                :formatter="format"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="disk-snapshot" v-if="show == 'disk'">
                <el-button type="primary" :disabled="this.currentRow==null" @click="revertPrompt = true">恢复磁盘</el-button>
                <el-button type="primary" :disabled="this.currentRow==null" @click="deletePrompt = true">删除备份</el-button>
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
                                prop="id"
                                label="磁盘编号"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="磁盘名"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="created"
                                label="创建时间"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="state"
                                label="状态"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <el-dialog title="提示" v-model="deleteHostPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认删除主机备份?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteHostPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="deleteVMSnapshot()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="revertHostPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认恢复主机备份?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="revertHostPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="revertToVMSnapshot()">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="提示" v-model="deletePrompt" size="tiny" :modal-append-to-body=false>
                <span>确认删除磁盘备份?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deletePrompt = false">取 消</el-button>
                    <el-button type="primary" @click="deleteSnapshot()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="revertPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认恢复磁盘备份?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="revertPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="revertSnapshot()">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script type="text/babel">
    import {Message,Loading} from 'element-ui'
    import dateFormatter from '../util/dateFormatter.js'
    export default{
        data(){
            return {
                tableData:[],
                currentRow:null,
                deletePrompt:false,
                revertPrompt:false,

                revertHostPrompt:false,
                deleteHostPrompt:false,
                //diskData:[],
                //diskCurrentRow:{},
                show:'host',
            };
        },
        created(){
            this.$http.get('Snapshot/listVMSnapshotAll.do').then(response => {
                if(response.ok==true&&response.status==200){
                    //console.log(response.body);
                    this.tableData = response.body
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
            toggle(type){
                this.tableData = [];
                this.currentRow = null;
                this.show = type;
                if(type=='host'){
                    this.$http.get('Snapshot/listVMSnapshotAll.do').then(response => {
                        if(response.ok==true&&response.status==200){
                            //console.log(response.body);
                            this.tableData = response.body
                        }
                    },response => {

                    })
                }else{
                    this.$http.get('Snapshot/listSnapshots.do').then(response => {
                        if(response.ok==true&&response.status==200){
                            //console.log(response.body);
                            this.tableData = response.body.listsnapshotsresponse.snapshot;
                        }
                    },response => {

                    })
                }
            },
            //恢复磁盘
            revertSnapshot(){
                this.revertPrompt = false;
                let loadingInstance = Loading.service({
                    text:'正在恢复磁盘...'
                })
                this.$http.get('Snapshot/revertSnapshot.do?id='+this.currentRow.id).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status){
                        Message({
                            message:'恢复成功',
                            type:'success'
                        });
                        this.tableData = response.body.listsnapshotsresponse.snapshot;
                    }else{
                        Message({
                            message:'恢复失败',
                            type:'error'
                        });
                    }
                },response => {

                })
            },
            //删除磁盘
            deleteSnapshot(){
                this.deletePrompt = false;
                let loadingInstance = Loading.service({
                    text:'正在删除磁盘...'
                })
                this.$http.get('Snapshot/deleteSnapshot.do?id='+this.currentRow.id).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status==200){
                        loadingInstance.close();
                        if(response.body.status==1){
                            Message({
                                message:'删除成功',
                                type:'success'
                            });
                            if(response.body.listsnapshotsresponse.hasOwnProperty('snapshot')){
                                this.tableData = dateFormatter.dateFormat(response.body.listsnapshotsresponse.snapshot);
                            }else{
                                this.tableData = [];
                            }

                        }else if(response.body.status==2){
                            Message({
                                message:'删除失败',
                                type:'error'
                            });
                            this.tableData = dateFormatter.dateFormat(response.body.listsnapshotsresponse.snapshot);
                        }else{
                            Message({
                                message:'删除超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                },response => {

                })
            },
            //恢复主机备份
            revertToVMSnapshot(){
                this.revertHostPrompt = false;
                let loadingInstance = Loading.service({
                    text:'正在恢复主机...'
                })
                this.$http.get('Snapshot/revertToVMSnapshot.do?vmsnapshotid='+this.currentRow.snapshotid).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status){
                        Message({
                            message:'恢复成功',
                            type:'success'
                        });
                        //this.tableData = response.body.listsnapshotsresponse.snapshot;
                    }else{
                        Message({
                            message:'恢复失败',
                            type:'error'
                        });
                    }
                },response => {

                })
            },

            //删除主机备份
            deleteVMSnapshot(){
                this.deleteHostPrompt = false;
                let loadingInstance = Loading.service({
                    text:'正在删除主机...'
                })
                this.$http.get('Snapshot/deleteVMSnapshot.do?vmsnapshotid='+this.currentRow.snapshotid).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status){
                        if(response.body.status==1){
                            Message({
                                message:'删除成功',
                                type:'success'
                            });
                            this.tableData = response.body.list;
                        }else{
                            Message({
                                message:'删除失败',
                                type:'error'
                            });
                            this.tableData = response.body.list;
                        }
                    }else{
                        Message({
                            message:'删除失败',
                            type:'error'
                        });
                    }
                },response => {
                    Message({
                        message:'服务器异常',
                        type:'error'
                    });
                })
            },
            format(row){
                return row.isbestnew=='0'?'已过时':'最新备份';
            }
        }
    }
</script>

<style scoped>
    .table{
        padding-top:15px;
    }
    .select{
        font-size:0px;
        background-color: #ecf5ff;
    }
    .select .default{
        font-size:17px;
        width: 120px;
        display: inline-block;
        text-align: center;
        height: 43px;
        border: 1px solid #e4e4e4;
        border-top:none;
        line-height: 43px;
        box-sizing: border-box;
    }
    .select .hover{
        font-size:19px;
        width: 120px;
        display: inline-block;
        text-align: center;
        height: 43px;
        border:none;
        border-top:2px solid #2d91cf;
        line-height: 43px;
        background-color: white;
    }
</style>
<template>
    <div class="wapper">
        <div class="operStage" v-if="showType=='balance'">
            <el-button type="primary" @click="createBalance">创建负载均衡</el-button>
            <el-button type="primary" :disabled="selectRow==null" @click="deleteBalance">删除负载均衡</el-button>
            <el-button type="primary" :disabled="selectRow==null" @click="addHostToBalance">添加虚拟机</el-button>
            <el-button type="primary" :disabled="selectRow==null" @click="deleteHostFromBalance">删除虚拟机</el-button>
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
                            prop="name"
                            label="名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="publicport"
                            label="公共端口">
                    </el-table-column>
                    <el-table-column
                            prop="privateport"
                            label="私有端口"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="belongpublicip"
                            label="所属IP"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="netwrokname"
                            label="所属网络"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="150">
                        <template scope="scope">
                            <el-button @click="viewRule(scope.row)" type="text" size="small">查看规则</el-button>
                            <el-button @click="viewHost(scope.row)" type="text" size="small">查看主机</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="operStage" v-if="showType=='host'">
            <div class="table">
                <el-table
                        :data="hostData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column
                            prop="computername"
                            label="名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="belongnetworkname"
                            label="所属子网">
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="endtime"
                            label="到期时间"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        </div>


        <el-dialog title="创建规则" v-model="dialogVisible" size="tiny" :modal-append-to-body=false>
            <div style="display:flex;border-top:2px solid #000">
                <div class="config">
                    <div class="confWapper">
                        <div class="label">规则名</div>
                        <div style="width:217px"><el-input v-model="ruleName" placeholder="请输入规则名"></el-input></div>
                    </div>
                    <div class="confWapper">
                        <div class="label">私有端口</div>
                        <div style="width:217px"><el-input v-model="privatePort" placeholder="请输入私有端口"></el-input></div>
                    </div>
                    <div class="confWapper">
                        <div class="label">共有端口</div>
                        <div style="width:217px"><el-input v-model="publicPort" placeholder="请输入共有端口"></el-input></div>
                    </div>
                    <div class="confWapper">
                        <div class="label">算法</div>
                        <el-select v-model="rule" placeholder="请选择">
                            <el-option
                                    v-for="item in ruleOptions"
                                    :label="item.name"
                                    :value="item.id"
                                    :key="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="confWapper">
                        <div class="label">公共IP</div>
                        <el-select v-model="publicIp" placeholder="请选择" @change="switchPublicIp">
                            <el-option
                                    v-for="item in publicIpOptions"
                                    :label="item.publicip"
                                    :value="item.publicipid"
                                    :key="item.publicipid">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="confWapper">
                        <div class="label">网络</div>
                        <el-select v-model="networkId" placeholder="请选择">
                            <el-option
                                    v-for="item in networkIdOptions"
                                    :label="item.ipsegment"
                                    :value="item.ipsegmentid"
                                    :key="item.ipsegmentid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="isDisable" @click="finishBalance">创建</el-button>
            </span>
        </el-dialog>

        <el-dialog title="绑定主机" v-model="bindVM" size="tiny" :modal-append-to-body=false>
            <div style="display:flex;border-top:2px solid #000">
                <div class="config">
                    <div class="confWapper">
                        <div class="label">选择主机</div>
                        <el-select v-model="vm" placeholder="请选择">
                            <el-option
                                    v-for="item in vmOptions"
                                    :label="item.computername"
                                    :value="item.computerid"
                                    :key="item.computerid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="vmIsDisable" @click="finishBind">绑定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="解绑主机" v-model="unbindVM" size="tiny" :modal-append-to-body=false>
            <div style="display:flex;border-top:2px solid #000">
                <div class="config">
                    <div class="confWapper">
                        <div class="label">选择主机</div>
                        <el-select v-model="vm" placeholder="请选择">
                            <el-option
                                    v-for="item in vmOptions"
                                    :label="item.computername"
                                    :value="item.computerid"
                                    :key="item.computerid">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :disabled="vmIsDisable" @click="finishUnbind">解绑</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script type="text/ecmascript-6">
    import util from '../util/util.js';
    export default{
        data(){
            return {
                dialogVisible:false,
                bindVM:false,
                unbindVM:false,
                showType:'balance',
                tableData:[],
                hostData:[],
                ruleName:'',
                privatePort:'',
                publicPort:'',
                ruleOptions:[{name:'轮询算法',id:'roundrobin'},{name:'最小连接算法',id:'leastconn'},{name:'源算法',id:'source'}],
                rule:'',
                publicIpOptions:[],
                publicIp:'',
                networkIdOptions:[],
                networkId:'',

                vmOptions:[],
                vm:'',
                selectRow:null
            }
        },
        created(){
            var url = 'loadbalance/listLoadBalanceRole.do'
            util.get(url,this,{tableData:'result'})
        },
        methods:{
            handleSelectAll:util.handleSelectAll,
            handleCurrentChange:util.handleCurrentChange,
            viewRule(row){

            },
            viewHost(row){
                this.showType = 'host';
                var url = "loadbalance/listVmByRoleId.do?roleid="+row.loadbalanceroleid;
                util.get(url,this,{hostData:'result'})
            },
            createBalance(){
                this.dialogVisible = true;
                var url = "network/listLoadBalancePublicIp.do.do"
                util.get(url,this,{publicIpOptions:'result'});
            },
            finishBalance(){
                this.dialogVisible = false;
                var url = "loadbalance/createLoadBalanceRole.do";
                url += '?name='+this.ruleName;
                url += '&privateport='+this.privatePort;
                url += '&publicport='+this.publicPort;
                url += '&algorithm='+this.rule;
                url += '&publicipid='+this.publicIp;
                url += '&networkid='+this.networkId;
                util.get(url,this,{tableData:'result'},'创建负载均衡规则成功!');
            },
            finishBind(){
                this.bindVM = false;
                var url = 'loadbalance/assignToLoadBalancerRule.do?roleId='+this.selectRow.loadbalanceroleid;
                url += '&vmids='+this.vm;
                util.get(url,this,{},'绑定成功');
                this.bindVM = false;
            },
            finishUnbind(){
                this.unbindVM = false;
                var url = 'loadbalance/removeFromLoadBalancerRule.do?roleId='+this.selectRow.loadbalanceroleid;
                url += '&vmids='+this.vm;
                util.get(url,this,{},'解绑成功');
            },
            switchPublicIp(publicIpId){
                this.networkId = '';
                for(var i in this.publicIpOptions){
                    if(this.publicIpOptions[i].publicipid == publicIpId){
                        var url = "network/listNetworkByVpcId.do?vpcid="+this.publicIpOptions[i].vpcid;
                        util.get(url,this,{networkIdOptions:'result'});
                        break;
                    }
                }
            },
            deleteBalance(){
                var url = 'loadbalance/deleteLoadBalancerRule.do?roleId='+this.selectRow.loadbalanceroleid;
                util.get(url,this,{tableData:'result'},'删除成功');
            },
            addHostToBalance(){
                this.bindVM = true;
                this.vm = '';
                this.vmOptions = [];
                var url = 'loadbalance/listVMByNetworkId.do?networkid='+this.selectRow.netwrokid;
                util.get(url,this,{vmOptions:'result'})
            },
            deleteHostFromBalance(){
                this.unbindVM = true;
                this.vm = ''
                this.vmOptions = [];
                var url = 'loadbalance/listVmByRoleId.do?roleid='+this.selectRow.loadbalanceroleid;
                util.get(url,this,{vmOptions:'result'})
            }
        },
        computed:{
            isDisable(){
                return !(this.ruleName&&this.privatePort&&this.publicPort&&this.rule&&this.publicIp&&this.networkId)
            },
            vmIsDisable(){
                return !this.vm
            }
        }
    }

</script>

<style scoped>
    .confWapper{
        display:flex;
        padding: 10px 37px;
    }
    .label{
        width: 80px;
        text-align: center;
        font-size: 16px;
        line-height: 34px;
        font-weight: 400;
    }
</style>
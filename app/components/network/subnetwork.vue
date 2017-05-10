<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary" @click="openDialog">创建子网</el-button>
            <el-button type="primary" :disabled="selectRow==null" @click="deleteNet">删除子网</el-button>

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
                            label="子网名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="descript"
                            label="子网描述"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="vpcname"
                            label="所属vpc"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="ipsegment"
                            label="网段"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog title="创建子网" v-model="dialogVisible" :modal-append-to-body=false size="tiny">
                <div style="border-top:2px solid #000">
                    <div class="config">
                        <div class="confWapper flex">
                            <div class="item">
                                <label>名称<i>*</i>：</label>
                                <div class="item-div"><el-input v-model="networkname" placeholder="请输入内容"></el-input></div>
                            </div>
                            <div class="item">
                                <label>网络地址<i>*</i>：</label>
                                <div class="item-div">
                                    <span>192</span><i>.</i><span>168</span><i>.</i><input type="text" v-model="netmask" v-on:keyup="checkMask" v-on:input="checkMask"><i>.</i><span>1</span>
                                </div>
                            </div>
                            <div class="item">
                                <label>网关地址<i>*</i>：</label>
                                <div class="item-div">
                                    <span>192</span><i>.</i><span>168</span><i>.</i><input type="text" v-model="netmask"><i>.</i><span>1</span>
                                </div>
                            </div>
                            <div class="item">
                                <label>区域<i>*</i>：</label>
                                <div class="item-div">
                                    <el-select v-model="zone" placeholder="请选择">
                                        <el-option
                                                v-for="zone in zoneOptions"
                                                :label="zone.name"
                                                :value="zone.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="item">
                                <label>VPC<i>*</i>：</label>
                                <div class="item-div">
                                    <el-select v-model="vpc" placeholder="请选择">
                                        <el-option
                                                v-for="vpc in vpcOptions"
                                                :label="vpc.vpcname"
                                                :value="vpc.vpcid">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="isFinish" @click="finish">创建</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/babel">
    import validate from '../util/validate.js';
    import interfaceUtil from '../util/interfaceUtil.js';
    import util from '../util/util.js';
    export default{
        data(){
            return {
                dialogVisible:false,
                tableData:[],
                netmask:'0',
                networkname:'',
                zoneOptions:null,
                zone:null,
                vpcOptions:null,
                vpc:null,
                netOptions:null,
                net:null,
                selectRow:null,
            }
        },
        created(){
            var attrOptions = {
                tableData:'result'
            }
            util.get('network/listNet.do',this,attrOptions)
        },
        methods:{
            openDialog(){
                this.dialogVisible = true;
                interfaceUtil.queryZones(this);
                var attrOptions = {
                    vpcOptions:'result'
                }
                util.get('network/listVpc.do',this,attrOptions)
            },
            deleteNet(){
                var url = 'network/deleteNetwork.do';
                url += '?networkId='+this.selectRow.ipsegmentid;
                util.getEmitter(this,url,'删除子网中...');
                this.selectRow = null;
            },
            handleCurrentChange: util.handleCurrentChange,
            handleSelectAll: util.handleSelectAll,
            checkMask:validate.checkMask,
            finish(){
                this.dialogVisible = false;
                var url = 'network/createNetwork.do';
                url += '?vpcid='+this.vpc;
                url += '&networkOfferingId='+this.net;
                url += '&name='+this.networkname;
                url += '&zoneId='+this.zone;
                url += '&gateway=192.168.'+this.netmask+'.1';
                util.getEmitter(this,url,'创建子网中...');
            }
        },
        computed:{
            isFinish:{
                get(){
                    return this.networkname==''||this.vpc==null;
                }
            }
        }
    }
</script>

<style scoped>
    .item i{
        font-size: 18px;
        width: 7px;
        display: inline-block;
        color: red;
    }
    .item{
        font-size: 16px;
        line-height: 34px;
        font-weight: 400;
        margin-top:25px;
    }
    .item-div{
        display:inline-block;
        font-size: 0px;
    }
    .item span{
        background-color: #cdcdcd;
        width:32px;
        height:28px;
        display: inline-block;
        font-size:14px;
        line-height: 28px;
        text-align: center;
        vertical-align: super;
    }
    .item i{
        font-size: 18px;
        width: 7px;
        display: inline-block;
    }
    .item input{
        border: 1px solid #000;
        width: 32px;
        height: 29px;
        vertical-align: super;
        text-align: center;
    }
    .confWapper label{
        width: 109px;
        display: inline-block;
        text-align: right;
    }
</style>
<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary" @click="openDialog">创建公网</el-button>
            <el-button type="primary" v-if="selectRow!=null&&!selectRow.loadbalanceroleid" @click="setNAT">设置静态NAT</el-button>
            <el-button type="primary" v-if="selectRow!=null&&!!selectRow.loadbalanceroleid" @click="unbindVisible = true">解除静态NAT</el-button>
            <el-button disabled="disabled" type="primary" @click="deletePublic=true">删除公网</el-button>

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
                            prop="publicip"
                            label="公网IP"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="caseType"
                            label="购买方式"
                            :formatter="format"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="cpCase"
                            label="费用"
                            :formatter="formatCost"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="endtime"
                            label="到期时间"
                            :formatter="formatEndtime"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="computerid"
                            label="绑定主机"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="vpcname"
                            label="所属vpc"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>


            <el-dialog title="创建公网" v-model="dialogVisible" :modal-append-to-body=false size="small">
                <div style="display:flex;border-top:2px solid #000">
                    <div class="config">
                        <div class="confWapper flex">
                            <div class="item">
                                <label>VPC<i>*</i>：</label>
                                <div class="item-div">
                                    <el-select v-model="vpc" placeholder="请选择">
                                        <el-option
                                                v-for="vpc in vpcOptions"
                                                :label="vpc.vpcname"
                                                :value="vpc.vpcid"
                                                :key="vpc.vpcid">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="item">
                                <label>带宽<i>*</i>：</label>
                                <div class="item-div" style="width:377px">
                                    <my-slider
                                            v-model="brand"
                                            unit="M"
                                            :points="[30,50]"
                                            @change="changePay">
                                    </my-slider>
                                    </el-select>
                                </div>
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
                            <el-select v-model="value" placeholder="请选择" class="eselect" @change="processTimeChange">
                                <el-option
                                        v-for="item in payOptions"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>购买时长 : </label>
                            <el-select v-model="timeValue" :disabled="value=='current'" placeholder="请选择" class="eselect" @change="changePay">
                                <el-option
                                        v-for="item in timeOptions"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>费用 : ￥ </label>{{money}}<span v-if="value=='current'">/小时</span>

                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="isFinish" @click="finish">创建</el-button>
                </span>
            </el-dialog>

            <el-dialog title="设置静态NAT" v-model="NATVisible" size="tiny" :modal-append-to-body=false >
                <div>
                    <div class="item">
                        <label>关联主机<i>*</i>：</label>
                        <div class="item-div">
                            <el-select v-model="host" placeholder="请选择">
                                <el-option
                                        v-for="host in hostOptions"
                                        :value="host.computerid"
                                        :label="host.computername"
                                        :key="host.computerid">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="NATVisible = false">取 消</el-button>
                    <el-button type="primary" @click="bindNAT">确 定</el-button>
                </span>
            </el-dialog>
            <!--删除提示框-->
            <el-dialog title="提示" v-model="unbindVisible" size="tiny" :modal-append-to-body=false >
                <span>确认解除与主机绑定？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="unbindVisible = false">取 消</el-button>
                    <el-button type="primary" @click="unbind">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/babel">
    import interfaceUtil from '../util/interfaceUtil.js';
    import data from '../host/data.js';
    import util from '../util/util.js';
    import dateFormatter from '../util/dateFormatter.js';
    export default{
        data(){
            return {
                dialogVisible:false,
                NATVisible:false,
                unbindVisible:false,
                tableData: [],//表格数据
                deletePublic:false,
                selectRow:null,

                payOptions:data.payOptions,
                value:'current',
                timeOptions:data.monthOptions,
                timeValue:'1',

                vpcOptions:null,
                vpc:null,
                brand:50,
                hostOptions:null,
                host:null,

                money:0,

            }
        },
        created(){
            var url = "network/listPublicIp.do",
                param = {
                    tableData:'result'
                }
            util.get(url,this,param)
        },
        methods:{
            handleCurrentChange: util.handleCurrentChange,
            handleSelectAll: util.handleSelectAll,
            openDialog(){
                this.dialogVisible = true;
                var attrOptions = {
                    vpcOptions:'result'
                }
                util.get('network/listVpc.do',this,attrOptions);
                this.changePay();
            },
            format:dateFormatter.format,
            formatEndtime:dateFormatter.formatEndtime,
            formatCost:dateFormatter.formatCost,
            processTimeChange(){
                //处理包月/包年转换
                util.processTimeChange(this.value,this,data);
                this.changePay();
            },
            changePay(){
                //发起价格查询
                var url = 'device/queryIpPrice.do';
                let params = {};
                params.value = this.value;
                params.timevalue = this.timeValue;
                params.brand = this.brand;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            setNAT(){
                this.NATVisible = true;
                var attrOptions = {
                    hostOptions:'result'
                }
                util.get('network/listComputerByVpcId.do?vpcid='+this.selectRow.vpcid,this,attrOptions);

            },
            bindNAT(){
                this.NATVisible = false;
                var url = 'network/enableStaticNat.do';
                url += '?ipId='+this.selectRow.publicipid;
                url += '&vmid='+this.host;
                var attrOptions = {
                    tableData:'result'
                }
                util.getEmitter(this,url,'正在绑定主机...','绑定成功','绑定失败',attrOptions);
            },
            unbind(){
                this.unbindVisible = false;
                var url = 'network/disableStaticNat.do';
                url += '?ipId='+this.selectRow.publicipid;
                var attrOptions = {
                    tableData:'result'
                }
                util.getEmitter(this,url,'正在解除IP绑定...','解绑成功','解绑失败',attrOptions);
            },
            finish(){
                this.dialogVisible = false;
                var url = 'network/associateIpAddress.do';
                url += '?vpcid='+this.vpc;
                url += '&value='+this.value;
                url += '&timevalue='+this.timeValue;
                url += '&brand='+this.brand;
                util.getEmitter(this,url,'正在创建公网...','创建成功','创建失败');
            }
        },
        computed:{
            isFinish:{
                get(){
                    return this.vpc==null;
                }
            }
        }
    }
</script>

<style scoped>

    .item{
        font-size: 16px;
        line-height: 34px;
        font-weight: 400;
        margin-top:25px;
    }
    .item-div{
        display:inline-block;
        font-size: 0px;
        width: 217px;
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
        color: red;
    }
    .item input{
        border: 1px solid #000;
        width: 32px;
        height: 29px;
        vertical-align: super;
        text-align: center;
    }
    .confWapper label{
        vertical-align: top;
        width: 109px;
        display: inline-block;
        text-align: right;
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
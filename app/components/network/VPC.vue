<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary" @click="openDialog">创建VPC</el-button>
            <el-button type="primary" :disabled='selectRow==null' @click="deleteVPC">删除VPC</el-button>

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
                            prop="vpcname"
                            label="vpc名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="vpcdescript"
                            label="vpc描述">
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
                            show-overflow-tooltip
                            :formatter="formatEndtime">
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog title="创建VPC" v-model="dialogVisible" :modal-append-to-body=false size="small">
                <div style="display:flex;border-top:2px solid #000">
                    <div class="config">
                        <div class="confWapper flex">
                            <div class="item">
                                <label>名称<i>*</i>：</label>
                                <div class="item-div"><el-input v-model="VPCname" placeholder="请输入VPC名称"></el-input></div>
                            </div>
                            <div class="item">
                                <label>描述：</label>
                                <div class="item-div"><el-input type="textarea" :rows="2" v-model="VPCdescription" placeholder="请输入VPC描述"></el-input></div>
                            </div>
                            <div class="item">
                                <label>区域<i>*</i>：</label>
                                <div class="item-div">
                                    <el-select v-model="zone" placeholder="请选择">
                                        <el-option
                                                v-for="item in zoneOptions"
                                                :label="item.name"
                                                :value="item.id"
                                                :key="item.id">
                                        </el-option>
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
                    <el-button type="primary" @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" :disabled="isFinish" @click="finish">创建</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/babel">
    import data from '../host/data.js';
    import dateFormatter from '../util/dateFormatter.js'
    import interfaceUtil from '../util/interfaceUtil.js';
    import util from '../util/util.js';
    export default{
        data(){
            return {
                dialogVisible:false,
                payOptions:data.payOptions,
                value:'current',
                timeOptions:data.monthOptions,
                timeValue:'1',
                tableData:[],
                VPCname:'',
                VPCdescription:'',
                zoneOptions:null,
                zone:null,
                money:null,
                selectRow:null,
            }
        },
        created(){
            console.log('create');
            var url = 'network/listVpc.do',
            attrOptions = {
                tableData:'result'
            }
            util.get(url,this,attrOptions);
        },
        methods:{
            openDialog(){
                this.dialogVisible = true;
                interfaceUtil.queryZones(this);
                //interfaceUtil.queryVpcs(this);
            },
            deleteVPC(){
                var url = 'network/deleteVPC.do';
                url += '?vpcid='+this.selectRow.vpcid;
                util.getEmitter(this,url,'正在删除VPC');
                this.selectRow = null;
            },
            changePay(value){
                //处理包月/包年转换
                util.processTimeChange(value,this,data);
                //发起价格查询
                var url = 'device/queryVpcPrice.do';
                let params = {};
                params.value = this.value;
                params.timevalue = this.timeValue;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            format:dateFormatter.format,
            formatEndtime:dateFormatter.formatEndtime,
            formatCost:dateFormatter.formatCost,
            handleCurrentChange:util.handleCurrentChange,
            handleSelectAll:util.handleSelectAll,
            finish(){
                this.dialogVisible = false;
                var url = 'network/createVPC.do';
                url += '?zoneid='+this.zone;
                url += '&name='+this.VPCname;
                url += '&displaytext='+this.VPCdescription;
                url += '&value='+this.value;
                url += '&timevalue='+this.timeValue;
                util.get(url,this,{},'创建订单成功');
                this.$router.push('order')
                //interfaceUtil.createVPC(this);
            }
        },
        computed:{
            isFinish:{
                get(){
                    return this.VPCname==''||this.zone==null;
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
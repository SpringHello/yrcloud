<template>
    <div class="wapper">
        <div class="operStage">
            <div class="table">
                <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="资源"
                            label="资源"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="数量"
                            label="数量"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="类型"
                            label="类型"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="原价"
                            label="原价"
                            show-overflow-tooltip>ordercreatetime
                    </el-table-column>
                    <el-table-column
                            prop="ordercreatetime"
                            label="创建日期"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div class="cost-wrapper"><span>总计支付:{{cost}}</span></div>
            <div><el-button type="primary" @click="pay">支付</el-button></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import util from '../util/util.js'
    export default{
        data(){
            return {
                originData:[],
                tableData:[],
                multipleSelection:[]
            }
        },
        created(){
            this.$http.get('information/searchOrder.do').then(response=>{
                if(response.ok==true&&response.status==200&&response.body.status==1){
                    this.tableData = response.body.result.map(function(item){
                        var obj = JSON.parse(item.display);
                        obj.ordernumber = item.ordernumber;
                        obj.ordercreatetime = item.ordercreatetime;
                        return obj
                    })
                    console.log(this);
                    console.log(this.tableData);
                }else{
                    Message({
                        message:response.body.message,
                        type:'error'
                    });
                }
            },response=>{
                Message({
                    message:'服务端错误',
                    type:'error'
                });
            });
        },
        methods:{
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            pay(){
                var order = this.multipleSelection.reduce(function(prev,current){
                    return `${prev},${current.ordernumber}`;
                },'');
                order = order.slice(1);
                var url = `information/payOrder.do?order=${order}`;
                util.getEmitter(this,url,'正在支付',{})
            }
        },
        computed:{
            cost(){
                if(this.multipleSelection.length<1)
                    return 0;
                return this.multipleSelection.reduce(function(previous,current){

                    return previous + Number.parseFloat(current['原价']);
                },0)
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .cost-wrapper{
        text-align: right;
        span{
            font-size:19px;
        }
    }
</style>
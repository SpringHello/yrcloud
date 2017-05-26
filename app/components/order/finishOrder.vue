<template>
    <div class="wapper">
        <div class="operStage">
            <div class="table">
                <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
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
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="ordercreatetime"
                            label="创建日期"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Message,Loading} from 'element-ui';
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
            this.$http.get('information/searchOrderAlreadyPay.do').then(response=>{
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
        },
        computed:{
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
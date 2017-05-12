<template>
    <div class="wapper">
        <div class="title" v-if="show=='orderTable'">我的工单</div>
        <div class="title" v-if="show=='orderMessage'">沟通记录</div>
        <div class="operStage">

            <div class="table" v-if="show=='orderTable'">
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
                            label="工单编号"
                            width="120"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="问题标题"
                            width="120"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="issue"
                            label="问题内容"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="puddate"
                            label="提交时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                        <template scope="scope">
                            <el-button @click="view(scope)" type="text" size="small">查看工单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="order-display" v-if="show=='orderMessage'">
                <div v-for="item in orderMessage" :class="{answer:item.uname!='',question:item.uname==''}">
                    {{item.message}}
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import util from '../util/util.js';
    export default{
        data(){
            return {
                tableData:[],
                selectRow:null,
                show:'orderMessage',
                orderMessage:[{message:'问题一',uname:''},{message:'回答二',uname:'kehuyi'},{message:'问题二',uname:''},{message:'回答二',uname:'kehu2'}]
            };
        },
        created(){
            var url = 'order/getOrders.do?type=pending';
            var attrOptions={
                tableData:'result'
            }
            util.get(url,this,attrOptions);
        },
        methods:{
            handleCurrentChange:util.handleCurrentChange,
            handleSelectAll:util.handleSelectAll,
            view(scope){
                /*var url = 'order/viewOrder.do?type='+scope.row.wc_sataus+"&orderid="+scope.row.id;
                var attrOptions={
                    orderMessage:'result'
                }
                util.get(url,this,attrOptions);*/
                this.show='orderMessage'
            }
        }
    }
</script>

<style scoped>
    .table{
        padding-top:15px;
    }
    .order-display{

    }
    .title{
        font-size:16px;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
        padding:12px 15px;
        background-color: #cdd0de;
    }
    .answer{
        text-align:left;
        background-color:#eafbff;
        height: 50px;
        font-size: 20px;
    }
    .question{
        text-align:right;
        height: 50px;
        font-size: 20px;
    }
</style>
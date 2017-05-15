<template>
    <div class="wapper">
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
                <div class="title">工单详情</div><span style="cursor: pointer;line-height: 27px;font-size: 16px;" @click="show = 'orderTable'">&lt;返回列表</span>
                <div style="">
                    问题描述:{{title.title}}
                </div>
                <div v-for="item in reply" :class="{answer:item.uname!='',question:item.uname==''}">
                    <p>{{item.g_reply}}</p>
                    <span class="dateTime">{{item.repdate}}</span>
                </div>
                <div style="padding-top:20px;width:80%">
                    <el-input type="textarea" :rows="3" v-model="newMessage"></el-input>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
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
                show:'orderTable',
                title:{},
                reply:[],
                newMessage:'',
                currentOrderid:null
            };
        },
        created(){
            var url = 'order/getOrders.do?type=processing';
            var attrOptions={
                tableData:'result'
            }
            util.get(url,this,attrOptions);
        },
        methods:{
            handleCurrentChange:util.handleCurrentChange,
            handleSelectAll:util.handleSelectAll,
            view(scope){
                this.currentOrderid = scope.row.id;
                var url = 'order/viewOrder.do?orderid='+scope.row.id;
                var attrOptions={
                    title:'title',
                    reply:'reply'
                }
                util.get(url,this,attrOptions);

                this.show='orderMessage'
            },
            onSubmit(){
                var url = 'order/reply.do';
                var postLoader = {
                    orderid:this.currentOrderid,
                    editorValue:this.newMessage
                }
                util.post(url,postLoader,this,{});
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
        font-size: 20px;
    }
    .question{
        text-align:right;
        font-size: 20px;
    }
    .dateTime{
        font-size: 5px;
    }
</style>
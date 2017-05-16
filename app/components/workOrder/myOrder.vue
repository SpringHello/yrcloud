<template>
    <div class="wapper">
        <div class="operStage">
            <div class="table" v-if="show=='orderTable'">
                <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="工单编号"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="问题标题"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="issue"
                            label="问题内容"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="puddate"
                            label="提交时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="wc_sataus"
                            label="状态"
                            show-overflow-tooltip
                            :formatter="format">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                        <template scope="scope">
                            <el-button @click="view(scope)" v-if="scope.row.wc_sataus!='1'" type="text" size="small">查看工单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="order-display" v-if="show!='orderTable'">
                <div class="title">
                    <div><span>问题标题:</span>{{title.title}}</div>
                    <div style="margin-right:50px">
                        <span>工单编号:</span>{{currentOrderid}}
                    </div>
                    <div>
                        <span>提交时间:</span>{{title.puddate}}
                    </div>
                </div>
                <div class="title" style="margin-top: 15px;border:1px solid #ccc;border-bottom: none">
                    <span>沟通记录</span>
                </div>
                <div class="dialog-wrapper">
                    <div v-for="(item,index) in reply" class="reply" :class="{lightBlue:index%2==0}">
                        <span style="line-height: 29px">{{item.uname}}:&nbsp;</span><span v-html="item.g_reply"></span>
                        <span style="display: block">{{item.repdate}}</span>
                    </div>
                    <div id="dialog"></div>
                </div>

                <div class="title" style="margin-top: 15px;border:1px solid #ccc;border-bottom: none" v-if="show=='processing'">
                    <span>我要反馈</span>
                </div>
                <div class="reply-wrapper" v-if="show=='processing'">
                    <div style="margin-bottom: 15px">
                        <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入留言内容"
                                v-model="newMessage">
                        </el-input>
                    </div>

                    <el-button :disabled="newMessage==''||disabled" @click="onSubmit">{{buttonMsg}}</el-button>
                    <el-button @click="closeOrder">问题已解决!关闭工单</el-button>
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
                currentOrderid:null,
                buttonMsg:'提交',
                disabled:false,
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
            view(scope){
                this.currentOrderid = scope.row.id;
                var url = 'order/viewOrder.do?orderid='+scope.row.id;
                var attrOptions={
                    title:'title',
                    reply:'reply'
                }
                util.get(url,this,attrOptions);
                this.show = scope.row.wc_sataus == '2'?'processing':'processed'

            },
            onSubmit(){
                this.disabled = true;
                count(this);
                var url = 'order/reply.do?orderid='+this.currentOrderid+"&editorValue="+this.newMessage;
                this.$http.get(url).then(response=>{
                    if(response.ok==true&&response.status==200&&response.body.status==1){
                        this.reply.push(response.body.msg)
                        document.getElementById("dialog").scrollIntoView(true);
                    }else{
                        Message({
                            message:'提交失败',
                            type:'error'
                        });
                    }
                },response=>{
                    Message({
                        message:'服务器错误',
                        type:'error'
                    });
                })
                function count(vm){
                    var sec = 5;
                    vm.buttonMsg = sec+'s';
                    var IntervalId = window.setInterval(f,1000);
                    function f(){
                        sec--;
                        vm.buttonMsg = sec+'s';
                        if(sec==0){
                            vm.buttonMsg = '提交'
                            vm.disabled = false;
                            window.clearInterval(IntervalId);
                        }
                    }

                }
            },
            closeOrder(){
                var url = 'order/closeOrder.do?orderid='+this.currentOrderid;
                util.get(url,this,{});
            },
            format(row){
                return row.wc_sataus=='1'?'未处理': row.wc_sataus=='2'?'处理中':'处理完成';
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
        font-size:12px;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
        padding:12px 15px;
        background-color: #eaedf1;
    }
    .answer{
        text-align:left;
        font-size: 20px;
        margin-top: 17px;
    }
    .question{
        text-align: right;
        font-size: 20px;
        margin-top: 17px;
    }
    .question span{
        background-color: #1d9a08;
        padding:5px;
        margin: 5px;
        border-radius: 5px;
    }
    .answer span{
        background-color: #cdd0de;
        padding:5px;
        margin: 5px;
        border-radius: 5px;
        color:black;
    }
    .dateTime{
        font-size: 5px;
    }
    .title span{
        color:#999;
    }
    .reply{
        padding: 6px 26px;
        font-size: 14px;
        color: #999;
        border:1px dashed #ccc;
    }
    .dialog-wrapper{
        height: 450px;
        overflow-y: auto;
        border: 1px solid #ccc;
        border-top: none;
    }
    .reply-wrapper{
        padding: 18px 13px;
        border: 1px solid #ccc;
        border-top:none;
    }
    .lightBlue{
        background-color: #eafbff;
    }
</style>
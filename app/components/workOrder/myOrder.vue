<template>
    <div class="wapper">
        <ul class="select">
            <li class="default" :class="{hover:show=='pending'}"><a class="select-item" @click="toggle('pending')">待处理工单</a></li>
            <li class="default" :class="{hover:show=='processing'}"><a class="select-item" @click="toggle('processing')">处理中工单</a></li>
            <li class="default" :class="{hover:show=='processed'}"><a class="select-item" @click="toggle('processed')">已处理工单</a></li>
        </ul>
        <div class="operStage">

            <div class="disk-snapshot" v-if="show == 'pending'">
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
                                label="工单号"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="工单标题"
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

            <div class="disk-snapshot" v-if="show == 'processing'">
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
                                label="工单号"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="工单标题"
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

            <div class="disk-snapshot" v-if="show == 'processed'">
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
                                label="工单号"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="工单标题"
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

                show:'pending',
            };
        },
        created(){
            this.refresh();
        },
        methods:{
            handleCurrentChange:util.handleCurrentChange,
            handleSelectAll:util.handleSelectAll,
            toggle(type){
                this.tableData = [];
                this.selectRow = null;
                this.show = type;
                this.refresh();
            },
            refresh(){
                var url = 'order/getOrders.do?type='+this.show;
                var attrOptions={
                    tableData:'result'
                }
                util.get(url,this,attrOptions);
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
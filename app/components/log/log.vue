<template>
    <div class="wapper">
        <div class="operStage">
            <div class="search">
                操作目标
                <el-select v-model="target" clearable placeholder="全部">
                    <el-option
                            v-for="item in options"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="search">
                查询日期
                <el-date-picker
                        v-model="time"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions"
                        @change="dataChange">
                </el-date-picker>
                <el-button type="primary" @click="search">&nbsp;&nbsp;&nbsp;&nbsp;搜索&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </div>

        </div>
        <div class="operStage">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="operatetarget"
                        label="操作目标">
                </el-table-column>
                <el-table-column
                        prop="operatetype"
                        label="操作类型">
                </el-table-column>
                <el-table-column
                        prop="operatedes"
                        label="操作详情"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="operator"
                        label="操作人">
                </el-table-column>
                <el-table-column
                        prop="operatestatus"
                        :formatter="format"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="operatortime"
                        label="操作时间">
                </el-table-column>
            </el-table>
            <div class="pagination" align="right">
                <el-pagination
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total"
                        @current-change="currentChange">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                options: [{
                    value: 'host',
                    label: '主机'
                }, {
                    value: 'disk',
                    label: '硬盘'
                }, {
                    value: 'snapshot',
                    label: '快照'
                }],
                target: '',

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                time:'',
                dateRange:'',
                tableData:[],
                currentPage:1,
                pageSize:15,
                total:0

            }
        },
        created(){
            this.$http.get('log/queryLog.do?pageSize='+this.pageSize+'&currentPage='+this.currentPage+'&target='+this.target+'&queryTime='+this.time).then(response => {
                this.total = response.body.total;
                this.tableData = response.body.tableData;
            })
        },
        methods:{
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.search();
            },
            dataChange(time){
                this.dateRange = time;
            },
            search(){
                this.$http.get('log/queryLog.do?pageSize='+this.pageSize+'&currentPage='+this.currentPage+'&target='+this.target+'&queryTime='+this.dateRange).then(response => {
                    this.total = response.body.total;
                    this.tableData = response.body.tableData;
                })
            },
            format(row){
                return row.operatestatus=='1'?'操作成功':'操作失败';
            }
        }
    }
</script>

<style scoped>
    .search{
        margin-left:11px;
        display:inline-block;
    }
    .pagination{
        margin-top:15px;
    }
    .operStage button{
        margin-left: 25px;
    }
</style>
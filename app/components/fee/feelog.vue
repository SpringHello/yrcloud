<template>
    <div class="wapper">
        <div class="operStage">
            <div class="search">
                查询日期
                <el-date-picker
                        v-model="searchDate"
                        type="daterange"
                        placeholder="选择日期范围"
                        @change="updateTime">
                </el-date-picker>
                <el-button type="primary" @click="search()">&nbsp;&nbsp;&nbsp;&nbsp;搜索&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </div>
        </div>

        <div class="operStage">
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="trno"
                        label="流水号">
                </el-table-column>
                <el-table-column
                        prop="amount"
                        label="消费金额">
                </el-table-column>
                <el-table-column
                        prop="createtime"
                        label="消费时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        show-overflow-tooltip
                        :formatter="format">
                </el-table-column>
                <el-table-column
                        prop="companyname"
                        label="操作人">
                </el-table-column>
                <el-table-column
                        prop="descs"
                        label="说明">
                </el-table-column>
            </el-table>
            <div class="pagination" align="right">
                <el-pagination
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total"
                        :current-page="currentPage"
                        @current-change="search">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                tableData:[],
                searchDate:null,
                date:'',
                pageSize:15,
                currentPage:1,
                total:100,
            }
        },
        created(){
            this.$http.get('account/getCaseList.do?currentPage=1&type=1').then(response => {
                if(response.ok==true&&response.status==200){
                    this.tableData = response.body.accountList;
                    this.pageSize = response.body.pageSize;
                    this.total = response.body.sum;
                }
            });
        },
        methods:{
            search(currentPage){
                if(currentPage){
                    this.currentPage = currentPage;
                }else{
                    this.currentPage = 1;
                }
                let url = 'account/getCaseList.do?type=1&currentPage='+this.currentPage;
               if(this.date!=''){
                    let dateRange = this.date.split(' - ');
                    url += '&startDate='+dateRange[0]+'&endDate='+dateRange[1];
                }
                this.$http.get(url).then(response => {
                    this.tableData = response.body.accountList;
                    this.total = response.body.sum;
                    this.pageSize = response.body.pageSize;
                });
            },
            updateTime(time){
                this.date = time;
            },
            format(row){
                if(row.status==1){
                    return '成功';
                }
                return '失败';
            }
        },

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
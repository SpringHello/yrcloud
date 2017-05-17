<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary">创建负载均衡</el-button>
            <el-button type="primary">删除负载均衡</el-button>
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
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import util from '../util/util.js';
    export default{
        data(){
            return {
                tableData:[]
            }
        },
        created(){
            var url = 'loadbalance/'
            util.get(url,this,{})
        },
        methods:{
            handleSelectAll:util.handleSelectAll,
            handleCurrentChange:util.handleCurrentChange,
        }
    }

</script>

<style>

</style>
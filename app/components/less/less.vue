<template>
    <div class="wapper">
        <div class="operStage">
            hello less
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
            return {}
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    @less:red;
    .operStage{
        background-color: @less;
    }
</style>
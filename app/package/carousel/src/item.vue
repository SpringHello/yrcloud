<template>
    <div class="carousel-item">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        name:'my-carousel-item',
        data(){
            return{}
        },
        created(){

        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .carousel-item{
        position:absolute;
        left:0px;
        top:0px;
        width:100%;
        height:100%;
    }
</style>
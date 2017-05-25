<template>
    <div class="carousel-item" :class="{isActive:active}" :style="{transform:`translateX(${translate}px)`}">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        name:'my-carousel-item',
        data(){
            return{
                translate:0,
                active:false
            }
        },
        created(){

        },
        methods:{
            calculatePosition(index,activeIndex,parentWidth){
                this.active = index===activeIndex;
                this.translate = (index-activeIndex)*parentWidth
            }
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
        -webkit-transition: 1s;
        -moz-transition: 1s;
        -ms-transition: 1s;
        -o-transition: 1s;
        transition: 1s;
        z-index:1;
    }
    .isActive{
        z-index:2
    }
</style>
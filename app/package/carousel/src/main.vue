<template>
    <div class="carousel">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name:'my-carousel',
        props:{

        },
        data(){
            return {
                items:[],
                activeIndex:-1
            }
        },
        created(){

        },
        mounted(){
            this.items = this.updateItem();
            if(this.item.length>0)
                this.activeIndex = 0;
        },
        methods:{
            updateItem(){
                return this.$children.filter(item=>{
                    return item.$options.name = 'my-carousel-item';
                })
            }
        },
        watch:{
            activeIndex(){
                this.items.forEach((item,index)=>{
                    item.calculatePosition(index,this.activeIndex);
                })
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>

    .carousel{
        height:100%;
        div{

        }
    }
</style>
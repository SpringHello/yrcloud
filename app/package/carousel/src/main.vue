<template>
    <div class="carousel"
         @mouseenter.stop="handleMouseEnter"
         @mouseleave.stop="handleMouseLeave">
        <transition name="carousel-arrow-left">
            <button class="carousel-arrow-button carousel-left-button"
                    v-show="hover">
                <i class="arrow-left-icon"></i>
            </button>
        </transition>
        <transition name="carousel-arrow-right">
            <button class="carousel-arrow-button carousel-right-button"
                    v-show="hover">
                <i class="arrow-right-icon"></i>
            </button>
        </transition>
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
                activeIndex:-1,
                hover:false
            }
        },
        created(){

        },
        mounted(){
            this.items = this.updateItem();
            if(this.items.length>0)
                this.activeIndex = 0;
        },
        methods:{
            updateItem(){
                return this.$children.filter(item=>{
                    return item.$options.name = 'my-carousel-item';
                })
            },
            handleMouseEnter(){
                this.hover = true;
            },
            handleMouseLeave(){
                this.hover = false;
            }
        },
        watch:{
            items(){
                if(this.items.length>0)
                    this.activeIndex = 0;
            },
            activeIndex(){
                const parentWidth = this.$el.offsetWidth;
                this.items.forEach((item,index)=>{
                    item.calculatePosition(index,this.activeIndex,parentWidth);
                })
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .carousel{
        height:100%;
        position:relative;
        overflow-x: hidden;
        .carousel-arrow-button{
            width:36px;
            height:36px;
            position:absolute;
            top:50%;
            transform: translate(0px,-50%);
            border-radius:50% 50%;
        }
        .carousel-left-button{
            left:16px;
        }
        .carousel-right-button{
            right:16px;
        }
        .carousel-arrow-left-enter-active, .carousel-arrow-left-leave-active, .carousel-arrow-right-enter-active, .carousel-arrow-right-leave-active {
            transition: all .5s ease;
        }
        .carousel-arrow-left-enter, .carousel-arrow-left-leave-active {
            opacity: 0;
            transform: translate(-16px,-50%);
        }
        .carousel-arrow-right-enter, .carousel-arrow-right-leave-active {
            opacity: 0;
            transform: translate(16px,-50%);
        }
    }
</style>
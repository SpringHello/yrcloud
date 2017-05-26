<template>
    <div class="carousel"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave">
        <transition name="carousel-arrow-left">
            <button class="carousel-arrow-button carousel-left-button"
                    v-show="hover"
                    @click.stop="setActiveItem(activeIndex - 1)">
                <i class="arrow-left-icon chevron-left"></i>
            </button>
        </transition>
        <transition name="carousel-arrow-right">
            <button class="carousel-arrow-button carousel-right-button"
                    v-show="hover"
                    @click.stop="setActiveItem(activeIndex + 1)">
                <i class="arrow-right-icon chevron-left"></i>
            </button>
        </transition>
        <slot></slot>
        <ul v-if="dots">
            <li @click="setActiveItem(index)" v-for="(item,index) in items" :key="item" :class="{isActive:activeIndex==index}"></li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import throttle from 'throttle-debounce/throttle'
    export default {
        name:'my-carousel',
        props:{
            autoplay:{
                type:Boolean,
                default:true
            },
            dots:{
                type:Boolean,
                default:true
            },
            effect:{
                type:String,
                default:'scrollx'
            },
            interval:{
                type:Number,
                default:5000
            },
            hoverStop:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {
                items:[],
                activeIndex:-1,
                hover:false,
                total:0,
                intervalID:null
            }
        },
        created(){
            this.setActiveItem = throttle(500,true,(index)=>{
                if(index<0)
                    index+=this.total;
                else if(index>this.total-1)
                    index-=this.total;
                this.activeIndex = index;

            });
        },
        mounted(){
            this.items = this.updateItem();
            this.total = this.items.length;
            this.activeIndex = 0;
            if(this.autoplay){
                this.intervalID = window.setInterval(()=>{
                    this.setActiveItem(this.activeIndex+1)
                },this.interval);
            }
        },
        methods:{
            updateItem(){
                return this.$children.filter(item=>{
                    return item.$options.name = 'my-carousel-item';
                })
            },
            handleMouseEnter(){
                this.hover = true;
                if(this.autoplay&&this.intervalID&&this.hoverStop){
                    window.clearInterval(this.intervalID);
                }
            },
            handleMouseLeave(){
                this.hover = false;
                if(this.autoplay&&this.hoverStop){
                    this.intervalID = window.setInterval(()=>{
                        this.setActiveItem(this.activeIndex+1)
                    },this.interval);
                }
            }
        },
        watch:{
            activeIndex(){
                const parentWidth = this.$el.offsetWidth;
                this.items.forEach((item,index)=>{
                    item.calculatePosition(index,this.activeIndex,this.total,parentWidth);
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
            z-index:4;
            border:none;
            outline:none;
            cursor:pointer;
            background-color: rgba(31,45,61,.11);
            transition:.5s;
            &:hover{
                background-color: #384c6e;
            }
        }
        .carousel-item{
            background-color:white;
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
        ul{
            z-index: 4;
            position: absolute;
            left: 50%;
            bottom: 2%;
            transform: translate(-50%,0%);
            li{
                transition:.5s;
                width: 16px;
                height: 4px;
                background-color: white;
                display: inline-block;
                margin:0px 2px;
                border-radius: 2px;
            }
            .isActive{
                width:32px;
            }
        }
    }
</style>
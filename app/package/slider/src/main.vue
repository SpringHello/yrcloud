<template>
    <div>
        <div id="pole">
            <span v-for="(point,index) in processPosition" :style="pointPosition(point)" class="points-style"><label class="points">{{showPoints[index]+unit}}</label></span>
            <slider
                    :value="value"
                    @refresh="refresh"
                    @setValue="setValue"
                    :step="step"
            >
            </slider>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import slider from './button.vue';
    export default{
        name:'my-slider',

        props:{
            value:{
                type:Number,
                default:0
            },
            points:{
                type:Array,
                default:function(){
                    return []
                }
            },
            unit:{
                type:String,
                default:''
            },
            min:{
                type:Number,
                default:0
            },
            max:{
                type:Number,
                default:100
            },
            step:{
                type:Number,
                default:1
            }
        },
        data(){
            this.points.push(this.max);
            var processPosition = this.points.map((value,index,arr)=>{
                if(index)
                    value = value-arr[index-1]
                return value;
            })
            return{
                showPoints:this.points,
                processPosition,
            }
        },
        components:{
            'slider':slider
        },
        methods:{
            pointPosition(point){
                let position = (point-this.min)/(this.max-this.min)*100+'%'
                return {width:position};
            },
            refresh(){
                this.$emit('change');
            },
            setValue(value){
                this.$emit('input',value);
            }
        },
        computed:{
            $sliderSize(){
                return document.getElementById('pole').clientWidth
            },
        }
    }
</script>
<style scoped>
    #pole{
        width:350px;
        height:30px;
        position:relative;
        font-size:0px;

    }
    .points-style{
        height:30px;
        text-align:right;
        font-size:16px;
        line-height:30px;
        display:inline-block;
        border-top:1px solid rgb(221,221,221);
        border-left:1px solid rgb(221,221,221);
        border-bottom:1px solid rgb(221,221,221);
        position:relative;
    }
    span:last-of-type{
        border-right:1px solid rgb(221,221,221);
    }
    .points{
        position:absolute;
        z-index:100;
        right:0px;
    }
</style>

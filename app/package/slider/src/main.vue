<template>
    <div>
        <div id="pole">
            <span v-for="(point,index) in processPosition" :style="pointPosition(point)" class="points-style"><label class="points">{{points[index]+unit}}</label></span>
            <slider
                    :value="value"
                    @refresh="refresh"
                    :step="step"
            >
            </slider>
        </div>
        <div>{{oldValue}}</div>
    </div>

</template>

<script type="text/ecmascript-6">
    import slider from './button.vue';
    export default{
        name:'COMSlider',

        props:{
            value:{
                type:Number,
                default:0
            },
            points:{
                type:Array,
                default:function(){
                    return [20,50]
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
            console.log(processPosition);
            return{
                oldValue:this.value,
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
            refresh(value){
                this.oldValue = value;
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

<template>
    <div>
        <div class="com-slider-pole"
             id="pole"
             ref="slider">
            <div class="com-slider-active"></div>
             <slider
                v-model="value">
             </slider>
        </div>
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
            }
        },
        data(){
            return{
                min:0,
                max:100
            }
        },
        components:{
            'slider':slider
        },
        computed:{
            $sliderSize(){
                return document.getElementById('pole').clientWidth
            }
        }
    }
</script>
<style scoped>
    .com-slider-pole{
        width:100px;
        height:20px;
        position:relative;
    }
    .com-slider-active{
        position:absolute;
        height:20px;
        width:50px;
        background-color: #43bfe3;
    }
</style>

<template>
    <div class="com-slider-pole">
        <slider></slider>
    </div>
</template>

<script type="text/ecmascript-6">
    import slider from './button.vue';

    export default{
        name:'COMSlider',

        data(){
            return{
                min:0,
                max:100,
                sliderSize:100
            }
        },
        components:{
            'slider':slider
        }
    }
</script>
<style scoped>
    .com-slider-pole{
        width:100px;
        height:15px;
        background-color: #333333;
        position:relative;
    }
</style>

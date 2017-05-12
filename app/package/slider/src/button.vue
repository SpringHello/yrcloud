<template>
    <div
        class="com-slider-button"
        :style="styleWrapper"
        :class="{hover:hovering,dragging:dragging}"
        @mousedown="handleMouseDown"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
    </div>
</template>

<script type="text/ecmascript-6">
    import slider from './button.vue';

    export default{
        name:'COMSlider',

        props:{

        },
        data(){
            return{
                hovering:false,
                dragging:false,
                startX:0,
                currentX:0,
                startPosition:0,
                value:0
            }
        },
        computed:{
            min(){
                return this.$parent.min;
            },
            max(){
                return this.$parent.max;
            },
            styleWrapper(){
                return {left:this.currentPosition};
            },
            currentPosition(){
                return `${(this.value-this.min)/(this.max-this.min)*100}%`;
            }
        },
        methods:{
            handleMouseEnter(){
                this.hovering = true;
            },
            handleMouseLeave(){
                this.hovering = false;
            },
            handleMouseDown(event){
                event.preventDefault();
                console.log(event);
                this.startX = event.clientX,
                this.startPosition = parseFloat(this.currentPosition);
                window.addEventListener('mousemove',this.onDragging);
                window.addEventListener('mouseup',this.DraggingEnd);
            },
            onDragging:function(event){
                this.currentX = event.clientX;
                console.log('this.currentX'+this.currentX)
                console.log('this.startX'+this.startX)
                console.log('this.$parent.$sliderSize'+this.$parent.$sliderSize)

                let diff = (this.currentX-this.startX)/this.$parent.$sliderSize*100;
                let newPosition = this.startPosition + diff;
                console.log(newPosition);
                this.setPosition(newPosition)
            },
            DraggingEnd:function(){
                window.removeEventListener('mousemove',this.onDragging);
                window.removeEventListener('mouseup',this.DraggingEnd)
            },
            setPosition(newPosition){
                if(newPosition>100)
                    newPosition=100;
                if(newPosition<0)
                    newPosition=0;
                this.value = (newPosition/100)*(this.max-this.min);
            }
        }
    }
</script>

<style scoped>
    .com-slider-button{
        width:16px;
        height:24px;
        background-color: #0095AC;
        cursor:pointer;
        position: absolute;
    }
    .hover{
        background-color: red;
    }
</style>

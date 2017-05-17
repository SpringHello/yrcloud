<template>
    <div class="my-alert-wrapper">
        <div :class="type" class="my-alert">
            <div class="header">
                <span>{{title}}</span>
                <i clas="el-alert-close-icon" v-if="CloseIcon" @click="close">X</i>
            </div>
            <div class="body">
                <span>{{description}}</span>
            </div>
            <div class="footer">
                <button>确定</button>
            </div>
        </div>
    </div>

</template>

<script type="text/babel">

    export default{
        name: 'my-alert',
        data(){

        },
        props:{
            value:{
                type:Boolean,
                default:true
            },
            CloseIcon:{
                type:Boolean,
                default:true
            },
            title:{
                type:String,
                default:'提示',
                require:true
            },
            type:{
                type:String,
                default:'info',
            },
            description:{
                type:String,
                default:'请添加描述...'
            }
        },
        create(){
            var model = document.createElement("div")
        },
        methods:{
            close(){
                this.$emit('input',false);
                this.$emit('close');
            }
        },
        computed:{

        }
    }
</script>


<style>
    .my-alert-wrapper{
        position:fixed;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        z-index:100;
    }
    .my-alert{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        opacity: 1;
    }
    .info{
        width:250px;
        height:150px;
    }
</style>
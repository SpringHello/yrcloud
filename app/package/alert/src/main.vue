<template>
    <translation>
        <div class="el-alert" :class="[typeClass]">
            <i clas="el-alert-icon" :class="[iconClass,isBigIcon]" v-if="showIcon"></i>
            <div>
                <span>{{title}}</span>
                <desc-content></desc-content>
                <i @click="close"></i>
            </div>
        </div>
    </translation>
</template>

<script type="text/babel">

    const iconClassMap = {
        success:'el-icon-circle-check',
        warning:'el-icon-warning',
        error:'el-alert-circle-cross'
    }

    export default{
        name: 'el-alert',
        data(){
            return {
                visible:true,
            }
        },
        props:{
            title:{
                type:String,
                default:'',
                require:true
            },
            type:{
                type:String,
                default:'info',
            },
            description:String,
            renderContent:Function
        },
        methods:{
            close(){
                this.visible = false;
                this.$emit('close');
            }
        },
        computed:{
            typeClass(){
                return "el-alert-"+this.type;
            },
            iconClass(){
                return iconClassMap[this.type]||'el-alert-info'
            },
            isBigIcon(){
                return this.description?'isBig':''
            }
        },
        components:{
            descContent:{
                render(h){
                    const parent = this.$parent;
                    if(parent.renderContent){
                        parent.renderContent(h);
                    }else if(parent.description){
                        return <p class="el-alert-description">{parent.description}</p>
                    }else{
                        return '';
                    }
                }
            }
        }
    }
</script>

<style>
    .el-alert{
        padding:5px;
        width:100%;

    }
</style>
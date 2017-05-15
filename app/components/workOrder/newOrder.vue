<template>
    <div class="wapper">
        <div class="title">提交工单</div>
        <div class="operStage">

            <div class="form-wrapper">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="问题描述">
                        <el-input type="textarea" :rows="3" v-model="form.title"></el-input>
                    </el-form-item>
                    <el-form-item label="详细信息">
                        <el-input type="textarea" :rows="6" v-model="form.content"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="isDisabled" @click="onSubmit">提交工单</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import util from '../util/util.js';
    export default{
        data(){
            return {
                form:{
                    title:'',
                    content:''
                }
            };
        },
        created(){

        },
        methods:{
            onSubmit(){
                var url = 'order/createOrder.do?title='+this.form.title+'&content='+this.form.content;
                util.get(url,this,{},'提交工单成功');
            }
        },
        computed:{
            isDisabled(){
                return this.form.title===''||this.form.content===''
            }
        }
    }
</script>

<style scoped>
    .form-wrapper{
        width:60%;
        margin:35px auto;
    }
    .title{
        font-size:16px;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", STHeiti, "Microsoft YaHei";
        padding:12px 15px;
        background-color: #cdd0de;
    }
</style>
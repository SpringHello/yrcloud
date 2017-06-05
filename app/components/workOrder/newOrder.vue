<template>
    <div class="wapper">
        <div class="title">提交工单</div>
        <div class="operStage">
            <div class="form-wrapper">
                <el-select v-model="qusttype" placeholder="请选择">
                    <el-option
                            v-for="item in orderType[0]"
                            :key="item.qusttype"
                            :label="item.description"
                            :value="item.qusttype">
                    </el-option>
                </el-select>
                <el-select v-model="protype" placeholder="请选择">
                    <el-option
                            v-for="item in orderType[1]"
                            :key="item.protype"
                            :label="item.description"
                            :value="item.protype">
                    </el-option>
                </el-select>
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
                },
                orderType:null,
                qusttype:null,
                protype:null
            };
        },
        created(){
            util.get("order/orderType.do",this,{orderType:'result'});
        },
        methods:{
            onSubmit(){
                var url = 'order/createOrder.do?title='+this.form.title+'&content='+this.form.content+'&protype='+this.protype+'&qusttype='+this.qusttype;
                util.get(url,this,{},'提交工单成功');
            }
        },
        computed:{
            isDisabled(){
                return this.form.title===''||this.form.content===''||this.protype==null||this.qusttype==null
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
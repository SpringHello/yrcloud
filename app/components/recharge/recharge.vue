<template>
    <div class="wapper">
        <div class="operStage">
            <div class="recharge">
                <span>充值金额 :</span><el-input v-model="input" placeholder="请输入内容" size="large" autofocus=true></el-input>
            </div>

            <div style="padding-top: 26px;padding-left: 19px;">

                <div :class="{ pay: payWay == 'alipay',default:payWay != 'alipay' }">
                    <span @click="payWay='alipay'"><input type="radio" name="payWay"></span>
                    <div class="payLogo alipay"></div>
                </div>
                <!--div :class="{ pay: payWay == 'wxpay',default:payWay != 'wxpay' }">
                    <span @click="payWay='wxpay'"><input type="radio" name="payWay"></span>
                    <div class="payLogo wxpay"></div>
                </div-->
            </div>
            <div style="padding-top: 26px;padding-left: 19px;">
                <el-button type="primary" @click="recharge">&nbsp;&nbsp;&nbsp;&nbsp;充值&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </div>
        </div>
        <el-dialog title="充值遇到问题?" v-model="dialogVisible" size="tiny" :modal-append-to-body=false>
            <span>充值完成前请不要关闭此窗口。完成充值后请根据你的情况点击下面的按钮：</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">充值已完成</el-button>
                <el-button @click="dialogVisible = false">充值遇到问题</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                input:10,
                payWay:'alipay',
                dialogVisible:false,
            }
        },
        created(){

        },
        methods:{
            recharge(){
                this.dialogVisible=true;
                window.open('zfb/alipayapi.do?total_fee='+this.input);
            }

        }
    }
</script>

<style scoped>
    .recharge{
        width:270px;
        padding-left:19px;
    }
    .pay{
        position:relative;
        display:inline-block;
        width:170px;
        height:38px;
    }
    .default{
        position:relative;
        display:inline-block;
        width:170px;
        height:38px;
    }
    .pay span{
        background-color: #20a0ff;
        position: absolute;
        display: inline-block;
        top:28%;
        width:18px;
        height:18px;
        border-radius:50%;
    }
    .pay span:after{
        content: '';
        width:6px;
        height:6px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius:50%;
        background-color: white;
    }
    .pay input{
        display:none;
    }
    .default span{
        display: inline-block;
        width:18px;
        position:absolute;
        height:18px;
        top:28%;
        border:1px solid #ccc;
        border-radius:50%;
    }
    .default input{
        display:none;
    }
    .payLogo{
        width:100px;
        height:38px;
        background: url("../../../assets/img/bank-icons.png") no-repeat;
        margin-left:20px;
    }
    .alipay{
        background-position: 3px -947px;
    }
    .wxpay{
        background-position: 30px -828px;
    }
</style>
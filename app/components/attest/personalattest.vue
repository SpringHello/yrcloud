<template>
    <div class="wapper">
        <div class="operStage">
            <h2 class="title">用户信息</h2>
            <div class="operator">
                <el-radio-group v-model="radio" size="small">
                    <el-radio-button label="个人信息"></el-radio-button>
                    <el-radio-button label="提醒设置"></el-radio-button>
                    <el-radio-button label="安全设置"></el-radio-button>
                </el-radio-group>
            </div>

            <div>
                <div class="personal-title">个人基本信息</div>
                <div class="personal-info">
                    <div class="avatar">
                        <img :src="userInfo.avatar">
                    </div>
                    <div class="personal-detail">
                        <div><span>用户类型</span></div>
                        <div><span>手机{{userInfo.phone}}</span></div>
                        <div><span>用户名称{{userInfo.realname}}</span></div>
                        <div><span>邮箱{{userInfo.loginname}}</span></div>
                    </div>
                </div>
            </div>

            <div v-if="userInfo.personalauth==1">
                <div class="personal-title">个人认证信息</div>
                <div class="info">
                    <div class="info-item"><span>真实姓名:</span><el-input v-model="name" placeholder="请输入姓名"></el-input></div>
                    <div class="info-item"><span>身份证号:</span><el-input v-model="cardID" placeholder="请输入身份证号"></el-input></div>
                    <div class="info-item"><span>手机号码:</span><el-input v-model="phone" placeholder="请输入手机号"></el-input></div>
                </div>
                <span>身份证正面</span>
                <el-upload
                        class="avatar-uploader"
                        action="file/upFile.do"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span>身份证背面</span>
                <el-upload
                        class="avatar-uploader"
                        action="file/upFile.do?isback=1"
                        :show-file-list="false"
                        :on-success="handleBackAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="backImageUrl" :src="backImageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-button type="primary" :disabled="isComplete" @click="commit">提交审核</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Message,Loading} from 'element-ui';
    import util from '../util/util.js';
    export default{
        data(){
            return {
                userInfo:'',
                name:'',
                cardID:'',
                phone:'',
                radio:'个人信息',
                imageUrl:'',
                backImageUrl:''
            }
        },
        created(){
            util.get("user/GetUserInfo.do",this,{userInfo:'result'})
        },
        methods:{
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleBackAvatarSuccess(res, file) {
                this.backImageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const reg = /^image\/(jpeg|png)$/;
                const isJPG = reg.test(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    Message.error('上传头像图片只能是 JPG/PNG 格式!');
                }
                if (!isLt2M) {
                    Message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            commit(){
                var url = `user/personalAttest.do?name=${this.name}&cardID=${this.cardID}&phone=${this.phone}`;
                this.$http.get(url).then(response=>{
                    if(response.ok==true&&response.status==200&&response.body.status==1){
                        this.userInfo.personalauth = 0;
                            Message({
                                message:"认证提交成功",
                                type:'success'
                            });
                    }else{
                        Message({
                            message:response.body.message,
                            type:'error'
                        });
                    }
                },response=>{
                    Message({
                        message:'服务器错误',
                        type:'error'
                    });
                })
                util.get(url,this,{},"认证提交成功");
            }
        },
        computed:{
            isComplete(){
                return !(this.imageUrl&&this.backImageUrl&&this.name&&this.cardID&&this.phone)
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .operStage{
        .title{
            padding-bottom:5px;
            border-bottom: 1px solid black;
            font-weight:bold;
        }
        .operator{
            margin-top: 10px;
        }
        .personal-title{
            margin-top:15px;
            font-weight: bold;
            font-size:16px;
        }
        .personal-info{
            width:100%;
            height:100px;
            display:flex;
            padding:10px 0px;
            .avatar{
                width:78px;
                height:78px;
            }

            .personal-detail{
                margin-left:25px;
                display:flex;
                flex-wrap:wrap;
                width:500px;
                div{
                    width:250px;
                }
            }

        }
        .info{
            .el-input{
                width:250px;
            }
            .info-item{
                margin: 11px 0px
            }
        }
        .avatar-uploader{
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width:180px;
            margin-bottom:10px;
            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }
            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }
            &:hover{
                border-color: #20a0ff;
            }
        }
    }
</style>
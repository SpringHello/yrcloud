<template>
    <div class="wapper">
        <div class="operStage">
            <h2 class="title">企业信息</h2>
            <div class="operator">
                <el-radio-group v-model="radio" size="small">
                    <el-radio-button label="企业信息"></el-radio-button>
                    <el-radio-button label="提醒设置"></el-radio-button>
                    <el-radio-button label="安全设置"></el-radio-button>
                </el-radio-group>
            </div>

            <div>
                <div class="personal-title">企业基本信息</div>
                <div class="personal-info">
                    <div class="avatar">
                        <img :src="userInfo.avatar">
                    </div>
                    <div class="personal-detail">
                        <div><span>企业名称</span></div>
                        <div><span>企业地址{{userInfo.phone}}</span></div>
                        <div><span>企业联系方式{{userInfo.realname}}</span></div>
                        <div><span>企业类型{{userInfo.loginname}}</span></div>
                    </div>
                </div>
            </div>

            <el-radio-group v-model="autoType">
                <el-radio-button label="三证"></el-radio-button>
                <el-radio-button label="三证合一"></el-radio-button>
            </el-radio-group>

            <div>
                <div class="personal-title">企业认证信息</div>
                <div class="info">
                    <div class="info-item"><span>企业名称:</span><el-input v-model="name" placeholder="请输入企业名称"></el-input></div>
                    <div class="info-item"><span>企业地址:</span><el-input v-model="address" placeholder="请输入企业地址"></el-input></div>
                    <div class="info-item"><span>联系方式:</span><el-input v-model="phone" placeholder="请输入企业联系方式"></el-input></div>
                    <div class="info-item"><span>证件号码:</span><el-input v-model="cardID" placeholder="请输入证件号码"></el-input></div>
                </div>
                <div v-if="autoType=='三证'" style="display: flex">
                    <div class="item">
                        <span>工商营业执照</span>
                        <el-upload
                                class="avatar-uploader"
                                action="file/companyUpFile.do?number=1"
                                :show-file-list="false"
                                :on-success="handleBusinessLicenseSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="businessLicense" :src="businessLicense" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>

                    <div class="item">
                        <span>组织机构代码证</span>
                        <el-upload
                                class="avatar-uploader"
                                action="file/companyUpFile.do?number=2"
                                :show-file-list="false"
                                :on-success="handleAgencyLicenseSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="agencyLicense" :src="agencyLicense" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>

                    <div class="item">
                        <span>税务登记证</span>
                        <el-upload
                                class="avatar-uploader"
                                action="file/companyUpFile.do?number=3"
                                :show-file-list="false"
                                :on-success="handleTaxRegistrationCertificateSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="taxRegistrationCertificate" :src="taxRegistrationCertificate" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>

                </div>

                <div v-if="autoType=='三证合一'" style="display: flex">
                    <div class="item">
                        <span>三证合一</span>
                        <el-upload
                                class="avatar-uploader"
                                action="file/upFile.do"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="threeToOne" :src="threeToOne" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
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
                address:'',
                cardID:'',
                phone:'',
                radio:'个人信息',
                businessLicense:'',
                agencyLicense:'',
                taxRegistrationCertificate:'',
                threeToOne:'',
                autoType:'三证'     //1:三证  2:三证合一
            }
        },
        created(){
            util.get("user/GetUserInfo.do",this,{userInfo:'result'})
        },
        methods:{
            handleBusinessLicenseSuccess(res, file) {
                this.businessLicense = URL.createObjectURL(file.raw);
            },
            handleAgencyLicenseSuccess(res, file) {
                this.agencyLicense = URL.createObjectURL(file.raw);
            },
            handleTaxRegistrationCertificateSuccess(res, file) {
                this.taxRegistrationCertificate = URL.createObjectURL(file.raw);
            },
            handleAvatarSuccess(res, file) {
                this.threeToOne = URL.createObjectURL(file.raw);
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
                var url = `user/personalAttest.do?name=${this.name}&cardID=${this.cardID}&phone=${this.phone}&address=${this.address}`;
                util.get(url,this)
            }
        },
        computed:{
            isComplete(){
                return !(this.imageUrl&&this.backImageUrl&&this.name&&this.cardID&&this.phone&&this.address)
            }
        }
    }
</script>

<style rel="stylesheet/less" lang="less" scoped>
    .item{
        span{
            display:block;
            text-align: center;
        }
        margin-right:15px;
    }
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
<template>
    <div class="wapper">
        <div class="flex" style="display:flex">
            <div class="information">
                <div style="height:100%">
                    <label>待恢复问题</label>
                    <div class="information-wapper" style="display:flex;height:100%;justify-content:space-between">
                        <div style="width:60%;height:119px;padding-top:20px;background-color: #f5f9fa">
                            <label style="padding-left:10%">云监控警告</label>
                            <h2 style="line-height: 50px;padding-left:25%;">0</h2>
                        </div>
                        <div style="width:35%;height:119px;padding-top:20px;background-color: #f5f9fa">
                            <label style="padding-left:10%">云安全监测</label>
                            <h2 style="line-height: 50px;padding-left:25%;">0</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="information">
                <div>
                    <label>待办事项</label>
                    <div>
                        <p>0&nbsp;&nbsp;&nbsp;待续费项（30天内到期）</p>
                        <p>0&nbsp;&nbsp;&nbsp;待支付的订单</p>
                        <p>0&nbsp;&nbsp;&nbsp;待处理的工单</p>

                    </div>
                </div>
            </div>
            <div class="information">
                <div>
                    <label>账户余额</label>
                    <div style="margin-top:23px;font-size:17px">
                        <span style="font-size:33px">{{balance}}</span> 元
                    </div>
                    <div style="margin-top:28px;">
                        <router-link to="/recharge">&nbsp;&nbsp;充值&nbsp;&nbsp;</router-link> <a href='#/feelog' style="margin-left: 20px;color: red;cursor: pointer;">消费查询</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="operStage">
            <div class="display">
                <label>使用中的云产品</label>
            </div>
            <div style="display:flex">
                <div class="item">
                    <div class="item-icon" style="background-image:url('/YRCloud/resource/img/host.png');background-size: 55px 53px;"></div>
                    <div class="item-info">
                        <p>云主机</p>
                        <h2>{{computer}}</h2>个
                    </div>
                </div>
                <div class="item">
                    <div class="item-icon" style="background-image:url('/YRCloud/resource/img/disk.png');background-size: 55px 53px;"></div>
                    <div class="item-info">
                        <p>云盘</p>
                        <h2>{{disk}}</h2>个
                    </div>
                </div>
                <div class="item">
                    <div class="item-icon" style="background-image:url('/YRCloud/resource/img/snapshot.png');background-size: 55px 53px;"></div>
                    <div class="item-info">
                        <p>备份</p>
                        <h2>{{snapshot}}</h2>个
                    </div>
                </div>
            </div>
        </div>

        <div class="operStage">
            <label>您可能还需要以下产品</label>

            <div class="block" style="height:350px">
                <my-carousel :interval=1000 effect="fade">
                    <my-carousel-item v-for="item in items" :key="item">
                        <div style="display: flex;flex-wrap:wrap;justify-content:space-between;height:100%;padding: 0px 25px;">
                            <div class="flex-item" v-for="i in item" :key="i.title">
                                <span>{{i.title}}</span>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;{{i.des}}</p>
                                <a href="#/home">&nbsp;&nbsp;&nbsp;&nbsp;立即选购></a>
                            </div>
                        </div>
                    </my-carousel-item>
                </my-carousel>
            </div>
        </div>
    </div>

</template>

<script>
    export default{
        data(){
            return {
                balance:0,
                computer:0,
                snapshot:0,
                disk:0,
                items:[
                    [{title:'云服务器',des:'可靠稳定，可灵活升级'},{title:'CDN',des:'网络加速能力行业顶尖，价格经济实惠'},{title:'对象存储服务',des:'接入便捷，可无限扩容，提供高质量上传与下载'},{title:'万象优图',des:'低门槛，高可靠，多样灵活的图片处理服务'}],
                    [{title:'专有网络VPC',des:'构建逻辑隔离网络，确保资源安全'},{title:'并行计算',des:'大规模并行批处理计算'},{title:'云监控',des:'一站式监控与报警解决方案'},{title:'消息服务',des:'大规模、高可靠、高并发访问和超强消息堆积能力'}],
                    [{title:'负载均衡',des:'对多台云服务器进行流量分发的负载均衡服务'},{title:'高性能计算 HPC',des:'加速深度学习、渲染和科学计算的 GPU 物理机'},{title:'容器服务',des:'支持微服务架构、全生命周期管理的Docker服务'},{title:'GPU云服务器',des:'GPU实例、强大的计算性能、弹性按需扩展'}],
                    [{title:'短信服务',des:'验证码和短信通知服务，三网合一快速到达'},{title:'流量服务',des:'轻松玩转手机流量，物联卡专供物联终端使用'},{title:'移动推送',des:'移动应用通知与消息推送服务'},{title:'邮件推送',des:'事务邮件、通知邮件和批量邮件的快速发送'}],
                ]
            }
        },
        created(){
            this.$http.post('user/productInfo.do').then(response => {
                if(response.ok==true&&response.status==200){
                    this.computer = response.body.computer;
                    this.snapshot = response.body.snapshot;
                    this.disk = response.body.disk;
                }
            })
            this.$http.post('device/DescribeWalletsBalance.do').then(response => {
                if(response.ok==true&&response.status==200){
                    this.balance = response.body.data.remainder;
                }
            })
        }
    }
</script>

<style scoped>
    .operStage{
        margin-top:20px;
    }
    label{
        font-size: 16px;
        padding-right: 15px;
        font-weight: 600;
    }
    .information a:first-child{
        width: 88px;
        height: 36px;
        display: inline-block;
        color: white;
        border-radius: 4px;
        background-color: #20a0ff;
        box-sizing: border-box;
        padding: 6px 19px;
        border: 1px solid #20a0ff;
    }
    .display{
        border-bottom: 2px solid #ccc;
        padding-bottom: 5px;
    }
    .item{
        width:25%;
        height: 123px;
        background-color: #f5f9fa;
        margin: 20px 50px 0px 0px;
        display: flex;
        padding: 35px 31px;
    }
    .item-icon{
        width: 58px;
        border-right:2px solid #e4ecfe;
    }
    .item-info{
        padding: 0px 19px;
    }
    .item-info p{
        font-size:19px;
    }
    .item-info h2{
        display:inline-block;
    }
    .information{
        width:32%;
        background-color: white;
        min-height:200px;
        min-width:500px;
        padding: 15px;
    }
    .flex{
        display:flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
    }
    .flex-item{
        width:25%;
        height:100%;
        padding:63px 30px;
    }
    .flex-item p{
        line-height:50px;
    }
    .flex-item span{
        font-size: 17px;
        font-weight: 500;
    }
    .flex-item a{
        color:#20a0ff;
    }
    .el-carousel__item{
        background-color: #f5f9fa;
    }
    .block{
        margin-top:15px;
    }
    .information-wapper{
        display: block;
        font-size: 16px;
        font-weight: 400;
        padding:20px 20px 10px 20px;
    }
    .information p{
        margin-top:10px;
        border-bottom:2px solid #f5f9fa;
        font-size: 16px;
        line-height: 34px;
        margin-left: 20px;
    }
</style>


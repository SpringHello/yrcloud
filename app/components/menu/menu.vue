<template>
    <div>
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" :unique-opened=true :router=true>
            <el-menu-item index="home"><i class="el-icon-menu"></i>总览</el-menu-item>
            <el-submenu index="2">
                <template slot="title">计算</template>
                    <el-menu-item index="host">主机</el-menu-item>
                    <el-menu-item index="disk">硬盘</el-menu-item>
                    <el-menu-item index="snapshot">备份</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">网络</template>
                <el-menu-item index="VPC">VPC</el-menu-item>
                <el-menu-item index="subnetwork">子网</el-menu-item>
                <el-menu-item index="publicnetwork">公网IP</el-menu-item>
            </el-submenu>
            <el-menu-item index="balance">负载均衡</el-menu-item>
            <el-submenu index="5">
                <template slot="title">充值管理</template>
                <el-menu-item index="recharge">账户充值</el-menu-item>
                <el-menu-item index="rechargelog">充值记录</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
                <template slot="title">消费管理</template>
                <el-menu-item index="feelog">消费详情</el-menu-item>
                <el-menu-item index="feeest">消费预估</el-menu-item>
                <el-menu-item index="order">未支付订单</el-menu-item>
                <el-menu-item index="finishorder">已支付订单</el-menu-item>
            </el-submenu>
            <el-submenu index="7">
                <template slot="title">工单</template>
                <el-menu-item index="neworder">新建工单</el-menu-item>
                <el-menu-item index="myorder">我的工单</el-menu-item>
                <!--el-menu-item index="less">less</el-menu-item-->
            </el-submenu>
            <el-menu-item index="log">操作日志</el-menu-item>
        </el-menu>

    </div>

</template>

<script>

    /*flow*/
    export default{
        data(arg:string):object{
            return{}
        },
        created(){

        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(key){
                console.log(key);
            }
        }
    }
</script>

<style scoped>
    div{
        height:100%;
        position:fixed;
        display:inline-block;
        width:12%;
    }
    ul{
        height:100%;
    }
</style>
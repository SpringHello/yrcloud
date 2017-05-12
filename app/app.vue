<template>
    <div>
        <header>
            <a class="logo" href="http://yrcloud.unionstech.cn/cloud/">
                <img src="../assets/img/logo.png">
            </a>
            <ul class="control">
                <li><a href="/YRCloud/index.html#/home">控制台</a></li>
                <li><a>工单</a></li>
                <li><a href="/YRCloud/index.html#/feelog">财务</a></li>
                <li><a>SDK</a></li>
                <!--li><a href="www.baidu.com">自动化运维</a></li-->
                <li>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                        {{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="usercenter">个人中心</el-dropdown-item>
                            <!--el-dropdown-item command="">帐号设置</el-dropdown-item-->
                            <el-dropdown-item command="exit">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
            </ul>
        </header>

        <y-menu></y-menu>
        <router-view></router-view>
    </div>

</template>

<script>
    import Ymenu from "./components/menu/menu.vue"
    /*flow*/
    export default{
        data(){
            return {
                username:'未登录'
            };
        },
        created(){
            this.$http.post('user/userInfo.do').then(response => {
                if(response.ok==true&&response.status==200){
                    this.username = response.body.loginname;
                }
            })
        },
        methods:{
            handleCommand(type){
                if(type=='exit'){
                    this.$http.get('user/logout.do').then(response=>{
                        if(response.ok==true&&response.status==200){
                            window.location.href='login.html';
                        }
                    })
                }
                if(type=='usercenter'){
                    this.$router.push('usercenter');
                }
            }
        },
        components:{
            'y-menu':Ymenu,
        }
    }
</script>

<style scoped>
    div{
        height:100%;
    }
</style>
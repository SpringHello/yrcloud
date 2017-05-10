<template>
    <div class="wapper">

        <div class="operStage">
            <table>
                <tr>
                    <td style="background-color: #f1f8fb;line-height: 50px;font-size: 16px;padding-left: 20px;">基本信息</td>
                    <td style="background-color: #f1f8fb"></td>
                </tr>
                <tr>
                    <th>公司id</th>
                    <th>{{userinfo.companyid}}</th>
                </tr>
                <tr>
                    <th>登录名</th>
                    <th>{{userinfo.loginname}}</th>
                </tr>
                <tr>
                    <th>真实姓名</th>
                    <th>{{userinfo.realname}}</th>
                </tr>
                <tr>
                    <th>手机号</th>
                    <th>{{userinfo.phone}}</th>
                </tr>
                <tr>
                    <th>地区</th>
                    <th>{{userinfo.province}}</th>
                </tr>
            </table>

        </div>
    </div>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                userinfo:null
            }
        },
        created(){
            this.$http.post('user/userInfo.do').then(response => {
                if(response.ok==true&&response.status==200){
                    this.userinfo = response.body;
                }
            })
        }
    }
</script>

<style scoped>

    tr{
        border-bottom: 1px solid #dddddd;
    }
    th:first-child{
        border-right: 1px solid #dddddd;
        width:250px;
    }
    th:nth-child(2){
        width:500px;
    }
    th{
        font-weight:400;
        font-family: Monaco, Menlo, Consolas, 'Microsoft YaHei', "Courier New", monospace;
        padding:10px;
    }
</style>
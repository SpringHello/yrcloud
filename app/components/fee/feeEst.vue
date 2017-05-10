<template>
    <div class="wapper">
        <div class="operStage">
            <div class="detail">
                <div style="padding:160px 40px;display:flex;flex-wrap:wrap">
                    <div class='wrap-item'><span>当前账户余额:￥{{remainder}}</span></div>
                    <div class='wrap-item'><span>消费预估:￥{{usercase}}/天</span></div>
                    <div class='wrap-item'><span>预计还可使用:{{day}}天</span></div>
                </div>




            </div>
            <div id="main"></div>
        </div>

    </div>
</template>

<script type="text/babel">
    // 引入 ECharts 主模块
    //import echarts from'echarts';
    // 引入 ECharts 主模块
    var echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    import options from './echartsOptions'
    export default{
        data(){
            return{
                remainder:null,
                usercase:null,
                day:null,
            }
        },
        created(){

        },
        methods:{

        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                var myChart = echarts.init(document.getElementById('main'));
                vm.$http.get('account/jsCastDay.do').then(response => {
                    options.series[0].data = response.body.data.map( v => v.value );;
                    vm.remainder = response.body.remainder;
                    vm.usercase = response.body.usercase;
                    vm.day = response.body.day;
                    myChart.setOption(options);
                })
            })
        }

    }
</script>

<style scoped>
    .operStage{
        display:flex;
    }
    #main{
        width:50%;
        height:500px;
    }
    .detail{
        width:20%;
        height:500px;
    }
    span{
        font-size: 16px;
    }
    .wrap-item{
        width:100%;
        margin-top:16px;
    }
</style>
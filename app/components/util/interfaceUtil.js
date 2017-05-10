import {Message,Loading} from 'element-ui';
export default {
    queryZones:(vm)=>{
        vm.$http.get('information/zone.do').then(
            response =>{
                if(response.ok==true&&response.status==200){
                    vm.zoneOptions = response.body.listzonesresponse.zone;
                    vm.zone = response.body.listzonesresponse.zone[0].id;
                }
            }
        )
    },

    queryVpcs:(vm)=>{
        vm.$http.get('network/listVPCOfferings.do').then(
            response =>{
                if(response.ok==true&&response.status==200){
                    console.log(response.body);
                    vm.vpcOptions = response.body;
                    vm.vpc = response.body[0].vpcofferingid;
                }
            }
        )
    },

    changePay(value){
        this.timeOptions = value=='month'?data.monthOptions:
            value=='year'?data.yearOptions:this.timeOptions;
        //this.money = Math.random()*1000;
        if(value=='month'||value=='year'){
            this.timeValue = '1';
        }
        util.calculationPay(this);
    },
    createVPC:(vm)=>{
        let loadingInstance = Loading.service({
            text:'正在创建VPC...'
        });
        var url = 'network/createVPC.do';
        url += '?zoneid='+vm.zone;
        url += '&vpcofferingid='+vm.vpc;
        vm.$http.get(url).then(response=>{
            console.log(response);
            loadingInstance.close();
            Message({
                message:'创建成功',
                type:'success'
            });
        },response=>{
            loadingInstance.close();
            Message({
                message:'500',
                type:'error'
            });
        })
    }
}
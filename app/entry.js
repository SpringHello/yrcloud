import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './app.vue';
import {Button,Menu,Submenu,MenuItem,Table,TableColumn,Tooltip,Dialog,Steps,Step,RadioGroup,
    RadioButton,Select,Option,Slider,Switch,Dropdown,DropdownMenu,DropdownItem,Input,Radio,DatePicker,Pagination,Carousel,CarouselItem,Form,FormItem} from 'element-ui';
import slider from './package/slider/index.js';
import carousel from './package/carousel/index.js';
import carouselItem from './package/carouselItem/index.js';
//import alert from './package/alert/index.js';
import icon from '../assets/iconfont.css';
//const host = resolve => require(['./components/host/host.vue'],resolve);
import host from './components/host/host.vue';
//const VPC = resolve => require(['./components/network/VPC.vue'],resolve);
import VPC from './components/network/VPC.vue';
//const subnetwork = resolve => require(['./components/network/subnetwork.vue'],resolve);
import subnetwork from './components/network/subnetwork.vue';
//const publicnetwork = resolve => require(['./components/network/publicnetwork.vue'],resolve);
import publicnetwork from './components/network/publicnetwork.vue';
//const snapshot = resolve => require(['./components/snapshot/snapshot.vue'],resolve);
import snapshot from './components/snapshot/snapshot.vue';
import disk from './components/disk/disk.vue';
import recharge from './components/recharge/recharge.vue';
import home from './components/home/home.vue';
import log from './components/log/log.vue';
import feelog from './components/fee/feelog.vue';
import feeEst from './components/fee/feeEst.vue';
import rechargelog from './components/rechargeLog/rechargelog.vue';
import usercenter from './components/user/usercenter.vue';
import neworder from './components/workOrder/newOrder.vue';
import myorder from './components/workOrder/myOrder.vue';
import balance from './components/balance/balance.vue';
import less from './components/less/less.vue';
import order from './components/order/order.vue';
//import Slider from './package/slider/src/index.vue';
const router = new VueRouter({
    routes: [
        { path: '/host', component: host },
        { path: '/VPC', component: VPC },
        { path: '/subnetwork', component: subnetwork },
        { path: '/publicnetwork', component: publicnetwork },
        { path: '/disk', component: disk },
        { path: '/snapshot', component: snapshot },
        { path: '/recharge', component: recharge },
        { path: '/home', component: home },
        { path: '/log', component: log },
        { path: '/feelog', component: feelog },
        { path: '/feeest', component: feeEst },
        { path: '/rechargelog', component: rechargelog },
        { path: '/usercenter', component: usercenter },
        { path: '/neworder', component: neworder },
        { path: '/myorder', component: myorder },
        { path: '/balance', component: balance },
        { path: '/less', component: less },
        { path: '/order', component: order },

    ]
})
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Steps);
Vue.use(Step);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Select);
Vue.use(Option);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(DatePicker);
Vue.use(Pagination);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(slider);
Vue.use(carousel);
Vue.use(carouselItem);
//Vue.use(alert);
new Vue({
    render:h => h(App),
    router,
}).$mount("#app")
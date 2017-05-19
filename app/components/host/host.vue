<template>
    <div class="wapper">
        <div class="operStage">
            <el-button type="primary" @click="createInstance">创建主机</el-button>
            <el-dropdown @command="handleCommand">
                <el-button type="primary">
                    &nbsp;&nbsp;更多&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="selectRow==null||selectRow.computerstate==1" command="startPrompt">启动</el-dropdown-item>
                    <el-dropdown-item :disabled="selectRow==null||selectRow.computerstate==0" command="stopPrompt">停止</el-dropdown-item>
                    <el-dropdown-item :disabled="selectRow==null" command="backupPrompt">备份</el-dropdown-item>
                    <el-dropdown-item :disabled="selectRow==null||selectRow.computerstate==1" command="updatePrompt">升级</el-dropdown-item>
                    <!--el-dropdown-item :disabled="selectRow==null" command="deletePrompt">删除</el-dropdown-item-->
                </el-dropdown-menu>
            </el-dropdown>
            <div class="table">
                <el-table
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%"
                        @select-all="handleSelectAll"
                        @select="handleCurrentChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="computername"
                            label="主机名"
                            width="120"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="computerstate"
                            label="状态"
                            width="120"
                            :formatter="formatStatus">
                    </el-table-column>
                    <el-table-column
                            prop="templatename"
                            label="操作系统"
                            show-overflow-tooltip>
                    </el-table-column>


                    <el-table-column
                            prop="serviceoffername"
                            label="配置"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            width="120"
                            prop="caseTpye"
                            label="购买方式"

                            :formatter="formatType">
                    </el-table-column>
                    <el-table-column
                            prop="cpCase"
                            label="费用"
                            width="120"
                            :formatter="formatCost">
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="endtime"
                            label="到期时间"
                            :formatter="formatEndtime">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100">
                        <template scope="scope">
                            <el-button @click="showInformation(scope.row)" type="text" size="small">查看主机</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog title="创建主机" v-model="dialogVisible" size="small" :modal-append-to-body=false>
                <div style="display:flex;border-top:2px solid #000">
                    <div class="config">
                        <div class="stepWapper">
                            <el-steps :active="active" finish-status="success" :align-center=true>
                                <el-step title="区域选择"></el-step>
                                <el-step title="镜像选择"></el-step>
                                <el-step title="配置选择"></el-step>
                                <el-step title="网络选择"></el-step>
                                <el-step title="取名"></el-step>
                            </el-steps>
                        </div>

                        <div class="confWapper" v-if="active==0">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">区域</div>
                            <el-select v-model="zone" placeholder="请选择">
                                <el-option
                                        v-for="item in zoneOptions"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="confWapper" v-if="active==1">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">镜像</div>
                            <div>
                                <el-radio-group v-model="radio">
                                    <el-radio-button label="Ubuntu"></el-radio-button>
                                    <el-radio-button label="CentOS"></el-radio-button>
                                    <el-radio-button label="Windows Server"></el-radio-button>
                                    <el-radio-button label="Debian"></el-radio-button>
                                </el-radio-group>


                                <div class="OSClass" v-bind:class="{ active: item==select }" v-for="item in OS[radio]" @click="change(item)" :key="item.templatename">
                                    {{item.templatename}}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="confWapper flex" v-if="active==2">
                                <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">CPU</div>
                                <div class="item-type" v-bind:class="{ active: item.cpuNum==CPUNum }" v-for="item in CPU" @click="changeCPU(item.cpuNum)" :key="item.cpuNum">{{item.cpuNum}}核</div>
                            </div>
                        </div>

                        <div class="confWapper flex" v-if="active==2&&item.cpuNum==CPUNum" v-for="item in CPU" :key="item.cache">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">内存</div>
                            <div class="item-type" v-bind:class="{ active: ite==CPUCache }" v-for="ite in item.cache" @click="changeCache(ite)" :key="ite.cache">{{ite.cache}}G</div>
                        </div>

                        <div class="confWapper flex" v-if="active==2">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">硬盘</div>
                            <div style="width:70%"><el-slider v-model="disk" :step="10" show-input @change="calculationPay"></el-slider></div>
                        </div>

                        <div class="confWapper flex" v-if="active==3">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">网络</div>
                            <el-select v-model="network" placeholder="请选择" @change="changeNetwork">
                                <el-option
                                        v-for="item in networkOptions"
                                        :label="item.name"
                                        :value="item.ipsegmentid"
                                        :key="item.ipsegmentid">
                                </el-option>
                            </el-select>
                        </div>

                        <div class="confWapper flex" v-if="active==3">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">带宽</div>
                            <div style="width:70%">
                                <el-slider v-model="bandwidth" show-input @change="calculationPay">

                                </el-slider>
                            </div>
                        </div>
                        <div class="confWapper flex" v-if="active==4">
                            <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">输入虚拟机名字：</div>
                            <div style="width:70%">
                                <el-input v-model="networkname" placeholder="请输入内容"></el-input>
                            </div>
                        </div>
                    </div>

                    <div class="display">
                        <!--div>
                            <label>OS :</label><span>{{select}}</span>
                        </div -->
                        <div>
                            <label>CPU : </label><span>{{CPUNum}}核</span>
                        </div>
                        <div>
                            <label>内存 : </label><span>{{CPUCache.cache}}G</span>
                        </div>
                        <div>
                            <label>硬盘 : </label><span>{{disk}}G</span>
                        </div>
                        <div>
                            <label>网络 : </label><span>{{networkName}}</span>
                        </div>
                        <div>
                            <label>带宽 : </label><span>{{bandwidth}}</span>
                        </div>
                        <div v-if="value=='current'">
                            <p>按需付费，根据资源的实际使用量收费，精确到秒。先使用后付费。</p>
                        </div>
                        <div v-if="value=='month'">
                            <p>计费单位为月，平均每小时价格低于按量。适用于不间断业务场景。</p>
                        </div>
                        <div v-if="value=='year'">
                            <p>计费单位为年，平均每小时价格低于实时计费。适用于不间断业务场景。</p>
                        </div>
                        <div>
                            <label>计费方式 : </label>
                            <el-select v-model="value" placeholder="请选择" class="eselect" @change="changePay">
                                <el-option
                                        v-for="item in payOptions"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>购买时长 : </label>
                            <el-select v-model="timeValue" :disabled="value=='current'" placeholder="请选择" class="eselect" @change="changePay">
                                <el-option
                                        v-for="item in timeOptions"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>费用 : ￥ </label>{{money}}<span v-if="value=='current'">/小时</span>

                        </div>
                    </div>
                </div>


                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="prev" v-if="active>0">上一步</el-button>
                    <el-button type="primary" v-if="active<4" @click="next">下一步</el-button>
                    <el-button type="primary" v-if="active>=4" :disabled="isFinish" @click="finish">创建</el-button>
                </span>
            </el-dialog>

            <el-dialog title="提示" v-model="startPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认启动实例?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="startPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleStart(selectRow)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="stopPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认停止实例?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="stopPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleStop(selectRow)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" v-model="deletePrompt" size="tiny" :modal-append-to-body=false>
                <span>确认删除实例?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deletePrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleDelete(selectRow)">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="用户名/密码提示" v-model="showInfo" size="tiny" :modal-append-to-body=false>
                <div style="border-top:2px solid rgb(0, 0, 0);">
                    <div style="padding:5px 15px;margin-top:10px"><label style="width:72px;display:inline-block;text-align:right">用户名：</label><span class="el-dialog__title">{{username}}</span></div>
                    <div style="padding:5px 15px"><label style="width:72px;display:inline-block;text-align:right">密码：</label><span class="el-dialog__title">{{password}}</span></div>
                    <div style="padding:5px 15px"><label style="width:72px;display:inline-block;text-align:right">私网名称：</label><span class="el-dialog__title">{{privatename}}</span></div>
                    <div style="padding:5px 15px"><label style="width:72px;display:inline-block;text-align:right">私网IP：</label><span class="el-dialog__title">{{privateip}}</span></div>
                    <div style="padding:5px 15px"><label style="width:72px;display:inline-block;text-align:right">公网IP：</label><span class="el-dialog__title">{{publicip}}</span></div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="showInfo = false">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="主机升级" v-model="updatePrompt" size="tiny" :modal-append-to-body=false>
                <div>
                    <div class="confWapper flex" v-if="upGrade">
                        <p style="font-size:18px;color: red;">不能升级，因为主机存在备份</p>
                    </div>
                    <div class="confWapper flex" v-if="!upGrade">
                        <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">CPU</div>
                        <div class="item-type" v-bind:class="{ active: item.cpuNum==CPUNum }" v-for="item in CPU" @click="changeCPU(item.cpuNum)">{{item.cpuNum}}核</div>
                    </div>
                </div>

                <div class="confWapper flex" v-if="!upGrade&&item.cpuNum==CPUNum" v-for="item in CPU">
                    <div style="width: 50px;text-align: center;font-size: 16px;line-height: 34px;font-weight: 400;">内存</div>
                    <div class="item-type" v-bind:class="{ active: ite==CPUCache }" v-for="ite in item.cache" @click="changeCache(ite)">{{ite.cache}}G</div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updatePrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleUpdate(selectRow)">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="主机备份" v-model="backupPrompt" size="tiny" :modal-append-to-body=false>
                <span>确认备份实例?</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="backupPrompt = false">取 消</el-button>
                    <el-button type="primary" @click="handleBackup(selectRow)">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import {Message,Loading} from 'element-ui'
    import data from './data.js'
    import util from '../util/util.js'
    import dateFormatter from '../util/dateFormatter.js'
    /*flow*/
    export default{
        data(){
            return{
                tableData:[],
                selectRow:null,
                dialogVisible: false,
                startPrompt:false,
                stopPrompt:false,
                backupPrompt:false,
                deletePrompt:false,
                updatePrompt:false,
                showInfo:false,
                username:'',
                password:'',
                networkname:'',
                privateip:'',
                privatename:'',
                publicip:'',
                promptMessage:'',
                active:0,
                radio: 'Ubuntu',
                select: 'Ubuntu Server 14.04 LTS x86_64',
                OS:{
                    Ubuntu:[],
                    CentOS:[],
                    'Windows Server':[],
                    Debian:[],
                },
                CPUNum:1,
                CPUCache:1,
                disk:40,
                CPU:[],
                payOptions:data.payOptions,
                value:'current',
                timeOptions:data.monthOptions,
                timeValue:'1',

                networkOptions:[],
                network:'',
                networkName:'',

                zoneOptions:[],
                zone:'',

                money:'0',
                bandwidth:1,

                snapshotName:'',
                snapshotDescription:'',

                upGrade:false

            }
        },
        created(){
            this.$http.get('information/listVirtualMachines.do').then(response=>{
                if(response.ok==true&&response.status==200){
                    console.log(response.body.result)
                    console.log(response.body.message)
                    console.log(response.body.status)
                    this.tableData = response.body.result;
                }
            })
        },
        methods:{
            createInstance(){
                this.dialogVisible=true;

                this.OS = {
                    Ubuntu:[],
                    CentOS:[],
                    'Windows Server':[],
                    Debian:[],
                }
                this.active = 0;
                this.$http.get('information/listTemplates.do').then(
                    response =>{

                        if(response.ok==true&&response.status==200){
                            let result = response.body.result;
                            for(let z in result){
                                if(result[z].templatename.indexOf("CentOS")>=0){
                                    this.OS.CentOS.push(result[z])
                                }
                                if(result[z].templatename.indexOf("Ubuntu")>=0){
                                    this.OS.Ubuntu.push(result[z])
                                }
                                if(result[z].templatename.indexOf("Debian")>=0){
                                    this.OS.Debian.push(result[z])
                                }
                            }
                            this.select = result[0];
                            console.log(this.select)
                        }
                    }
                )
                this.$http.get('information/zone.do').then(
                    response =>{
                        if(response.ok==true&&response.status==200){
                            this.zoneOptions = response.body.listzonesresponse.zone;
                            this.zone = response.body.listzonesresponse.zone[0].id;
                        }
                    }
                )
                var attrOptions = {
                    networkOptions:'result'
                }
                util.get('network/listNetDefault.do',this,attrOptions);
                this.$http.get('information/listServiceOfferings.do').then(
                    response =>{
                        console.log(response);
                        if(response.ok==true&&response.status==200){
                            this.CPU = response.body.result;
                            this.CPUNum = response.body.result[0].cpuNum;
                            this.CPUCache = response.body.result[0].cache[0];
                        }
                    }
                )

                //const result = {"listtemplatesresponse":{"count":1,"template":[{"id":"be62d248-19c1-11e7-aac7-005056ac4aa8","name":"CentOS 5.6 (64-bit) no GUI (Simulator)","displaytext":"CentOS 5.6 (64-bit) no GUI (Simulator)","ispublic":true,"created":"2017-04-05T21:35:57+0800","isready":true,"passwordenabled":false,"format":"VHD","isfeatured":true,"crossZones":true,"ostypeid":"6cf5aeb2-19c1-11e7-aac7-005056ac4aa8","ostypename":"CentOS 5.6 (64-bit)","account":"system","zoneid":"7b899cb6-b128-4328-a820-2f765d7d74ad","zonename":"Sandbox-simulator","status":"Download Complete","size":2147483648,"templatetype":"BUILTIN","hypervisor":"Simulator","domain":"ROOT","domainid":"6d0fa696-19c1-11e7-aac7-005056ac4aa8","isextractable":false,"checksum":"","sshkeyenabled":false,"isdynamicallyscalable":false,"tags":[]}]}}
                //result.listtemplatesresponse

            },
            handleCurrentChange(select,row){
                if(select.length>1){
                    select.splice(0,1);
                }
                this.selectRow = row;
                if(select.length==0){
                    this.selectRow = null;
                }
            },
            handleSelectAll(select){
                select.splice(0,select.length);
                this.selectRow = null;
            },
            prev(){
                this.active--;
            },
            next(){
                this.active++;
                util.calculationPay(this);
            },
            change(select){

                this.select = select;
            },
            changeCPU(CPUNum){
                this.CPUNum = CPUNum;
                for(let item in this.CPU){
                    if(this.CPU[item].cpuNum==CPUNum){
                        this.CPUCache = this.CPU[item].cache[0];
                    }
                }
                var url = 'device/QueryBillingPrice.do';
                var params = {};
                params.cpunum = this.CPUNum;
                params.memory = this.CPUCache.cache;
                params.disk = this.disk;
                params.value = this.value;
                params.timevalue = this.timeValue;
                params.bandwidth = this.bandwidth;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            changeCache(CPUCache){
                this.CPUCache = CPUCache;
                var url = 'device/QueryBillingPrice.do';
                var params = {};
                params.cpunum = this.CPUNum;
                params.memory = this.CPUCache.cache;
                params.disk = this.disk;
                params.value = this.value;
                params.timevalue = this.timeValue;
                params.bandwidth = this.bandwidth;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            changePay(value){
                //处理包月/包年转换
                util.processTimeChange(value,this,data);
                //发起价格查询
                var url = 'device/QueryBillingPrice.do';
                let params = {};
                params.cpunum = this.CPUNum;
                params.memory = this.CPUCache.cache;
                params.disk = this.disk;
                params.value = this.value;
                params.timevalue = this.timeValue;
                params.bandwidth = this.bandwidth;
                var attrOptions = {
                    money:'cost'
                }
                util.post(url,params,this,attrOptions)
            },
            finish(){
                this.dialogVisible = false;
                let loadingInstance = Loading.service({
                    text:'拼命创建中...'
                })
                let params = "?";
                params += "zoneid="+this.zone;
                params += "&templateid="+this.select.templateid;
                params += "&serviceofferingid="+this.CPUCache.id;
                params += "&diskofferingid=fcafa58a-573c-4606-b729-c65bf041b004&size="+this.disk;
                params += "&networkid="+this.network;
                params += "&value="+this.value;
                params += "&timevalue="+this.timeValue;
                params += "&bandwidth="+this.bandwidth;
                params += "&name="+this.networkname;
                this.$http.get('information/deployVirtualMachine.do'+params).then(response => {
                    if(response.ok==true&&response.status==200){
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'创建成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'创建超时',
                                type:'error'
                            });
                        }
                    }else{
                        Message({
                            message:'服务端错误',
                            type:'error'
                        })
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            changeNetwork(networkId){
                for(let item in this.networkOptions){
                    if(this.networkOptions[item].id == networkId){
                        this.networkName = this.networkOptions[item].name;
                        break;
                    }
                }
            },
            handleEdit(index,item){
                console.log(index);
                console.log(item);
            },
            calculationPay(){
                util.calculationPay(this);
            },
            handleCommand(type){
                console.log(type);
                if(type=='updatePrompt'){
                    this.$http.get('information/upgrade.do?id='+this.selectRow.computerid).then(
                        response =>{
                            if(response.ok==true&&response.status==200){
                                console.log(response.body.result);
                                if(response.body.result==1){
                                    this.upGrade = false;
                                }else{
                                    this.upGrade = true;
                                }
                            }
                        }
                    )
                    this.$http.get('information/listServiceOfferings.do').then(
                        response =>{
                            console.log(response);
                            if(response.ok==true&&response.status==200){
                                this.CPU = response.body.result;
                                this.CPUNum = response.body.result[0].cpuNum;
                                this.CPUCache = response.body.result[0].cache[0];
                            }
                        }
                    )
                }
                this[type] = true;
            },
            handleStart(row){
                this.startPrompt = false;
                let loadingInstance = Loading.service({
                    text:'实例启动中...'
                })
                this.$http.post('information/startVirtualMachine.do',{
                    virtualMachineid:row.computerid,
                }).then(response => {
                    if(response.ok==true&&response.status==200){
                        console.log(response.body);
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'启动成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'启动超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            handleStop(row){
                this.stopPrompt = false;
                let loadingInstance = Loading.service({
                    text:'实例停止中...'
                })
                this.$http.post('information/stopVirtualMachine.do',{
                    virtualMachineid:row.computerid,
                    forced:true
                }).then(response => {
                    if(response.ok==true&&response.status==200){
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'停止成功',
                                type:'success'
                            });
                            this.tableData = response.body.result;
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'停止超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            handleBackup(row){
                this.backupPrompt = false;
                let loadingInstance = Loading.service({
                    text:'实例备份中...'
                });
                this.$http.get('Snapshot/createVMSnapshot.do?virtualmachineid='+row.computerid+'&name='+this.snapshotName+'&description='+this.snapshotDescription).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status==200){
                        if(response.body.status==1){
                            Message({
                                message:'备份成功',
                                type:'success'
                            });
                            console.log(response.body);
                        }else if(response.body.status==2){
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                        }else{
                            Message({
                                message:'备份超时',
                                type:'error'
                            });
                        }
                    }else{
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                },response => {
                    loadingInstance.close();
                    Message({
                        message:'备份失败，请检查备份数是否超过十份',
                        type:'error'
                    });
                })
            },
            handleDelete(row){
                this.deletePrompt = false;
                let loadingInstance = Loading.service({
                    text:'实例删除中...'
                })
                this.$http.post('information/destroyVirtualMachine.do',{
                    virtualMachineid:row.id
                }).then(response => {
                    if(response.ok==true&&response.status==200){
                        if(response.body.status==1){
                            loadingInstance.close();
                            Message({
                                message:'删除成功',
                                type:'success'
                            });
                            if(response.body.listvirtualmachinesresponse.hasOwnProperty("virtualmachine")){
                                this.tableData = dateFormatter.dateFormat(response.body.listvirtualmachinesresponse.virtualmachine);
                            }else{
                                this.tableData = [];
                            }
                        }else if(response.body.status==2){
                            loadingInstance.close();
                            Message({
                                message:response.body.message,
                                type:'error'
                            });
                            this.tableData = dateFormatter.dateFormat(response.body.listvirtualmachinesresponse.virtualmachine);
                        }else{
                            loadingInstance.close();
                            Message({
                                message:'删除超时',
                                type:'error'
                            });
                        }
                        //util.queryStartJobResult(this,response.body.startvirtualmachineresponse.jobid,loadingInstance);
                    }else{
                        loadingInstance.close();
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                }, response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            handleUpdate(row){
                let loadingInstance = Loading.service({
                    text:'主机升级中...'
                })
                this.updatePrompt = false;
                console.log(row);
                this.$http.get('information/scaleVirtualMachine.do?virtualMachineid='+row.computerid+'&serviceofferingid='+this.CPUCache.id).then(response => {
                    loadingInstance.close();
                    if(response.ok==true&&response.status==200){
                        if(response.body.status==1){
                            Message({
                                message:'升级成功',
                                type:'success'
                            })
                            this.tableData = response.body.result;
                        }else{
                            Message({
                                message:response.body.message,
                                type:'error'
                            })
                        }
                    }
                },response => {
                    loadingInstance.close();
                    Message({
                        message:'服务端错误',
                        type:'error'
                    })
                })
            },
            formatStatus(row){
                return row.computerstate==1?'正在运行':'已停止';
            },
            formatType:dateFormatter.format,
            formatCost:dateFormatter.formatCost,
            formatEndtime:dateFormatter.formatEndtime,
            showInformation(row){
                this.$http.get('information/showInfo.do?vmid='+row.computerid).then(
                    response => {
                        if(response.ok==true&&response.status==200){
                            this.username = response.body.username;
                            this.password = response.body.password;
                            this.privatename = response.body.privatename;
                            this.privateip = response.body.privateip;
                            this.publicip = response.body.publicip;
                            this.showInfo = true;
                        }else{
                            Message({
                                message:'服务端错误',
                                type:'error'
                            });
                        }
                    },
                    response => {
                        Message({
                            message:'服务端错误',
                            type:'error'
                        });
                    }
                )
                console.log(row);
            }
        },
        computed:{
            isFinish:function(){
                return !(this.zone&&this.network);
            }
        }
    }
</script>

<style scoped>
    .item i{
        font-size: 18px;
        width: 7px;
        display: inline-block;
        color: red;
    }
    .table{
        padding-top:15px;
    }
    .stepWapper{
        padding:10px 50px;
    }
    .confWapper{
        display:flex;
        padding: 10px 37px;
    }
    .OSClass{
        padding: 5px 15px;
        margin: 5px 0px;
        border: 1px solid #ccc;
        border-radius: 3px;
        width: 382px;
        cursor:pointer;
    }
    .flex{
        display: flex;
    }
    .active{
        background-color: #20a0ff;;
    }
    .config{
        width:70%;
        margin-top:10px;
    }
    .display{
        background-color: #eaeaea;
        width:30%;
    }
    .item-type{
        margin-right: 10px;
        padding: 10px 25px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #ccc;
        cursor: pointer;
    }
    .display span{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .display div{
        border-bottom:1px solid #dddddd;
    }
    .display label{
        display: inline-block;
        width: 70px;
        height: 50px;
        text-align: right;
        line-height: 50px;
        font-size: 14px;
    }
    .display p{
        padding: 10px 15px;
        color: red;
    }
    .eselect{
        width: 165px;
    }
    .el-dialog__header{
        border-bottom:2px solid black;
    }
</style>
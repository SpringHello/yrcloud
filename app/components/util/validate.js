
export default {
    checkMask:function(){
        const replaceRG = /^0+|\D+/g;
        console.log(this.netmask);
        this.netmask = this.netmask.replace(replaceRG,'');
        this.netmask = Number.parseInt(this.netmask);
        console.log(this.netmask);
        if(isNaN(this.netmask)){
            this.netmask = 0;
        }
        if(this.netmask>255){
            this.netmask = 255;
        }
    },
}
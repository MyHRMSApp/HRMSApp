import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { MyApp } from '../../app/app.component'


/**
 * CouponsPage Functionalities
 * @author Vivek
 */

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  hamburger: string;
  homeIcon: string;
  watches: string;
  jewelleries: string;
  saree: string;
  eyeWears: string;
  counts: any;
  watchCounts: any;
  jewelleryCounts: any;
  eyeWearCounts: any;
  taneiraCounts: any;
  watchCoupons: any;
  jewelleryCoupons: any;
  eyeWearCoupons: any;
  taneiraCoupons: any;

constructor(public menu: MenuController, public events: Events,
  private http: Http, private toast: ToastController, private network: Network, 
  public loadingCtrl: LoadingController, public platform: Platform, public mainService: MyApp, 
  public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
  public navParams: NavParams, public storage:StorageProvider, public service: ServiceProvider, 
  public utilService: UtilsProvider) {
    
    this.menu.swipeEnable(false);
    this.counts = this.mainService.couponPageData;
    console.log("Counts" + JSON.stringify(this.counts));
    
    this.eyeWearCounts = this.navParams.get("eyeWearLength");;
    this.jewelleryCounts = this.navParams.get("jewelleryLength");;
    this.taneiraCounts = this.navParams.get("taneiraLength");;
    this.watchCounts = this.navParams.get("watchLength");;
  }

ionViewDidLoad() {
  
  console.log('ionViewDidLoad CouponsPage');
  this.utilService.dismissLoader();
  this.hamburger = ("./assets/homePageIcons/hamburger.svg");
  this.homeIcon = ("./assets/homePageIcons/Home.svg");
  this.watches = ("./assets/couponsImages/watch.svg");
  this.jewelleries = ("./assets/couponsImages/jewellery.svg");
  this.saree = ("./assets/couponsImages/saree.svg");
  this.eyeWears = ("./assets/couponsImages/glass-IMG.svg");

}

/**
Method for Menu Toggle
*/
openMenu() {
  this.menu.toggle();
} 
  
back(){
  this.navCtrl.pop();
}

watch() {
  if(this.eyeWearCounts == 0){
    this.utilService.showCustomPopup("FAILURE", "No coupons available");
  }
  else{
  this.watchCoupons = this.counts.data.ET_WATCH.item;
  this.navCtrl.push("ShareCouponsPage", {"titleName":"WATCHES", "coupons": this.watchCoupons, "length": this.watchCounts});
}
}

jewellery() {
  if(this.eyeWearCounts == 0){
    this.utilService.showCustomPopup("FAILURE", "No coupons available");
  }
  else{
  this.jewelleryCoupons = this.counts.data.ET_JEWELLERY.item;
  this.navCtrl.push("ShareCouponsPage", {"titleName":"JEWELLERY", "coupons": this.jewelleryCoupons, "length": this.jewelleryCounts});
}
}

eyewear() {
  if(this.eyeWearCounts == 0){
    this.utilService.showCustomPopup("FAILURE", "No coupons available");
  }
  else{
  this.eyeWearCoupons = this.counts.data.ET_EYEWEAR.item;
  this.navCtrl.push("ShareCouponsPage", {"titleName":"EYE WEAR", "coupons": this.eyeWearCoupons, "length": this.eyeWearCounts});
}
}

taneira() {
  if(this.eyeWearCounts == 0){
    this.utilService.showCustomPopup("FAILURE", "No coupons available");
  }
  else{
  this.taneiraCoupons = this.counts.data.ET_TANEIRA.item;
  this.navCtrl.push("ShareCouponsPage", {"titleName":"TANEIRA", "coupons": this.taneiraCoupons, "length": this.taneiraCounts});
}
}

}

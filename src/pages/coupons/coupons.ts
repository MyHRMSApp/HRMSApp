import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { ServiceProvider } from '../../providers/service/service';
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

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
  private http: Http, private toast: ToastController, private network: Network, 
  public loadingCtrl: LoadingController, public platform: Platform, public mainService: MyApp, 
  public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
  public navParams: NavParams, public storage:StorageProvider, public service: ServiceProvider) {
}

ionViewDidLoad() {
  console.log('ionViewDidLoad CouponsPage');
  this.hamburger = ("./assets/homePageIcons/hamburger.svg");
  this.homeIcon = ("./assets/homePageIcons/Home.svg");
  this.watches = ("./assets/couponsImages/watch.svg");
  this.jewelleries = ("./assets/couponsImages/jewellery.svg");
  this.saree = ("./assets/couponsImages/saree.svg");
  this.eyeWears = ("./assets/couponsImages/glass-IMG.svg");

}

openMenu() {
  /**
  Method for Menu Toggle
  */
  this.menu.toggle();
} 
  
back(){
  this.navCtrl.pop();
}

watch(){
  this.navCtrl.push("ShareCouponsPage");
  var tempResponseData:any = this.service.invokeAdapterCall('couponRequest', 'getCoupons', 'post', {payload : true,length: 1,payloadData: {"IV_PERNR": "0063169"}});
  this.mainService.couponPageData = tempResponseData;
  console.log(tempResponseData);
}

jewellery() {
  this.navCtrl.push("ShareCouponsPage");
}

eyewear() {
  this.navCtrl.push("ShareCouponsPage");
}

taneira() {
  this.navCtrl.push("ShareCouponsPage");
}

}

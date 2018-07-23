import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';


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

  public cal:any;

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
  private http: Http, private toast: ToastController, private network: Network, 
  public loadingCtrl: LoadingController, public platform: Platform, 
  public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
  public navParams: NavParams, public storage:StorageProvider) {
}

ionViewDidLoad() {
  console.log('ionViewDidLoad CouponsPage');
  this.cal = ("./assets/icon/cal.png")
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

}

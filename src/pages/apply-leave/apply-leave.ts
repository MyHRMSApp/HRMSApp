import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-apply-leave',
  templateUrl: 'apply-leave.html',
})
export class ApplyLeavePage {

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider) {
  }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot("HomePage");
  }
  privilegeLeave() {
    this.navCtrl.push("AllLeavesPage");
  }
  sickLeave() {
    this.navCtrl.push("AllLeavesPage");
  }
  generalLeave() {
    this.navCtrl.push("AllLeavesPage");
  }
  casualLeave() {
    this.navCtrl.push("AllLeavesPage");
  }
  leaveEncashment() {
    this.navCtrl.push("AllLeavesPage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyLeavePage');
  }

  

}

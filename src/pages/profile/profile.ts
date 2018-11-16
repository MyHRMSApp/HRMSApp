import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  hamburger: string;
  homeIcon: string;

public profileDetails:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public service: ServiceProvider,
    public utilService: UtilsProvider, public commonString: CommonStringsProvider) {
    
    this.menu.swipeEnable(false);

    this.profileDetails = this.navParams.get('profile');
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.ProfilePage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.ProfilePage.HOMEICON_IMG);
  }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.ProfilePage.HOMEPAGE_NAV);
  }

  getProfileValue(profileValue){
    if(profileValue !== undefined){
      return profileValue;
    } 
    return "";
  }
  
}

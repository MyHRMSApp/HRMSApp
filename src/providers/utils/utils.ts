import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController ,ToastController,LoadingController} from 'ionic-angular';


@Injectable()
export class UtilsProvider {
  loader:any;
  commonValues:any;
  constructor(
    public http: HttpClient,
    public alert:AlertController,
    public toast:ToastController,
    public loading:LoadingController) {
    this.commonValues = {
      "appName" :"My HR",
      "duration":"3000",
      "loadingMsg":"Processing..."
    };
  }
  /**
   * Method for showing popups
   * @param title
   * @param message
   */
  showPopup(title,message){
    const alert = this.alert.create({
      title: (title) ? title : this.commonValues.appName,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  /**
   * Method for showing toast
   * @param message
   * @param duration
   */
  showToast(message,duration){
    const toast = this.toast.create({
      message: message,
      duration: (duration) ? duration : this.commonValues.duration
    });
    toast.present();
  }
  /**
   * Method for showing loader
   * @param message
   */
  showLoader(message){
    this.loader = this.loading.create({
      content: (message) ? message : this.commonValues.loadingMsg,
      duration: 3000
    });
    this.loader.present();
  }
  /**
   * Method for dismissing the loader
   */
  dismissLoader(){
    this.loader.dismiss();
  }

}
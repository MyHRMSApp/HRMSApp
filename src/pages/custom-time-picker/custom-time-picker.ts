import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomTimePickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-time-picker',
  templateUrl: 'custom-time-picker.html',
})
export class CustomTimePickerPage {
  public hoursValue:any;
  public minuteValue:any;
  public customTitle:any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public ref: ChangeDetectorRef) {
    this.hoursValue = 0;
    this.minuteValue = 0;
    this.customTitle = this.navParams.get("title");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomTimePickerPage');
  }

  dismiss(val) {
      var tempHours = "00", tempSeconds = "00"; 
      if(this.hoursValue < 10){
        tempHours = "0"+this.hoursValue;
      }else{
        tempHours = this.hoursValue;
      }
      if(this.minuteValue < 10){
        tempSeconds = "0"+this.minuteValue;
      }else{
        tempHours = this.minuteValue;
      }
      this.ref.detectChanges();
      console.log("Time is : "+ tempHours+":"+tempSeconds)
      setTimeout(() => {
        this.viewCtrl.dismiss({time : tempHours+":"+tempSeconds});
      }, 100);
  }

  setHoursTimeAddFunction(flag){
    if(flag == "H"){
      if(this.hoursValue < 24 && this.hoursValue >= 0){
        this.hoursValue++;
        this.ref.detectChanges();
      }
    }else if(flag == "S"){
      if(this.minuteValue < 59 && this.minuteValue >= 0){
        this.minuteValue++;
        this.ref.detectChanges();
      }
    }
  }


  setHoursTimeReduceFunction(flag){
    if(flag == "H"){
      if(this.hoursValue <= 24 && this.hoursValue > 0){
        this.hoursValue--;
        this.ref.detectChanges();
      }
    }else if(flag == "S"){
      if(this.minuteValue < 59 && this.minuteValue >= 0){
        this.minuteValue--;
        this.ref.detectChanges();
      }
    }
  }
  

}

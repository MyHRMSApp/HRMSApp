import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import moment from 'moment';


/**
 * Generated class for the CustomCalendarModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-calendar-model',
  templateUrl: 'custom-calendar-model.html',
})
export class CustomCalendarModelPage {

  public optionsRange:any;
  public dateRange:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomCalendarModelPage');
  }

  ionViewCanEnter() {

    console.log('ionViewCanEnter HomePage');

    var tempoptionsRange : CalendarComponentOptions = {
      showMonthPicker: false,
    };
    this.optionsRange = tempoptionsRange;
  
  }

  onChange($event) {
    console.log(moment($event._d).format("YYYY-MM-DD"));
  }

}

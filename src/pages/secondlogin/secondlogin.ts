import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage,NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';


@IonicPage()
@Component({
  selector: 'page-secondlogin',
  templateUrl: 'secondlogin.html',
})
export class SecondloginPage {
  form;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      public alertCtrl: AlertController, public authHandler:AuthHandlerProvider, public loadingCtrl: LoadingController) {
    console.log('--> LoginPage constructor() called');

    this.form = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setLoginFailureCallback((error) => {
      this.loader.dismiss();
      if (error !== null) {
        this.showAlert('Login Failure', error);
      } else {
        this.showAlert('Login Failure', 'Failed to login.');
      }
    });
    this.authHandler.setLoginSuccessCallback(() => {
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof HomePage)) {
        this.navCtrl.setRoot("HomePage");
      }
    });
    this.authHandler.setHandleChallengeCallback(() => {
      this.navCtrl.setRoot("SecondloginPage");
    });
  }

  processForm() {
    // Reference: https://github.com/driftyco/ionic-preview-app/blob/master/src/pages/inputs/basic/pages.ts
    let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "" || password === "") {
      this.showAlert('Login Failure', 'Username and password are required');
      return;
    }
    console.log('--> Sign-in with user: ', username);
    this.loader = this.loadingCtrl.create({
      content: 'Signining in. Please wait ...',
      dismissOnPageChange: true
    });
    this.loader.present().then(() => {
      this.authHandler.login(username, password);
    });
  }

  showAlert(alertTitle, alertMessage) {
    let prompt = this.alertCtrl.create({
      title: alertTitle,
      message: alertMessage,
      buttons: [{
        text: 'Ok',
      }]
    });
    prompt.present();
  }

  ionViewDidLoad() {
    console.log('--> LoginPage ionViewDidLoad() called');
  }
}

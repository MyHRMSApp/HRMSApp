import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';

declare var WL;

declare var WLAuthorizationManager;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public adapterResult:any="";
  public AuthHandler: any;
  public employee_id: any;
  public password: any;
  public isChallenged: boolean = false;


  constructor(public alert:AlertController, public service:ServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
   
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad LoginPage');
  // }

  ionViewCanEnter() {
    console.log('ionViewDidLoad HomePage');
    setTimeout(() => {
    this.mfpAuthInit();
  }, 2000);
  }


   /**
   * Method for invoking adapter call from services
   */
  invokeAdapter(){
    // this.service.invokeAdapterCall("ramdomuser","getRandomUser","get","").then((response:any)=>{
    //   console.log("response from adapter call is",response);
    //   this.adapterResult = response.results;
    // });
    //this.mfpAuthInit();

    this.navCtrl.setRoot("HomePage");
  }

  mfpAuthInit(){
    this.AuthHandler = WL.Client.createSecurityCheckChallengeHandler("UserLogin");
    this.AuthHandler.handleChallenge = ((response)=>{
      console.log("I am in challenge handler method");
      if(response.errorMsg){
        var msg = response.errorMsg+"<br>";
        msg+="Remaining Attempts : "+response.remainingAttempts;
      }
      this.isChallenged = true;
    });

  }

  home() {
    let username = this.employee_id
    let pwd = this.password;

    let data = {
      "username" : username,
      "password" : pwd
    }

    if(this.isChallenged == false){
    console.log(username, pwd);
    console.log("isChallenged==false");
    WLAuthorizationManager.login("UserLogin", data)
    .then(
        (success) => {
          console.log('--> AuthHandler: login success');
          this.isChallenged = false;
          this.navCtrl.setRoot("HomePage");
        },
        (failure) => {
          console.log('--> AuthHandler: login failure: ' + JSON.stringify(failure));
          //self.loginFailureCallback(failure.errorMsg);
        }
      );
    }
    else {
      console.log("isChallenged==true");
      this.AuthHandler.submitChallengeAnswer(data);
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';


/**
 * Login Functionalities
 * @author Vivek
 */

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
  jsondata: any;
  storage: any;
  photos: string;

constructor(public alert:AlertController, public service:ServiceProvider, public navCtrl: NavController, 
  public navParams: NavParams, public loadingCtrl: LoadingController) {
 
}

invokeAdapter() {
  /**
  Method for pushing 
  */
  this.navCtrl.setRoot("HomePage");
}

ionViewCanEnter() {
  console.log('ionViewCanEnter HomePage');
  setTimeout(() => {
  this.mfpAuthInit();
}, 2000);

}

/**
 * Method to handle the userlogin security check
 * It is scope restricted
 */
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

if(this.isChallenged == false) {
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { StorageProvider } from '../../providers/storage/storage';


/**
 * Login Functionalities
 * @author Vivek
 */

declare var WL;
declare var WLAuthorizationManager;
declare var WLResourceRequest;

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
  //storage: any;
  photos: string;
  IP_BEGDA:any = "20180601";
  IP_ENDDA:any = "20180605";
  IP_PERNR:any = "00477072";

constructor(public alert:AlertController, public serviceProvide:ServiceProvider, public navCtrl: NavController, 
  public navParams: NavParams, public loadingCtrl: LoadingController, public storage:StorageProvider) {
 
}

invokeAdapter() {
  /**
  Method for pushing 
  */
 let dataRequest = new WLResourceRequest("/adapters/attananceRequest/getAttananceData", WLResourceRequest.POST, 3000);
 dataRequest.setHeader("Content-Type","application/json");
 dataRequest.setQueryParameter("IP_BEGDA", "20180601");
 dataRequest.setQueryParameter("IP_ENDDA", "20180605");
 dataRequest.setQueryParameter("IP_PERNR", "00477072");
 dataRequest.send().then(
   (response) => {
     console.log('--> MyWardDataProvider: Upload successful:\n', response);
   }, (failure) => {
     console.log('--> MyWardDataProvider: Upload failed:\n', failure);
   });


  this.navCtrl.setRoot("HomePage");
}

ionViewCanEnter() {
  console.log('ionViewCanEnter HomePage');
  setTimeout(() => {
  this.mfpAuthInit();
}, 2000);

}

ionViewDidLoad() {
  /**
  * Method for reading  json data from local jsonstore
  */

  setTimeout(()=>{
  this.storage.jsonstoreInitialize().then(()=>{ 
  this.storage.jsonstoreReadAll("userImage").then((jsonData:any)=>{
    if(jsonData){
          if(jsonData.length == 0) {
          this.photos = ("./assets/icon/avatar.png");
          localStorage.setItem("userPicture", this.photos);
          }
          else{
          this.photos = jsonData.json.value;
          localStorage.setItem("userPicture", this.photos);
          //console.log("JSON data has image");
          }
    };
  }, (error)=>{
    console.log("Data readed from jsonstore error",error);
  });

  });

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

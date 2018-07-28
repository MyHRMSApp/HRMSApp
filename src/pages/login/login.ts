import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from 'ionic-angular';
import {
  ServiceProvider
} from '../../providers/service/service';
import {
  StorageProvider
} from '../../providers/storage/storage';
import {
  GooglePlus
} from '@ionic-native/google-plus';
//import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';


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
  public adapterResult: any = "";
  public AuthHandler: any;
  public gmailHandler: any;
  public employee_id: any;
  public password: any;
  public isChallenged: boolean = false;
  jsondata: any;
  //storage: any;
  photos: string;

  constructor(public alert: AlertController, public service: ServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public storage: StorageProvider,
    private googlePlus: GooglePlus) {
      console.log("Hello from login page");
  }
  /**
   * Method for handling functionalities before entering into the page
   */
  ionViewCanEnter(){
    //Initialize the auth handlers before getting into the codes
    setTimeout(()=>{
      this.initAuthHanlder("UserLogin");
      this.initAuthHanlder("socialLogin");
    },2000);
  }
  
  /**
   * Method for submitting login details to security check handler
   */
  loginUser(){
    let errorIndex = [null,"",undefined];
    let userData = {
      "username": this.employee_id,
      "password": this.password
    }
    if(errorIndex.indexOf(this.employee_id) == -1 && errorIndex.indexOf(this.password) == -1){
      this.authorizeUserCredentials(userData,"UserLogin");
    }else{
      console.log("invalid credentials");
    }
  }
  /**
   * Method to handle user login via google plus option
   */
  userLoginViagooglePlus(){
    this.googlePlus.login({
      'webClientId': '609753179467-2l3pspgamabenaigj9euf0mqs9ug7cpg.apps.googleusercontent.com',
      'offline': true
    }).then((res) => {
      let inputParams = {
        "vendor": "google",
        "token": res.idToken
      };
      this.authorizeUserCredentials(inputParams,"socialLogin");
      //Enable the firebse authentication if need
      //const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      //console.log("res.idToken", res.idToken);
      /*firebase.auth().signInWithCredential(googleCredential).then((response) => {
        console.log("Firebase success: " + JSON.stringify(response));
      }, (err) => {
        console.error("Error: ", err);
      });*/
    });
  }
  /**
   * Method for initializing authorization handlers commonly
   * @param handlerName 
   */
  initAuthHanlder(handlerName){
    console.log("given security check hanlder name is", handlerName)
    this.AuthHandler = WL.Client.createSecurityCheckChallengeHandler(handlerName);
    this.AuthHandler.handleChallenge = ((response)=>{
      console.log("getting into challenge handler method");
      if(response.errorMsg){
        var msg = response.errorMsg+"<br>";
        msg+="Remaining Attempts : "+response.remainingAttempts;
      }
    });
  }
  /**
   * Method for authorizing user credentials with security checks
   * @param userData 
   * @param hanlderName
   */
  authorizeUserCredentials(userData,hanlderName){
    console.log("passing input credentials are",userData,hanlderName);
    //this.AuthHandler.submitChallengeAnswer(userData)
    if (this.isChallenged == false) {
    WLAuthorizationManager.login(hanlderName,userData)
    .then ((success)=>{
      console.log("WLAuthorizationManager success for "+hanlderName);
      sessionStorage.setItem("tempCredentials",JSON.stringify({"userData":userData,"loginCheckName":hanlderName}));
      this.navCtrl.setRoot("HomePage");
      this.isChallenged = false;
    },(error)=>{
      console.log("Uhhoh, i am facing error in WLAuthorizationManager"+ hanlderName);
    });
    }
    else{
      this.AuthHandler.submitChallengeAnswer(userData);
    }
  }


}

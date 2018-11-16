/// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable } from '@angular/core';
import { StorageProvider } from '../../providers/storage/storage';
import { ConsoleServiceProvider } from '../../providers/console-service/console-service';
import { UtilsProvider } from '../utils/utils';
import { Network } from '@ionic-native/network';

declare var MFPPush:any;
@Injectable()
export class AuthHandlerProvider {
  securityCheckName = 'socialLogin';
  userLoginChallengeHandler;
  gmailLoginChallengeHandler;
  initialized = false;
  username = null;
  isChallenged = false;
  handleChallengeCallback = null;
  loginSuccessCallback = null;
  loginFailureCallback = null;
  chalengeTriggerFlag = true;
  userInfo:any;
  constructor(public storage:StorageProvider, public consoleServ: ConsoleServiceProvider, 
              public utilService: UtilsProvider, public network: Network) {
    console.log('--> AuthHandlerProvider called');
  }

  // init() {
  //   console.log('--> userAuthInit');
  //   if (this.initialized) {
  //     return;
  //   }
  //   this.initialized = true;
  //   console.log('--> AuthHandler init() called');
  //   this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("titan_UserLogin");
  //   this.userLoginChallengeHandler.handleChallenge = this.handleChallenge.bind(this);
  //   this.userLoginChallengeHandler.handleSuccess = this.handleSuccess.bind(this);
  //   this.userLoginChallengeHandler.handleFailure = this.handleFailure.bind(this);
  // }

  gmailAuthInit() {
    console.log('--> gmailAuthInit'); 
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    console.log('--> gmailAuthInit init() called');
    this.gmailLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("socialLogin");
    this.gmailLoginChallengeHandler.handleChallenge = this.handleChallenge.bind(this);
    this.gmailLoginChallengeHandler.handleSuccess = this.handleSuccess.bind(this);
    this.gmailLoginChallengeHandler.handleFailure = this.handleFailure.bind(this);
  }

  setHandleChallengeCallback(onHandleChallenge) {
    console.log('--> AuthHandler setHandleChallenge called');
    this.handleChallengeCallback = onHandleChallenge;
  }

  setLoginSuccessCallback(onSuccess) {
    console.log('--> AuthHandler setLoginSuccess called');
    this.loginSuccessCallback = onSuccess;
  }

  setLoginFailureCallback(onFailure) {
    console.log('--> AuthHandler setLoginFailure called');
    this.loginFailureCallback = onFailure;
  }

  handleChallenge(challenge) {
    console.log('--> AuthHandler handleChallenge called.\n', JSON.stringify(challenge));
    if(this.utilService.loader !== undefined){
      this.utilService.dismissLoader();
    }
    this.isChallenged = true;
    if (this.handleChallengeCallback != null) {
      this.handleChallengeCallback(challenge);
    } else {
      console.log('--> AuthHandler: handleChallengeCallback not set!');
    }
  }

  handleSuccess(data) {
    console.log('--> AuthHandler handleSuccess called');
    console.log("-->>"+data.user.displayName);
    console.log("-->>"+data.user.displayName.rememberMe);
    console.log("this.chalengeTriggerFlag-->>"+this.chalengeTriggerFlag);
    localStorage.setItem("userInfo", data.user.displayName.replace(/'/g, '"'));
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(this.chalengeTriggerFlag){
      this.loginSuccessCallback();
    }

  }

  handleFailure(error) {
    console.log('--> AuthHandler handleFailure called.\n' + JSON.stringify(error));
    this.isChallenged = false;
    if (this.loginFailureCallback != null) {
      this.loginFailureCallback(error.failure);
    } else {
      console.log('--> AuthHandler: loginFailureCallback not set!');
    }
  }

  checkIsLoggedIn() {
    this.chalengeTriggerFlag = false;
    // if(this.utilService.loader.data.content == "Please Wait..."){

    // }
    // console.log("this.utilService.loader====>>>"+this.utilService.loader);
    if(this.utilService.loader === undefined){
      this.utilService.showLoader("Please Wait...");
    }
    console.log('--> AuthHandler checkIsLoggedIn called');
    if(localStorage.getItem("rememberMe") == "enabled"){
      WLAuthorizationManager.obtainAccessToken(this.securityCheckName)
      .then(
        (accessToken) => {
          console.log('--> AuthHandler: obtainAccessToken onSuccess' + JSON.stringify(accessToken));
          this.chalengeTriggerFlag = true;
          if(this.userInfo !== undefined){
            var tags = [this.userInfo.EP_EGROUP, this.userInfo.EP_USERTYPE];
            MFPPush.registerDevice(
              null,
              function(successResponse) {
                console.log("Successfully registered-->>"+successResponse);
                
                  MFPPush.subscribe(
                    tags,
                    function(tags) {
                      console.log("Subscribed successfully-->>"+tags);
                    },
                    function(failureResponse) {
                      console.log("Failed to subscribe-->>"+JSON.stringify(failureResponse));
                    }
                  );
              },
              function(failureResponse) {
                  console.log("Failed to register-->>"+JSON.stringify(failureResponse));
              }
           );
          }
          

      
          this.loginSuccessCallback();
        },
        (error) => {
          console.log('--> AuthHandler: obtainAccessToken onFailure: ' + JSON.stringify(error));
            // this.utilService.dismissLoader();
            // this.utilService.showCustomPopup("FAILURE", "Request timed out, Please restart the application");
          //this.loginFailureCallback(error);
          if(this.network.type !== "none"){
            // this.authHandler.gmailAuthInit();
            this.checkIsLoggedIn();
          }else{
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet");
          }
        }
      );
    }else{
      this.logout();
    }
  }

  login(credentialData) {
    console.log('--> AuthHandler login called. isChallenged = ', this.isChallenged);
    console.log("input parameters are",credentialData);
    this.isChallenged = true;
    if (this.isChallenged) {
      if(credentialData){
        // (securityName == "socialLogin") ? this.userLoginChallengeHandler.submitChallengeAnswer(credentialData) : this.gmailLoginChallengeHandler.submitChallengeAnswer(credentialData);
        console.log("this.gmailLoginChallengeHandler.submitChallengeAnswer Processing..........");
        this.gmailLoginChallengeHandler.submitChallengeAnswer(credentialData);
      }else{
        console.log("input data missing");
        return;
      }
    } else {
      var self = this;
      // this.securityCheckName = (securityName) ? securityName : this.securityCheckName;
      WLAuthorizationManager.login(this.securityCheckName, credentialData)
      .then(
        (success) => {
          console.log('--> AuthHandler: login success');
          self.loginSuccessCallback(success);        
        },
        (failure) => {
          console.log('--> AuthHandler: login failure: ' + JSON.stringify(failure));
          this.utilService.dismissLoader();
            this.utilService.showCustomPopup("FAILURE", JSON.stringify(failure));
          // self.loginFailureCallback(failure.errorMsg);
        }
      );
    }
  }

  logout() {
    console.log('--> AuthHandler logout called');
    // this.securityCheckName = (securityName) ? securityName : this.securityCheckName;
    if(this.utilService.loader === undefined){
      this.utilService.showLoader("Please Wait...");
    }
    return new Promise((resolve,reject)=>{
      WLAuthorizationManager.logout(this.securityCheckName)
    .then(
      (success) => {
        console.log('--> AuthHandler: logout success');
        localStorage.setItem("rememberMe", "enabled");
        // this.utilService.dismissLoader();
        this.checkIsLoggedIn();
        resolve(true);
      },
      (failure) => {
        this.utilService.dismissLoader();
        console.log('--> AuthHandler: logout failure: ' + JSON.stringify(failure));
        // this.utilService.showCustomPopup("FAILURE", "Logout failure, Please try again");
        reject(false);
      }
    );
    });
  }
}
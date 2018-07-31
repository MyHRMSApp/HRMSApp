/// <reference path="../../../plugins/cordova-plugin-mfp/typings/worklight.d.ts" />
import { Injectable } from '@angular/core';


@Injectable()
export class AuthHandlerProvider {
  securityCheckName = 'UserLogin';
  userLoginChallengeHandler;
  gmailLoginChallengeHandler;
  initialized = false;
  username = null;
  isChallenged = false;
  handleChallengeCallback = null;
  loginSuccessCallback = null;
  loginFailureCallback = null;

  constructor() {
    console.log('--> AuthHandlerProvider called');
  }

  init() {
    console.log('--> userAuthInit'); 
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    console.log('--> AuthHandler init() called');
    this.userLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("UserLogin");
    this.userLoginChallengeHandler.handleChallenge = this.handleChallenge.bind(this);
    this.userLoginChallengeHandler.handleSuccess = this.handleSuccess.bind(this);
    this.userLoginChallengeHandler.handleFailure = this.handleFailure.bind(this);
  }

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
    this.isChallenged = true;
    if (challenge.errorMsg !== null && this.loginFailureCallback != null) {
      var statusMsg = 'Remaining attempts = ' + challenge.remainingAttempts + '' + challenge.errorMsg;
      this.loginFailureCallback(statusMsg);
    } else if (this.handleChallengeCallback != null) {
      this.handleChallengeCallback();
    } else {
      console.log('--> AuthHandler: handleChallengeCallback not set!');
    }
  }

  handleSuccess(data) {
    console.log('--> AuthHandler handleSuccess called');
    this.isChallenged = false;
    if (this.loginSuccessCallback != null) {
      this.loginSuccessCallback();
    } else {
      console.log('--> AuthHandler: loginSuccessCallback not set!');
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

  checkIsLoggedIn(securityName) {
    this.securityCheckName = (securityName) ? securityName : this.securityCheckName;
    console.log('--> AuthHandler checkIsLoggedIn called');
    WLAuthorizationManager.obtainAccessToken(this.securityCheckName)
    .then(
      (accessToken) => {
        console.log('--> AuthHandler: obtainAccessToken onSuccess');
      },
      (error) => {
        console.log('--> AuthHandler: obtainAccessToken onFailure: ' + JSON.stringify(error));
      }
    );
  }

  login(credentialData,securityName) {
    console.log('--> AuthHandler login called. isChallenged = ', this.isChallenged);
    console.log("input parameters are",credentialData);
    if (this.isChallenged) {
      if(credentialData){
        (securityName == "UserLogin") ? this.userLoginChallengeHandler.submitChallengeAnswer(credentialData) : this.gmailLoginChallengeHandler.submitChallengeAnswer(credentialData);
      }else{
        console.log("input data missing");
        return;
      }
    } else {
      var self = this;
      this.securityCheckName = (securityName) ? securityName : this.securityCheckName;
      WLAuthorizationManager.login(this.securityCheckName, credentialData)
      .then(
        (success) => {
          console.log('--> AuthHandler: login success');
          self.loginSuccessCallback(success);        
        },
        (failure) => {
          console.log('--> AuthHandler: login failure: ' + JSON.stringify(failure));
          self.loginFailureCallback(failure.errorMsg);
        }
      );
    }
  }

  logout(securityName) {
    console.log('--> AuthHandler logout called');
    this.securityCheckName = (securityName) ? securityName : this.securityCheckName;
    return new Promise((resolve,reject)=>{
      WLAuthorizationManager.logout(this.securityCheckName)
    .then(
      (success) => {
        console.log('--> AuthHandler: logout success');
        resolve(true);
      },
      (failure) => {
        console.log('--> AuthHandler: logout failure: ' + JSON.stringify(failure));
        reject(false);
      }
    );
    });
  }
}

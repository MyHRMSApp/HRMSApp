import { Component, ViewChild, Renderer } from '@angular/core';
import { Nav, Platform,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage";

  pages: Array<{title: string, component: any}>;

  constructor(    public platform: Platform,
    public statusBar: StatusBar,
    public render:Renderer,
    public alert:AlertController,
    public splashScreen: SplashScreen) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
        console.log("Wlcommoninit success");
        var wlEvent = new CustomEvent("wlInitFinished");
        console.log("dispatch starting wlInitFinished event");
        document.dispatchEvent(wlEvent);
      
    });
    this.render.listenGlobal('document','wlInitFinished',()=>{
      console.log("wlclient init event recieved");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(){
    this.nav.push("LoginPage");
  }
}

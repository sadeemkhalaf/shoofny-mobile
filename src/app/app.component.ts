import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './providers/auth.service';
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from './core/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private _storage: StorageService,
    private _route: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this._storage.getAuthToken().then((loggedIn) => {
      if (!!loggedIn) {
        this._route.parseUrl('/home');
      } else {
        this._route.parseUrl('/login');
      }
    })
  }

  // TODO: handle routing based on Auth-state here -- done

}

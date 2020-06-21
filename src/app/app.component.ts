import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './providers/auth.service';
import { Router } from '@angular/router';
import { StorageService } from './core/storage/storage.service';
import { AppHelpersService } from './core/utils/app-helpers.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //TODO: move flter items to another component later


  constructor(
    public helper: AppHelpersService,
    private _storage: StorageService,
    private _route: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
          this._storage.getAuthToken().then((loggedIn) => {
      if (!!loggedIn) {
        this._route.parseUrl('/home');
      } else {
        this._route.parseUrl('/login');
      }
    });
    });


  }
  public logout() {
    this._auth.logout().then(() => {
      this._route.navigate(['/login']);
    }, error => console.error(error));
  }
  // TODO: handle routing based on Auth-state here -- done

}

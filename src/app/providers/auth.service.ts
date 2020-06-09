import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService, ConnectionStatus } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';
import { Router } from '@angular/router';
import { AppHelpersService } from '../core/utils/app-helpers.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export class Token {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedInUser: Observable<IUser>;
  private _loggedInUser: ReplaySubject<IUser> = new ReplaySubject(1);

  constructor(
    private _http: AuthHttp,
    private _httpClient: HttpClient,
    private _networkService: NetworkService,
    private _storageService: StorageService,
    private _helper: AppHelpersService,
    private _route: Router) {
    this.loggedInUser = this._loggedInUser.asObservable();
    this._checkLoggedIn();
    this._storageService.getRefreshAuthToken().then((refresh) => {
      this._refreshToken(refresh);
    }, error => { 
      console.warn('token missing!');
      this._route.navigate(['/login']); });
  }

  // login
  public login(e_mail: string, pass_word: string) {
    this._getAccessToken({ email: e_mail, password: pass_word });
  }

  // TODO:
  // logout
  public logout() {
      return this._http.post('api/auth/logout/', {});
  }

  private _getAccessToken(data) {
    this._helper.showLoading();
    return new Promise<Token>(
      (resolve, reject) =>
        this._http.post('/api/token/', data)
          .subscribe((token: any) => {
            this._helper.hideLoading();
            if (!!token) {
              this._setUserToken(token).then(() => {
                resolve(token);
                this._route.navigate(['/home']);
              });
            } else {
              this._helper.hideLoading();
              reject({ message: 'Wrong username and password' });
            }
          }, error => {
            this._helper.hideLoading();
            reject(error);
          }));
  }

  private _setUserData(userData: IUser): Promise<any> {
    return this._storageService.updateUserData(userData)
      .then((response) => this._loggedInUser.next(userData), (reason) => console.warn(reason));
  }

  private async _setUserToken(userData: Token): Promise<any> {
    await this._storageService.updateRefreshToken(userData);
    await this._storageService.updateUserToken(userData);
  }

  private _removeUserData(): Promise<any> {
    return this._storageService.clearUserData()
      .then((response) => this._loggedInUser.next(), (reason) => console.warn(reason));
  }

  private _fillUserData(resolve, reject) {
    this._http.get<IUser>('/api/auth/profile/')
      .subscribe((userData: IUser) => this._setUserData(userData)
        .then(() => {
          resolve(userData);
        }), (reason) => {
          if (reason.status >= 400 && reason.status < 500) {
            if (reason.status == 401) {
              // send refresh token
              this._storageService.getRefreshAuthToken().then((refresh) => {
                this._refreshToken(refresh);
                console.log(refresh);
              }, error => { 
                console.warn('token missing!');
               })
            } else {
              this._removeUserData().then(() => {
                this._route.navigate(['/login']);
                console.warn('Token missing or expired');
                reject(reason);
              });
            }
          } else {
            reject(reason);
          }
        });
  }

  private _checkLoggedIn(): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      this._networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          this._storageService.getAuthToken()
            .then(() => this._fillUserData(resolve, reject),
              reject => {
                console.warn(reject);
              })
        } else {
          console.warn('You are offline!');
        }
      });
    });
  }

  public _refreshToken(refreshToken: string) {
    return new Promise<Token>(
      (resolve, reject) =>
        this._http.post('/api/token/refresh/', { refresh: refreshToken })
          .subscribe((token: any) => {
            if (!!token) {
              console.log(token);
              this._storageService.updateUserToken(token)
                .then(() => resolve(token));
            } else {
              reject({ message: 'token missing or expired' });
            }
          }, error => {
            // reject(error);
            this._route.navigate(['/login']);
          }));
  }

}

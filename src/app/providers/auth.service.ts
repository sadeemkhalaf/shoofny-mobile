import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService, ConnectionStatus } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';
import { Router } from '@angular/router';
import { AppHelpersService } from '../core/utils/app-helpers.service';
import { IUserSubmit } from '../main/details/edit-profile/edit-profile.page';
import { switchMap, take } from 'rxjs/operators';
import { DetailsService } from './details.service';
export class Token {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedInUser: Observable<IUser>;
  private _isLoggedIn = new BehaviorSubject(null);
  private _loggedInUser: ReplaySubject<IUser> = new ReplaySubject(1);

  constructor(
    private _http: AuthHttp,
    private _networkService: NetworkService,
    private _storageService: StorageService,
    private _helper: AppHelpersService,
    private _details: DetailsService,
    private _route: Router) {
    this.loggedInUser = this._loggedInUser.asObservable();
    this._checkLoggedIn();
    this._isLoggedIn.next(true);
  }

  // login
  public login(e_mail: string, pass_word: string, isLogin: boolean) {
    this._getAccessToken({ username: e_mail, password: pass_word }, isLogin);
  }

  // TODO:
  // logout
  public logout() {
    this._isLoggedIn.next(false);
    return this._storageService.clearUserData();
  }

  public getUserProfile() {
    return this._http.get<IUser>('/api/auth/profile');
  }

  public registerUser(user: any) {
    return this._http.post<any>('/api/auth/register/', user);
  }

  public updateUserProfile(user: IUserSubmit) {
    return this._http.put<IUserSubmit>('/api/auth/profile/', user);
  }

  public refreshToken() {
    console.log('refresh token');
    this._storageService.getRefreshAuthToken().then((refreshToken) => {
      return new Promise<Token>(
        (resolve, reject) =>
          this._http.post('/api/token/refresh/', { refresh: refreshToken })
            .subscribe((token: any) => {
              if (!!token) {
                this._storageService.updateUserToken(token)
                  .then(() => resolve(token));
              } else {
                reject({ message: 'token missing or expired' });
              }
            }, error => {
              reject(error);
              this.logout().then(() =>
                this._route.navigate([`/login`], { queryParamsHandling: 'merge', replaceUrl: true })
              );

            }));
    }, error => console.error(error));

  }

  isAuthenticated() {
    return this._isLoggedIn.value;
  }

  private _getAccessToken(data, isLogin: boolean) {
    this._helper.showLoading();
    return new Promise<any>(
      (resolve, reject) =>
        this._http.post('/api/token/', data)
          .pipe(switchMap((token) => {
            this._helper.hideLoading();
            this._checkLoggedIn();
            this._isLoggedIn.next(true);
            this._setUserToken(token).then(() => {
              resolve(token);
              if (isLogin) {
                this._route.navigate(['/home']);
              } else {
                this._route.navigate(['/signup/profile'])
              }
            });
            return this._http.get<IUser>('/api/auth/profile');
          }, error => {
            this._helper.hideLoading();
            this._helper.showToast('Wrong email/password!', 'danger');
            reject({ message: 'Wrong username and password' });
          }), take(1))
          .subscribe((userData: any) => {
            this._setUserData(userData);
          }, error => {
            this._helper.hideLoading();
            this._helper.showToast('Something went wrong!', 'danger');
            reject(error);
          }));
  }

  private _setUserData(userData: IUser): Promise<any> {
    return this._storageService.updateUserData(userData)
      .then((response) => {
        this._loggedInUser.next(userData);
      }, (reason) => console.warn(reason));
  }

  private async _setUserToken(userData: any): Promise<any> {
    await this._storageService.updateRefreshToken(userData);
    await this._storageService.updateUserToken(userData);
  }

  private _removeUserData(): Promise<any> {
    return this._storageService.clearUserData()
      .then((response) => this._loggedInUser.next(null), (reason) => console.warn(reason));
  }

  private _fillUserData(resolve, reject) {
    this._http.get<IUser>('/api/auth/profile/')
      .subscribe((userData: IUser) => this._setUserData(userData)
        .then(() => {
          resolve(userData);
        }), (reason) => {
          if (reason.status >= 400 && reason.status < 500) {
            if (reason.status == 401) {
              console.log('reason.status: ', reason.status);
              this._storageService.getAuthToken().then((token) => {
                if (!!token) {
                  this.refreshToken();
                }
              });
            } else {
              this._removeUserData().then(async () => {
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
            .then((token) => {
              if (!!token) {
                this._fillUserData(resolve, reject);
                this._isLoggedIn.next(true);
              } else {
                this._isLoggedIn.next(false);
              }
            },
              reject => {
                console.warn(reject);
              });
        } else {
          console.warn('You are offline!');
        }
      });
    });
  }

}

import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService, ConnectionStatus } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';
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
    private _networkService: NetworkService,
    private _storageService: StorageService) {
      this.loggedInUser = this._loggedInUser.asObservable();
      this._checkLoggedIn();
    }

  // login
  public login(e_mail: string, pass_word: string) {
    this._getAccessToken({email: e_mail, password: pass_word});
  }

  // TODO:
  // logout

  private _getAccessToken(data) {
    return new Promise<Token>(
      (resolve, reject) =>
          this._http.post('/api/token/', data)
          .subscribe((token: any) => {
            if (!!token) {
              this._setUserToken(token).then(() => resolve(token));
            } else {
              reject({message: 'Wrong username and password'});
            }
          }, error => reject(error)));
  }

  private _setUserData(userData: IUser): Promise<any> {
    return this._storageService.updateUserData(userData)
      .then((response) => this._loggedInUser.next(userData), (reason) => console.warn(reason));
  }

  private _setUserToken(userData: Token): Promise<any> {
    return this._storageService.updateUserToken(userData)
      .then((response) => {}, (reason) => console.warn(reason));
  }

  private _removeUserData(): Promise<any> {
    return this._storageService.clearUserData()
      .then((response) => this._loggedInUser.next(), (reason) => console.warn(reason));
  }

  private _fillUserData(resolve, reject) {
    this._http.get<IUser>('/api/auth/profile/')
      .subscribe((userData: IUser) => this._setUserData(userData).then(() => resolve(userData)), (reason) => {
        if (reason.status >= 400 && reason.status < 500) {
          this._removeUserData().then(() => {
            console.warn('Token missing or expired');
            reject(reason);
          });
        } else {
          reject(reason);
        }
      });
  }

  private _checkLoggedIn(): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
      this._networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          return this._fillUserData(resolve, reject);
        } else {
          console.warn('You are offline!');
        }
      });
    });
  }
}

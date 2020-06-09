import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IStorage } from './storage';
import { Observable, ReplaySubject } from 'rxjs';
import { Token } from 'src/app/providers/auth.service';
import { IUser } from 'src/app/models/user';

const AUTH_STORAGE_KEY = 'AUTH_TOKEN';
const AUTH_REFRESH_STORAGE_KEY = 'AUTH_REFRESH_TOKEN';
const USER_DATA_STORAGE_KEY = 'userData';
const API_STORAGE_KEY = 'storageKey';

@Injectable()
export class StorageService implements IStorage {
  public token: Observable<string>;
  private _tokenSubject: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private readonly _storage: Storage) {
    this.token = this._tokenSubject.asObservable();
  }

  public async updateUserToken(userData: Token) {
    await this._storage.set(AUTH_STORAGE_KEY, userData.access)
    .then(() => this._tokenSubject.next(userData.access));
    return userData;
  }

  public async updateRefreshToken(userData: Token) {
    await this._storage.set(AUTH_REFRESH_STORAGE_KEY, userData.refresh);
    return userData;
  }

  public async updateUserData(userData: IUser) {
    await this.setLocalData(USER_DATA_STORAGE_KEY, userData);
    return userData;
  }

  public async getUserData() {
    return this.getLocalData(USER_DATA_STORAGE_KEY);
  }

  public async clearUserData() {
    await this._storage.remove(AUTH_STORAGE_KEY)
    .then(() => this._tokenSubject.next(undefined));
    await this._storage.remove(AUTH_REFRESH_STORAGE_KEY);
    await this._storage.remove(USER_DATA_STORAGE_KEY);
  }

  public async getAuthToken(): Promise<string> {
    return this._storage.get(AUTH_STORAGE_KEY);
  }

  public async getRefreshAuthToken(): Promise<string> {
    return this._storage.get(AUTH_REFRESH_STORAGE_KEY);
  }

  // Save data
  public setLocalData<T = any>(key: string, data: T): Promise<T> {
    console.log('Set local data for: ', `${API_STORAGE_KEY}-${key}`);
    return this._storage.set(`${API_STORAGE_KEY}-${key}`, JSON.stringify(data));
  }

  // Get cached data
  public getLocalData<T = any>(key: string): Promise<T> {
    console.log('Getting cached data for: ', `${API_STORAGE_KEY}-${key}`);
    return this._storage.get(`${API_STORAGE_KEY}-${key}`)
      .then(data => !!data ? Promise.resolve(JSON.parse(data)) 
      : Promise.reject({ message: 'No Cached data for Offline support found' }));
  }
}

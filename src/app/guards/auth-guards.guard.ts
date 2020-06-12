import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../providers/auth.service';
import { StorageService } from '../core/storage/storage.service';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private _storage: StorageService,
    private _route: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise<boolean>((resolve, reject) => {
        this._storage.getAuthToken().then((data) => {
          if (!!data) {
            resolve(true);
            return true;
          } else {
            reject('not authenticated')
            return false;
          }
        })
      });
  }
  
}

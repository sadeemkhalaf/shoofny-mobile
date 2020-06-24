import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsGuard implements CanActivate {

  constructor(private _storage: StorageService) {}

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

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../providers/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardsGuard implements CanActivate {

  constructor(
    private _auth: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this._auth.isAuthenticated()) {
        return true;
      } else {
         return false;
      }
  }
  
}

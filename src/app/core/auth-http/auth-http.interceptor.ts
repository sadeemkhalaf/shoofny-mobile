import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { environment } from '../../../environments/environment';
import { AppHelpersService } from '../utils/app-helpers.service';

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

  constructor(private _router: Router,
              private _storageService: StorageService,
              private _helper: AppHelpersService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const APIEndpoint = environment.APIEndpoint;
    const tokenPromise = this._addToken();
    return from(tokenPromise)
      .pipe(
        switchMap(token => {
          let headers = request.headers;
          if (!!token && token !== '') {
            headers = headers.set('Authorization', 'Bearer ' + (token || ''));
          }
          headers = headers.append('Content-Type', 'application/json');
          const requestClone = request.clone({headers, withCredentials: true, url: `${APIEndpoint}${request.url}`});
          return next.handle(requestClone)
            .pipe(tap((ev: HttpEvent<any>) => {
              if (ev instanceof HttpResponse) {
              }
            }), catchError((error) => {
              let errorData = {
                message: '',
                status: 500
              };
              this._helper.hideLoading();
              if (error.error instanceof ErrorEvent) {
                // client-side error
                console.warn('>>> Client Side Error: ', error);
                errorData = {message: `Error: ${error.error.message}`, status: -1};
              } else {
                console.warn('>>> Server Side Error: ', error);
                // server-side error
                errorData = {message: this._getMessageFromError(error), status: error.status};
                // TODO maybe handle more cases? like server under maintenance, or other 5xx errors
                if (errorData.status === 500) {
                  const newError = Object.assign({}, error, {message: 'Internal Server Error, failed to perform action'});
                  return throwError(newError);
                }
                this._handleAuthError(error);
              }
              return throwError(errorData);
            }));
        })
      );
  }

  private _getMessageFromError(error) {
    const message = !!error.error ? error.error.message : error.message;
    switch (error.status) {
      case 500:
        return 'Internal Server Error, failed to perform action';
      case 504:
      case 503:
        return message || 'Server is down, it is might be under maintenance, try again later';
      default:
        return message;
    }
  }

  /**
   * manage errors
   * @param err
   * @returns {any}
   */
  private _handleAuthError(err: HttpErrorResponse): Observable<any> {
    console.log('Handled error ' + err.status + ' - ' + err.message);
    if (err.status === 401) {
      this._router.navigate([`/login`], {queryParamsHandling: 'merge', replaceUrl: true});
      // if you've caught / handled the error, you don't want to rethrow it
      // unless you also want downstream consumers to have to handle it as well.
      return of(err.message);
    }
  }

  /**
   * Add stored auth token to request headers.
   * @param request HttpRequest<any> - the intercepted request
   * @return
   */
  private _addToken(): Promise<string> {
    return new Promise<string>((resolve) => {
      this._storageService.getAuthToken()
        .then((token: string) => {
          resolve(token);
        })
        .catch((error) => {
          console.warn('Can\'t access to storage ', error.message);
          resolve();
        });
    });
  }
}

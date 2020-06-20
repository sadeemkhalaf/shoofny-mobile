import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Observable, ReplaySubject, TimeoutError } from 'rxjs';
import { ErrorResponse, IHttp } from './auth-http';

@Injectable({
  providedIn: 'root',
})
export class AuthHttp implements IHttp {
  private TIMEOUT = 120000;

  constructor(private _http: HttpClient) {
  }

  public get<T>(url: string, params?: object | HttpParams, responseType?): Observable<T> {
    const subject: ReplaySubject<T> = new ReplaySubject<T>(1);
    this._http.get<T>(url, {params: this._getQueryParamsFromObject(params), responseType})
      .pipe(timeout(this.TIMEOUT))
      .subscribe((response) => subject.next(response), (error) => subject.error(error));

    return subject.asObservable();
  }

  public post<T>(url: string, data: object): Observable<T> {
    const subject: ReplaySubject<T> = new ReplaySubject<T>(1);

    this._http.post<T>(url, data)
      .pipe(timeout(this.TIMEOUT))
      .subscribe((response) => subject.next(response), (error) => subject.error(error));

    return subject.asObservable();
  }

  public put<T>(url: string, data: object): Observable<T> {
    const subject: ReplaySubject<T> = new ReplaySubject<T>(1);

    this._http.put<T>(url, data || {})
      .pipe(timeout(this.TIMEOUT))
      .subscribe((response) => subject.next(response), (error) => subject.error(error));


    return subject.asObservable();
  }

  public delete<T>(url: string, options?: Object): Observable<T> {
    const subject: ReplaySubject<T> = new ReplaySubject<T>(1);

    this._http.delete<T>(url, options)
      .pipe(timeout(this.TIMEOUT))
      .subscribe((response) => subject.next(response), (error) => subject.error(error));

    return subject.asObservable();
  }

  public handleError(errorResponse: HttpErrorResponse, reject) {
    if (errorResponse.error instanceof Error) {
      // A client-side or network error.
      console.warn('Client Side Error:', errorResponse.error.message);
    } else {
      console.warn(`Backend returned code ${errorResponse.status || 0}, error body is: `, errorResponse.error || errorResponse);
    }
    const error = this._getErrorMessage(errorResponse);
    reject(error);
  }

  private _getQueryParamsFromObject(obj: object | HttpParams): HttpParams {
    let queryString = '';
    if (!!obj) {
      if (obj instanceof HttpParams) {
        return obj;
      } else {
        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
          queryString = queryString.concat(`${key}=${obj[key]}`);
          if (keys.length > (index + 1)) {
            queryString = queryString.concat('&');
          }
        });
      }
    }
    return new HttpParams({fromString: queryString});
  }

  private _getErrorMessage(response: any): ErrorResponse {
    let errorJson: ErrorResponse;
    try {
      errorJson = JSON.parse(JSON.parse(JSON.stringify(response)));
    } catch (ignored) {
      errorJson = response || {};
      if (response instanceof TimeoutError) {
        errorJson = {name: response.name, message: 'Request timeout, check your connection and try again'};
      } else {
        errorJson = {
          message: ((!!response && !!response.statusText ? response.statusText + ': ' : '') + (errorJson.message || 'Request to server failed, please try again later')),
          name: !!response ? response.name : 'request-failed'
        };
      }
    }
    if (!!response) {
      errorJson.status = errorJson.status || response.status;
      errorJson.message = response.error && response.error ? response.error.message : response.message;
    }
    return errorJson;
  }
}

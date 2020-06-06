import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IHttp {
  /**
   * Performs a request with `get` http method.
   */
  get<T>(url: string, params?: HttpParams): Observable<T>;

  /**
   * Performs a request with `post` http method.
   */
  post<T>(url: string, data: any): Observable<T>;

  /**
   * Performs a request with `put` http method.
   */
  put<T>(url: string, data: any): Observable<T>;

  /**
   * Performs a request with `delete` http method.
   */
  delete<T>(url: string, params?: HttpParams): Observable<T>;

  /**
   * handles http request error.
   */
  handleError(errorResponse: HttpErrorResponse, reject);

}

export class ErrorResponse implements Error {
  public name: string;
  public message: string;
  public status?: number;
}

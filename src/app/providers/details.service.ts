import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private _http: AuthHttp,
    private _networkService: NetworkService,
    private _storageService: StorageService) { }
}

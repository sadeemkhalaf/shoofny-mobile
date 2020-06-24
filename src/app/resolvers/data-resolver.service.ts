import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DataService } from '../providers/data.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any>{

  constructor(private _dataService: DataService) { }

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot) {
    // const id = route.paramMap.get('id');
    console.log(this._dataService.getData());
    return this._dataService.getData();
  }
}

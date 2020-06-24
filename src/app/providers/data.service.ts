import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data: any[] = [];

  constructor() { }

  setData(data: any) {
    this.data[0] = data;
  }

  getData() {
    return this.data[0];
  }

  clearData() {
    this.data = [];
  }
}

import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { AppHelpersService } from './app-helpers.service';

export enum ConnectionStatus {
  Unknown,
  Online,
  Offline
}

const NETWORK_API_WAIT = 4000;

@Injectable()
export class NetworkService {
  private _status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Unknown);

  constructor(private _network: Network,
              private _platform: Platform,
              private _appHelpersService: AppHelpersService) {
    this._platform.ready().then(() => {
      let status: ConnectionStatus;
      if (_appHelpersService.isRealDevice) {
        this._initializeNetworkEvents();
        status = this._network.type !== _network.Connection.NONE ? ConnectionStatus.Online : ConnectionStatus.Offline;
      } else {
        status = ConnectionStatus.Online;
      }
      this._status.next(status);
    });
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this._status.asObservable().pipe(debounceTime(500));
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this._status.getValue();
  }

  private _initializeNetworkEvents() {
    this._network.onDisconnect().subscribe(() => {
      if (this._status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE GOING OFFLINE');
        this._updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this._network.onConnect().pipe(debounceTime(NETWORK_API_WAIT)).subscribe(() => {
      if (this.isValidNetworkType() && this.getCurrentNetworkStatus() !== ConnectionStatus.Online) {
        console.log('WE ARE GOING ONLINE');
        this._updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private isValidNetworkType() {
    return (this._network.type !== this._network.Connection.NONE &&
      this._network.type !== this._network.Connection.UNKNOWN &&
      this._network.type !== this._network.Connection.CELL_2G &&
      this._network.type !== this._network.Connection.CELL);
  }

  private async _updateNetworkStatus(status: ConnectionStatus) {
    this._status.next(status);
  }
}

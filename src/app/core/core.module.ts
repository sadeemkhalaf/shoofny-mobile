import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHttpInterceptor } from './auth-http/auth-http.interceptor';
import { StorageService } from './storage/storage.service';
import { NetworkService } from './utils/network.service';
import { AppHelpersService } from './utils/app-helpers.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [TranslateModule, HttpClientModule, CommonModule, IonicStorageModule.forRoot()],
  providers: [
    Network,
    StorageService,
    NetworkService,
    AppHelpersService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
})
export class CoreModule {}

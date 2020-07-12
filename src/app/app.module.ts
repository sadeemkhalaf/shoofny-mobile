import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { CoreModule } from './core/core.module';
import { HTTP } from '@ionic-native/http/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuardsGuard } from './guards/auth-guards.guard';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SearchBoxPipe } from './providers/search-box.pipe';
import { SearchJobsPipe } from './search-jobs.pipe';
@NgModule({
  declarations: [AppComponent, SearchBoxPipe, SearchJobsPipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    FormsModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    CoreModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthGuardsGuard,
    InAppBrowser,
    Toast,
    Platform,
    HTTP,
    Media,
    MediaCapture,
    File,
    FileTransfer,
    Camera,
    ImagePicker
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

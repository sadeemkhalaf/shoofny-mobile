import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { IUser } from 'src/app/models/user';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  @ViewChild('video') myVideo: any;
  public profile: IUser;
  navigationSubscription: Subscription;

  constructor(
    public helper: AppHelpersService,
    private _storageService: StorageService,
    private _streamingMedia: StreamingMedia,
    private _route: Router
  ) { }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  ngOnInit() {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e) {
        this._loadData();
        window.onload = () => {
          if (!!this.profile && this.profile.picture.length > 0) {
            document
              .getElementById('profileCircle')
              .setAttribute('style', `background-image: url("${this.profile.picture}")`);
          };
        }
      }
    });
  }

  calculatAge() {
    const difference = Date.now() - new Date(this.profile.DOB).getTime();
    const result = new Date(difference);
    return Math.abs(result.getUTCFullYear() - 1970);
  }

  playVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'portrait',
    };

    this._streamingMedia.playVideo(this.profile.video, options);
  }

  private _loadData() {
    this._storageService.getUserData()
      .then((user) => {
        this.profile = user as IUser;
        if (!!this.profile.picture && this.profile.picture.length > 0) {
          window.onload = () => {
            document
              .getElementById('profileCircle')
              .setAttribute('style', `background-image: url("${this.profile.picture}")`);
          };
        }
      }, error => this.helper.showToast(error)
      );
  }
}

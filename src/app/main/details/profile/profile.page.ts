import { Component, OnInit, ViewChild } from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser } from 'src/app/models/user';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { take } from 'rxjs/operators';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { StorageService } from 'src/app/core/storage/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('video') myVideo: any;
  public profile: IUser;

  constructor(
    public helper: AppHelpersService,
    private _authService: AuthService,
    private _streamingMedia: StreamingMedia
    ) { }

  ngOnInit() {
    this._authService.getUserProfile()
    .pipe(take(1))
    .subscribe((user) => {
      this.profile = user;
    }, error => this.helper.showToast('somthing went wrong!')
    )
  }

  ionViewDidLoad() {}

  playVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'portrait',
    };
    
    this._streamingMedia.playVideo(this.profile.video, options);
  }
}

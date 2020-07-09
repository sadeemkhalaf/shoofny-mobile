import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { take } from 'rxjs/operators';
import { WebView } from '@ionic-native/ionic-webview';

@Component({
  selector: 'app-start-recording',
  templateUrl: './start-recording.page.html',
  styleUrls: ['./start-recording.page.scss'],
})
export class StartRecordingPage implements OnInit {
  @ViewChild('video') myVideo: any;
  public slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  public video: any;
  public enablePlay: boolean;

  public pathTest: string;

  constructor(
    private _mediaService: MediaPickerService
  ) { }

  ngOnInit() {
  }

  public startRecording() {
    this._mediaService.uploadVideo('testVideo');
    // this._mediaService.selectVideo().then((results) => {
    //   this._mediaService.$selectedVideo.pipe(take(1)).subscribe((vid) => {
    //     if (!!vid) {
    //       this.enablePlay = true;
    //     } else {
    //       this.enablePlay = false;
    //     }
    //   });
    // });
  }

  public playVideo() {
    this._mediaService.$selectedVideo.pipe(take(1)).subscribe((vid) => {
      const video = this.myVideo.nativeElement;
      video.src = WebView.convertFileSrc(vid);
      this.pathTest = WebView.convertFileSrc(vid);
      video.play();
    });

  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { take, first } from 'rxjs/operators';
import { WebView } from '@ionic-native/ionic-webview';
import { Router } from '@angular/router';

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
    private _mediaService: MediaPickerService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  public startRecording() {
    this._mediaService.uploadVideo('testVideo');
    // this._mediaService.selectVideo().then((results) => {
    //   this._mediaService.$selectedVideo.pipe().subscribe((vid) => {
    //     if (!!vid) {
    //       this.enablePlay = true;
    //     } else {
    //       this.enablePlay = false;
    //     }
    //   });
    // });
  }

  public playVideo() {
    this._mediaService.$selectedVideo.pipe(first()).subscribe((vid) => {
      const video = this.myVideo.nativeElement;
      video.src = WebView.convertFileSrc(vid);
      this.pathTest = WebView.convertFileSrc(vid);
      video.play();
    });

  }

  goToHomePage() {
    this._router.navigate([`/home`])
  }

}

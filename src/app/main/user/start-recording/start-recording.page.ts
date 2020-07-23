import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { VideoCaptureService } from 'src/app/providers/video-capture.service';

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
    private _mediaService: VideoCaptureService,
    private _router: Router
  ) { }

  ngOnInit() {
  }

  public startRecording() {
    from(this._mediaService.selectVideo()).pipe(first()).subscribe((video) => {
      console.log(video);
    });
  }

  public playVideo() {
    this._mediaService.$selectedVideo.pipe(first()).subscribe((vid) => {
      const video = this.myVideo.nativeElement;
      video.play();
    });

  }

  goToHomePage() {
    this._router.navigate([`/home`])
  }

}

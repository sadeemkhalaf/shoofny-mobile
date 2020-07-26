import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { VideoCaptureService } from 'src/app/providers/video-capture.service';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { LoadingController } from '@ionic/angular';

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
  public uploaded: boolean;
  public pathTest: string;

  private _loader;

  constructor(
    public loadingController: LoadingController,
    private _mediaService: VideoCaptureService,
    private _router: Router,
    private _helper: AppHelpersService
  ) { }

  ngOnInit() {
  }

  public startRecording() {
    from(this._mediaService.selectVideo()).pipe(first()).subscribe((video) => {
      this.enablePlay = true;
      this.video = video;
    });
  }

  public uploadVideo() {
    this._helper.showLoading();
    this.presentLoading();
    this.uploaded = true;
    this._mediaService.uploadVideo().then(() => {
      this.stopLoading();
    }, error => {
      this.uploaded = false;
      this.stopLoading();
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

  async presentLoading() {
    this._loader = await this.loadingController.create({
      spinner: null,
      message: 'Uploading Video, please wait ...',
      translucent: true,
      cssClass: 'loader',
      backdropDismiss: false
    });
    await this._loader.present();
  }

  async stopLoading() {
    await this._loader.dismiss();
  }

}

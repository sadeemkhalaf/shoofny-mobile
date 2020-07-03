import { Component, OnInit } from '@angular/core';
import { MediaPickerService, VIDEO_FILE_KEY } from 'src/app/providers/media-picker.service';
import { StorageService } from 'src/app/core/storage/storage.service';

@Component({
  selector: 'app-start-recording',
  templateUrl: './start-recording.page.html',
  styleUrls: ['./start-recording.page.scss'],
})
export class StartRecordingPage implements OnInit {

  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  public video: any;

  constructor(
    private _mediaService: MediaPickerService,
    private _storageService: StorageService
    ) { }

  ngOnInit() {
  }

  public startRecording() {
    this._mediaService.selectVideo().then((results) => {
      this._storageService.getLocalData(VIDEO_FILE_KEY).then((video) => 
      this.video = video
      );
    });
  }

}

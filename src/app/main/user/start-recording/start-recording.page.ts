import { Component, OnInit } from '@angular/core';
import { MediaPickerService, VIDEO_FILE_KEY } from 'src/app/providers/media-picker.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-start-recording',
  templateUrl: './start-recording.page.html',
  styleUrls: ['./start-recording.page.scss'],
})
export class StartRecordingPage implements OnInit {

  public slideOpts = {
    initialSlide: 0,
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
      this._mediaService.$selectedVideo.pipe(take(1)).subscribe((vid) => this.video = vid);
    });
  }

}

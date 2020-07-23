import { Injectable, OnInit } from '@angular/core';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ReplaySubject } from 'rxjs';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { StorageService } from '../core/storage/storage.service';
import { AppHelpersService } from '../core/utils/app-helpers.service';
import { environment } from 'src/environments/environment';

export const VIDEO_FILE_KEY = 'videoFile';
export const IMAGE_FILE_KEY = 'imageFile';
export const MEDIA_FOLDER = 'media_folder';

@Injectable({
  providedIn: 'root'
})
export class VideoCaptureService implements OnInit {

  constructor(
    public actionSheetController: ActionSheetController,
    private _helper: AppHelpersService,
    private _storageService: StorageService,
    private _mediaCapture: MediaCapture,
    private _fileTransfer: FileTransfer,
    private _file: File,
    public navCtrl: NavController,
    private _platform: Platform) { }

  ngOnInit(): void {
    const path = this._file.dataDirectory;
    this._platform.ready().then(() => {
      this._file.checkDir(path, MEDIA_FOLDER).then(() => {

      }, err => {
        this._file.createDir(path, MEDIA_FOLDER, false);
      })
    }, error => { })
  }

  isLoading = false;
  $selectedVideo: ReplaySubject<any> = new ReplaySubject(1);

  // upload variables
  selectedVideo: string = 'https://res.cloudinary.com/demo/video/upload/w_640,h_640,c_pad/dog.mp4';
  uploadedVideo: string;

  isUploading: boolean = false;
  uploadPercent: number = 0;
  videoFileUpload: FileTransferObject;
  loader;

  private _videoFileUpload: FileTransferObject;

  public async selectVideo() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Start recoding your Video',
      buttons: [{
        text: 'Use Camera',
        handler: () => {
          this._recordVideo();
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  public getVideoToPlay(file) {
    const path = this._file.dataDirectory + file.name;
    const url = path.replace(/^file:\/\//, '');
    return url;
  }

  private _recordVideo() {
    const options: CaptureVideoOptions = {
      duration: 59,
      limit: 1,
      quality: 80
    }
    this._mediaCapture.captureVideo(options)
      .then(
        (res) => {
          if (!!res) {
            const capturedFile = res[0];
            this.$selectedVideo.next(capturedFile.fullPath);
            this._storageService.setLocalData(VIDEO_FILE_KEY, capturedFile);
            this._copyFileToLocalDir(capturedFile.fullPath);
            // this._uploadVideo(capturedFile.name, this._pathForFile(capturedFile.fullPath));
          }
        },
        (err) => console.error(err)
      );
  }


  private _uploadVideo(filename: string, selectedVideo: any) {
    // var filename = this.selectedVideo.substr(this.selectedVideo.lastIndexOf('/') + 1);   
    var options: FileUploadOptions = {
      fileName: filename,
      fileKey: "video",
      mimeType: "video/mp4"
    }

    this._videoFileUpload = this._fileTransfer.create();
    this.isUploading = true;

    this._videoFileUpload.upload(selectedVideo, `${environment.APIEndpoint}/api/videos/`, options)
      .then((data) => {
        this.isUploading = false;
        this.uploadPercent = 0;
        return JSON.parse(data.response);
      })
      .then((data) => {
        this.uploadedVideo = data.url;
        this._helper.showToast('Video upload was successful.', 'success');
      })
      .catch((err) => {
        this.isUploading = false;
        this.uploadPercent = 0;
        console.log(`error: ${JSON.stringify(err)}`)
        this._helper.showToast('Error uploading video.', 'danger');
      });

    this._videoFileUpload.onProgress((data) => {
      this.uploadPercent = Math.round((data.loaded / data.total) * 100);
    });

  }

  private _copyFileToLocalDir(fullPath) {
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this._file.dataDirectory + MEDIA_FOLDER;

    this._file.copyFile(copyFrom, name, copyTo, newName).then(
      success => {
        // delete from storage 
        this._file.removeFile(copyFrom, name).then(() => console.log('removed from local storage'));
      },
      error => {
        console.log('error: ', error);
      }
    );
  }
}

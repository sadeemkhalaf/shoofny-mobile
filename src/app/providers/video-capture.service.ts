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
import { AuthService } from './auth.service';
import { first } from 'rxjs/operators';

export const VIDEO_FILE_KEY = 'videoFile';
export const IMAGE_FILE_KEY = 'imageFile';
export const MEDIA_FOLDER = 'media_folder';

@Injectable({
  providedIn: 'root'
})
export class VideoCaptureService implements OnInit {

  private _videoPath: any;

  private isLoading = false;
  $selectedVideo: ReplaySubject<any> = new ReplaySubject(1);

  // upload variables
  selectedVideo: string = 'https://res.cloudinary.com/demo/video/upload/w_640,h_640,c_pad/dog.mp4';
  uploadedVideo: string;

  private isUploading: boolean = false;
  private uploadPercent: number = 0;
  private videoFileUpload: FileTransferObject;
  private loader;

  private _videoFileUpload: FileTransferObject;
  
  constructor(
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    private _helper: AppHelpersService,
    private _storageService: StorageService,
    private _mediaCapture: MediaCapture,
    private _fileTransfer: FileTransfer,
    private _file: File,
    private _platform: Platform,
    private _auth: AuthService
    ) { }

  ngOnInit(): void {
    const path = this._file.dataDirectory;
    this._platform.ready().then(() => {
      this._file.checkDir(path, MEDIA_FOLDER).then(() => {

      }, err => {
        this._file.createDir(path, MEDIA_FOLDER, false);
      })
    }, error => { })
  }

  // step 1: call this to select/record the video
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

  // step 2: call this to to upload
  public async uploadVideo() {
    this.isUploading = true;
    const path = this._videoPath.nativeURL.substr(0, this._videoPath.nativeURL.lastIndexOf('/') + 1);
    const type = this._getMimeType(this._videoPath.name.split('.').pop());
    const buffer = await this._file.readAsArrayBuffer(path, this._videoPath.name);
    const videoBlob = new Blob([buffer], type);
  
    // TODO: use the video upload API here
    this._helper.showLoading();
    this._auth.uploadVideo(videoBlob).pipe(first()).subscribe((success) => {
      this._helper.hideLoading();
      this.isUploading = false;
      this._helper.showToast(`Video uploaded successfully`, `success`);
    }, error => {
      this.isUploading = false;
      this._helper.hideLoading();
      this._helper.showHttpErrorMessage(error);
    });

  }

  private _recordVideo() {
    const options: CaptureVideoOptions = {
      duration: 59,
      limit: 1,
      quality: 30
    }
    this._mediaCapture.captureVideo(options)
      .then(
        (res) => {
          if (!!res) {
            const capturedFile = res[0];
            this._videoPath = capturedFile;
            this.$selectedVideo.next(capturedFile.fullPath);
            this._storageService.setLocalData(VIDEO_FILE_KEY, capturedFile);
            this._copyFileToLocalDir(capturedFile.fullPath);
          }
        },
        (err) => console.error(err)
      );
  }

  private _getMimeType(fileExt) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime' };
  }

  private _uploadVideo(filename: string, selectedVideo: any) { 
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

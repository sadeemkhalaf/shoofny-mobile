import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ReplaySubject } from 'rxjs';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { StorageService } from '../core/storage/storage.service';
import { AppHelpersService } from '../core/utils/app-helpers.service';
import { environment } from 'src/environments/environment';

export const VIDEO_FILE_KEY = 'videoFile';
export const IMAGE_FILE_KEY = 'imageFile';
@Injectable({
  providedIn: 'root'
})
export class MediaPickerService {

  constructor(
    public actionSheetController: ActionSheetController,
    private _helper: AppHelpersService,
    private _camera: Camera,
    private _storageService: StorageService,
    private _mediaCapture: MediaCapture,
    private _fileTransfer: FileTransfer,
    private _file: File,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController) { }

  croppedImagepath = '';
  isLoading = false;
  $selectedImage: ReplaySubject<any> = new ReplaySubject(1);
  $selectedVideo: ReplaySubject<any> = new ReplaySubject(1);

  // upload variables
  selectedVideo: string = 'https://res.cloudinary.com/demo/video/upload/w_640,h_640,c_pad/dog.mp4';
  uploadedVideo: string;

  isUploading: boolean = false;
  uploadPercent: number = 0;
  videoFileUpload: FileTransferObject;
  loader;

  private _videoFileUpload: FileTransferObject;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  private pickImage(source: any) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: source,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE
    };
    return this._camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.$selectedImage.next('data:image/jpeg;base64,' + imageData);
      this._storageService.setLocalData(IMAGE_FILE_KEY, 'data:image/jpeg;base64,' + imageData);

      // this.$selectedImage.next(imageData);
    }, (err) => {
      // Handle error
    });
  }

  public async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select image source',
      buttons: [{
        text: 'Load from library',
        handler: () => {
          this.pickImage(this._camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this._camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

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

  getVideoToPlay(file) {
    const path = this._file.dataDirectory + file.name;
    const url = path.replace(/^file:\/\//, '');
    return url;
  }

  uploadVideo(filename: string, selectedVideo?) {
    // var filename = this.selectedVideo.substr(this.selectedVideo.lastIndexOf('/') + 1);   
    var options: FileUploadOptions = {
      fileName: filename,
      fileKey: "video",
      mimeType: "video/mp4"
    }

    this._videoFileUpload = this._fileTransfer.create();
    this.isUploading = true;

    this._videoFileUpload.upload(this.selectedVideo, `${environment.APIEndpoint}/api/videos/`, options)
      .then((data)=>{
        this.isUploading = false;
        this.uploadPercent = 0;
        return JSON.parse(data.response);
      })
      .then((data) => {        
        this.uploadedVideo = data.url;
        this._helper.showToast('Video upload was successful.', 'success');
      })
      .catch((err)=>{
        this.isUploading = false;
        this.uploadPercent = 0;
        console.log(`error: ${JSON.stringify(err)}`)
        this._helper.showToast('Error uploading video.', 'danger');
      });

    this._videoFileUpload.onProgress((data) => {
      this.uploadPercent = Math.round((data.loaded/data.total) * 100);
    });

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
            this.uploadVideo(capturedFile.name);
          }
        },
        (err) => console.error(err)
      );
  }

  private _copyVideoToLocalDirectory(capturedFile) {
    /* var filename = videoUrl.substr(videoUrl.lastIndexOf('/') + 1);
       var dirpath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1); 
       dirpath = dirpath.includes("file://") ? dirpath : "file://" + dirpath;*/
    let fileName = capturedFile.name;
    let dir = capturedFile['localURL'].split('/');
    dir.pop();
    let fromDirectory = dir.join('/');
    var toDirectory = this._file.dataDirectory;

    this._file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
      // remove from device storage
      this._file.removeFile(capturedFile['localURL'], fileName);

    });


  }
}

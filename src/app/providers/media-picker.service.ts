import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ReplaySubject } from 'rxjs';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { StorageService } from '../core/storage/storage.service';

export const VIDEO_FILE_KEY = 'videoFile';
export const IMAGE_FILE_KEY = 'imageFile';
@Injectable({
  providedIn: 'root'
})
export class MediaPickerService {

  constructor(
    public actionSheetController: ActionSheetController,
    private _camera: Camera,
    private _storageService: StorageService,
    private _mediaCapture: MediaCapture,
    private _file: File) { }

  croppedImagepath = '';
  isLoading = false;
  $selectedImage: ReplaySubject<any> = new ReplaySubject(1);
  $selectedVideo: ReplaySubject<any> = new ReplaySubject(1);

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

  private _recordVideo() {
    let options: CaptureVideoOptions = {
      duration: 59,
      limit: 1,
      quality: 80
    }
    this._mediaCapture.captureVideo(options)
      .then(
        (res) => {
          const capturedFile: MediaFile = res[0];
            this.$selectedVideo.next(capturedFile.fullPath);
            this._storageService.setLocalData(VIDEO_FILE_KEY, capturedFile);
        },
        (err) => console.error(err)
      );
  }

}

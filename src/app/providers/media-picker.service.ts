import { Injectable, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
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
export const MEDIA_FOLDER = 'media_folder';

@Injectable({
  providedIn: 'root'
})
export class MediaPickerService implements OnInit {

  constructor(
    public actionSheetController: ActionSheetController,
    private _helper: AppHelpersService,
    private _camera: Camera,
    private _storageService: StorageService,
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

  croppedImagepath = '';
  isLoading = false;
  $selectedImage: ReplaySubject<any> = new ReplaySubject(1);

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  public async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select image source',
      buttons: [{
        text: 'Load from library',
        handler: () => {
          this._pickImage(this._camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Use Camera',
        handler: () => {
          this._pickImage(this._camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  private _pickImage(source: any) {
    const options: CameraOptions = {
      quality: 40,
      sourceType: source,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE
    };
    return this._camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
      // TODO: upload the image as a file
      this.$selectedImage.next('data:image/jpg;base64,' + imageData);
      this._storageService.setLocalData(IMAGE_FILE_KEY, 'data:image/jpg;base64,' + imageData);

      // this.$selectedImage.next(imageData);
    }, (err) => {
      // Handle error
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

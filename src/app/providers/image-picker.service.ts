import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { pathToFileURL } from 'url';

@Injectable({
  providedIn: 'root'
})
export class ImagePickerService {

  constructor(
    public actionSheetController: ActionSheetController,
    private _camera: Camera,
    private _imagePicker: ImagePicker,
    private _file: File) { }

  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

/* HOW TO USE: 
    1- call imagePicker() to return the image path 
    2- use prev. data returned (path) as a parameter to call readAsData(path)

*/
  public imagePicker() {
    let options: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 100
    };
    return this._imagePicker.getPictures(options);
  }

  public readAsDataURL(path: string) {
    let fileName = path.substring(path.lastIndexOf('/') + 1);
    let pathString = path.substring(0, path.lastIndexOf('/') + 1);
    return this._file.readAsDataURL(pathString, fileName)
    // .then((value) => image = value)
  }

  private pickImage(sourceType: any) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this._camera.DestinationType.FILE_URI,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE
    };
    return this._camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });

    /*
    // HANDLE THIS WHEN IT'S CALLED
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
    */
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

}

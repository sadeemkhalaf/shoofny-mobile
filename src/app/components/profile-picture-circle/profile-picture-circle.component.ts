import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';

@Component({
  selector: 'app-profile-picture-circle',
  templateUrl: './profile-picture-circle.component.html',
  styleUrls: ['./profile-picture-circle.component.scss'],
})
export class ProfilePictureCircleComponent implements OnInit {

  public userData: IUser;
  
  constructor(private _storage: StorageService) { }

  ngOnInit() {
    this._storage.getUserData().then((data) => {
      this.userData = data;
      const pictureUrl = !!this.userData.picture && this.userData.picture.length > 0 ? this.userData.picture : './../../../assets/placeholder-img.png' ;
      document.getElementsByClassName('image-circle')
        .item(0).setAttribute('style', `background-image: url('${pictureUrl}')`);
    });
  }

}

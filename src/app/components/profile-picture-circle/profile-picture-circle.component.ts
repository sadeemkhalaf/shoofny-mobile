import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-picture-circle',
  templateUrl: './profile-picture-circle.component.html',
  styleUrls: ['./profile-picture-circle.component.scss'],
})
export class ProfilePictureCircleComponent implements OnInit {
  public userData: IUser;
  navigationSubscription: Subscription;

  constructor(private _storage: StorageService, private _route: Router) { }

  ngOnInit() {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this._loadPicture();
      }
    });
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }

  _loadPicture() {
    this._storage.getUserData().then((data) => {
      this.userData = data as IUser;
      const pictureUrl =
        !!this.userData.picture && this.userData.picture.length > 0
          ? this.userData.picture
          : './../../../assets/placeholder-img.png';
      document
        .getElementsByClassName('image-circle')
        .item(0)
        .setAttribute('style', `background-image: url('${pictureUrl}')`);
    });
  }
}

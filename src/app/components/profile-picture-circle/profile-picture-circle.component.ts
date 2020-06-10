import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-picture-circle',
  templateUrl: './profile-picture-circle.component.html',
  styleUrls: ['./profile-picture-circle.component.scss'],
})
export class ProfilePictureCircleComponent implements OnInit {

  @Input() userDataPicture: string;
  constructor() { }

  ngOnInit() {
    document.getElementsByClassName('image-circle')
    .item(0).setAttribute('style', `backgroundImage: url('${this.userDataPicture}')`);
  }

}

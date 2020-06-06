import { Component, OnInit } from '@angular/core';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public helper: AppHelpersService) { }

  ngOnInit() {
  }

}

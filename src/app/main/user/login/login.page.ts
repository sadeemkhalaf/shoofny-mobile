import { Component, OnInit } from '@angular/core';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public helper: AppHelpersService,
    private _auth: AuthService) { }

  ngOnInit() {
  }

  login(email, password) {
    this._auth.login(email, password);
  }

}

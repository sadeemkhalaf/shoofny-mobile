import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/storage/storage.service';
import { AuthService } from 'src/app/providers/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public form: FormGroup;
  public isSubmitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public helper: AppHelpersService,
    private _route: Router,
    private _auth: AuthService) {
    }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  resetPassword(email: string) {
    this._auth.resetPassword(email).pipe(first()).subscribe((success) => {
      
    }, error => {

    });
  }

  get errorControl() {
    return this.form.controls;
  }

  onSubmitForm() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const email = this.form.get('email').value;
      this.resetPassword(email);
    }
  }

}

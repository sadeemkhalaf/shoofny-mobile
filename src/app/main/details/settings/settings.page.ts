import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/storage/storage.service';
import { TranslateConfigService } from 'src/app/providers/translate-config.service';
import { Router } from '@angular/router';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public languageSelected: string;

  constructor(
    private _storage: StorageService,
    private _translate: TranslateConfigService,
    private _helper: AppHelpersService,
    private _route: Router) { }

  ngOnInit() {
    this.getLanguage();
  }

  getLanguage() {
    this._storage.getLocalData('language').then((language) => {
      if (!!language) {
        this._translate.setLanguage(language);
        this.languageSelected = language;
      } 
    }, error => {
        this._translate.setLanguage('en');
        this._storage.setLocalData('language', 'en');
        this.languageSelected = 'en';
    })
  }

  async setChanges() {
    this._translate.setLanguage(this.languageSelected);
    await this._storage.setLocalData('language', this.languageSelected)
    .then(() => this._helper.showToast('Changes Saved', 'success'));
    this._route.navigate(['/home']);
  }
}

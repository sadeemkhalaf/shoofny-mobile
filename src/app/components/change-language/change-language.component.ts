import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/storage/storage.service';
import { TranslateConfigService } from 'src/app/providers/translate-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss'],
})
export class ChangeLanguageComponent implements OnInit {

  public languageSelected: string;
  private _navigationSubscription;

  constructor(
    private _storage: StorageService,
    private _translate: TranslateConfigService,
    private _route: Router) { }

  ngOnInit() { }

  getLanguage() {
    this._storage.getLocalData('language').then((language) => {
      if (language) {
        this._translate.setLanguage(language);
        this.languageSelected = language;
        console.log(language);
      }
    }, error => {
      this._translate.setLanguage('en');
      this._storage.setLocalData('language', 'en');
      this.languageSelected = 'en';
    })
  }

  onChangeLanguage(e: any) {
    this.languageSelected = e.detail.value;
    this._translate.setLanguage(this.languageSelected);
    this._storage.setLocalData('language', this.languageSelected);
  }
}

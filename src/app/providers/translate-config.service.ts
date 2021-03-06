import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(private translate: TranslateService) { }

  getDefaultLanguage() {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang('en');
    return language;
  }

  setLanguage(language) {
    this.translate.use(language);
  }
}

import { Injectable } from '@angular/core';
import { Platform, ToastController, MenuController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { ActivatedRoute } from '@angular/router';

const TOAST_TIMEOUT = 8000;

@Injectable()
export class AppHelpersService {
  private _loading: Promise<HTMLIonLoadingElement>;
  private _loadingSubject: ReplaySubject<boolean> = new ReplaySubject(1);
  private _toastSubject: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private _toastController: ToastController,
              private _inAppBrowser: InAppBrowser,
              private _toast: Toast,
              private _menuCtrl: MenuController,
              private _platform: Platform) {
    this._toastSubject.asObservable().pipe(debounceTime(250)).subscribe((toast) => this._showToast(toast));
  }

  public get isMobile() {
    // return this._platform.is('mobile');
    const agent = navigator.userAgent || navigator.vendor || (window as any).opera;
    // tslint:disable-next-line:max-line-length
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substr(0, 4)));
  }

  public get isIos() {
    return this.isRealDevice && this._platform.is('ios');
  }

  public get isAndroid() {
    return this.isRealDevice && this._platform.is('android');
  }

  public get isTablet() {
    return this._platform.is('tablet') || this._platform.is('ipad');
  }

  public get isBigScreen() {
    return !this.isMobile || this.isTablet;
  }

  public get isRealDevice() {
    return this._platform.is('cordova'); // maybe this._platform.is('hybrid') ??
  }

  public findDeepParam(route: ActivatedRoute, paramKey) {
    if (!!route.children && route.children.length > 0) {
      const paramRoute = route.children.find(value => !!value.snapshot.paramMap.get(paramKey));
      return !!paramRoute ? paramRoute.snapshot.paramMap.get(paramKey) : this.findDeepParam(route.firstChild, paramKey);
    } else {
      return route.snapshot.paramMap.get(paramKey);
    }

  }

  public showToast(message: string, color: Color = 'danger', duration: number = TOAST_TIMEOUT, position: 'top' | 'bottom' | 'middle' = 'top') {
    if (this.isRealDevice) {
      const backgroundColor = color === 'danger' ? '#F43E00' : '#00ab66';
      this._toastSubject.next({message, position: 'bottom', duration, styling: {backgroundColor}});
    } else {
      const toast = this._toastController.create({
        message,
        color,
        duration,
        position,
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ],
        id: 'MainToaster'
      });
      this._toastSubject.next(toast);
    }
  }

  public async hideToast() {
    if (this.isRealDevice) {
      return this._toast.hide();
    } else {
      this._toastController.getTop().then((toast) => {
        if (!!toast) {
          return this._toastController.dismiss();
        }
      });
    }
  }

  public showLoading() {
    this._loadingSubject.next(true);
  }

  public hideLoading() {
    this._loadingSubject.next(false);
  }

  public showHttpErrorMessage(reason: { status: number; error: any; message: string }) {
    switch (reason.status) {
      case 503:
      case 504:
        this.showToast('Server under maintenance please wait a few minutes and try again', 'danger');
        break;
      case 0:
      case undefined:
        this.showToast('Internet connection issue, please check your connection first and try again', 'danger');
        break;
      case 500:
        this.showToast('Internal server error, please let us know about it', 'danger');
        break;
      default:
        this.showToast(reason.message || 'Something went wrong! please contact our support.', 'danger');
    }
  }

  public openUrl(url: string, inApp: boolean = false) {
    if (inApp) {
      const inAppBrowserObject = this._inAppBrowser.create(url, '_system', {hardwareback: 'yes', location: 'no'});
    } else {
      try {
        const pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
          this.showToast('Please disable your Pop-up blocker and try again.', 'danger', 5000, 'top');
        }
      } catch (e) {
        console.warn(e);
        this.showToast('Please disable your Pop-up blocker and try again.', 'danger', 5000, 'top');
      }
    }
  }

  public search(value: any[], keys: string, term: string, deepSearch: boolean): any[] {
    if (!term) {
      return value;
    }
    return (value || []).filter((item) => keys.trim().split(',')
      .some(key => item.hasOwnProperty(key.trim()) && new RegExp(term.trim(), deepSearch ? 'gi' : 'yi')
        .test(item[key.trim()])));
  }

  public openMenu(menuId: string) {
    this._menuCtrl.enable(true, menuId);
    this._menuCtrl.open(menuId);
  }

  public closeMenu(menuId: string) {
    this._menuCtrl.close(menuId);
  }

  private async _showToast(toastObject) {
    if (this.isRealDevice) {
      return this._toast.showWithOptions(toastObject).subscribe();
    } else {
      return await (await toastObject).present();
    }
  }
  
}

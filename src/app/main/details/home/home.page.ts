import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser } from 'src/app/models/user';
import { Router } from '@angular/router';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/core/storage/storage.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public profileImage: string;
  public userData: IUser;
  public jobsCountByCity: number = 0;
  public jobsListByCity: IJobDetails[] = [];

  navigationSubscription: Subscription = new Subscription();
  private _subscriptions: Subscription[] = [];

  constructor(
    public helper: AppHelpersService,
    private _auth: AuthService,
    private _route: Router,
    private _StorageService: StorageService,
    private _jobDetailsService: JobDetailsService) { }

  ngOnInit() {
    this._loadData();
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      // if (e instanceof NavigationEnd) {
      //   this._loadData();
      // }

    });
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ionViewWillEnter() {
    this._loadData();
  }

  public logout() {
    this._auth.logout().then(() => {
      this.helper.closeMenu('menu')
      this.navigateTo('/login');
    }, error => console.error(error));
  }

  public getJobsByCity(id: number) {
    return this._jobDetailsService.getJobByParam({ city: id });
  }

  public navigateTo(path: string) {
    this._route.navigate([path]);
  }

  _loadData() {
    this._StorageService.getUserData().then((user) => {
      this.userData = user;
      if (!!this.userData.city.id) {
        this._subscriptions.push(this.getJobsByCity(user.city.id).subscribe((data: any) => {
          this.jobsCountByCity = data.count;
          this.jobsListByCity = data.results as IJobDetails[];
          if (this.jobsListByCity.length > 3) {
            this.jobsListByCity = this.jobsListByCity.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1).slice(0, 3);
          }
        }));
      }
    });
  }
}

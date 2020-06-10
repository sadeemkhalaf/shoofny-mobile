import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';
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

  constructor(
    private _auth: AuthService,
    private _route: Router,
    private _jobDetailsService: JobDetailsService,
    private _storage: StorageService) { }

  ngOnInit() {
    this._storage.getUserData().then((data) => {
      this.userData = data;
      this.getJobsByCity(595)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.jobsCountByCity = data.count;
          this.jobsListByCity = data.results as IJobDetails[];
        });
      if (!!this.userData.picture) {
        document.getElementsByClassName('image-circle')
          .item(0).setAttribute('style', `backgroundImage: url('${this.userData.picture}')`);
      }
    })
  }

  public logout() {
    this._auth.logout();
  }

  public getJobsByCity(id: number) {
    return this._jobDetailsService.getJobByParam({ city: id });
  }

  public navigateTo(path: string) {
    this._route.navigate([path]);
  }

}

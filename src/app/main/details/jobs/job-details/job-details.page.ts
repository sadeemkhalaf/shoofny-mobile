import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IJobDetails } from 'src/app/models/Job';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { IUser } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.page.html',
  styleUrls: ['./job-details.page.scss'],
})
export class JobDetailsPage implements OnInit, OnDestroy {

  public jobDetails: IJobDetails;
  public jobTitle: string;

  public applied: boolean = false;
  private _jobId: number;
  private _user: IUser;
  private _subscriptions: Subscription[] = [];

  constructor(
    public helper: AppHelpersService,
    private _route: ActivatedRoute,
    private _storageService: StorageService,
    private _jobDetailsService: JobDetailsService) { }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit() {
    this._jobId = Number(this._route.snapshot.paramMap.get('id'));
    this._subscriptions.push(this._jobDetailsService.getJobByParam({id: this._jobId})
    .subscribe((data: any) => {
      this.jobDetails = data.results[0] as IJobDetails;
      this.jobTitle = this.jobDetails.slug.split('-').join(' ');
    }));
    this._getUser();
  }

  public caculateDays() {
    const now = new Date(Date.now()).getTime();
    const updated = new Date(this.jobDetails.updated).getTime();
    const diffTime = Math.abs(now - updated);
    const days =  Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 1 ? days + ' days' : days + ' day'; 
  }

  public applyNow() {
    this.helper.showLoading();
    this._jobDetailsService.applyNow(this.jobDetails.id, this._user.id).subscribe(() => {
      this.applied = true;
      this.helper.hideLoading();
      this.helper.showToast('You applied successfully!', 'success');
    }, error => {
      console.warn(error);
      this.helper.showToast('You\'ve already applied', 'danger');
      this.applied = true;
      this.helper.hideLoading();
    })
  }

  private _getUser() {
    this._storageService.getUserData().then((user) => this._user = user);
  }
}

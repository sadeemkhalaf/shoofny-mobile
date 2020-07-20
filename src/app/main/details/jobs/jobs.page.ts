import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take, first } from 'rxjs/operators';
import { DataService } from 'src/app/providers/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  public jobsList: IJobDetails[] = [];
  public search: string;

  private _config: any;
  private _subscriptions: Subscription[] = [];

  navigationSubscription: Subscription = new Subscription();

  constructor(
    public helper: AppHelpersService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
    private _data: DataService,
    private _jobDetailsService: JobDetailsService
    ) {
      this.navigationSubscription = this._route.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          const config = this._data.getData();
          this._loadData(config);
        }    
      });
    }

  ngOnInit() {
    this._loadData();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
      this.navigationSubscription.unsubscribe();
   }
   this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private _loadData(config?) {
    this.helper.showLoading();
    if(!!config) {
      this._config = config;
      this._subscriptions.push(this._jobDetailsService.getJobByParam(this._config).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        // sort results 
        this.jobsList = this._sortJobsByDate(this.jobsList);
        this.helper.hideLoading();
      }, error => {
        this.helper.hideLoading();
        this.helper.showHttpErrorMessage(error);
      }));
      this._data.clearData();
    }
    else if(!!this._activatedRoute.snapshot.data['query']) {
      this._config = this._activatedRoute.snapshot.data['query'];
      this._subscriptions.push(this._jobDetailsService.getJobByParam(this._config).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        this.jobsList = this._sortJobsByDate(this.jobsList);
        this.helper.hideLoading()
      }, error => {
        this.helper.hideLoading();
        this.helper.showHttpErrorMessage(error);
      }));
      this._data.clearData();
    } else {
      this._subscriptions.push(this._jobDetailsService.getJobByParam({}).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        this.helper.hideLoading()
      }, error => {
        this.helper.hideLoading();
        this.helper.showHttpErrorMessage(error);
      }));
    }
  }

  
private _sortJobsByDate(jobsList: any[]) {
  return jobsList.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
}
}



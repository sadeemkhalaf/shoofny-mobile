import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DataService } from 'src/app/providers/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  public jobsList: IJobDetails[] = [];
  private _config: any;

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
  }

  private _loadData(config?) {
    this.helper.showLoading();
    if(!!config) {
      this._config = config;
      console.log('config: ', this._config);
      this._jobDetailsService.getJobByParam(this._config).pipe(take(1)).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        // sort results 
        this.jobsList = this._sortJobsByDate(this.jobsList);
        this.helper.hideLoading();
      }, error => this.helper.hideLoading());
      this._data.clearData();
    }
    else if(!!this._activatedRoute.snapshot.data['query']) {
      this._config = this._activatedRoute.snapshot.data['query'];
      console.log('config: ', this._config);
      this._jobDetailsService.getJobByParam(this._config).pipe(take(1)).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        this.jobsList = this._sortJobsByDate(this.jobsList);
        this.helper.hideLoading()
      }, error => this.helper.hideLoading());
      this._data.clearData();
    } else {
      this._jobDetailsService.getJobByParam({}).pipe(take(1)).subscribe((jobs: any) => {
        this.jobsList = jobs.results as IJobDetails[];
        this.helper.hideLoading()
      }, error => this.helper.hideLoading());
    }
  }

  
private _sortJobsByDate(jobsList: any[]) {
  return jobsList.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
}
}



import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  public jobsList: IJobDetails[] = [];
  constructor(
    public helper: AppHelpersService,
    private _jobDetailsService: JobDetailsService
    ) {}

  ngOnInit() {
    this._jobDetailsService.getJobByParam({}).subscribe((jobs: any) => {
      this.jobsList = jobs.results as IJobDetails[];
    });
  }
  

}

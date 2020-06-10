import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from 'src/app/providers/job-details.service';
import { IJobDetails } from 'src/app/models/Job';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  public jobsList: IJobDetails[] = [];
  constructor(
    private _jobDetailsService: JobDetailsService
    ) {}

  ngOnInit() {
    this._jobDetailsService.getJobByParam({}).subscribe((jobs: any) => {
      this.jobsList = jobs.results as IJobDetails[];
    });
  }

}

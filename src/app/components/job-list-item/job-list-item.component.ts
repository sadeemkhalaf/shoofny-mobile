import { Component, OnInit, Input } from '@angular/core';
import { IJobDetails } from 'src/app/models/Job';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list-item',
  templateUrl: './job-list-item.component.html',
  styleUrls: ['./job-list-item.component.scss'],
})
export class JobListItemComponent implements OnInit {

  @Input() jobItem: IJobDetails;
  public jobTitle: string;

  constructor(private _route: Router) { }

  ngOnInit() {
    this.jobTitle = this.jobItem.slug.split('-').join(' ');
  }

  caculateDays() {
    const now = new Date(Date.now()).getTime();
    const updated = new Date(this.jobItem.updated).getTime();
    const diffTime = Math.abs(now - updated);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  navigateToJobDetails() {
    this._route.navigate([`/home/jobs/job-details/`, this.jobItem.id]);
  }
}

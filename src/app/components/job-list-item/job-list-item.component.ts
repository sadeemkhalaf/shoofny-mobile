import { Component, OnInit, Input } from '@angular/core';
import { IJobDetails } from 'src/app/models/Job';

@Component({
  selector: 'app-job-list-item',
  templateUrl: './job-list-item.component.html',
  styleUrls: ['./job-list-item.component.scss'],
})
export class JobListItemComponent implements OnInit {

  @Input() jobItem: IJobDetails;
  constructor() { }

  ngOnInit() {}

  caculateDays() {
    const now = new Date(Date.now()).getTime();
    const updated = new Date(this.jobItem.updated).getTime();
    const diffTime = Math.abs(now - updated);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }
  navigateToJobDetails() {}
}

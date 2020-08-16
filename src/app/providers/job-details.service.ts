import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { IJobDetails } from '../models/Job';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {

  constructor(private _http: AuthHttp) { }

    // get job details by id
    public getJobDetails(id: number) {
      return this._http.get<IJobDetails>(`/api/jobs/${id}`);
    }
    // get jobs by city || country || region || sub-region (some or all)
    // get all jobs, send empty parameters 
    public getJobByParam(param: any) {
      return this._http.get(`/api/jobs/`, param);
    }
    
    public applyNow(jobDetails: number, userData: number) {
      return this._http.post(`/api/apply/`, {job: jobDetails, user: userData});
    }
}

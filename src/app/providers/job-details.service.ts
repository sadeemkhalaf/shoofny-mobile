import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { IJobDetails } from '../models/Job';
import { IDomainOfExperience } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class JobDetailsService {

  constructor(private _http: AuthHttp,
    private _networkService: NetworkService,
    private _storageService: StorageService) { }

    // domains of experience
    public getDomainsOfExperience() {
      return this._http.get<IDomainOfExperience[]>('/api/domains');
    }

    // get job details by id
    public getJobDetails(id: number) {
      return this._http.get<IJobDetails>(`/api/jobs/${id}`);
    }
    // get jobs by city
    public getJobByParam(param: any) {
      return this._http.get(`/api/jobs/`, param);
    }
    
    // get all jobs
    // countries
    // cities
    // regions
    // sub-regions
}

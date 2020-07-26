import { IUser, ICity, IDomainOfExperience, IYearsOfExperience, INationality } from './user';

export interface IJobDetails {
    id: number;
    user: IUser;
    slug: string;
    job_des: string;
    country: INationality;
    city: ICity;
    domains: IDomainOfExperience;
    level: IYearsOfExperience;
    tags: string[];
    timestamp: Date;
    updated: Date;
    job_title: string;
    Company_Name: string;
}

export interface ICountryCode {
    dial_code: string;
    name: string;
    alpha3Code: string;
    nativeName: string;
    callingCodes: string[];
    translations: string[];
}

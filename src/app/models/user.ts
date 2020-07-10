import { Token } from '../providers/auth.service';

export class IUser {
    id: number;
    first_name: string = '';
    last_name: string = '';
    email: string = '';
    username: string = '';
    DOB: Date;
    picture: string = '';
    video: string = '';
    Private: boolean = true;
    date_joined: Date;
    is_seeker: boolean;
    is_active: boolean;
    rating_avaerage: number;
    profile_views: number;
    gender: string = '';
    Job_in_City: number;
    city: ICity;
    nationality: INationality;
    DOEX: IDomainOfExperience;
    YOEX: IYearsOfExperience;
    tags: string[] = [];
    Public_Profile: string[] = [];
    token?: Token;

    IUser() {
        this.DOB = new Date('1/1/1990');
        this.YOEX = new IYearsOfExperience();
    }
}

export interface ICity {
    id: number;
    name: string;
    name_ascii: string;
    slug: string;
    geoname_id: any;
    alternate_names: string;
    display_name: string;
    search_names: string;
    latitude: number;
    longitude: number;
    population: number;
    feature_code: string;
    timezone: number;
    subregion: number;
    region: number;
    country: number;
}

export interface INationality {
    id: number;
    name: string;
    name_ascii: string;
    slug: string;
    geoname_id: any;
    alternate_names: string;
    code2: string;
    code3: string;
    continent: string;
    tld: string;
    phone: number;
    url: string;
}

export interface IDomainOfExperience {
    id: number;
    name_EN: string;
    name_ar: string;
    slug: string;
}

export class IYearsOfExperience {
    id: number;
    title: string;
    // year: string;
    IYearsOfExperience() {
        this.title = '0';
    }
}

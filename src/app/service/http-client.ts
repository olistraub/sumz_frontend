import { InjectionToken } from '@angular/core';
import axios from 'restyped-axios';
import { SumzAPI } from '../api/api';
import { environment } from '../../environments/environment';

// TODO: Ist das Best Practice?
export const HttpClient = new InjectionToken(
    'TypedAxiosInstance', {
        providedIn: 'root',
        factory: () => axios.create<SumzAPI>({ baseURL: environment.apiUrl }),
    });

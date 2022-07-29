import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private apiUrl = environment.apiUrl;
    private apiVersion = `${this.apiUrl}/api/v1`;

    constructor(private http: HttpClient) { }

    public get isLoggedIn(): boolean {
        return localStorage.getItem(environment.access_token) != null;
    }

    canRegis(request_data: any): Observable<any> {
        const httpOption = {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'userid': request_data,
            }
        };
        return this.http.get(`${this.apiVersion}/canRegis/`, httpOption);
    }




    register(request_data: any): Observable<any> {
        return this.http.post(`${this.apiVersion}/register`, request_data);
    }


}

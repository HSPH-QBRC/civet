import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }

  getSecureData(url: string): Observable<any> {
    const token = sessionStorage.getItem('AUTH_TOKEN');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}` // or 'Bearer' if your API expects Bearer tokens
    });
  
    return this.http.get(url, { headers });
  }

  postSecureData(url: string, body: string[]){
    let newObj = {
      "subject_list": body
    }
    return this.http.post(url, newObj);
  }
}

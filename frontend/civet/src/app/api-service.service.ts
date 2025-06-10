import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) { }

  // getSecureData(url: string) {
  //   // const url = 'https://dev-civet-api.tm4.org/api/subjects/';

  //   // // Use HttpClient to make a GET request
  //   return this.http.get(url);
  //   // const url = 'https://dev-civet-api.tm4.org/api/mt-dna/pl/cohort/';
  //   // let body = { "subject_list": ["SF183729", "LA193709", "UT170666", "SF183757", "MU160774", "WF120936", "LV200414", "UT172395", "MU160357", "UT173585", "WF122722", "UT173516", "NJ220265", "MU164388", "WF123814", "WF120440", "WF123088", "SF182830", "JH110070", "UA240388", "UT174582", "UT172987", "SF184032", "WF123107", "LA191082", "LA190094", "CU100215", "CU102720", "MU161540", "MU161916", "SF182331", "UT170604", "MU163703", "LA190249", "WF122221", "MU163377", "MU161897", "MU164473", "UA241105", "CU100068", "UI250139", "SF183871", "UI250521", "MU163497", "UT174207", "MU161382", "LA191910", "CU103008", "JH112419", "SF183180", "CU100419", "MU160095", "LA190221", "CU101366", "CU101865", "UA240441", "UT171072", "MU162383", "LA191457", "UT174002", "JH115664", "LA191580", "WF124698", "MU164306", "SF183358", "UA241025", "CU102985", "NJ221653", "MU161479", "WF120523", "CU101251", "CU100716", "WF122171", "CU104012", "MU164653", "JH111756", "LV200497", "NJ220058", "UI251042", "LA193290", "UT170539", "SF182429", "TE230278", "CU102869", "WF124036", "MU163655", "UA240677", "LA190420", "SF181387", "LA192100", "CU104271", "SF181924", "UA240612", "MU162369", "SF182261", "UT171200", "WF121879", "SF182013", "JH115739", "JH111255", "SF183256", "LA191388", "UT170148", "CU104315", "CU102496", "MU164705", "UT174047", "UI250230", "WF120975", "UT174180", "SF180691", "CU102300", "MU164013", "WF120678", "WF120137", "SF180899", "MU164294", "UT171132", "SF181262", "UT172689", "MU161211", "UI250598", "CU104066", "CU105095", "UA240539", "CU104857", "WF124393", "MU162439", "UA240054", "LA192596", "UI250263", "MU162617", "LA191902", "WF122528", "CU101030", "UT171769", "WF120176", "CU100180", "MU161704", "IA210577", "UT170891", "WF121143", "UA241017", "MU162661", "UI250860", "MU161128", "CU101854", "SF182327", "MU162301", "WF122126", "MU160949", "TE230484", "JH111153", "JH113680", "LA192293", "SF180413", "WF120834", "WF122673", "SF182744", "SF183734", "UT173835", "IA210097", "WF124980", "WF120502", "SF183790", "UT170902", "UT174289", "MU161321", "UI250325", "MU164699", "WF124097", "MU161447", "MU164082", "CU104260", "JH111791", "SF181318", "MU164049", "WF120646", "LA190943", "MU163559", "CU103352", "WF121060", "SF180222", "LV200134", "WF121915", "UT172866", "SF181637", "UI250675", "MU164524", "SF183263", "MU160460", "MU161295", "SF180380", "MU160329", "CU102777", "LA192873", "CU103971", "WF120081", "MW130151", "MU161586"] }
  //   // return this.http.post(url, body);
  // }

  getSecureData(url: string): Observable<any> {
    const token = sessionStorage.getItem('AUTH_TOKEN');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}` // or 'Bearer' if your API expects Bearer tokens
    });
  
    return this.http.get(url, { headers });
  }
  // getSecureData(url: string): Observable<any> {
  //   const token = localStorage.getItem('authToken');
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}` // changed from 'Token' to 'Bearer'
  //   });
  
  //   return this.http.get(url, { headers });
  // }

  postSecureData(url: string, body: string[]){
    let newObj = {
      "subject_list": body
    }
    return this.http.post(url, newObj);
  }
}

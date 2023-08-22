import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { throwError } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiServiceService } from '../api-service.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private apiService: ApiServiceService
  ) { }


  subtasks = [
    { name: 'Primary', completed: false, color: 'primary' },
    { name: 'Accent', completed: false, color: 'accent' },
    { name: 'Warn', completed: false, color: 'warn' },
  ]
  // username = 'saron';
  // password = 'SaronPass123';
  // subjectList = ["SF183729", "LA193709"];

  ngOnInit(): void {
    // this.authenticationService
    //   .login(this.username, this.password)
    //   .subscribe(
    //     data => {
    //       // const url = 'https://dev-civet-api.tm4.org/api/subjects/';
    //       const url = 'https://dev-civet-api.tm4.org/api/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY'
    //       this.apiService.getSecureData(url).subscribe(res => {
    //         console.log("secure data: ", res)
    //       })

    //     },
    //     error => {
    //       console.log("err: ", error)
    //     }
    //   );



  }

  updateAllComplete() {
    // console.log("update all")
  }



}

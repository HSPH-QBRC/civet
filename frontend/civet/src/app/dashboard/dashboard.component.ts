import { Component, OnInit, } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  receivedData: any;
  storageDS: any;

  constructor() { }

  ngOnInit(): void { }

  passData(data: any) {
    this.receivedData = data;
  }
}

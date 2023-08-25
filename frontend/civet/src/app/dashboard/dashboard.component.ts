import { Component, OnInit, } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  receivedData: any;
  storageDS: any;
  dataUR: any;

  constructor() { }

  ngOnInit(): void { }

  passDataSP(data: any) {
    this.receivedData = data;
  }

  passDataVP(data: any) {
    this.dataUR = data;
  }
}

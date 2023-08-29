import { Component, OnInit, ViewChild } from '@angular/core';
import { DataFilterComponent } from '../data-filter/data-filter.component'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DataFilterComponent) childComponent: DataFilterComponent;
  receivedData: any;
  storageDS: any;
  dataUR: any;
  dataVP2ndFilter: any;
  filterDataset: any;
  filterCategory = [];

  constructor() { }

  ngOnInit(): void { 
    
  }

  passDataSP(data: any) {
    this.receivedData = data;
  }

  passDataVP(data: any) {
    this.dataUR = data;

    // console.log("dataUR: ", this.dataUR, data)
  }

  passDataVP2ndFilter(data: any){
    
    if(this.dataVP2ndFilter === undefined){
      this.dataVP2ndFilter = []
    }
    
    this.dataVP2ndFilter[data.value] = data.data
    // console.log("new data: ", this.dataVP2ndFilter)
  }

  passDataFilterDataset(data: any) {
    this.filterDataset = data

    for (let cat in this.filterDataset['civet']) {
      this.filterCategory.push(cat)
    }
    
  }

  onFilterSelected(selectedValue: string) {
    let options = this.filterDataset['civet'][selectedValue]
    for(let option in options){
      let newString = `(${selectedValue}:${option})`;
      this.childComponent.addSecondFilter(newString, option); 
    }
    
  }

  getObjectValues(obj: any): any[] {
    return Object.values(obj);
  }

  
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataFilterComponent } from '../data-filter/data-filter.component';
import { ApiServiceService } from '../api-service.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DataFilterComponent) childComponent: DataFilterComponent;
  private readonly API_URL = environment.API_URL;
  receivedData: any;
  storageDS: any;
  dataUR: any;
  dataVP2ndFilter: any;
  filterDataset: any;
  filterCategory = [];
  dataDictionary = {};
  selectedCategory = ''
  isLoading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiServiceService,
  ) { }

  username = environment.username;
  password = environment.password;

  dataDict = {} //this will be the real dictionary
  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']
  currentCategories = []; //Won't need this in the future when we load all categories

  ngOnInit(): void {
    this.isLoading = true;
    this.authenticationService
      .login(this.username, this.password)
      .subscribe(
        data => {
          const url = `${this.API_URL}/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY`
          this.apiService.getSecureData(url).subscribe(res => {
            // this.dataReady = true
            this.isLoading = false
            this.childComponent.initializeFilterData(['civet'])
            // this.initializeFilterData(['civet']);
          })

          let dd_url = 'https://dev-civet-api.tm4.org/api/subject-dictionary/';
          this.apiService.getSecureData(dd_url).subscribe(res => {
            for (let item in res) {
              const unformattedString = res[item]['VALUES']
              const lines = unformattedString.split('\n');
              let dictObj = {}
              for (const line of lines) {
                const [key, value] = line.split('=');
                let newKey = !isNaN(key) && !this.dataDictExclude.includes(item) ? key + '.0' : key
                dictObj[newKey] = value;
              }
              this.dataDict[item] = dictObj
            }
            // this.dataDictionaryShare.emit(this.dataDict);
            this.createFilterDataset(res)
          })
        },
        error => {
          console.log("err: ", error)
        }
      );
  }

  passDataSP(data: any) {
    this.receivedData = data;
  }

  passDataVP(data: any) {
    this.dataUR = data;
  }

  passDataVP2ndFilter(data: any) {
    if (this.dataVP2ndFilter === undefined) {
      this.dataVP2ndFilter = []
    }
    this.dataVP2ndFilter[data.value] = data.data
  }

  passDataFilterDataset(data: any) {
    this.filterDataset = data;
    for (let cat in this.filterDataset['civet']) {
      this.currentCategories.push(cat)
    }
  }
  createFilterDataset(data) {
    for (let cat in data) {
      let valueType = data[cat]['VALUE TYPE'];
      if (valueType === 'Categorical' && this.currentCategories.includes(cat)) {
        this.filterCategory.push(cat)
      }
    }
  }

  onFilterSelected(selectedValue: string) {
    let options = this.filterDataset['civet'][selectedValue];
    for (let option in options) {
      let newString = `(${selectedValue}:${option})`;
      this.selectedCategory = selectedValue;
      this.childComponent.addSecondFilter(newString, option);
    }
  }

  getObjectValues(obj: any): any[] {
    return Object.values(obj);
  }

  shareDataDictionary(data) {
    this.dataDictionary = data
  }
}

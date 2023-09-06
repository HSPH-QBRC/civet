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
  dataSP2ndFilter: any;
  filterDataset: any;
  filterCategory = [];
  dataDictionary = {};
  selectedCategory = ''
  isLoading = false;
  numberOfBins = '60';

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiServiceService,
  ) { }

  username = environment.username;
  password = environment.password;

  dataDict = {} //this will be the real dictionary
  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']
  currentCategories = []; //Won't need this in the future when we load all categories

  minViolinplot = Number.MAX_SAFE_INTEGER;
  maxViolinplot = Number.MIN_SAFE_INTEGER;
  minScatterplot = Number.MAX_SAFE_INTEGER;
  maxScatterplot = Number.MIN_SAFE_INTEGER;
  maxNum = 0;

  ngOnInit(): void {
    this.isLoading = true;
    this.authenticationService
      .login(this.username, this.password)
      .subscribe(
        response => {
          const url = `${this.API_URL}/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY`
          this.apiService.getSecureData(url).subscribe(res => {
            this.isLoading = false
            this.childComponent.initializeFilterData(['civet'])
          })

          let dd_url = 'https://dev-civet-api.tm4.org/api/subject-dictionary/';
          this.apiService.getSecureData(dd_url).subscribe(res => {
            this.isLoading = false;
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
    this.getMaxNum('main')
  }

  passDataVP2ndFilter(data: any) {
    if (this.dataVP2ndFilter === undefined) {
      this.dataVP2ndFilter = []
    }

    for (let i in data.data) {
      for (let j in data.data[i]) {
        let currentValue = data.data[i][j]
        this.minViolinplot = Math.min(this.minViolinplot, currentValue)
        this.maxViolinplot = Math.max(this.maxViolinplot, currentValue)
      }
    }

    this.dataVP2ndFilter[data.value] = data.data
    this.getMaxNum(data.value)
  }

  passDataSP2ndFilter(data: any) {
    if (this.dataSP2ndFilter === undefined) {
      this.dataSP2ndFilter = []
    }

    for (let i in data.data) {
      for (let j in data.data[i]) {
        let currentValue = data.data[i][j]
        this.minScatterplot = Math.min(this.minScatterplot, currentValue)
        this.maxScatterplot = Math.max(this.maxScatterplot, currentValue)
      }
    }

    this.dataSP2ndFilter[data.value] = data.data
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

  getMaxNum(plotNum) {
    let tempMin = Number.MAX_SAFE_INTEGER
    let tempMax = Number.MIN_SAFE_INTEGER
    let number_of_bins = parseInt(this.numberOfBins)
    let tempArr = [];

    if (plotNum === 'main') {
      for (let i in this.dataUR) {
        for (let j in this.dataUR[i]) {
          let value = this.dataUR[i][j];
          tempMin = Math.min(tempMin, value)
          tempMax = Math.max(tempMax, value)
          tempArr.push(value)
        }
      }
    } else {
      for (let i in this.dataVP2ndFilter[plotNum]) {
        for (let j in this.dataVP2ndFilter[plotNum][i]) {
          let value = this.dataVP2ndFilter[plotNum][i][j];
          tempMin = Math.min(tempMin, value)
          tempMax = Math.max(tempMax, value)
          tempArr.push(value)
        }
      }
    }


    const bins = Array(20).fill(0);
    const binSize = (tempMax - tempMin) / number_of_bins;
    let largestBin = 0;

    for (const number of tempArr) {
      const binIndex = Math.floor(number / binSize);
      bins[binIndex]++;
      if (bins[binIndex] > bins[largestBin]) {
        largestBin = binIndex;
      }
    }

    this.maxNum = Math.max(this.maxNum, bins[largestBin])
  }

  onNumberBinsSelected(event) {
    this.maxNum = -10000;
    this.numberOfBins = event

    //Checks for largest bin size from the main plot and the secondary violin plots
    this.getMaxNum('main')
    if (this.dataVP2ndFilter) {
      for (let index in this.dataVP2ndFilter) {
        this.getMaxNum(index)
      }
    }

  }
}

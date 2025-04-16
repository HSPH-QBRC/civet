import { Component, OnInit, ViewChild, ElementRef, Renderer2, } from '@angular/core';
import { DataFilterComponent } from '../data-filter/data-filter.component';
import { ApiServiceService } from '../api-service.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(DataFilterComponent) childComponent: DataFilterComponent;
  private readonly API_URL = environment.API_URL;
  dataPl: any;
  storageDS: any;
  dataUR: any;
  dataVP2ndFilter: any;
  dataSP2ndFilter: any;
  filterDataset: any;
  filterCategory = [];
  dataDictionary = {};
  selectedCategory = ''
  isLoading = false;
  numberOfBins = '40';
  dataType = {}

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiServiceService,
    private el: ElementRef,
    // private renderer: Renderer2
    private router: Router,
    private httpClient: HttpClient
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

  sliderValue = 40;
  sliderOptions = {
    floor: 20,
    ceil: 100,
    step: 10,
    showTicks: true,
  };

  numericSlidervalue = 2;
  numericSliderOptions = {
    floor: 1,
    ceil: 5,
    step: 1,
    showTicks: true,
  };

  selected1stCategory = 'AGE_DERV_V1';
  selected2ndCategory = 'BMI_CM_V1';

  // ngOnInit(): void {
  //   this.isLoading = true;
  //   this.authenticationService
  //     .login(this.username, this.password)
  //     .subscribe(
  //       response => {
  //         const url = `${this.API_URL}/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY`
  //         this.apiService.getSecureData(url).subscribe(res => {
  //           this.isLoading = false
  //           this.childComponent.initializeFilterData(['civet'])
  //         })

  //         let dd_url = `${this.API_URL}/subject-dictionary/`;
  //         this.apiService.getSecureData(dd_url).subscribe(res => {
  //           this.isLoading = false;
  //           for (let item in res) {
  //             const unformattedString = res[item]['VALUES']
  //             const lines = unformattedString.split('\n');
  //             let dictObj = {}
  //             for (const line of lines) {
  //               const [key, value] = line.split('=');
  //               let newKey = !isNaN(key) && !this.dataDictExclude.includes(item) ? key + '.0' : key
  //               dictObj[newKey] = value;
  //             }
  //             this.dataDict[item] = dictObj;
  //             this.dataType[item] = res[item]['VALUE TYPE']
  //           }
  //           this.createFilterDataset(res)
  //           // this.childComponent.getSubjectIds()
  //         })

  //       },
  //       error => {
  //         console.log("err: ", error)
  //       }
  //     );
  // }

  ngOnInit() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
      this.router.navigate(['/login']); // not logged in
      return;
    } else {
      this.loadSubjectQuery();
      this.loadSubjectDictionary();
    }



  }

  loadSubjectQuery() {
    const url = `${this.API_URL}/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY`;
    this.apiService.getSecureData(url).subscribe(res => {
      // this.getQueryResults(url).subscribe(res => {
      this.isLoading = false;
      this.childComponent.initializeFilterData(['civet']);
    });

  }

  loadSubjectDictionary() {
    const dd_url = `${this.API_URL}/subject-dictionary/`;
    this.apiService.getSecureData(dd_url).subscribe(res => {
      // this.getQueryResults(dd_url).subscribe(res => {
      this.isLoading = false;
      for (let item in res) {
        const unformattedString = res[item]['VALUES'];
        const lines = unformattedString.split('\n');
        let dictObj = {};
        for (const line of lines) {
          const [key, value] = line.split('=');
          let newKey = !isNaN(key) && !this.dataDictExclude.includes(item) ? key + '.0' : key;
          dictObj[newKey] = value;
        }
        this.dataDict[item] = dictObj;
        this.dataType[item] = res[item]['VALUE TYPE'];
      }
      this.createFilterDataset(res);
    });
  }

  // getQueryResults(queryString) {
  //   return this.httpClient.get(queryString)
  //     .pipe(
  //       catchError(error => {
  //         let message = `Error: ${error.error.error}`
  //         console.log("err: ", message)
  //         throw error;
  //       }))
  // }

  passDataSP(data: any) {
    this.dataPl = data;
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

    this.dataSP2ndFilter[data.value] = data.data;
  }

  passDataFilterDataset(data: any) {
    this.filterDataset = data;
    for (let cat in this.filterDataset['civet']) {
      this.currentCategories.push(cat)
    }
  }

  customPlotData = {}
  filteredDataForCustomPlot = {}

  passCustomPlotData(data: any) {
    this.customPlotData = {};
    this.filteredDataForCustomPlot = data;
    if (this.dataType[this.selected1stCategory] === 'Continuous' && this.dataType[this.selected2ndCategory] === 'Continuous') {
      // use scatter plot
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndCategory]) {
          let key = data[index]['SUBJID']
          let temp = {
            xValue: data[index][this.selected1stCategory][0],
            yValue: data[index][this.selected2ndCategory][0]
          }
          this.customPlotData[key] = temp
        }
      }
    } else if ((this.dataType[this.selected1stCategory] === 'Categorical' && this.dataType[this.selected2ndCategory] === 'Continuous') || (this.dataType[this.selected1stCategory] === 'Continuous' && this.dataType[this.selected2ndCategory] === 'Categorical')) {
      // use violin plot
      this.customPlotData = {};
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndCategory]) {
          let categoryName = '';
          let numericName = '';
          if (this.dataType[this.selected1stCategory] === 'Categorical') {
            categoryName = this.selected1stCategory;
            numericName = this.selected2ndCategory;
          } else {
            categoryName = this.selected2ndCategory;
            numericName = this.selected1stCategory;
          }

          let key = data[index]['SUBJID']
          let cat = data[index][categoryName]
          let num = data[index][numericName]

          let temp = {}
          temp[cat] = num;

          this.customPlotData[key] = temp
        }
      }

    } else if (this.dataType[this.selected1stCategory] === 'Categorical' && this.dataType[this.selected2ndCategory] === 'Categorical') {
      //use heat map
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndCategory]) {
          let key = data[index]['SUBJID'];
          let temp = {
            xValue: data[index][this.selected1stCategory][0],
            yValue: data[index][this.selected2ndCategory][0]
          }
          this.customPlotData[key] = temp
        }
      }

    } else {
      console.log("Data type didn't match. Please check logs.")
    }
  }

  customPlotData2ndFilter = {}
  filteredDataForCustomPlot2ndFilter = {}
  dataCP2ndFilter = {}
  passCustomPlotData2ndFilter(event: any) {

    let [data, val] = event;
    this.customPlotData2ndFilter = {};
    this.filteredDataForCustomPlot2ndFilter = data;
    if (this.dataType[this.selected1stCategory] === 'Continuous' && this.dataType[this.selected2ndFilterCategory] === 'Continuous') {
      // use scatter plot
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndFilterCategory]) {
          let key = data[index]['SUBJID']
          let temp = {
            xValue: data[index][this.selected1stCategory][0],
            yValue: data[index][this.selected2ndFilterCategory][0]
          }
          this.customPlotData2ndFilter[key] = temp
        }
      }
    } else if ((this.dataType[this.selected1stCategory] === 'Categorical' && this.dataType[this.selected2ndFilterCategory] === 'Continuous') || (this.dataType[this.selected1stCategory] === 'Continuous' && this.dataType[this.selected2ndFilterCategory] === 'Categorical')) {
      // use violin plot
      this.customPlotData2ndFilter = {};
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndFilterCategory]) {
          let categoryName = '';
          let numericName = '';
          if (this.dataType[this.selected1stCategory] === 'Categorical') {
            categoryName = this.selected1stCategory;
            numericName = this.selected2ndFilterCategory;
          } else {
            categoryName = this.selected2ndFilterCategory;
            numericName = this.selected1stCategory;
          }

          let key = data[index]['SUBJID']
          let cat = data[index][categoryName]
          let num = data[index][numericName]

          let temp = {}
          temp[cat] = num;

          this.customPlotData2ndFilter[key] = temp
        }
      }

    } else if (this.dataType[this.selected1stCategory] === 'Categorical' && this.dataType[this.selected2ndFilterCategory] === 'Categorical') {
      //use heat map
      for (let index in data) {
        if (data[index][this.selected1stCategory] && data[index][this.selected2ndFilterCategory]) {
          let key = data[index]['SUBJID'];
          let temp = {
            xValue: data[index][this.selected1stCategory][0],
            yValue: data[index][this.selected2ndFilterCategory][0]
          }
          this.customPlotData2ndFilter[key] = temp
        }
      }

    } else {
      console.log("Data type didn't match. Please check logs.")
    }
    this.dataCP2ndFilter[val] = this.customPlotData2ndFilter
  }

  currentSliderCategories = []
  passSliderDataset(data) {
    for (let numeric in data['civet']) {
      this.currentSliderCategories.push(numeric)
    }
  }

  createFilterDataset(data) {
    for (let cat in data) {
      // let valueType = data[cat]['VALUE TYPE'];
      // if (valueType === 'Categorical' && this.currentCategories.includes(cat)) {
      //   this.filterCategory.push(cat)
      // }
      if (this.currentCategories.includes(cat) || this.currentSliderCategories.includes(cat)) {
        this.filterCategory.push(cat)
      }
    }
  }

  selected2ndFilterCategory = ''
  showNumericSlider = false;
  onFilterSelected(selectedValue: string) {
    this.selected2ndFilterCategory = selectedValue;
    let options = this.filterDataset['civet'][selectedValue];
    for (let option in options) {
      let newString = `(${selectedValue}:${option})`;
      this.selectedCategory = selectedValue;
      this.childComponent.addSecondFilter(newString, option, this.selected2ndFilterCategory, 1);
    }
    if (options === undefined) { //numerical categories would return undefined here
      this.showNumericSlider = true;
      let newString = '*'
      this.childComponent.addSecondFilter(newString, 'numeric', this.selected2ndFilterCategory, this.numericSlidervalue);
    }

    this.scrollToID('anotherFilter')
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

  onNumberBinsSelectedNumeric(bins) {
    this.dataCP2ndFilter = {};
    this.numericSlidervalue = bins
    this.onFilterSelected(this.selected2ndFilterCategory)

  }

  showCustomPlots = false
  updatePlots() {
    this.showCustomPlots = true
    this.passCustomPlotData(this.filteredDataForCustomPlot)
    this.scrollToID('a2ndFilter')
  }

  isNotEmpty(obj) {
    if (Object.keys(obj).length > 0) {
      return true
    } else {
      return false
    }
  }

  onCategoryChange() {
    this.customPlotData = {}
  }

  showSummaryPlot = false;
  dataBarChart = {}
  dataHistogram = {}
  displaySummaryPlots(category) {
    this.showSummaryPlot = true;

    if (this.dataType[category] === 'Categorical') {
      for (let index in this.filteredDataForCustomPlot) {
        if (this.filteredDataForCustomPlot[index][category]) {
          let subjectID = this.filteredDataForCustomPlot[index]['SUBJID']
          let key = this.filteredDataForCustomPlot[index][category][0]
          let temp = {}
          temp[key] = 1
          this.dataBarChart[subjectID] = temp
        }
      }
    } else {
      for (let index in this.filteredDataForCustomPlot) {
        if (this.filteredDataForCustomPlot[index][category]) {
          let subjectID = this.filteredDataForCustomPlot[index]['SUBJID']
          let key = this.filteredDataForCustomPlot[index][category][0]
          let temp = {}
          temp['test'] = key
          this.dataHistogram[subjectID] = temp
        }
      }
    }

    this.scrollToID('summaryPlots')
  }

  scrollToID(id) {
    const element = this.el.nativeElement.querySelector('#' + id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}



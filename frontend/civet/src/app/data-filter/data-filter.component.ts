import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { ApiServiceService } from '../api-service.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';
// import * as dataDictionary from './data_dictionary'

@Component({
  selector: 'app-data-filter',
  templateUrl: './data-filter.component.html',
  styleUrls: ['./data-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DataFilterComponent implements OnInit {
  @Output() subjectIdEventSP = new EventEmitter<any>();
  @Output() subjectIdEventVP = new EventEmitter<any>();
  @Output() subjectIdEventVP2ndFilter = new EventEmitter<any>();
  @Output() subjectIdEventSP2ndFilter = new EventEmitter<any>();
  @Output() filterDataset = new EventEmitter<any>();
  // @Output() dataDictionaryShare = new EventEmitter<any>(); 

  @Input() dataDict = {}
  @Output() emitStorageDS = new EventEmitter<any>();

  private readonly API_URL = environment.API_URL;
  currentDataset: string = 'civet';
  queryStringForFilters: string = '';
  queryRangeString: string = '';
  filterItems = {};
  filterRangeItems = {};
  facetField;
  searchQueryResults: string = "";
  checkBoxItems = [];
  isLoading: boolean = false;

  civetFields = ["GENDER", "ETHNICITY", "RACE", "DEM02_V1", "DEM03_V1", "DEM04_V1", "SITE", "ASTHMA_CHILD_V1", "ASTHMA_DX_V1", "DIABETES_DERV_V1", "CURRENT_SMOKER_V1", "STRATUM_ENROLLED", "WT_KG_V1", "BETA_BLOCKER_V1", "BMH08I_V1", "BMH08H_V1", "BMH08B_V1", "DATE_V1", "DATE_V2", "DATE_V3", "DATE_V4"]
  civetRangeFields = ["AGE_DERV_V1", "BMI_CM_V1", "BMI_CM_V2", "WT_KG_V1"]
  advanceFields = ["cog_renal_stage", "dbgap_accession_number", "morphology", "disease_type", "primary_site", "site_of_resection_or_biopsy", "days_to_last_follow_up", "ajcc_pathologic_m", "ajcc_pathologic_n", "ajcc_pathologic_t", "ajcc_staging_system_edition", "alcohol_history", "icd_10_code", "synchronous_malignancy", "age_at_index", "days_to_birth", "year_of_birth", "year_of_diagnosis", "nucleic_acid_isolation_batch", "expression_batch", "collection_site_code", "rna_rin", "Center_QC_failed", "Item_flagged_DNU", "Item_Flagged_Low_Quality"];
  filterFields = {
    'civet': this.civetFields
  }
  filterRangeFields = {
    'civet': this.civetRangeFields
  };
  sliderStorage = {
    'civet': {
      "AGE_DERV_V1": {
        "count": 2973,
        "floor": 40,
        "ceil": 80,
        "low": 40,
        "high": 80,
        "not_reported": true
      },
      "BMI_CM_V1": {
        "count": 5,
        "floor": 41,
        "ceil": 80,
        "low": 13,
        "high": 41,
        "not_reported": true
      },
      "BMI_CM_V2": {
        "count": 31,
        "floor": 13,
        "ceil": 48,
        "low": 13,
        "high": 48,
        "not_reported": true
      },
      "WT_KG_V1": {
        "count": 1490,
        "floor": 37,
        "ceil": 144,
        "low": 37,
        "high": 144,
        "not_reported": true
      },
    },
  }
  myObject: any = { name: 'John', age: 30 };
  storageDataSet = {};
  //checkbox object keeps track of which items are checked
  checkBoxObj = {};
  //checkbox status keeps track of every checkbox for true/false values
  checkboxStatus = {}
  altStorage = {}
  displayAdvance: boolean = false;
  excludeList: string[] = [];
  mainQuery: string = "*";
  showMoreStorage = {};

  constructor(
    fb: FormBuilder,
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private apiService: ApiServiceService,
    private cdRef: ChangeDetectorRef,
  ) { }

  username = environment.username;
  password = environment.password;

  // dataReady = false
  // dataDictionary = {} //pass this on to checkbox

  // dataDict = {} //this will be the real dictionary
  dataDictExclude = ['GENDER', 'RACE', 'STRATUM_ENROLLED']

  ngOnInit(): void {
    // this.dataDictionary = dataDictionary.data_dictionary
    // this.isLoading = true;
    // this.authenticationService
    //   .login(this.username, this.password)
    //   .subscribe(
    //     data => {
    //       const url = `${this.API_URL}/subject-query/?q=GENDER:2&q.op=AND&facet=true&facet.field=ETHNICITY`
    //       this.apiService.getSecureData(url).subscribe(res => {
    //         this.dataReady = true
    //         this.isLoading = false
    //         this.initializeFilterData(['civet']);
    //       })

    //       let dd_url = 'https://dev-civet-api.tm4.org/api/subject-dictionary/';
    //       this.apiService.getSecureData(dd_url).subscribe(res => {
    //         for(let item in res){
    //           const unformattedString = res[item]['VALUES']
    //           const lines = unformattedString.split('\n');
    //           let dictObj = {}
    //           for (const line of lines) {
    //             const [key, value] = line.split('=');
    //             let newKey = !isNaN(key) && !this.dataDictExclude.includes(item) ? key + '.0' : key
    //             dictObj[newKey] = value;
    //           }
    //           this.dataDict[item] = dictObj
    //         }
    //         this.dataDictionaryShare.emit(this.dataDict);
    //       })
    //     },
    //     error => {
    //       console.log("err: ", error)
    //     }
    //   );
  }

  initializeFilterData(activeSets: string[]) {
    let dataset = activeSets[0]
    // for (let dataset of activeSets) {
    this.createRangeDataStorage(dataset);
    //builds the initial query string
    this.queryStringForFilters = this.getFacetFieldQuery(dataset);
    this.createAltQuery(dataset)

    if (!this.storageDataSet[dataset]) {
      this.storageDataSet[dataset] = {}
    }
    if (!this.checkboxStatus[dataset]) {
      this.checkboxStatus[dataset] = {}
    }
    //gets the numbers for each category
    this.updateFilterValues(this.queryStringForFilters, this.checkboxStatus[dataset], dataset, true);
    // }
  }

  createRangeDataStorage(dataset) {
    let categoryArray = this.filterRangeFields[dataset];
    let query = `${this.API_URL}/subject-query/?q=*&stats=true`;
    for (let i = 0; i < categoryArray.length; i++) {
      query += `&stats.field={!tag=piv1,piv2 min=true max=true}${categoryArray[i]}`
    }
    this.getQueryResults(query)
      .subscribe(res => {
        let stats_field = res["stats"]["stats_fields"];
        for (let cat in stats_field) {
          if (!this.sliderStorage[dataset]) {
            this.sliderStorage[dataset] = {};
          }
          this.sliderStorage[dataset][cat] = {
            "count": 0,
            "floor": stats_field[cat]["min"],
            "ceil": stats_field[cat]["max"],
            "low": stats_field[cat]["min"],
            "high": stats_field[cat]["max"],
            "not_reported": true
          }
        }
      })
  }

  getFacetFieldQuery(dataset) {
    let categoryArray = this.filterFields[dataset]
    let query = `${this.API_URL}/subject-query/?q=*&facet=true`;
    for (let i = 0; i < categoryArray.length; i++) {
      query += "&facet.field=" + categoryArray[i];
    }
    let categoryArrayRange = this.filterRangeFields[dataset]

    let rangeQuery = '';
    for (let k = 0; k < categoryArrayRange.length; k++) {
      let category = categoryArrayRange[k];
      let low = this.sliderStorage[dataset][category]['low'];
      let high = this.sliderStorage[dataset][category]['high'];
      rangeQuery += `&facet.query={!tag=q1}${category}:[${low} TO ${high}]`
    }
    query += rangeQuery;
    return query;
  }

  addSearchQuery(dataset, filterItems) {
    let categoryArrayRange = this.filterRangeFields[dataset]
    let rangeQuery = '';
    let missingRangeQuery = '';
    for (let k = 0; k < categoryArrayRange.length; k++) {
      let category = categoryArrayRange[k];
      let low = this.sliderStorage[dataset][category]['low'];
      let high = this.sliderStorage[dataset][category]['high'];
      rangeQuery += `&facet.query={!tag=q1}${category}:[${low} TO ${high}]`;
      missingRangeQuery += (missingRangeQuery.length === 0) ? `(* -${category}:*)` : ` OR (* -${category}:*)`;
    }

    let categoryArray = this.filterFields[dataset];
    let tempQuery = filterItems.length === 0 ? (missingRangeQuery.length === 0 ? '*' : missingRangeQuery) : `${filterItems}`;
    let query = `${this.API_URL}/subject-query/?q=${tempQuery}&facet=true`;

    for (let i = 0; i < categoryArray.length; i++) {
      query += "&facet.field=" + categoryArray[i];
    }
    this.mainQuery = tempQuery;
    query += rangeQuery;
    return query;
  }

  getQueryResults(queryString) {
    return this.httpClient.get(queryString)
      .pipe(
        catchError(error => {
          let message = `Error: ${error.error.error}`
          console.log("err: ", message)
          throw error;
        }))
  }

  updateFilterValues(query, checkboxStatus, dataset, initializeCheckbox) {
    this.getQueryResults(query)
      .subscribe(res => {
        this.facetField = res['facet_counts']['facet_fields'];
        for (let category in this.facetField) {
          let arr = this.facetField[category]
          let checkboxStatusObj = {}; //this is for checkbox status
          this.storageDataSet[dataset][category] = [];
          if (!this.altStorage[dataset]) {
            this.altStorage[dataset] = {}
          }
          if (!this.altStorage[dataset][category]) {
            this.altStorage[dataset][category] = {
              "altQuery": '',
              "data": []
            };
          }
          if (!this.checkBoxObj[dataset][category]) {
            this.altStorage[dataset][category]["data"] = [];
          }
          if (initializeCheckbox) {
            for (let j = 0; j < arr.length; j += 2) {
              let countObj = {};
              countObj[arr[j]] = arr[j + 1];
              checkboxStatusObj[arr[j]] = false;
              this.storageDataSet[dataset][category].push(countObj);
              checkboxStatus[category] = checkboxStatusObj;
              if (!this.checkBoxObj[dataset][category]) {
                this.altStorage[dataset][category]["data"].push(countObj);
              }
            }

          } else {
            for (let i = 0; i < arr.length; i += 2) {
              let countObj = {};
              countObj[arr[i]] = arr[i + 1];

              //if it does exist, look for that id and replace, else just add it
              this.storageDataSet[dataset][category].push(countObj);

              ///need to remove items from the array before pushing them
              if (!this.checkBoxObj[dataset][category]) {
                this.altStorage[dataset][category]["data"].push(countObj);
              }
            }
          }
        }
        //for the range queries only
        let facet_queries = res["facet_counts"]["facet_queries"];
        for (let item in facet_queries) {
          let indexOfColon = item.indexOf(':')
          let category = item.slice(9, indexOfColon)
          let count = res["facet_counts"]['facet_queries'][item];
          this.sliderStorage[dataset][category]['count'] = count;
        }
        this.emitStorageDS.emit(this.storageDataSet);
      })
  }

  onChecked(isChecked, category, subcategory, dataset) {
    if (!this.checkBoxObj[dataset]) {
      this.checkBoxObj[dataset] = {};
    }
    let newQueryItem = `${category}:"${subcategory}"`;
    if (isChecked) {
      if (!this.checkBoxObj[dataset][category]) {
        this.checkBoxObj[dataset][category] = [];
      }
      this.checkBoxObj[dataset][category].push(newQueryItem);
      this.checkboxStatus[dataset][category][subcategory] = true;

    } else if (!isChecked) {
      this.checkBoxObj[dataset][category] = this.checkBoxObj[dataset][category].filter(item => item !== newQueryItem);
      if (this.checkBoxObj[dataset][category].length === 0) {
        delete this.checkBoxObj[dataset][category]
      }
      this.checkboxStatus[dataset][category][subcategory] = false
    }
    this.createAltQuery(dataset);
    this.filterData(dataset);
    this.cdRef.detectChanges();
  }

  onNotReportedChecked(result) {
    let temp = result.dataset + "_" + result.cat;
    if (result.checked === false) {
      this.excludeList.push(temp)
    } else {
      this.excludeList = this.excludeList.filter(item => item !== temp)
    }
    this.createAltQuery(result.dataset);
    this.filterData(result.dataset);
  }

  createAltQuery(dataset) {
    if (!this.checkBoxObj[dataset]) {
      this.checkBoxObj[dataset] = {}
    }
    for (let mainCat in this.checkBoxObj[dataset]) {
      let newQueryString = '';
      for (let cat in this.checkBoxObj[dataset]) {
        if (this.checkBoxObj[dataset][cat].length > 0 && cat !== mainCat) {
          let temp = "(" + this.checkBoxObj[dataset][cat].join(' OR ') + ")"
          if (newQueryString.length > 0) {
            newQueryString += " AND " + temp;
          } else {
            newQueryString += temp;
          }
        }
      }
      //add query from range here before passing it on to updateFacet
      let rangeQuery = '';
      let missingRangeQuery = '';
      for (let cat in this.sliderStorage[dataset]) {
        let data = this.sliderStorage[dataset][cat]
        let temp = `${cat}:[${data["low"]} TO ${data["high"]}]`;
        if (rangeQuery.length > 0) {
          rangeQuery += " AND " + temp;
        } else {
          rangeQuery += temp;
        }
        let temp2 = dataset + "_" + cat;
        if (!this.excludeList.includes(temp2)) {
          if (missingRangeQuery.length === 0) {
            missingRangeQuery += `(* -${cat}:*)`
          } else {
            missingRangeQuery += ` OR (* -${cat}:*)`
          }
        }
      }

      rangeQuery = (missingRangeQuery.length === 0) ? `(${rangeQuery})` : `(${rangeQuery}) OR (${missingRangeQuery})`;
      if (this.filterRangeFields[dataset].length === 0) {
        this.searchQueryResults = (newQueryString.length > 0) ? `${newQueryString}` : '';
      } else {
        this.searchQueryResults = (newQueryString.length > 0) ? `${newQueryString} AND ${rangeQuery}` : rangeQuery;
      }
      let tempQuery = this.searchQueryResults.length === 0 ? '*' : this.searchQueryResults;
      let query = `${this.API_URL}/subject-query/?q=${tempQuery}&facet=true`;
      query += "&facet.field=" + mainCat;

      if (!this.altStorage[dataset][mainCat]) {
        this.altStorage[dataset][mainCat] = {};
      }
      this.altStorage[dataset][mainCat]["altQuery"] = query;


    }
    for (let cat in this.altStorage[dataset]) {
      this.isLoading = true;
      let query = this.altStorage[dataset][cat]['altQuery'];
      if (query.length > 0) {
        this.getQueryResults(query)
          .subscribe(res => {
            this.isLoading = false;
            this.facetField = res['facet_counts']['facet_fields'];
            for (let subcat in this.facetField) {
              let arr = this.facetField[cat];
              let temp: Array<{}> = [];
              for (let i = 0; i < arr.length; i += 2) {
                let obj = {};
                obj[arr[i]] = arr[i + 1];
                temp.push(obj);
              }
              this.altStorage[dataset][cat]["data"] = temp;
            }
          })
      }
      this.isLoading = false;
    }
  }

  setSliderValue(value) {
    let dataset = value['dataset']
    let cat = value['category']
    this.sliderStorage[dataset][cat]['low'] = value['low'];
    this.sliderStorage[dataset][cat]['high'] = value['high'];
    this.filterData(dataset)
  }

  filterData(dataset) {
    let newQueryString = '';
    for (let cat in this.checkBoxObj[dataset]) {
      if (this.checkBoxObj[dataset][cat].length > 0) {
        let temp = "(" + this.checkBoxObj[dataset][cat].join(' OR ') + ")"
        if (newQueryString.length > 0) {
          newQueryString += " AND " + temp;
        } else {
          newQueryString += temp;
        }
      }
    }
    //add query from range here before passing it on to updateFacet
    let rangeQuery = '';
    for (let cat in this.sliderStorage[dataset]) {
      let data = this.sliderStorage[dataset][cat]
      let excludeString = dataset + "_" + cat;
      let temp = this.excludeList.includes(excludeString) ? `(${cat}:[${data["low"]} TO ${data["high"]}])` : `(${cat}:[${data["low"]} TO ${data["high"]}] OR (* -${cat}:*))`;

      if (rangeQuery.length > 0) {
        rangeQuery += " AND " + temp;
      } else {
        rangeQuery += temp;
      }
    }
    rangeQuery = `(${rangeQuery})`;
    //This deals with the case where for TCGA Methylation where there are no range filter
    if (this.filterRangeFields[dataset].length === 0) {
      this.searchQueryResults = (newQueryString.length > 0) ? `${newQueryString}` : '';

    } else {
      this.searchQueryResults = (newQueryString.length > 0) ? `${newQueryString} AND ${rangeQuery}` : rangeQuery;
    }
    let temp = this.addSearchQuery(this.currentDataset, this.searchQueryResults)
    this.updateFilterValues(temp, this.checkboxStatus[dataset], dataset, false)
  }

  onDisplayAdvance() {
    this.displayAdvance = !this.displayAdvance;
  }

  setDataset(datasetTag: string) {
    this.currentDataset = datasetTag;
  }

  backToBrowse() {
    this.currentDataset = '';
    this.searchQueryResults = '';
    this.isLoading = false;

    this.checkBoxObj = {};
    // this.altStorage = {};
    this.mainQuery = '*';

    this.resetVariables()
  }

  resetVariables() {
    this.filteredSubjectId = []

    //reset storage to default
    for (let dataset in this.sliderStorage) {
      for (let cat in this.sliderStorage[dataset]) {
        this.sliderStorage[dataset][cat]["low"] = this.sliderStorage[dataset][cat]["floor"];
        this.sliderStorage[dataset][cat]["high"] = this.sliderStorage[dataset][cat]["ceil"];
      }
    }
    //reset checkbox values to false
    for (let dataset in this.checkboxStatus) {
      for (let cat in this.checkboxStatus[dataset]) {
        for (let subcat in this.checkboxStatus[dataset][cat]) {
          if (this.checkboxStatus[dataset][cat][subcat] === true) {
            this.checkboxStatus[dataset][cat][subcat] = false;
          }
        }
      }
    }
  }

  filteredSubjectId: string[] = [];



  getSubjectIds() {
    this.scrollToTop()
    this.isLoading = true;
    let searchQuery = this.searchQueryResults !== '' ? `(${this.searchQueryResults})` : '*'
    let query = `${this.API_URL}/subject-query/?q=${searchQuery}&facet=true&facet.field=SUBJID`;
    this.getQueryResults(query)
      .subscribe(res => {
        this.isLoading = false;
        let total = res['response']['numFound']
        let queryToGetAll = `${this.API_URL}/subject-query/?q=${searchQuery}&facet=true&facet.field=SUBJID&rows=${total}`;
        this.getQueryResults(queryToGetAll)
          .subscribe(res => {
            let fullArray = res['response']['docs']
            for (let subject of fullArray) {
              let subjId = subject['SUBJID']
              this.filteredSubjectId.push(subjId)
            }

            let postUrlSP = 'https://dev-civet-api.tm4.org/api/mt-dna/pl/cohort/';
            let postUrlVP = 'https://dev-civet-api.tm4.org/api/mt-dna/ur/cohort/';

            this.getPlotPointsScatterPlot(postUrlSP, this.filteredSubjectId)
            this.getPlotPointsViolinPlot(postUrlVP, this.filteredSubjectId)
          })
      })
  }

  addSecondFilter(item, value) {
    let tempArr = [];
    let searchQuery = this.searchQueryResults !== '' ? `${item} AND ${this.searchQueryResults}` : `${item}`
    let query = `${this.API_URL}/subject-query/?q=${searchQuery}&facet=true&facet.field=SUBJID`;
    this.getQueryResults(query)
      .subscribe(res => {
        this.isLoading = false;
        let total = res['response']['numFound']
        let queryToGetAll = `${this.API_URL}/subject-query/?q=${searchQuery}&facet=true&facet.field=SUBJID&rows=${total}`;
        this.getQueryResults(queryToGetAll)
          .subscribe(res => {
            let fullArray = res['response']['docs']
            for (let subject of fullArray) {
              let subjId = subject['SUBJID'];
              tempArr.push(subjId)
            }
            let postUrlVP = 'https://dev-civet-api.tm4.org/api/mt-dna/ur/cohort/';
            this.getPlotPointsViolinPlot2ndFilter(postUrlVP, tempArr, value)

            let postUrlSP = 'https://dev-civet-api.tm4.org/api/mt-dna/pl/cohort/'
            this.getPlotPointsScatterPlot2ndFilter(postUrlSP, tempArr, value)
          })
      })
  }

  getPlotPointsScatterPlot(url, array) {
    this.isLoading = true;
    this.apiService.postSecureData(url, array).subscribe(data => {
      this.isLoading = false;
      this.subjectIdEventSP.emit(data);
    })
  }

  getPlotPointsViolinPlot(url, array) {
    this.isLoading = true;
    this.apiService.postSecureData(url, array).subscribe(data => {
      this.isLoading = false;
      this.subjectIdEventVP.emit(data);
    })
  }

  getPlotPointsViolinPlot2ndFilter(url, array, val) {
    this.isLoading = true;

    this.apiService.postSecureData(url, array).subscribe(data => {
      // console.log("data: ", data)
      // this.getMaxNum(data, 0)
      this.isLoading = false;
      let temp = {
        data: data,
        value: val
      }
      this.subjectIdEventVP2ndFilter.emit(temp);
    })
  }

  getPlotPointsScatterPlot2ndFilter(url, array, val) {
    this.isLoading = true;

    this.apiService.postSecureData(url, array).subscribe(data => {
      this.isLoading = false;
      let temp = {
        data: data,
        value: val
      }
      
      this.subjectIdEventSP2ndFilter.emit(temp);
    })

  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // maxNum = 0;
  // getMaxNum(data, plotNum) {
  //   let tempMin = Number.MAX_SAFE_INTEGER
  //   let tempMax = Number.MIN_SAFE_INTEGER
  //   let number_of_bins = 20
  //   let tempArr = [];
  //   for (let i in data[plotNum]) {
  //     for (let j in data[plotNum][i]) {
  //       let value = data[plotNum][i][j];
  //       tempMin = Math.min(tempMin, value)
  //       tempMax = Math.max(tempMax, value)
  //       tempArr.push(value)
  //     }
  //   }

  //   const bins = Array(20).fill(0);
  //   const binSize = (tempMax - tempMin) / number_of_bins;
  //   let largestBin = 0;

  //   for (const number of tempArr) {
  //     const binIndex = Math.floor(number / binSize);
  //     bins[binIndex]++;
  //     if (bins[binIndex] > bins[largestBin]) {
  //       largestBin = binIndex;
  //     }
  //   }

  //   this.maxNum = Math.max(this.maxNum, bins[largestBin])

  //   console.log("largest bin: ", this.maxNum)
  // }
}


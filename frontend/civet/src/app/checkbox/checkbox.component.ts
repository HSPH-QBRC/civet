import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { DataFilterComponent } from '../data-filter/data-filter.component';
// import * as dataDictionary from '../data-filter/data_dictionary';

@Component({
  selector: 'mev-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CheckboxComponent implements OnInit {
  @Input() info;
  @Input() checked;
  @Input() currentDataset;
  @Input() alt
  @Input() version
  @Input() displayDetails
  @Input() showMoreStatus
  @Input() test_dictionary

  showDescription: boolean = false;
  minimum = 5
  maximum = 200
  filterSize: number = this.minimum
  objectLength;

  constructor(public pds: DataFilterComponent) { }
  dataDict = {}

  

  ngOnInit(): void {
    console.log("info:" , this.info, this.info.key)
    console.log("test: ", this.test_dictionary)
    // console.log("original_dict: ", dataDictionary.data_dictionary)
    // this.dataDict = dataDictionary.data_dictionary
    this.dataDict = this.test_dictionary
    this.objectLength = Object.keys(this.info.value).length;

    if (this.showMoreStatus[this.currentDataset] !== undefined && this.showMoreStatus[this.currentDataset][this.info.key] !== undefined) {
      if (this.showMoreStatus[this.currentDataset][this.info.key] === true) {
        this.filterSize = this.maximum;
        this.showDescription = true;
      } else {
        this.filterSize = this.minimum;
        this.showDescription = false;
      }
    }
  }

  showMore() {
    this.showDescription = !this.showDescription;
    this.filterSize = this.showDescription === false ? this.minimum : this.maximum;
    if (!this.showMoreStatus[this.currentDataset]) {
      this.showMoreStatus[this.currentDataset] = {};
    }
    if (!this.showMoreStatus[this.currentDataset][this.info.key] === undefined) {
      this.showMoreStatus[this.currentDataset][this.info.key] = true;
    } else {
      this.showMoreStatus[this.currentDataset][this.info.key] = !this.showMoreStatus[this.currentDataset][this.info.key]
    }
  }

  expandSection() {
    this.displayDetails = !this.displayDetails;
  }

  isNotEmpty(obj){
    if (Object.keys(obj).length > 0) {
      return true
    } else {
      return false
    }
  }
}

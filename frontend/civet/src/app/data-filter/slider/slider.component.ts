// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-slider',
//   templateUrl: './slider.component.html',
//   styleUrls: ['./slider.component.scss']
// })
// export class SliderComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, ChangeDetectionStrategy, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Options, ChangeContext } from '@angular-slider/ngx-slider';
// import { PublicDatasetsComponent } from '../public-datasets.component';

@Component({
  selector: 'mev-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// export class SliderPDSComponent extends PublicDatasetsComponent implements OnInit {
export class SliderPDSComponent implements OnInit {
  @Input() info;
  @Input() currentDataset;
  @Input() countNum;
  @Input() title
  @Output() childEvent = new EventEmitter()
  @Input() category
  @Input() displayDetails
  @Output() checkEvent = new EventEmitter()
  @Input() mainQuery: string = '*'
  @Input() sliderdata

  minValue;
  maxValue;
  count;
  options: Options = {}

  ngOnInit(): void {
    // this.minValue = this.sliderStorage[this.currentDataset][this.info.key]['low'];
    // this.maxValue = this.sliderStorage[this.currentDataset][this.info.key]['high'];
    // this.count = this.sliderStorage[this.currentDataset][this.info.key]['count']
    // this.options = {
    //   floor: this.sliderStorage[this.currentDataset][this.info.key]['floor'],
    //   ceil: this.sliderStorage[this.currentDataset][this.info.key]['ceil'],
    //   showTicks: true,
    //   tickStep: (this.maxValue - this.minValue) / 8
    // };
    this.minValue = this.sliderdata[this.currentDataset][this.info.key]['low'];
    this.maxValue = this.sliderdata[this.currentDataset][this.info.key]['high'];
    this.count = this.sliderdata[this.currentDataset][this.info.key]['count']
    this.options = {
      floor: this.sliderdata[this.currentDataset][this.info.key]['floor'],
      ceil: this.sliderdata[this.currentDataset][this.info.key]['ceil'],
      showTicks: true,
      tickStep: (this.maxValue - this.minValue) / 8
    };
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    let temp = {
      "dataset": this.currentDataset,
      "category": this.info.key,
      "low": this.minValue,
      "high": this.maxValue
    }
    this.childEvent.emit(temp)
    this.minValue = Math.floor(this.minValue)
    this.maxValue = Math.floor(this.maxValue)
  }

  onCheckedNotReported(currResult, cat, dataset) {
    let temp = {
      "checked": currResult,
      "cat": cat,
      "dataset": dataset
    }
    this.checkEvent.emit(temp)
  }
}

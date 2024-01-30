import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox-plots',
  templateUrl: './checkbox-plots.component.html',
  styleUrls: ['./checkbox-plots.component.scss']
})
export class CheckboxPlotsComponent implements OnInit {
  @Input() checked: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}

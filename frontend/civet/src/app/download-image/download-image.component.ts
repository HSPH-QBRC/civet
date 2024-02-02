import { Component, OnInit, Input } from '@angular/core';
import * as svgAsPng from 'save-svg-as-png';

@Component({
  selector: 'app-download-image',
  templateUrl: './download-image.component.html',
  styleUrls: ['./download-image.component.scss']
})
export class DownloadImageComponent implements OnInit {
  @Input() containerId;
  @Input() imageName;

  constructor() { }

  ngOnInit(): void {
  }

  onSaveImagePNG() {
    svgAsPng.saveSvgAsPng(
      document.querySelector(`#${this.containerId} svg`),
      this.imageName
    );

  }
}

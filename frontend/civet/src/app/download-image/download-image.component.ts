import { Component, OnInit, Input } from '@angular/core';
import * as domToImage from 'dom-to-image';

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
    const svgElement = document.getElementById(this.containerId);

    if (svgElement) {
      domToImage.toPng(svgElement)
        .then((dataUrl: string) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = this.imageName || 'chart.png';
          link.click();
        })
        .catch((error: any) => {
          console.error('Error converting SVG to PNG:', error);
        });
    } else {
      console.error('SVG element not found.');
    }
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { TokenInterceptorInterceptor } from './token-interceptor.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataFilterComponent } from './data-filter/data-filter.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SliderPDSComponent } from './slider/slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HistogramComponent } from './histogram/histogram.component'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ScatterplotComponent,
    DataFilterComponent,
    CheckboxComponent,
    SpinnerOverlayComponent,
    SliderPDSComponent,
    HistogramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCheckboxModule,
    MatCardModule,
    MatChipsModule,
    MatSidenavModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgxSliderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

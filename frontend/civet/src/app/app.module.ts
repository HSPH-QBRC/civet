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
import { ConnectedScatterplotComponent } from './connected-scatterplot/connected-scatterplot.component';
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
import { SliderPDSComponent } from './data-filter/slider/slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { HistogramMiniComponent } from './data-filter/histogram/histogram.component';
import { ViolinplotComponent } from './violinplot/violinplot.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BarchartComponent } from './barchart/barchart.component';
import { HistogramComponent } from './histogram/histogram.component';
import { ScatterplotComponent } from './scatterplot/scatterplot.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { CheckboxPlotsComponent } from './checkbox-plots/checkbox-plots.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConnectedScatterplotComponent,
    DataFilterComponent,
    CheckboxComponent,
    SpinnerOverlayComponent,
    SliderPDSComponent,
    HistogramComponent,
    ViolinplotComponent,
    BarchartComponent,
    HistogramMiniComponent,
    ScatterplotComponent,
    HeatmapComponent,
    CheckboxPlotsComponent
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
    NgxSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatTabsModule,
    MatDividerModule
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './shared/material.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { NumberDirective } from './Directives/number-only.directive';

@NgModule( {
  declarations: [
    AppComponent,
    DynamicTableComponent,
    DialogFormComponent,
    NumberDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
} )
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {
  MatTableModule
} from "@angular/material/table";
import {
  MatFormFieldModule
} from "@angular/material/form-field";
import {
  MatChipsModule
} from "@angular/material/chips";
import {
  MatAutocompleteModule
} from "@angular/material/autocomplete";
import {
  MatOptionModule
} from "@angular/material/core";
import {
  ReactiveFormsModule
} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcquirePackagesComponent } from './acquire-packages.component';
import { CodeSnippetModule } from 'carbon-components-angular';



@NgModule({
  declarations: [
    AcquirePackagesComponent
  ],
  imports: [
    CommonModule,
    CodeSnippetModule
  ],
  exports: [
    AcquirePackagesComponent
  ] 
})
export class AcquirePackagesModule { }

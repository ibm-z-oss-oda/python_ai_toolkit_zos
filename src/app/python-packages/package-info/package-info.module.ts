import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageInfoComponent } from './package-info/package-info.component';
import { BreadcrumbModule, CodeSnippetModule, StructuredListModule, TagModule } from 'carbon-components-angular';
import { LaunchModule } from '@carbon/icons-angular';



@NgModule({
  declarations: [
    PackageInfoComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TagModule,
    StructuredListModule,
    LaunchModule,
    CodeSnippetModule
  ],
  exports: [
    PackageInfoComponent
  ]
})
export class PackageInfoModule { }

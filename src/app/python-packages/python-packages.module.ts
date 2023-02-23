import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PythonPackagesComponent } from './python-packages.component';
import { ResourcesModule } from './resources/resources.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { GetStartedModule } from './get-started/get-started.module';
import { PackageInfoModule } from './package-info/package-info.module';
import { PlaceholderModule } from 'carbon-components-angular';



@NgModule({
  declarations: [
    PythonPackagesComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    HomeModule,
    GetStartedModule,
    ResourcesModule,
    PackageInfoModule,
    PlaceholderModule
  ],
  exports: [
    PythonPackagesComponent
  ],
})
export class PythonPackagesModule { }

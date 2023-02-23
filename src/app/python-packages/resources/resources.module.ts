import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './resources/resources.component';
import { GridModule, TilesModule } from 'carbon-components-angular';
import { LaunchModule } from '@carbon/icons-angular';



@NgModule({
  declarations: [
    ResourcesComponent
  ],
  exports: [
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    TilesModule,
    GridModule,
    LaunchModule
  ]
})
export class ResourcesModule { }

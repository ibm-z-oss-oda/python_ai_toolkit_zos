import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetStartedComponent } from './get-started/get-started.component';
import { TabsModule } from 'carbon-components-angular';
import { SetUpEnvModule } from './set-up-env/set-up-env.module';
import { AcquirePackagesModule } from './acquire-packages/acquire-packages.module';



@NgModule({
  declarations: [
    GetStartedComponent
  ],
  imports: [
    CommonModule,
    TabsModule,
    SetUpEnvModule,
    AcquirePackagesModule
  ],
  exports: [
    GetStartedComponent
  ],
})
export class GetStartedModule { }

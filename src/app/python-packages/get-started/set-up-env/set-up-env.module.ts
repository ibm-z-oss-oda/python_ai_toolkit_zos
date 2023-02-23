import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetUpEnvComponent } from './set-up-env.component';
import { CodeSnippetModule } from 'carbon-components-angular';



@NgModule({
  declarations: [
    SetUpEnvComponent
  ],
  imports: [
    CommonModule,
    CodeSnippetModule
  ],exports: [
    SetUpEnvComponent
  ]
})
export class SetUpEnvModule { }

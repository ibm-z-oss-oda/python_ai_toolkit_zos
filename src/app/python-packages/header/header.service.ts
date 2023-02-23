import { Injectable } from '@angular/core';
import { PackageInfoObject } from '../home/model/PackageInfoObject';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  renderHome:boolean = true;
  renderResources: boolean = false;
  renderGetStarted:boolean = false;
  renderPackageInfo:boolean = false;
  packageInfoData: PackageInfoObject = null;

  constructor() { }
}

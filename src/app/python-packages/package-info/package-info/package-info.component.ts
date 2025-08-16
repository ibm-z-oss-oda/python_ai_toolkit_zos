import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { PackageInfoObject } from '../../home/model/PackageInfoObject';
import { ConstantService } from '../../services/constant.service';
import { MessageService } from '../../services/message.service';
import { PullStrbject } from './model/PullStrObject';
import * as data from '../../../../assets/i18n/shas.json'

@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.scss']
})
export class PackageInfoComponent implements OnInit {
  shaValues: any[] = [];
  version: any = '';
  noTrailingSlash: boolean = false;
  packageInfoData: PackageInfoObject = null;
  pullStrRowData: any[] = [];
  border: boolean = false;
  condensed: boolean = true;
  nowrap: boolean = false;

  constructor(public http: HttpClient, public _messageService: MessageService,
      public headService: HeaderService, public constantService: ConstantService){}

  ngOnInit(): void {
    this.packageInfoData = this.headService.packageInfoData; // get the data from headService
    if (this.packageInfoData.name == "flask") {
      this.packageInfoData.name = "Flask"
    }
    // SHA values will be loaded directly in construcePullStrRowData()
    if (this.packageInfoData.versions.split(' ').length > 2){
      this.version = (this.packageInfoData.versions as string).split(' ')[2]
    } else {
        this.version = (this.packageInfoData.versions as string).split(' ')[1]
    }
    setTimeout(() => {
      this.construcePullStrRowData();
    }, 1);
    // set the scroll bar to top
    window.scrollTo(0, 0);
  }

  loadShaValuesFromPackageInfo(): void {
    this.http.get('assets/packageInfo.json').subscribe((data: any) => {
      const currentPackageName = this.packageInfoData.name.toLowerCase();
      const packageData = data[currentPackageName];
      
      if (packageData && packageData.versions) {
        this.shaValues = this.extractShaDataForPackage(currentPackageName, packageData);
      } else {
        console.log(`No data found for package: ${currentPackageName}`);
        this.shaValues = [];
      }
    }, error => {
      console.log("Error loading packageInfo for SHA values:", error);
      this.shaValues = [];
    });
  }

  extractShaDataForPackage(packageName: string, packageData: any): any[] {
    const packageArray: string[] = [`${packageName}==latest`];
    
    Object.keys(packageData.versions).forEach(versionKey => {
      const versionData = packageData.versions[versionKey];
      if (versionData.dist && versionData.dist.length > 0) {
        versionData.dist.forEach(dist => {
          const versionEntry = `${versionKey} ${dist.py_version} ${dist.sha256}`;
          packageArray.push(versionEntry);
        });
      }
    });
    
    return [packageArray]; // Return array containing this package's data
  }

  goToHome() {
    this.headService.renderHome = true;
    this.headService.renderGetStarted = false;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
  }

  checkTagType(tag: string) {
    if (tag == null || tag == "") {
      return this.constantService.ALL_TAGS_TYPE[8];
    }
    let index = this.constantService.ALL_TAGS.indexOf(tag.toLowerCase());
    return this.constantService.ALL_TAGS_TYPE[index];
  }

  construcePullStrRowData() {
    this.pullStrRowData = []; // Clear existing data
    
    this.http.get('assets/packageInfo.json').subscribe((data: any) => {
      const currentPackageName = this.packageInfoData.name.toLowerCase();
      const packageData = data[currentPackageName];
      
      if (packageData && packageData.versions) {
        const versionEntries: Array<{version: string, pyTag: string, sha: string}> = [];
        
        Object.keys(packageData.versions).forEach(versionKey => {
          const versionData = packageData.versions[versionKey];
          if (versionData.dist && versionData.dist.length > 0) {
            versionData.dist.forEach(dist => {
              versionEntries.push({
                version: versionKey,
                pyTag: dist.py_version,
                sha: dist.sha256
              });
            });
          }
        });
        
        versionEntries.sort((a, b) => {
          const getPriority = (tag: string) => {
            if (tag.startsWith('cp')) {
              const versionStr = tag.substring(2);
              const versionNum = parseInt(versionStr);
              return isNaN(versionNum) ? 0 : versionNum;
            } else if (tag.startsWith('py')) {
              const versionStr = tag.substring(2);
              const versionNum = parseInt(versionStr);
              return isNaN(versionNum) ? -1000 : versionNum - 1000; 
            }
            return -2000; 
          };
          return getPriority(b.pyTag) - getPriority(a.pyTag);
        });
        
        
        versionEntries.forEach(entry => {
          const pullStr = `${this.packageInfoData.name}==${entry.version} --hash=sha256:${entry.sha}`;
          const versionDisplay = `${entry.version} (${entry.pyTag})`;
          const pullStrbject = new PullStrbject(versionDisplay, pullStr, "https://fake.site.string");
          this.pullStrRowData.push(pullStrbject);
        });
      }
    }, error => {
      console.log("Error loading packageInfo for pull string data:", error);
    });
  }
}

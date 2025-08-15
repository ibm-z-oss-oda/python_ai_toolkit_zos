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

  // Load SHA values from packageInfo structure 
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

  // Extract SHA data for the current package  
  extractShaDataForPackage(packageName: string, packageData: any): any[] {
    const packageArray: string[] = [`${packageName}==latest`];
    
    // Add version entries for each version
    Object.keys(packageData.versions).forEach(versionKey => {
      const versionData = packageData.versions[versionKey];
      if (versionData.dist && versionData.dist.length > 0) {
        versionData.dist.forEach(dist => {
          // Format: "version py_version sha256hash"
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

  // check which tag should be show
  checkTagType(tag: string) {
    if (tag == null || tag == "") {
      return this.constantService.ALL_TAGS_TYPE[8];
    }
    let index = this.constantService.ALL_TAGS.indexOf(tag.toLowerCase());
    return this.constantService.ALL_TAGS_TYPE[index];
  }

  // construct pull string row data
  construcePullStrRowData() {
    this.pullStrRowData = []; // Clear existing data
    
    // Load package data directly from packageInfo
    this.http.get('assets/packageInfo.json').subscribe((data: any) => {
      const currentPackageName = this.packageInfoData.name.toLowerCase();
      const packageData = data[currentPackageName];
      
      if (packageData && packageData.versions) {
        const versionEntries: Array<{version: string, pyTag: string, sha: string}> = [];
        
        // Extract all versions and their distribution info
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
        
        // Sort by python tag (most recent first)
        versionEntries.sort((a, b) => {
          const getPriority = (tag: string) => {
            if (tag.startsWith('cp')) {
              // Extract version number from cpXYZ format (e.g., cp313 -> 313, cp314 -> 314)
              const versionStr = tag.substring(2);
              const versionNum = parseInt(versionStr);
              return isNaN(versionNum) ? 0 : versionNum;
            } else if (tag.startsWith('py')) {
              // py3, py2, etc. get lower priority but still sorted by version
              const versionStr = tag.substring(2);
              const versionNum = parseInt(versionStr);
              return isNaN(versionNum) ? -1000 : versionNum - 1000; // Subtract 1000 to keep below cp versions
            }
            return -2000; // Any other format gets lowest priority
          };
          return getPriority(b.pyTag) - getPriority(a.pyTag);
        });
        
        // Create PullStrbject entries for each version
        versionEntries.forEach(entry => {
          const pullStr = `${this.packageInfoData.name}==${entry.version} --hash=sha256:${entry.sha}`;
          const versionDisplay = `${entry.version} (${entry.pyTag})`;
          const pullStrbject = new PullStrbject(versionDisplay, pullStr, "https://en.wikipedia.org/wiki/Clown");
          this.pullStrRowData.push(pullStrbject);
        });
      }
    }, error => {
      console.log("Error loading packageInfo for pull string data:", error);
    });
  }
}

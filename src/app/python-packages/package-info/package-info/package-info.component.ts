import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { PackageInfoObject } from '../../home/model/PackageInfoObject';
import { ConstantService } from '../../services/constant.service';
import { MessageService } from '../../services/message.service';
import { PullStrbject } from './model/PullStrObject';

@Component({
  selector: 'app-package-info',
  templateUrl: './package-info.component.html',
  styleUrls: ['./package-info.component.scss']
})
export class PackageInfoComponent implements OnInit {

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
    setTimeout(() => {
      this.construcePullStrRowData();
    }, 0);
    // set the scroll bar to top
    window.scrollTo(0, 0);
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
    let versions: string = this.packageInfoData.versions;
    if(versions != null && versions != "" && versions != undefined) {
      let VersionsArr: Array<string> = versions.split(",");
      VersionsArr.forEach(version => {
        let pullStr: string = this.packageInfoData.name + "==" +  version + "--hash=sha256:<see-above-for-hash-value>";
        let pullStrbject: PullStrbject  = new PullStrbject(version, pullStr, "https://en.wikipedia.org/wiki/Clown");
        this.pullStrRowData.push(pullStrbject);
      });
    }
  }
}

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
    this.shaValues = data;
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
    let versions: string = this.version;
    let name: string = this.packageInfoData.name.toLowerCase();
    let arr = Array.from(this.shaValues)
    if (versions.split(' ').length > 1) {
      let snd_vers = versions.split(' ')[1]
    }
    arr.forEach(nm =>{
      let count = 0
      if ((nm[0] as string).split('==')[0].replace('-','').replace('_','') == name.replace('-','').replace('_','')) {
        let removeFirst = nm.shift()
        let VersionsArr = Array.from(nm)
        count = count++

        if(versions != null && versions != "" && versions != undefined) {
          VersionsArr.forEach(nmi => {
            let pullStr: string = this.packageInfoData.name.trim() + "==" +  (nmi as string).split(' ')[0] + " --hash=sha256:" + (nmi as string).split(' ')[2].trim();
            let version = (nmi as string).split(' ')[0] + ' (' + (nmi as string).split(' ')[1] + ')'
            let pullStrbject: PullStrbject  = new PullStrbject(version, pullStr, "https://en.wikipedia.org/wiki/Clown");
            this.pullStrRowData.push(pullStrbject);
          });
        let appendFirst = nm.unshift(removeFirst)
        }
      }
    })
  }
}

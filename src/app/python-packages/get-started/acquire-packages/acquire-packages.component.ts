import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-acquire-packages',
  templateUrl: './acquire-packages.component.html',
  styleUrls: ['./acquire-packages.component.scss']
})
export class AcquirePackagesComponent implements OnInit {
  installCommand: string = `pip install --no-deps -r requirements.txt`;

  pyyamlCommand: string = `pip install pyyaml`;

  pyyamlCommand6: string = `pip install pyyaml==6.0`;

  py310url: string = "https://ibm.biz/BdPnfF";
  py311url: string = "https://ibm.biz/BdPnfE";
  
  constructor(public _messageService: MessageService, public headService: HeaderService) { }

  ngOnInit(): void {
  }

  goToHome() {
    this.headService.renderHome = true;
    this.headService.renderGetStarted = false;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
  }

  launchReq310() {
    window.open(this.py310url);
  }

  launchReq311() {
    window.open(this.py311url);
  }
}

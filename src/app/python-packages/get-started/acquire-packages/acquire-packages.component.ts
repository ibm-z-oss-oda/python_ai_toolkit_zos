import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-acquire-packages',
  templateUrl: './acquire-packages.component.html',
  styleUrls: ['./acquire-packages.component.scss']
})
export class AcquirePackagesComponent implements OnInit {
  installCommand: string = `pip install -r requirements.txt`;

  pyyamlCommand: string = `pip install pyyaml`;

  pyyamlCommand6: string = `pip install pyyaml==6.0`;

  github: string = "https://github.ibm.com/";
  
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

  launchGithub() {
    window.open(this.github);
  }
}

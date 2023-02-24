import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-acquire-packages',
  templateUrl: './acquire-packages.component.html',
  styleUrls: ['./acquire-packages.component.scss']
})
export class AcquirePackagesComponent implements OnInit {
  installCommand: string = `pip install --no-deps -r pyaitoolkit_cp311_20230224.txt`;
  installCommand2: string = `pip install --no-deps -r my_pyyaml_requirements.txt`;

  pyyamlCommand: string = `
  pyyaml==6.0 
  --hash=sha256:96787f42a61916311549aacd47e4bca100092d51ab0f098cbb3f778fcdd241fc
`;

  pyyamlCommand6: string = `pip install pyyaml==6.0`;

  py310url: string = "https://ibm.biz/BdPnfF";
  py311url: string = "https://ibm.biz/BdPnfE";

  command: string = `
  --index-url    https://downloads.pyaitoolkit.ibm.net:443/repository/python_ai_toolkit_zos/simple

  --trusted-host downloads.pyaitoolkit.ibm.net 
  
  --require-hashes 
  
  --only-binary :all:
  
  pyyaml==6.0 
     --hash=sha256:96787f42a61916311549aacd47e4bca100092d51ab0f098cbb3f778fcdd241fc`;

  
  
  
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

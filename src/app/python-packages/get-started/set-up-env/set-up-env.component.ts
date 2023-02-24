import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-set-up-env',
  templateUrl: './set-up-env.component.html',
  styleUrls: ['./set-up-env.component.scss']
})
export class SetUpEnvComponent implements OnInit {

  openSDK: string = "https://www.ibm.com/products/open-enterprise-python-zos";
  reqURL: string = "https://github.com/ibm-z-oss-oda/python_ai_toolkit_zos/tree/main/requirements";
  pipDocs: string = "https://pip.pypa.io/en/stable/topics/configuration/";
  
  command: string = `
  [global]
  index = https://downloads.pyaitoolkit.ibm.net:443/repository/python_al_toolkit_zos/
  index-url = https://downloads.pyaitoolkit.ibm.net:443/repository/python_ai_toolkit_zos/simple
  trusted-host = downloads.pyaitoolkit.ibm.net`;

  command2: string = `
  --index-url https://downloads.pyaitoolkit.ibm.net:443/repository/python_ai_toolkit_zos/simple

  --trusted-host downloads.pyaitoolkit.ibm.net`;
  
  constructor(public _messageService: MessageService) { }

  ngOnInit(): void {
  }

  launchOpenSDK() {
    window.open(this.openSDK);
  }
  
  launchReq() {
    window.open(this.reqURL);
  }

  launchPipDocs() {
    window.open(this.pipDocs);
  }
}

import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-set-up-env',
  templateUrl: './set-up-env.component.html',
  styleUrls: ['./set-up-env.component.scss']
})
export class SetUpEnvComponent implements OnInit {

  openSDK: string = "https://www.ibm.com/products/open-enterprise-python-zos";
  
  command: string = `
  [global]
  trusted-host = <URL to IBM Repo>
  index-url = https://<URL to IBM Repo>:$<Port to IBM Repo>/<Path to IBM Repo>
  extra-index-url = https://<URL to IBM Repo>:<Port to IBM Repo>/<Path to IBM Repo>`;
  
  constructor(public _messageService: MessageService) { }

  ngOnInit(): void {
  }

  launchOpenSDK() {
    window.open(this.openSDK);
  }

}

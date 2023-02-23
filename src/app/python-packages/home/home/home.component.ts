import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header/header.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // make an inquiry and launch shopz
  shopz: string = "https://www.ibm.com/client-tools/shopz";

  constructor(public _messageService: MessageService, public headService: HeaderService) { }

  ngOnInit(): void {
  }

  goToGetStarted(): void {
    this.headService.renderHome = false;
    this.headService.renderGetStarted = true;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
  }

  // open shopz in new tab

  launchShopz() {
    window.open(this.shopz);
  }

}

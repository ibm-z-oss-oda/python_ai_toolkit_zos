import { Component, HostBinding, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // adds padding to the top of the document, so the content is below the header
  @HostBinding('class.bx--header') headerClass = true;
  
  constructor(public _messageService: MessageService,
     public headService: HeaderService) { }

  ngOnInit(): void {
  }

  onRenderHome() {
    this.headService.renderHome = true;
    this.headService.renderGetStarted = false;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
  }

  onRenderGetStarted(event: Event) {
    this.headService.renderHome = false;
    this.headService.renderGetStarted = true;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
    event.stopPropagation();
  }

  onRenderResources(event: Event) {
    this.headService.renderHome = false;
    this.headService.renderGetStarted = false;
    this.headService.renderResources = true;
    this.headService.renderPackageInfo = false;
    this.headService.packageInfoData = null;
    event.stopPropagation();
  }

}

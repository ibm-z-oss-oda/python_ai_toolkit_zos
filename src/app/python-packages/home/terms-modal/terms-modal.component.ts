import { Component, Input, OnInit } from '@angular/core';
import { BaseModal } from 'carbon-components-angular';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-terms-modal',
  templateUrl: './terms-modal.component.html',
  styleUrls: ['./terms-modal.component.scss']
})
export class TermsModalComponent extends BaseModal implements  OnInit {

  openLicenseTerms: string = "https://www.ibm.com/support/customer/csol/terms/?id=L-MZYZ-TUDP2Q&lc=en";
  size: string = "md";
  theme: string = "light";
  @Input() hasScrollingContent: boolean = true;
  @Input() showCloseButton: boolean = false;
  @Input() override open: boolean = true;
  
  constructor(public _messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
  }

  agreeClicked() {
    this.closeModal();
  }

  launchLicenseTerms() {
    window.open(this.openLicenseTerms);
  }
   

}

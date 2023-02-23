import { Component, OnInit } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { HeaderService } from './header/header.service';
import { TermsModalComponent } from './home/terms-modal/terms-modal.component';

@Component({
  selector: 'app-python-packages',
  templateUrl: './python-packages.component.html',
  styleUrls: ['./python-packages.component.scss']
})
export class PythonPackagesComponent implements OnInit {

  constructor(public headService: HeaderService, public modalService: ModalService,) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showTermsOfUseModal();
    }, 0);
  }

  renderHome() {
    return this.headService.renderHome;
  }

  renderGetStarted() {
    return this.headService.renderGetStarted;
  }

  renderResources() {
   return this.headService.renderResources;
  }

  renderPackageInfo() {
    return this.headService.renderPackageInfo;
  }

   /**
   * Show terms of use modal
   */
  showTermsOfUseModal() {
      // pop up the add policy modal 
      this.modalService.create(
        {
          component: TermsModalComponent,
          // inputs: {
          //   callModal: this,
          //   tableModel: this.model // pass the model to the add dialog, when the api returned, update it to get the new data
          // }
        }
      ); 
  }

}

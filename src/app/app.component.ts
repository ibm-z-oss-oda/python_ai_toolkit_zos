import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from './python-packages/services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'python-packages-zos';
  constructor(public _messageService: MessageService, private translate: TranslateService) {
    {
      translate.addLangs(['en', 'ja']);
      const browserLang = translate.getBrowserLang();
      // console.log("browser languague: " + browserLang);
      translate.use(browserLang.match(/en|ja/) ? browserLang : 'en').subscribe(
        data => {
          this._messageService.setBundle(data.BUNDLE);
          this._messageService.setMessages(data.MESSAGES);
        },
        error => {
        },
      );
    }
  }
}

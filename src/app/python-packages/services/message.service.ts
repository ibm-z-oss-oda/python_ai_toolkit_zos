import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public timerHandler = null;

  public TYPE_SUCCESS = 'success';
  public TYPE_WARNING = 'warning';
  public TYPE_ERROR = 'error';

  private messages: object;  // loaded from i18n file
  private bundle: object;  // loaded from i18n file
  private constants: object;  // loaded from i18n file

  constructor(private http: HttpClient, 
    private _constant: ConstantService) {

  }

  public setMessages(messages) {
    this.messages = messages;
  }

  public getMessage(msgId) {
    return this.messages[msgId];
  }

  public getBundle(id) {
    return this.bundle === undefined ? '' : this.bundle[id];
  }

  public setBundle(bundle) {
    this.bundle = bundle;
  }

  public getConstants(id) {
    return this.constants === undefined ? '' : this.constants[id];
  }

  public setConstants(constants) {
    this.constants = constants;
  }
}

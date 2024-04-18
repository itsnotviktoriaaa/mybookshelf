import { Params } from '@angular/router';

export type ActiveParamsType = {
  q: string;
  maxResults: number;
  startIndex: number;
};

export enum NamesOfKeys {
  all = 'all',
  intitle = 'title',
  inauthor = 'author',
  intext = 'text',
  subject = 'subject',
}
/* eslint-disable no-prototype-builtins */
export class ActiveParamUtil {
  static processParam(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = { q: 'search+term', maxResults: 40, startIndex: 0 };
    let typeForRequest: string = '';
    let textFromInput: string = '';

    if (params.hasOwnProperty('type')) {
      const type: string = params['type'];

      switch (type) {
        case NamesOfKeys.all:
          typeForRequest = '';
          break;
        case NamesOfKeys.inauthor:
          typeForRequest = `+in${NamesOfKeys.inauthor}:`;
          break;
        case NamesOfKeys.intitle:
          typeForRequest = `+in${NamesOfKeys.intitle}:`;
          break;
        case NamesOfKeys.intext:
          typeForRequest = `+in${NamesOfKeys.intext}:`;
          break;
        case NamesOfKeys.subject:
          typeForRequest = `+${NamesOfKeys.subject}:`;
          break;
        default:
          typeForRequest = `+in${NamesOfKeys.intitle}:`;
      }
    }

    if (params.hasOwnProperty('text')) {
      textFromInput = params['text'];
    }

    if (textFromInput && !typeForRequest) {
      activeParams.q = textFromInput;
    } else if (textFromInput && typeForRequest && typeForRequest !== `+${NamesOfKeys.subject}:`) {
      activeParams.q = '' + typeForRequest + textFromInput;
    } else if (textFromInput && typeForRequest && typeForRequest === `+${NamesOfKeys.subject}:`) {
      activeParams.q = textFromInput + typeForRequest + 'computers';
    }

    console.log(activeParams);
    return activeParams;
  }
}

import { Params } from '@angular/router';
import { ActiveParamsSearchType, NamesOfKeys } from '../../types/user';

/* eslint-disable no-prototype-builtins */
export class ActiveParamUtil {
  static processParam(params: Params, text?: string): ActiveParamsSearchType {
    const activeParams: ActiveParamsSearchType = {
      q: '',
      maxResults: 40,
      startIndex: 0,
    };
    let typeForRequest: string = '';
    let textFromInput: string = '';
    let category: string = '';

    if (text) {
      activeParams.q = text;
    }

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

    if (params.hasOwnProperty('category') && params['category'].toLowerCase() !== 'browse') {
      category = params['category'];
    }

    if (textFromInput) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else {
      activeParams.q += typeForRequest + category;
    }

    if (textFromInput && typeForRequest === `+${NamesOfKeys.subject}:`) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else if (!textFromInput && typeForRequest === `+${NamesOfKeys.subject}:`) {
      activeParams.q = typeForRequest + category;
    } else if (textFromInput) {
      activeParams.q = typeForRequest + textFromInput;
    }

    if (!activeParams.q) {
      activeParams.q = 'search+term';
    }

    console.log(activeParams);
    return activeParams;
  }

  static processTypeForLive(typeFromInput: string): string {
    let typeForRequest: string = '';

    switch (typeFromInput.toLowerCase()) {
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

    return typeForRequest;
  }
}

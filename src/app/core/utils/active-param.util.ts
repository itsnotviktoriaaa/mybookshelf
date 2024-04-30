import {
  IActiveParamsSearch,
  NamesOfKeysEnum,
  SelectedHeaderModalItemEnum,
} from '../../modals/user';
import { Params } from '@angular/router';

export class ActiveParamUtil {
  static processParam(params: Params, text?: string): IActiveParamsSearch {
    const activeParams: IActiveParamsSearch = {
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
        case NamesOfKeysEnum.all:
          typeForRequest = '';
          break;
        case NamesOfKeysEnum.inauthor:
          typeForRequest = `+in${NamesOfKeysEnum.inauthor}:`;
          break;
        case NamesOfKeysEnum.intitle:
          typeForRequest = `+in${NamesOfKeysEnum.intitle}:`;
          break;
        case NamesOfKeysEnum.intext:
          typeForRequest = `+in${NamesOfKeysEnum.intext}:`;
          break;
        case NamesOfKeysEnum.subject:
          typeForRequest = `+${NamesOfKeysEnum.subject}:`;
          break;
        default:
          typeForRequest = `+in${NamesOfKeysEnum.intitle}:`;
      }
    }

    if (params.hasOwnProperty(SelectedHeaderModalItemEnum.Text.toLowerCase())) {
      textFromInput = params['text'];
    }

    if (params.hasOwnProperty('category') && params['category'].toLowerCase() !== 'browse') {
      category = params['category'];
    }

    if (params.hasOwnProperty('page')) {
      activeParams.startIndex = ActiveParamUtil.defineStartIndexFromNumberOfPage(
        Number(params['page'])
      );
    }

    if (textFromInput) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else {
      activeParams.q += typeForRequest + category;
    }

    if (textFromInput && typeForRequest === `+${NamesOfKeysEnum.subject}:`) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else if (!textFromInput && typeForRequest === `+${NamesOfKeysEnum.subject}:`) {
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
      case NamesOfKeysEnum.all:
        typeForRequest = '';
        break;
      case NamesOfKeysEnum.inauthor:
        typeForRequest = `+in${NamesOfKeysEnum.inauthor}:`;
        break;
      case NamesOfKeysEnum.intitle:
        typeForRequest = `+in${NamesOfKeysEnum.intitle}:`;
        break;
      case NamesOfKeysEnum.intext:
        typeForRequest = `+in${NamesOfKeysEnum.intext}:`;
        break;
      case NamesOfKeysEnum.subject:
        typeForRequest = `+${NamesOfKeysEnum.subject}:`;
        break;
      default:
        typeForRequest = `+in${NamesOfKeysEnum.intitle}:`;
    }

    return typeForRequest;
  }

  static processParamsForFavoritePage(params: Params): IActiveParamsSearch {
    const activeParams: IActiveParamsSearch = {
      q: '',
      maxResults: 40,
      startIndex: 0,
    };

    if (params.hasOwnProperty(SelectedHeaderModalItemEnum.Text.toLowerCase())) {
      activeParams.q = params['text'];
    }

    if (params.hasOwnProperty('page')) {
      activeParams.startIndex = ActiveParamUtil.defineStartIndexFromNumberOfPage(
        Number(params['page'])
      );
    }

    return activeParams;
  }

  static defineStartIndexFromNumberOfPage(number: number): number {
    return number * 40 - 40;
  }
}

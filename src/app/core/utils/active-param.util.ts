import { IActiveParamsSearch, NamesOfKeysEnum, SelectedHeaderModalItemEnum } from 'app/models';
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
        case NamesOfKeysEnum.ALL:
          typeForRequest = '';
          break;
        case NamesOfKeysEnum.INAUTHOR:
          typeForRequest = `+in${NamesOfKeysEnum.INAUTHOR}:`;
          break;
        case NamesOfKeysEnum.INTITLE:
          typeForRequest = `+in${NamesOfKeysEnum.INTITLE}:`;
          break;
        case NamesOfKeysEnum.INTEXT:
          typeForRequest = `+in${NamesOfKeysEnum.INTEXT}:`;
          break;
        case NamesOfKeysEnum.SUBJECT:
          typeForRequest = `+${NamesOfKeysEnum.SUBJECT}:`;
          break;
        default:
          typeForRequest = `+in${NamesOfKeysEnum.INTITLE}:`;
      }
    }

    if (params.hasOwnProperty(SelectedHeaderModalItemEnum.TEXT.toLowerCase())) {
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

    if (textFromInput && typeForRequest === `+${NamesOfKeysEnum.SUBJECT}:`) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else if (!textFromInput && typeForRequest === `+${NamesOfKeysEnum.SUBJECT}:`) {
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
      case NamesOfKeysEnum.ALL:
        typeForRequest = '';
        break;
      case NamesOfKeysEnum.INAUTHOR:
        typeForRequest = `+in${NamesOfKeysEnum.INAUTHOR}:`;
        break;
      case NamesOfKeysEnum.INTITLE:
        typeForRequest = `+in${NamesOfKeysEnum.INTITLE}:`;
        break;
      case NamesOfKeysEnum.INTEXT:
        typeForRequest = `+in${NamesOfKeysEnum.INTEXT}:`;
        break;
      case NamesOfKeysEnum.SUBJECT:
        typeForRequest = `+${NamesOfKeysEnum.SUBJECT}:`;
        break;
      default:
        typeForRequest = `+in${NamesOfKeysEnum.INTITLE}:`;
    }

    return typeForRequest;
  }

  static processParamsForFavoritePage(params: Params): IActiveParamsSearch {
    const activeParams: IActiveParamsSearch = {
      q: '',
      maxResults: 40,
      startIndex: 0,
    };

    if (params.hasOwnProperty(SelectedHeaderModalItemEnum.TEXT.toLowerCase())) {
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

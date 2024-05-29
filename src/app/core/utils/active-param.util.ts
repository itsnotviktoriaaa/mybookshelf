import {
  IActiveParamsSearch,
  NamesOfKeysEngEnum,
  NamesOfKeysRusEnum,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from 'app/models/';
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
        case NamesOfKeysEngEnum.ALL:
        case NamesOfKeysRusEnum.ALL:
          typeForRequest = '';
          break;
        case NamesOfKeysEngEnum.INAUTHOR:
        case NamesOfKeysRusEnum.INAUTHOR:
          typeForRequest = `+in${NamesOfKeysEngEnum.INAUTHOR}:`;
          break;
        case NamesOfKeysEngEnum.INTITLE:
        case NamesOfKeysRusEnum.INTITLE:
          typeForRequest = `+in${NamesOfKeysEngEnum.INTITLE}:`;
          break;
        case NamesOfKeysEngEnum.INTEXT:
        case NamesOfKeysRusEnum.INTEXT:
          typeForRequest = `+in${NamesOfKeysEngEnum.INTEXT}:`;
          break;
        case NamesOfKeysEngEnum.SUBJECT:
        case NamesOfKeysRusEnum.SUBJECT:
          typeForRequest = `+${NamesOfKeysEngEnum.SUBJECT}:`;
          break;
        default:
          typeForRequest = `+in${NamesOfKeysEngEnum.INTITLE}:`;
      }
    }

    if (
      params.hasOwnProperty(
        SelectedHeaderModalItemEngEnum.TEXT.toLowerCase() ||
          SelectedHeaderModalItemRusEnum.TEXT.toLowerCase()
      )
    ) {
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

    if (textFromInput && typeForRequest === `+${NamesOfKeysEngEnum.SUBJECT}:`) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else if (!textFromInput && typeForRequest === `+${NamesOfKeysEngEnum.SUBJECT}:`) {
      activeParams.q = typeForRequest + category;
    } else if (textFromInput) {
      activeParams.q = typeForRequest + textFromInput;
    }

    if (!activeParams.q) {
      activeParams.q = 'search+term';
    }

    // console.log(activeParams);
    return activeParams;
  }

  static processTypeForLive(typeFromInput: string): string {
    let typeForRequest: string = '';

    switch (typeFromInput.toLowerCase()) {
      case NamesOfKeysEngEnum.ALL:
      case NamesOfKeysRusEnum.ALL:
        typeForRequest = '';
        break;
      case NamesOfKeysEngEnum.INAUTHOR:
      case NamesOfKeysRusEnum.INAUTHOR:
        typeForRequest = `+in${NamesOfKeysEngEnum.INAUTHOR}:`;
        break;
      case NamesOfKeysEngEnum.INTITLE:
      case NamesOfKeysRusEnum.INTITLE:
        typeForRequest = `+in${NamesOfKeysEngEnum.INTITLE}:`;
        break;
      case NamesOfKeysEngEnum.INTEXT:
      case NamesOfKeysRusEnum.INTEXT:
        typeForRequest = `+in${NamesOfKeysEngEnum.INTEXT}:`;
        break;
      case NamesOfKeysEngEnum.SUBJECT:
      case NamesOfKeysRusEnum.SUBJECT:
        typeForRequest = `+${NamesOfKeysEngEnum.SUBJECT}:`;
        break;
      default:
        typeForRequest = `+in${NamesOfKeysEngEnum.INTITLE}:`;
    }

    return typeForRequest;
  }

  static processParamsForFavoritePage(params: Params): IActiveParamsSearch {
    const activeParams: IActiveParamsSearch = {
      q: '',
      maxResults: 40,
      startIndex: 0,
    };

    if (
      params.hasOwnProperty(
        SelectedHeaderModalItemEngEnum.TEXT.toLowerCase() ||
          SelectedHeaderModalItemRusEnum.TEXT.toLowerCase()
      )
    ) {
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

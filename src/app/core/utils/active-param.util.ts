import {
  IActiveParamsSearch,
  NamesOfKeysEngEnum,
  NamesOfKeysRusEnum,
  SelectedHeaderModalItemEngEnum,
  SelectedHeaderModalItemRusEnum,
} from 'modals/';
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
        case NamesOfKeysEngEnum.all:
        case NamesOfKeysRusEnum.all:
          typeForRequest = '';
          break;
        case NamesOfKeysEngEnum.inauthor:
        case NamesOfKeysRusEnum.inauthor:
          typeForRequest = `+in${NamesOfKeysEngEnum.inauthor}:`;
          break;
        case NamesOfKeysEngEnum.intitle:
        case NamesOfKeysRusEnum.intitle:
          typeForRequest = `+in${NamesOfKeysEngEnum.intitle}:`;
          break;
        case NamesOfKeysEngEnum.intext:
        case NamesOfKeysRusEnum.intext:
          typeForRequest = `+in${NamesOfKeysEngEnum.intext}:`;
          break;
        case NamesOfKeysEngEnum.subject:
        case NamesOfKeysRusEnum.subject:
          typeForRequest = `+${NamesOfKeysEngEnum.subject}:`;
          break;
        default:
          typeForRequest = `+in${NamesOfKeysEngEnum.intitle}:`;
      }
    }

    if (
      params.hasOwnProperty(
        SelectedHeaderModalItemEngEnum.Text.toLowerCase() ||
          SelectedHeaderModalItemRusEnum.Text.toLowerCase()
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

    if (textFromInput && typeForRequest === `+${NamesOfKeysEngEnum.subject}:`) {
      activeParams.q = textFromInput + typeForRequest + category;
    } else if (!textFromInput && typeForRequest === `+${NamesOfKeysEngEnum.subject}:`) {
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
      case NamesOfKeysEngEnum.all:
      case NamesOfKeysRusEnum.all:
        typeForRequest = '';
        break;
      case NamesOfKeysEngEnum.inauthor:
      case NamesOfKeysRusEnum.inauthor:
        typeForRequest = `+in${NamesOfKeysEngEnum.inauthor}:`;
        break;
      case NamesOfKeysEngEnum.intitle:
      case NamesOfKeysRusEnum.intitle:
        typeForRequest = `+in${NamesOfKeysEngEnum.intitle}:`;
        break;
      case NamesOfKeysEngEnum.intext:
      case NamesOfKeysRusEnum.intext:
        typeForRequest = `+in${NamesOfKeysEngEnum.intext}:`;
        break;
      case NamesOfKeysEngEnum.subject:
      case NamesOfKeysRusEnum.subject:
        typeForRequest = `+${NamesOfKeysEngEnum.subject}:`;
        break;
      default:
        typeForRequest = `+in${NamesOfKeysEngEnum.intitle}:`;
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
        SelectedHeaderModalItemEngEnum.Text.toLowerCase() ||
          SelectedHeaderModalItemRusEnum.Text.toLowerCase()
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

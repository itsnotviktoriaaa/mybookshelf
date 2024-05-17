import { IActiveParamsSearch } from '../../modals/user';
import { ActiveParamUtil } from './active-param.util';
import { Params } from '@angular/router';

describe('ActiveParamUtil', (): void => {
  it('should process parameters without text and type', (): void => {
    const result: IActiveParamsSearch = ActiveParamUtil.processParam({});

    expect(result.q).toBe('search+term');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should put text to q param', (): void => {
    const params: Params = {
      text: 'angular',
    };
    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('angular');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should process parameters with type author, without category and text', (): void => {
    const params: Params = {
      type: 'author',
    };

    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('+inauthor:');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should change error type to type like +intitle', (): void => {
    const params: Params = {
      type: 'error',
    };

    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('+intitle:');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should process parameters with type subject and chosen category by user and text', (): void => {
    const params: Params = {
      text: 'angular',
      type: 'subject',
      category: 'computers',
    };

    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('angular+subject:computers');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should not put Browse after subject: if type subject', (): void => {
    const params: Params = {
      text: 'angular',
      type: 'subject',
      category: 'Browse',
    };

    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('angular+subject:');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(0);
  });

  it('should count quantity of skipping books if page exists', (): void => {
    const params: Params = {
      text: 'angular',
      type: 'subject',
      category: 'Browse',
      page: 4,
    };

    const result: IActiveParamsSearch = ActiveParamUtil.processParam(params);

    expect(result.q).toBe('angular+subject:');
    expect(result.maxResults).toBe(40);
    expect(result.startIndex).toBe(120);
  });

  it('should change type for live searching', (): void => {
    expect(ActiveParamUtil.processTypeForLive('all')).toBe('');
    expect(ActiveParamUtil.processTypeForLive('title')).toBe('+intitle:');
    expect(ActiveParamUtil.processTypeForLive('author')).toBe('+inauthor:');
    expect(ActiveParamUtil.processTypeForLive('text')).toBe('+intext:');
    expect(ActiveParamUtil.processTypeForLive('subject')).toBe('+subject:');
  });

  it('should default process params if user is on favorite page', (): void => {
    const activeParams: IActiveParamsSearch = {
      q: '',
      maxResults: 40,
      startIndex: 0,
    };

    expect(ActiveParamUtil.processParamsForFavoritePage({})).toEqual(activeParams);
  });

  it('should process params if user is on favorite page and wrote text in search input and chose page number 2', (): void => {
    const activeParams: Params = {
      text: '',
      page: 2,
    };

    const activeParamsResult: IActiveParamsSearch = {
      q: '',
      maxResults: 40,
      startIndex: 40,
    };

    expect(ActiveParamUtil.processParamsForFavoritePage(activeParams)).toEqual(activeParamsResult);
  });

  it('should back right startIndexFromNumberOfPage', (): void => {
    expect(ActiveParamUtil.defineStartIndexFromNumberOfPage(1)).toBe(0);
    expect(ActiveParamUtil.defineStartIndexFromNumberOfPage(2)).toBe(40);
    expect(ActiveParamUtil.defineStartIndexFromNumberOfPage(3)).toBe(80);
  });
});

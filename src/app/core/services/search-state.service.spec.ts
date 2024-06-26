import { TestBed } from '@angular/core/testing';

import { SelectedHeaderModalItemEnum } from 'models/personal-library';
import { SearchStateService } from './search-state.service';

describe('SearchStateService', (): void => {
  let service: SearchStateService;

  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchStateService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should searchCategory$ is default equality Browse', (): void => {
    service.getSearchCategory().subscribe((category: string): void => {
      expect(category).toBe('Browse');
    });
  });

  it('should searchCategory$ is equality category', (): void => {
    service.setSearchCategory('Computers');

    service.getSearchCategory().subscribe((category: string): void => {
      expect(category).toBe('Computers');
    });
  });

  it('should searchType$ is default equality All', (): void => {
    service.getHeaderModalItem().subscribe((type: string): void => {
      expect(type).toBe(SelectedHeaderModalItemEnum.ALL);
    });
  });

  it('should searchType$ is equality type', (): void => {
    service.setHeaderModalItem(SelectedHeaderModalItemEnum.SUBJECT);
    service.getHeaderModalItem().subscribe((type: string): void => {
      expect(type).toBe(SelectedHeaderModalItemEnum.SUBJECT);
    });
  });

  it('should isFavoritePage$ is default equality false', (): void => {
    service.getFavoritePage().subscribe((isFavorite: boolean): void => {
      expect(isFavorite).toBeFalse();
    });
  });

  it('should isFavoritePage$ is equality true', (): void => {
    service.setFavoritePage(true);
    service.getFavoritePage().subscribe((isFavorite: boolean): void => {
      expect(isFavorite).toBeTruthy();
    });
  });
});

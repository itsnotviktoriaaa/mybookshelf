import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonPopupService } from 'app/core/';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './common-popup.component.html',
  styleUrl: './common-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonPopupComponent {
  @Input() isOpenDeletePopup = { isOpen: false };
  @Input() textForPopup: { text: string } | null = null;
  @Input() page: 'own' | 'favorite' | null = null;

  constructor(private commonPopupService: CommonPopupService) {}

  delete(): void {
    this.isOpenDeletePopup = { isOpen: false };

    if (this.page === 'own') {
      this.commonPopupService.setIsDeleteOwnBookOrNot(true);
    } else if (this.page === 'favorite') {
      this.commonPopupService.setIsDeleteFavoriteBookOrNot(true);
    }
  }

  notDelete(): void {
    this.isOpenDeletePopup = { isOpen: false };

    if (this.page === 'own') {
      this.commonPopupService.setIsDeleteOwnBookOrNot(false);
    } else if (this.page === 'favorite') {
      this.commonPopupService.setIsDeleteFavoriteBookOrNot(false);
    }
  }
}

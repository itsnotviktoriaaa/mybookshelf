import { CommonPopupService } from '../../core/services/common-popup.service';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [],
  templateUrl: './common-popup.component.html',
  styleUrl: './common-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonPopupComponent {
  @Input() isOpenDeletePopup = { isOpen: false };

  constructor(private commonPopupService: CommonPopupService) {}

  delete(): void {
    this.isOpenDeletePopup = { isOpen: false };
    this.commonPopupService.setIsDeleteOwnBookOrNot(true);
  }

  notDelete(): void {
    this.isOpenDeletePopup = { isOpen: false };
    this.commonPopupService.setIsDeleteOwnBookOrNot(false);
  }
}

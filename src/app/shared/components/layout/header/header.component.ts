import { Component, HostListener } from '@angular/core';
import { HeaderClickInterface } from '../../../../../types/header.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  allMiniModal: boolean = false;
  langMiniModal: boolean = false;
  profileMiniModal: boolean = false;
  protected readonly HeaderClickInterfaceEnum = HeaderClickInterface;

  constructor() {}

  openOrCloseMiniModal(nameOfMiniModal: HeaderClickInterface.allMiniModal | HeaderClickInterface.langMiniModal | HeaderClickInterface.profileMiniModal): void {
    if (nameOfMiniModal === HeaderClickInterface.allMiniModal) {
      this.allMiniModal = !this.allMiniModal;
    }
    if (nameOfMiniModal === HeaderClickInterface.langMiniModal) {
      this.langMiniModal = !this.langMiniModal;
    }
    if (nameOfMiniModal === HeaderClickInterface.profileMiniModal) {
      this.profileMiniModal = !this.profileMiniModal;
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    console.log(event.target);
    if (this.allMiniModal && !((event.target as Element).closest('.header-search-modal') || (event.target as Element).closest('.header-search-all'))) {
      this.allMiniModal = false;
    }

    if (this.langMiniModal && !((event.target as Element).closest('.header-lang-modal') || (event.target as Element).closest('.header-lang-info'))) {
      this.langMiniModal = false;
    }

    if (this.profileMiniModal && !((event.target as Element).closest('.header-account-modal') || (event.target as Element).closest('.header-account-info'))) {
      this.profileMiniModal = false;
    }
  }
}

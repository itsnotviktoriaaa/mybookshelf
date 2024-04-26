import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {}

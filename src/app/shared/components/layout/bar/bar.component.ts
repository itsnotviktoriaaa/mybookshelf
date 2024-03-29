import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, RouterLinkActive],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarComponent {}

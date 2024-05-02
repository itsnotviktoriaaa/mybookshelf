import { NgxExtendedPdfViewerModule, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-example-pdf-viewer',
  templateUrl: './example-pdf-viewer.component.html',
  styleUrls: ['./example-pdf-viewer.component.css'],
  standalone: true,
  imports: [NgxExtendedPdfViewerModule],
  providers: [NgxExtendedPdfViewerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplePdfViewerComponent {
  /** In most cases, you don't need the NgxExtendedPdfViewerService. It allows you
   *  to use the "find" api, to extract text and images from a PDF file,
   *  to print programmatically, and to show or hide layers by a method call.
   */

  examplePdfUrl =
    'https://firebasestorage.googleapis.com/v0/b/mybookshelff-c1a0f.appspot.com/o/EXCj50C0ruWGrJumrcfbjknFxik2%2Fpdfs%2F2rrspocd0fo_RETRO%2019.04.2024.pdf?alt=media&token=b529b2b2-5d77-4779-a4c8-122e34cda9b5';

  constructor(private pdfService: NgxExtendedPdfViewerService) {
    /* More likely than not you don't need to tweak the pdfDefaultOptions.
       They are a collecton of less frequently used options.
       To illustrate how they're used, here are two example settings: */
    // pdfDefaultOptions.doubleTapZoomFactor = '150%'; // The default value is '200%'
    // pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
    // but most devices support much higher resolutions.
    // Increasing this setting allows your users to use higher zoom factors,
    // trading image quality for performance.
  }
}

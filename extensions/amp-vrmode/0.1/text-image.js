/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export class TextImage {

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.visibility = 'hidden';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.right = 0;
    canvas.style.bottom = 0;
    canvas.style.zIndex = 1111111;
    document.body.appendChild(canvas);

    /** @private @const {!HTMLCanvasElement} */
    this.canvas_ = canvas;

    /** @private @const {!CanvasContext2d} */
    this.context_ = canvas.getContext('2d');
  }

  /**
   * @param {string} text
   * @return {string}
   */
  getImageUrl(text) {
    const context = this.context_;
    const canvas = this.canvas_;

    /*
      font
      textAlign
      textBaseline
      fillText
      strokeText
      measureText
    */

    context.clearRect(0, 0, 1000, 1000);

    const fontSize = this.calculateFontSize_(text, 10, 500);
    context.font = `${fontSize}px arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = 'white';
    context.fillText(text, 500, 500);

    return canvas.toDataURL(context.getImageData(0, 0, 1000, 1000));
  }

  /**
   * @param {string} text
   * @param {number} minFontSize
   * @param {number} maxFontSize
   * @return {number}
   * @private
   */
  calculateFontSize_(text, minFontSize, maxFontSize) {
    const context = this.context_;
    maxFontSize++;
    // Binomial search for the best font size.
    while (maxFontSize - minFontSize > 1) {
      const mid = Math.floor((minFontSize + maxFontSize) / 2);
      context.font = `${mid}px arial`;
      const width = context.measureText(text).width;
      if (width > 1000) {
        maxFontSize = mid;
      } else {
        minFontSize = mid;
      }
    }
    return minFontSize;
  }

}

/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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

export class FakeStyle {

  constructor(opt_initial) {
    if (opt_initial) {
      for (const prop in opt_initial) {
        this.setProperty(prop, opt_initial[prop]);
      }
    }
  }

  setProperty(propertyName, value, priority) {
    const fullValue = value ? (priority ? `${value}!${priority}` : `${value}`) : '';
    this[propertyName] = fullValue;
  }

  getPropertyValue(propertyName) {
    if (!(propertyName in this)) {
      return '';
    }
    return this[propertyName].split('!')[0];
  }

  getPropertyPriority(propertyName) {
    if (!(propertyName in this)) {
      return '';
    }
    return this[propertyName].split('!')[1] || '';
  }
}

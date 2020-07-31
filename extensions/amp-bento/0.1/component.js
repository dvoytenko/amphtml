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

import * as Preact from '../../../src/preact';
import {useEffect, useRef} from '../../../src/preact';
import {WithAmpContext} from '../../../src/preact/context';
import {openWindowDialog} from '../../../src/dom';
import {useLoad} from '../../../src/preact/component';

/**
 * @param {!JsonObject} props
 * @return {PreactDef.Renderable}
 */
export function BentoComponent({
  id,
  renderable = true,
  playable = true,
  children,
  ...rest
}) {
  const counterRef = useRef(0);
  counterRef.current++;
  console.log('id: ', id, 'render:', counterRef.current);

  const {load, onLoad} = useLoad(rest);

  useEffect(() => {
    if (!load) {
      return;
    }
    setTimeout(() => {
      console.log('load done');
      onLoad();
    }, 1000);
  }, [load, onLoad]);

  return (
    <WithAmpContext debug={id} renderable={renderable} playable={playable}>
      <div {...rest} style={{border: '1px solid green'}}>
        <div>{id}</div>
        <div>
          Render count: {counterRef.current}
        </div>
        <div>
          Load: {String(load)}
        </div>

        <div>
          {children}
        </div>
      </div>
    </WithAmpContext>
  );
}

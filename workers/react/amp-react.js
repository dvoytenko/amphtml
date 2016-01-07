/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
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

import '../../third_party/babel/custom-babel-helpers';
import {AmpReactComponent, findAndDispatchEvent} from './amp-react-component';
import {AmpReconcileTransaction} from './amp-react-transaction';

const React = require('../../node_modules/react/lib/ReactIsomorphic');
const ReactDefaultBatchingStrategy = require('../../node_modules/react/lib/ReactDefaultBatchingStrategy');
const ReactElement = require('../../node_modules/react/lib/ReactElement');
const ReactNativeComponent = require('../../node_modules/react/lib/ReactNativeComponent');
const ReactInstanceHandles = require('../../node_modules/react/lib/ReactInstanceHandles');
const ReactReconciler = require('../../node_modules/react/lib/ReactReconciler');
const ReactRootIndex = require('../../node_modules/react/lib/ReactRootIndex');
const ReactUpdates = require('../../node_modules/react/lib/ReactUpdates');
const ServerReactRootIndex = require('../../node_modules/react/lib/ServerReactRootIndex');
const instantiateReactComponent = require('../../node_modules/react/lib/instantiateReactComponent');
const emptyObject = require('../../node_modules/react/node_modules/fbjs/lib/emptyObject');

/** Mapping from reactRootID to React component instance. */
const instancesByReactRootID = {};


console.log('AMP-REACT STARTED!', this, self);

function log(var_args) {
  const args = Array.prototype.slice.call(arguments, 0);
  args.unshift('[AMPReact]');
  console.log.apply(console, args);
}

class ReactMount {

  constructor() {
    ReactRootIndex.injection.injectCreateReactRootIndex(
        ServerReactRootIndex.createReactRootIndex);
    ReactUpdates.injection.injectReconcileTransaction(
        AmpReconcileTransaction);

    ReactUpdates.injection.injectBatchingStrategy(
        ReactDefaultBatchingStrategy);

    ReactNativeComponent.injection.injectGenericComponentClass(
        AmpReactComponent);
  }

  /**
   * @param {!ReactElement} rootElement
   * @return {???}
   */
  mount(rootElement) {

    this.rootElement = rootElement;

    log('Mount:', rootElement);

    var rootWrappedElement = new ReactElement(
      TopLevelWrapper,
      null,
      null,
      null,
      null,
      null,
      rootElement
    );
    log('Root wrapped:', rootWrappedElement);

    var component = this._renderNewRootComponent(
      rootWrappedElement,
      emptyObject
    );
    return component;
  }

  dispatchEvent(event) {
    findAndDispatchEvent(event);
  }

  /**
   * @param {ReactElement} rootElement element to render
   * @return {ReactComponent} nextComponent
   * @private
   */
  _renderNewRootComponent(rootElement, context) {
    var componentInstance = instantiateReactComponent(rootElement, null);
    log('Component instance: ', componentInstance);

    var reactRootID = this._registerComponent(componentInstance);
    log('reactRootID: ', reactRootID);


    // The initial render is synchronous but any updates that happen during
    // rendering, in componentWillMount or componentDidMount, will be batched
    // according to the current batching strategy.

    ReactUpdates.batchedUpdates(
      this.batchedMountComponentIntoNode_.bind(this),
      componentInstance,
      reactRootID,
      context
    );

    return componentInstance;
  }

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @return {string} reactRoot ID prefix
   * @private
   */
  _registerComponent(nextComponent) {
    var reactRootID =  ReactInstanceHandles.createReactRootID();
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  }

  /**
   * Batched mount.
   *
   * @param {ReactComponent} componentInstance The instance to mount.
   * @private
   */
  batchedMountComponentIntoNode_(
      componentInstance,
      rootID,
      context
      ) {

    log('batchedMountComponentIntoNode_');

    var transaction = AmpReconcileTransaction.getPooled(false);

    log('Transaction: ', transaction);
    transaction.perform(
      this.mountComponentIntoNode_.bind(this),
      null,
      componentInstance,
      rootID,
      transaction,
      context
    );

    AmpReconcileTransaction.release(transaction);
  }

  /**
   * @param {ReactComponent} componentInstance The instance to mount.
   * @param {AmpReconcileTransaction} transaction
   * @private
   */
  mountComponentIntoNode_(
      componentInstance,
      rootID,
      transaction,
      context
      ) {

    log('MOUNT HERE!!!', transaction);
    var markup = ReactReconciler.mountComponent(
        componentInstance, rootID, transaction, context);
    log('MARKUP: ', markup);
    log('rendered component: ', componentInstance,
        componentInstance._renderedComponent);

    componentInstance._renderedComponent._topLevelWrapper = componentInstance;

    log('MOUNT THIS: ', markup);
    send('mount-dom', markup);
  }
}


/**
 * Temporary (?) hack so that we can store all top-level pending updates on
 * composites instead of having to worry about different types of components
 * here.
 */
var topLevelRootCounter = 1;
var TopLevelWrapper = function() {
  this.rootID = topLevelRootCounter++;
};
TopLevelWrapper.prototype.isReactComponent = {};
TopLevelWrapper.prototype.render = function() {
  // this.props is actually a ReactElement
  return this.props;
};


const reactMount = new ReactMount();


self['React'] = React;

self['AMP'] = {
  mount: function(rootElement) {
    return reactMount.mount(rootElement);
  }
};


var startedResolver;
var started = new Promise(function(resolve) {
  startedResolver = resolve;
});

self.addEventListener('message', function(e) {
  log('WORKER MESSAGE RCVD:', e);
  startedResolver();
  if (e.data.type == 'event') {
    reactMount.dispatchEvent(e.data.data);
  }
}, false);

function send(type, data) {
  started.then(function() {
    self.postMessage({
      type: type,
      data: data
    });
    log('message posted: ', type, data);
  });
}

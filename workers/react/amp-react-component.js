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

const React = require('../../node_modules/react/lib/ReactIsomorphic');
const ReactMultiChild = require('../../node_modules/react/lib/ReactMultiChild');
const Transaction = require('../../node_modules/react/lib/Transaction');
const assign = require('../../node_modules/react/lib/Object.assign');

/** @const {!Object<string, !ReactElement>} */
const eventNodes = {};

function log(var_args) {
  const args = Array.prototype.slice.call(arguments, 0);
  args.unshift('[AmpReactComponent]');
  console.log.apply(console, args);
}


export function findAndDispatchEvent(event) {
  log('dispatchEvent: ', event, eventNodes);
  var element = eventNodes[event.target];
  if (!element) {
    log('-- target not found!');
    return;
  }

  var eventProp = 'on' + event.type.substring(0, 1).toUpperCase() +
      event.type.substring(1);
  var eventHandler = element.props[eventProp];
  if (!eventHandler) {
    log('-- no handler: ', eventProp);
    return;
  }

  eventHandler.call(element);
}


/**
 * @constructor AmpReactComponent
 * @extends ReactMultiChild
 */
export function AmpReactComponent(tag) {
  this._tag = tag.toLowerCase();
  this._renderedChildren = null;
  this._previousStyle = null;
  this._previousStyleCopy = null;
  this._rootNodeID = null;
  this._wrapperState = null;
  this._topLevelWrapper = null;
  this._nodeWithLegacyProperties = null;
}

AmpReactComponent.displayName = 'AmpReactComponent';

AmpReactComponent.Mixin = {

  construct: function(element) {
    this._currentElement = element;
  },

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root node ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   * @return {string} The computed markup.
   */
  mountComponent: function(rootID, transaction, context) {
    this._rootNodeID = rootID;

    var props = this._currentElement.props;

    log('mountComponent: ', rootID, this._rootNodeID, this._tag,
        this._currentElement, this._currentElement.type,
        props);

    // Attributes, events, content.
    var attrs = null;
    var events = null;
    var children = null;
    var html = null;
    var text = null;
    var className = null;
    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (propKey.substring(0, 2) == 'on') {
        if (!events) {
          events = [];
        }
        events.push(propKey.substring(2).toLowerCase());
        // TODO: All we need really is to be able to find nodes by ID. There
        // has to be a simpler way, but in the meantime, I'll use the cache.
        eventNodes[this._rootNodeID] = this._currentElement;
      } else if (propKey == 'className') {
        className = propValue;
      } else if (propKey == 'style') {
        // TODO ???
        // propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
      } else if (propKey == 'dangerouslySetInnerHTML') {
        // TODO ???
        if (propValue != null && propValue.__html != null) {
          html = propValue.__html;
        }
      } else if (propKey == 'children') {
        // TODO ???
        if (isContent(propValue)) {
          text = '' + propValue;
        } else {
          children = this.mountChildren(propValue, transaction, context);
        }
      } else {
        if (!attrs) {
          attrs = {};
        }
        attrs[propKey] = propValue;
      }
    }

    var mountImage = {
      nodeId: this._rootNodeID,
      tag: this._currentElement.type,
      className: className,
      attrs: attrs,
      events: events,
      html: html,
      text: text,
      children: children,
    };
    log('-- mount image: ', mountImage);

    return mountImage;
  },

  /**
   * Receives a next element and updates the component.
   *
   * @internal
   * @param {ReactElement} nextElement
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {object} context
   */
  receiveComponent: function(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;
    this.updateComponent(transaction, prevElement, nextElement, context);
  },

  /**
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @param {ReactElement} nextElement
   * @internal
   * @overridable
   */
  updateComponent: function(transaction, prevElement, nextElement, context) {
    var lastProps = prevElement.props;
    var nextProps = this._currentElement.props;

    log('updateComponent:', this._currentElement.props.className,
        this._currentElement, lastProps, nextProps);

    this.diffUpdateProperies_(lastProps, nextProps, transaction, null);

    if (!nextProps.children || !isContent(nextProps.children)) {
      this.updateChildren(nextProps.children, transaction, context);
    }
  },

  /**
   * @param {object} lastProps
   * @param {object} nextProps
   * @param {AmpReactReconcileTransaction} transaction
   * @private
   */
  diffUpdateProperies_(lastProps, nextProps, transaction) {
    var propKey;
    var className;
    var deleteEvents;
    var deleteAttrs;
    var addEvents;
    var setAttrs;
    for (propKey in lastProps) {
      if (propKey == 'children' || propKey == 'dangerouslySetInnerHTML') {
        continue;
      }
      if (nextProps.hasOwnProperty(propKey) ||
         !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      var lastProp = lastProps[propKey];
      if (propKey == 'style') {
        // TODO: ????
        /*
        var lastStyle = this._previousStyleCopy;
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
        this._previousStyleCopy = null;
        */
      } else if (propKey == 'className') {
        className = '';
      } else if (propKey.substring(0, 2) == 'on') {
        if (!deleteEvents) {
          deleteEvents = [];
        }
        deleteEvents.push(propKey.substring(2).toLowerCase());
      } else {
        if (!deleteAttrs) {
          deleteAttrs = [];
        }
        deleteAttrs.push(propKey);
      }
    }

    for (propKey in nextProps) {
      if (propKey == 'children' || propKey == 'dangerouslySetInnerHTML') {
        continue;
      }
      if (propKey == 'style') {
        // TODO: ????
        /*
          var lastProp = propKey === STYLE ?
            this._previousStyleCopy :
            lastProps[propKey];
         */
        continue;
      }
      var nextProp = nextProps[propKey];
      var lastProp = lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey.substring(0, 2) == 'on') {
        if (nextProp) {
          if (!addEvents) {
            addEvents = [];
          }
          addEvents.push(propKey.substring(2).toLowerCase());
        } else if (lastProp) {
          if (!deleteEvents) {
            deleteEvents = [];
          }
          deleteEvents.push(propKey.substring(2).toLowerCase());
        }
      } else {
        if (nextProp != null) {
          if (!setAttrs) {
            setAttrs = {};
          }
          setAttrs[propKey] = nextProp;
        } else {
          if (!deleteAttrs) {
            deleteAttrs = [];
          }
          deleteAttrs.push(propKey);
        }
      }
    }

    /* TODO: ????
    if (styleUpdates) {
      CSSPropertyOperations.setValueForStyles(node, styleUpdates);
    }
    */

    var lastText, nextText;
    var setText;
    if (lastProps.children && isContent(lastProps.children)) {
      lastText = '' + lastProps.children;
    }
    if (nextProps.children && isContent(nextProps.children)) {
      nextText = '' + nextProps.children;
    }
    if (lastText !== nextText) {
      setText = nextText || '';
    }

    var lastHtml, nextHtml;
    var setHtml;
    if (lastProps.dangerouslySetInnerHTML &&
            lastProps.dangerouslySetInnerHTML.__html) {
      lastHtml = lastProps.dangerouslySetInnerHTML.__html;
    }
    if (nextProps.dangerouslySetInnerHTML &&
            nextProps.dangerouslySetInnerHTML.__html) {
      nextHtml = nextProps.dangerouslySetInnerHTML.__html;
    }
    if (lastHtml !== nextHtml) {
      setHtml = nextHtml || '';
    }

    if (className !== undefined ||
            deleteEvents !== undefined ||
            addEvents !== undefined ||
            deleteAttrs !== undefined ||
            setAttrs !== undefined ||
            setText !== undefined ||
            setHtml !== undefined) {
      var update = {
        nodeId: this._rootNodeID,
        className: className,
        deleteEvents: deleteEvents,
        addEvents: addEvents,
        deleteAttrs: deleteAttrs,
        setAttrs: setAttrs,
        setText: setText,
        setHtml: setHtml,
      };
      log('UPDATE PROP:', update);
      send('update-dom', update);
    } else {
      log('NO UPDATE');
    }
  },

  /**
   * @internal
   */
  unmountComponent: function() {
    this.unmountChildren();
    /* TODO???
    ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
    this._rootNodeID = null;
    this._wrapperState = null;
    if (this._nodeWithLegacyProperties) {
      var node = this._nodeWithLegacyProperties;
      node._reactInternalComponent = null;
      this._nodeWithLegacyProperties = null;
    }
    */
  },

  getPublicInstance: function() {
    if (!this._nodeWithLegacyProperties) {
      var node = ReactMount.getNode(this._rootNodeID);

      node._reactInternalComponent = this;
      node.getDOMNode = legacyGetDOMNode;
      node.isMounted = legacyIsMounted;
      node.setState = legacySetStateEtc;
      node.replaceState = legacySetStateEtc;
      node.forceUpdate = legacySetStateEtc;
      node.setProps = legacySetProps;
      node.replaceProps = legacyReplaceProps;

      // updateComponent will update this property on subsequent renders
      node.props = this._currentElement.props;

      this._nodeWithLegacyProperties = node;
    }
    return this._nodeWithLegacyProperties;
  },
};


assign(
  AmpReactComponent.prototype,
  AmpReactComponent.Mixin,
  ReactMultiChild.Mixin
);


/**
 */
function isContent(children) {
  return (typeof children == 'string' || typeof children == 'number');
}

function send(type, data) {
  self.postMessage({
    type: type,
    data: data
  });
  log('message posted: ', type, data);
}

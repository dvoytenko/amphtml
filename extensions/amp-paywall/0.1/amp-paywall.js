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

import {CSS} from '../../../build/amp-paywall-0.1.css';
import {Guide} from './guide';
import {Services} from '../../../src/services';
import {createLoaderElement} from '../../../src/loader';
import {installStyles} from '../../../src/style-installer';
import {toArray} from '../../../src/types';

const TAG = 'amp-paywall';


/**
 */
export class PaywallService {
  /**
   * @param {!../../../src/service/ampdoc-impl.AmpDoc} ampdoc
   */
  constructor(ampdoc) {
    /** @const */
    this.ampdoc = ampdoc;

    /** @const */
    this.guide_ = new Guide(ampdoc.win);

    /** @const @private*/
    this.vsync_ = Services.vsyncFor(ampdoc.win);

    /** @const @private */
    this.remoteStub_ = new RemoteStub();

    /** @private {?JSONObject} */
    this.config_ = null;

    installStyles(ampdoc.getRootNode(), CSS, () => {}, false, TAG);

    this.guide_.onAction('guide', action => {
      this.guide_.show(GUIDES[action.scene]);
    });
    this.guide_.onAction('authorize-subscriber', action => {
      this.subscriberInfo_(this.config_, {
        vendor: 'Google Subscriptions',
        access: true,
        subscriber: true,
      });
    });
    this.guide_.onAction('authorize-new-user', action => {
      this.showPopup_(PopupShortOffer, true, this.config_, {
        vendor: 'Google Subscriptions',
        access: true,
        subscriber: false,
        meter: {
          quotaLeft: 10,
          text: 'You can read 10 articles for free this month!',
        },
        offer: {
          id: 'offer-123',
          product: '1234-def',
          text: '7 day free trial',
        },
      }, GUIDES.NEW_USER);
    });
    this.guide_.onAction('authorize-metered', action => {
      this.showPopup_(PopupShortOffer, true, this.config_, {
        vendor: 'Google Subscriptions',
        access: true,
        subscriber: false,
        meter: {
          quotaLeft: 3,
          text: '3 articles left this month',
        },
        offer: {
          id: 'offer-123',
          product: '1234-def',
          text: '7 day free trial',
        },
      }, GUIDES.RET_USER_METERED);
    });
    this.guide_.onAction('not-authorized-no-meter', action => {
      this.showPopup_(PopupExpandedOffer, false, this.config_, {
        vendor: 'Google Subscriptions',
        access: false,
        subscriber: false,
        meter: {
          quotaLeft: 0,
          text: 'No articles left this month',
        },
        offer: {
          id: 'offer-123',
          product: '1234-def',
          text: 'Subscribe now and get 7 day free trial!',
        },
      }, GUIDES.RET_USER_NO_METER);
    });
  }

  /** @private */
  start_() {
    console.log('QQQ: HERE!!!!!!');

    this.guide_.show(GUIDES.INTRO);
    return;

    // 1. Get config.
    return this.getConfig_().then(config => {
      console.log('QQQ: config: ', config);

      // 2. Authorize.
      return this.authorize_(config).then(authorizations => {
        console.log('QQQ: authorization: ', authorizations);
        const grant = this.selectGrant_(config, authorizations);
        if (grant) {
          // 3. Update doc.
          this.grant_(config, grant);
          // 4. Show subscriber info.
          if (grant.subscriber) {
            this.subscriberInfo_(config, grant);
          }
        }

        // 5. Popup flow
        const offer = grant || this.selectOffer_(config, authorizations);
        if (offer) {
          this.offer_(config, offer);
        }
      });

      // 6. Big popup flow
      // 7. Dialog flow
    }).then(end => {
      console.log('QQQ: THE END: ', end);
    });
  }

  /**
   * @param {string} text
   * @param {string} linkText
   * @private
   */
  showToast_(text, linkText, guide) {
    console.log('QQQ: showToast: ', text, linkText);
    const toast = document.createElement('div');
    toast.classList.add('amp-paywall-toast');

    const toastText = document.createElement('div');
    toastText.classList.add('amp-paywall-toast-text');
    toastText.textContent = text;
    toast.appendChild(toastText);

    const toastLink = document.createElement('a');
    toastLink.classList.add('amp-paywall-toast-link');
    toastLink.textContent = linkText;
    toast.appendChild(toastLink);

    this.ampdoc.getBody().appendChild(toast);
    setTimeout(() => {
      toast.classList.add('amp-paywall-toast-shown');
      setTimeout(() => {
        this.guide_.show(guide).then(() => {
          setTimeout(() => {
            toast.classList.remove('amp-paywall-toast-shown');
            setTimeout(() => {
              this.ampdoc.getBody().removeChild(toast);
            }, 1000);
          }, 2000);
        });
      }, 1000);
    }, 100);
  }

  /**
   * @return {!JSONObject}
   * @private
   */
  getConfig_() {
    if (this.config_) {
      return this.config_;
    }
    return this.config_ = Services.xhrFor(this.ampdoc.win).fetchJson(
        '/examples/access.manifest',
        {credentials: 'omit'}
        ).then(response => response.json());
  }

  /**
   * @param {!JSONObject} config
   * @private
   */
  authorize_(config) {
    if (!config.services) {
      return Promise.resolve([]);
    }
    // TODO: this will be more sophisticated, including min/max timeouts:
    // - the fastest response will timeout other responses, but not before
    // min threshold.
    // - all incomplete responses are timed out at max timeout.
    const promises = config.services.map(service => {
      return this.remoteStub_.authorize(service);
    });
    return Promise.all(promises);
  }

  /**
   * @param {!JSONObject} config
   * @param {!Array<!JSONObject>} authorizations
   * @return {?JSONObject}
   * @private
   */
  selectGrant_(config, authorizations) {
    const granted = authorizations.filter(authorization => {
      return authorization.access === true;
    });
    if (granted.length == 0) {
      return null;
    }
    if (granted.length == 1) {
      return granted[1];
    }
    // TODO: select one. Among other things: `subscriber: true` should have higher priority.
    return granted[0];
  }

  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   * @private
   */
  grant_(config, authorization) {
    console.log('QQQ: grant: ', authorization);
  }

  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   * @private
   */
  subscriberInfo_(config, authorization) {
    console.log('QQQ: subscriber: ', authorization);
    this.showToast_(
        `Access via ${authorization.vendor}`,
        'Details',
        GUIDES.SUBSCRIBER_TOAST);
  }

  /**
   * @param {!JSONObject} config
   * @param {!Array<!JSONObject>} authorizations
   * @return {?JSONObject}
   * @private
   */
  selectOffer_(config, authorizations) {
    const offers = authorizations.filter(authorization => {
      return !!authorization.offer;
    });
    if (offers.length == 0) {
      return null;
    }
    if (offers.length == 1) {
      return offers[1];
    }
    // TODO: select one.
    return offers[0];
  }

  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   * @private
   */
  offer_(config, authorization) {
    console.log('QQQ: offer: ', authorization);
    this.popup_ = new Popup(config, authorization);
    return this.popup_.start();
  }

  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   * @private
   */
  showPopup_(popupClass, closable, config, authorization, guide) {
    this.popup_ = new popupClass(config, authorization);
    const result = this.popup_.start(closable);
    if (guide) {
      this.guide_.show(guide).then(() => {});
    }
    result.then(res => {
      console.log('QQQ: popup result: ', res);
      if (res == 'show-expanded-offer') {
        this.showPopup_(
            PopupExpandedOffer,
            closable,
            config,
            authorization,
            null);//QQQQ: guide?
      } else if (res == 'show-signin-options') {
        this.showPopup_(
            PopupSignIn,
            closable,
            config,
            authorization,
            GUIDES.SIGNIN_OPTIONS);
      }
    });
  }
}


class Popup {
  constructor() {
    this.popup_ = null;
    this.graypane_ = null;
    this.resolver_ = null;
  }

  /**
   * @return {!Promise}
   */
  start(closable) {
    const popup = document.createElement('div');
    this.popup_ = popup;
    popup.classList.add('amp-paywall-popup');

    const closeButton = document.createElement('button');
    closeButton.classList.add('amp-paywall-popup-close-button');
    popup.appendChild(closeButton);
    closeButton.addEventListener('click', e => {
      e.stopPropagation();
      this.close();
    });

    if (!closable) {
      popup.classList.add('not-closable');
      this.graypane_ = document.createElement('div');
      this.graypane_.classList.add('amp-paywall-popup-graypane');
      document.body.appendChild(this.graypane_);
    }

    this.render(popup);
    document.body.appendChild(popup);
    this.onStarted(popup);
    return new Promise(resolve => {
      this.resolver_ = resolve;
    });
  }

  /**
   */
  close(opt_result) {
    document.body.removeChild(this.popup_);
    if (this.graypane_) {
      document.body.removeChild(this.graypane_);
    }
    if (this.resolver_) {
      this.resolver_(opt_result);
    }
  }

  /**
   * @param {!Element} popup
   * @abstract
   */
  render(popup) {}

  /**
   * @param {!Element} popup
   */
  onStarted(popup) {}
}


class PopupShortOffer extends Popup {
  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   */
  constructor(config, authorization) {
    super();
    this.config_ = config;
    this.authorization_ = authorization;
  }

  /**
   */
  render(popup) {
    const brandText = document.createElement('div');
    brandText.classList.add('amp-paywall-popup-brand-text');
    brandText.textContent = 'Vampires die in the light';
    popup.appendChild(brandText);

    if (this.authorization_.meter) {
      const stateText = document.createElement('div');
      stateText.classList.add('amp-paywall-popup-state-text');
      stateText.textContent = this.authorization_.meter.text;
      popup.appendChild(stateText);
    }

    const offerText = document.createElement('div');
    offerText.classList.add('amp-paywall-popup-offer-text');
    offerText.textContent = this.authorization_.offer.text + ' via ' +
        this.authorization_.vendor;
    popup.appendChild(offerText);

    popup.addEventListener('click', () => {
      this.close('show-expanded-offer');
    });
  }
}


class PopupExpandedOffer extends Popup {
  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   */
  constructor(config, authorization) {
    super();
    this.config_ = config;
    this.authorization_ = authorization;
  }

  /** @override */
  render(popup) {
    popup.style.minHeight = '200px';

    const brandText = document.createElement('div');
    brandText.classList.add('amp-paywall-popup-brand-text');
    brandText.textContent = 'Vampires die in the light';
    popup.appendChild(brandText);

    const expandedContainer = document.createElement('div');
    expandedContainer.classList.add('amp-paywall-popup-expanded-container');
    popup.appendChild(expandedContainer);
    this.expandedContainer_ = expandedContainer;

    const alreadySubscriberButton = document.createElement('button');
    alreadySubscriberButton.classList.add('amp-paywall-popup-already-subscriber-button');
    alreadySubscriberButton.textContent = 'Already subscriber';
    popup.appendChild(alreadySubscriberButton);
    alreadySubscriberButton.addEventListener('click', e => {
      e.stopPropagation();
      this.close('show-signin-options');
    });

    const loader = createLoaderElement(document, 'amp-paywall');
    popup.appendChild(loader);
    this.loader_ = loader;
  }

  /** @override */
  onStarted(popup) {
    popup.classList.add('amp-paywall-popup-loading');
    this.loader_.classList.add('amp-active');
    setTimeout(() => {
      console.log('QQQ: popup content loaded');
      popup.classList.remove('amp-paywall-popup-loading');
      this.loader_.classList.remove('amp-active');
      this.expandLoaded_();
    }, 3000);
  }

  /** @private */
  expandLoaded_() {
    this.expandedContainer_.appendChild(todoText('Brand with "Google Subscriptions"'));
    this.expandedContainer_.appendChild(this.renderOfferButton_({
      text: '14 day free, $8/mo after',
    }));
    this.expandedContainer_.appendChild(this.renderOfferButton_({
      text: '$80/year',
    }));
  }

  /** @private */
  renderOfferButton_(spec) {
    const button = document.createElement('button');
    button.classList.add('amp-paywall-popup-expanded-offer-button');
    button.textContent = spec.text;
    return button;
  }
}


class PopupSignIn extends Popup {
  /**
   * @param {!JSONObject} config
   * @param {!JSONObject} authorization
   */
  constructor(config, authorization) {
    super();
    this.config_ = config;
    this.authorization_ = authorization;
  }

  /** @override */
  render(popup) {
    const brandText = document.createElement('div');
    brandText.classList.add('amp-paywall-popup-brand-text');
    brandText.textContent = 'Vampires die in the light';
    popup.appendChild(brandText);

    popup.appendChild(todoText('All buttons must be branded'));

    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('amp-paywall-popup-signin-options');
    popup.appendChild(optionsContainer);

    optionsContainer.appendChild(this.renderOption_({
      vendor: 'subscriptions.google.com',
      name: 'Google Subscriptions',
    }));
    optionsContainer.appendChild(this.renderOption_({
      vendor: 'subscriptions.bigmarket.com',
      name: 'Big Market',
    }));
    optionsContainer.appendChild(this.renderOption_({
      vendor: 'subscriptions.vampiretimes.com',
      name: 'Vampire Times',
    }));
  }

  /**
   * @param {!JSONObject} service
   * @return {!Element}
   * @private
   */
  renderOption_(service) {
    const serviceEl = document.createElement('button');
    serviceEl.classList.add('amp-paywall-popup-signin-button');
    serviceEl.classList.add(service.vendor.replace(/\./g, '-'));
    serviceEl.textContent = service.name;
    return serviceEl;
  }
}


function todoText(text, className) {
  const el = document.createElement('div');
  el.classList.add('TODO');
  if (className) {
    el.classList.add(className);
  }
  el.textContent = text;
  return el;
}


class RemoteStub {

  authorize(service) {
    return Promise.resolve({
      vendor: service.vendor,
      access: true,
      subscriber: false,
      meter: {
        quotaLeft: 3,
        text: '3 articles left this month',
      },
      offer: {
        id: 'offer-123',
        product: '1234-def',
        text: '7 day free trial',
      },
    });
  }
}


const GUIDES = {};


GUIDES.INTRO = {
  title: 'Paywall demo',
  sections: [
    {
      text: 'This is the paywall demo using several paywall providers.'
    },
    {
      text: 'And this is the guide to help you walk through this demo.'
    },
    {
      text: 'Obviously, this is not a user visible UI, but just to help to explain how paywall would work.'
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'START_FLOW'},
        },
      ],
    },
  ],
};


GUIDES.START_FLOW = {
  title: 'Select the flow',
  sections: [
    {
      text: 'At start, all paywall services are firing in parallel returning the user state.',
    },
    {
      text: 'Choose from these options:'
    },
    {
      optionList: [
        {
          optionText: 'Subscriber',
          action: {verb: 'authorize-subscriber'},
        },
        {
          optionText: 'New user: never visited the site before',
          action: {verb: 'authorize-new-user'},
        },
        {
          optionText: 'Returning user: still has metering quota',
          action: {verb: 'authorize-metered'},
        },
        {
          optionText: 'Returning user: no more metering quota',
          action: {verb: 'not-authorized-no-meter'},
        },
        {
          optionText: 'Subscriber: payment problems',
          action: {verb: 'QQQQ'},
        },
      ],
    },
  ],
};


GUIDES.SUBSCRIBER_TOAST = {
  title: 'User is the subscriber',
  sections: [
    {
      text: 'A paywall service that says that user is the subscriber should take precedence.',
    },
    {
      text: 'Important! We need to indicate subscription with, e.g., a toast.',
      pointTo: '.amp-paywall-toast-text',
    },
    {
      text: 'This toast must include an action to see subscription details.',
      pointTo: '.amp-paywall-toast-link',
    },
    {
      text: 'But otherwise, this is it. Authorization is successful. Read the content.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Done',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


GUIDES.NEW_USER = {
  title: 'First-time user',
  sections: [
    {
      text: 'None of the paywalls know anything about the user.',
    },
    {
      text: 'Google Subscription gives meter and product offer. Publisher opts in to use it.',
    },
    {
      text: 'Details are shown in the popup.',
      pointTo: '.amp-paywall-popup',
    },
    {
      buttonBar: [
        {
          buttonText: 'Some details...',
          action: {verb: 'guide', scene: 'NEW_USER_POPUP_CLOSABLE'},
        },
      ],
    },
  ],
};

GUIDES.NEW_USER_POPUP_CLOSABLE = {
  title: 'First-time user: popup is non-blocking and closable',
  sections: [
    {
      text: 'This UI is not blocked. The user can scroll and read the content.',
    },
    {
      text: 'This popup is closable.',
      pointTo: '.amp-paywall-popup-close-button',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'NEW_USER_BRANDING'},
        },
      ],
    },
  ],
};

GUIDES.NEW_USER_BRANDING = {
  title: 'First-time user: publisher branding',
  sections: [
    {
      text: 'Some branding is rendered from the publisher.',
      pointTo: '.amp-paywall-popup-brand-text',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'NEW_USER_METER'},
        },
      ],
    },
  ],
};

GUIDES.NEW_USER_METER = {
  title: 'First-time user: metering',
  sections: [
    {
      text: 'Metering info is explained.',
      pointTo: '.amp-paywall-popup-state-text',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'NEW_USER_OFFER'},
        },
      ],
    },
  ],
};

GUIDES.NEW_USER_OFFER = {
  title: 'First-time user: offer',
  sections: [
    {
      text: 'The subscription is offered.',
      pointTo: '.amp-paywall-popup-offer-text',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'NEW_USER_FINAL'},
        },
      ],
    },
  ],
};

GUIDES.NEW_USER_FINAL = {
  title: 'First-time user: that\'s it',
  sections: [
    {
      text: 'This is it. Authorization is successful. Next, the user can read the content, close the popup, or tap on the popup for more info.',
    },
    {
      class: 'TODO',
      text: 'TODO: what about "already subscriber"?',
    },
    {
      buttonBar: [
        {
          buttonText: 'Done',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


GUIDES.RET_USER_METERED = {
  title: 'Returning user: metering',
  sections: [
    {
      text: 'Mostly the same as first-time user. Access granted. Offer is shown.',
    },
    {
      text: 'But, metering quota is reduced.',
      pointTo: '.amp-paywall-popup-state-text',
    },
    {
      buttonBar: [
        {
          buttonText: 'Done',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};

GUIDES.RET_USER_NO_METER = {
  title: 'Returning user: no quota',
  sections: [
    {
      text: 'No more metering quota. Authorization is denied.',
    },
    {
      text: 'Google Subscription has a product offer. Publisher opts in to use it.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Some details...',
          action: {verb: 'guide', scene: 'RET_USER_NO_METER_BLOCKING'},
        },
      ],
    },
  ],
};

GUIDES.RET_USER_NO_METER_BLOCKING = {
  title: 'No quota: popup is blocking and not closable',
  sections: [
    {
      text: 'Popup is immediately shown in an expanded form.',
    },
    {
      text: 'This UI is blocked. The user has to respond to the popup. There\'s no close button.',
      pointTo: '.amp-paywall-popup',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'RET_USER_NO_METER_OFFER'},
        },
      ],
    },
  ],
};

GUIDES.RET_USER_NO_METER_OFFER = {
  title: 'No quota: offer details',
  sections: [
    {
      text: 'The detailed offer details are shown. It might take a bit to load.',
      pointTo: '.amp-paywall-popup-expanded-container',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'RET_USER_NO_METER_ALREADY_SUBSCR'},
        },
      ],
    },
  ],
};

GUIDES.RET_USER_NO_METER_ALREADY_SUBSCR = {
  title: 'No quota: already a subscriber?',
  sections: [
    {
      text: 'Maybe the user is already a subscriber?',
      pointTo: '.amp-paywall-popup-already-subscriber-button',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'RET_USER_NO_METER_FINAL'},
        },
      ],
    },
  ],
};

GUIDES.RET_USER_NO_METER_FINAL = {
  title: 'No quota: final',
  sections: [
    {
      text: 'Next, the user can take the offer or select "already a subscriber".',
    },
    {
      buttonBar: [
        {
          buttonText: 'Done',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


GUIDES.SIGNIN_OPTIONS = {
  title: 'Already subscriber: sign-in',
  sections: [
    {
      text: 'All paywall services configured by the publisher provide their sign-in UIs.',
      pointTo: '.amp-paywall-popup-signin-button',
    },
    {
      text: 'Order is defined by the publisher and can be adjusted in runtime, e.g. based on the referrer.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Done',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


// Register the extension services.
AMP.extension(TAG, '0.1', function(AMP) {
  AMP.registerServiceForDoc(TAG, function(ampdoc) {
    return new PaywallService(ampdoc).start_();
  });
});

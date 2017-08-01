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
      setTimeout(this.giveSpace_.bind(this), 1);
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
    this.guide_.onAction('subscription-broken', action => {
      this.showPopup_(PopupSubscriptionBroken, false, this.config_, {
        vendor: 'Google Subscriptions',
        access: false,
        subscriber: true,
        problem: true,
      }, GUIDES.SUBSCRIBER_BROKEN);
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
  showToast_(text, linkText, link, guide) {
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
    toastLink.onclick = () => {
      window.open(link, '_blank');
    };

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
          }, 7000);
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
        '/examples/subscription.html',
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
    result.then(res => {
      console.log('QQQ: popup result: ', res);
      if (res == 'show-expanded-offer') {
        this.showPopup_(
            PopupExpandedOffer,
            closable,
            config,
            authorization,
            GUIDES.ACCESS_AND_EXPANDED_OFFER);
      } else if (res == 'show-checkout') {
        this.showPopup_(
            PopupCheckout,
            closable,
            config,
            authorization,
            GUIDES.CHECKOUT);
      } else if (res == 'checkout-done') {
        this.showToast_(
            'Access via Google Subscriptions',
            'Manage',
            '/examples/subscription.html',
            null);
      } else if (res == 'show-signin-options') {
        this.showPopup_(
            PopupSignIn,
            closable,
            config,
            authorization,
            GUIDES.SIGNIN_OPTIONS);
      }
    });
    if (guide) {
      setTimeout(() => {
        this.guide_.show(guide).then(() => {});
        setTimeout(this.giveSpace_.bind(this), 1);
        this.popup_.onUpdate_ = () => {
          this.guide_.updatePointers();
          setTimeout(this.giveSpace_.bind(this), 1);
        };
      }, 1000);
    }
  }

  /** @private */
  giveSpace_() {
    if (!this.popup_ || !this.guide_.getCurrentSceneElement()) {
      return;
    }
    const winHeight = window.innerHeight;
    const popupHeight = this.popup_.getRoot().offsetHeight;
    const guideHeight = this.guide_.getCurrentSceneElement().offsetHeight;
    const currentTop = (winHeight - guideHeight) / 2;
    const needTop = Math.max(winHeight - guideHeight - popupHeight - 40, 0);
    if (needTop < currentTop) {
      this.guide_.getCurrentSceneElement().style.transform =
          `translateY(${needTop - currentTop}px)`;
    }
  }
}


function expandTemplate(id, container) {
  const template = document.getElementById(id);
  if (!template) {
    throw new Error('template not found: ' + id);
  }
  const children = template.content.children;
  for (let i = 0; i < children.length; i++) {
    container.appendChild(children[i].cloneNode(true));
  }
  while (true) {
    const ref = container.querySelector('ref[template]');
    if (!ref) {
      break;
    }
    const div = document.createElement('div');
    expandTemplate(ref.getAttribute('template'), div);
    if (div.children.length > 0) {
      ref.parentElement.replaceChild(div.children[0], ref);
    } else {
      ref.textContent = '!!!NOT FOUND!!!';
    }
  }
}


class Popup {
  constructor() {
    this.popup_ = null;
    this.graypane_ = null;
    this.resolver_ = null;
  }

  /**
   * @return {!Element}
   */
  getRoot() {
    return this.popup_;
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
    expandTemplate('PopupShortOffer', popup);

    const stateText = popup.querySelector('.amp-paywall-popup-state-text');
    if (this.authorization_.meter) {
      stateText.textContent = this.authorization_.meter.text;
    } else {
      stateText.style.display = 'none';
    }

    const offerText = popup.querySelector('.amp-paywall-popup-offer-text');
    offerText.textContent = this.authorization_.offer.text + ' via ' +
        this.authorization_.vendor;
    offerText.style.display = 'none';

    const subscribeGoogleButton = popup.querySelector('.amp-paywall-popup-subscribe-google-button');
    subscribeGoogleButton.addEventListener('click', () => {
      this.close('show-expanded-offer');
    });

    const signinButton = popup.querySelector('.amp-paywall-popup-signin-button');
    signinButton.addEventListener('click', () => {
      this.close('show-signin-options');
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
    expandTemplate('PopupExpandedOffer', popup);

    const expandedContainer = popup.querySelector('.amp-paywall-popup-expanded-container');
    expandedContainer.style.minHeight = '80px';
    this.expandedContainer_ = expandedContainer;

    const signinButton = popup.querySelector('.amp-paywall-popup-signin-button');
    signinButton.addEventListener('click', () => {
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
    if (this.onUpdate_) {
      this.onUpdate_();
    }
  }

  /** @private */
  renderOfferButton_(spec) {
    const button = document.createElement('button');
    button.classList.add('amp-paywall-popup-expanded-offer-button');
    button.textContent = spec.text;
    button.onclick = () => {
      this.close('show-checkout');
    };
    return button;
  }
}


class PopupCheckout extends Popup {
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
    expandTemplate('PopupCheckout', popup);
    const subscribeButton =
        popup.querySelector('.amp-paywall-popup-subscribe-google-button-text');
    subscribeButton.textContent = 'SUBSCRIBE';
    subscribeButton.onclick = () => {
      this.close('checkout-done');
    };
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
    expandTemplate('PopupSignIn', popup);
    popup.querySelector('.amp-paywall-popup-subscribe-google-button-text')
        .textContent = 'Google Subscriptions';
  }
}


class PopupSubscriptionBroken extends Popup {
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
    expandTemplate('PopupSubscriptionBroken', popup);
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
  title: 'Paywall demo 1.1',
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
          action: {verb: 'subscription-broken'},
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
      text: 'Google Subscriptions gives meter and product offer. Publisher opts in to use it.',
    },
    {
      text: `Note, Google Subscriptions does not return any user/subscriptions
          identifiers in response until user opts in. The counting is done
          internally and hidden from the publisher.`,
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
      pointTo: '.amp-paywall-popup-brand-icon',
    },
    {
      text: 'The branding can come from access.manifest and defaulted to normal site manifest.',
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
      pointTo: '.amp-paywall-popup-subscribe-google-button',
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
      text: 'This is it. Authorization is successful. Next, the user can read the content, close the popup, or tap on the subscribe for more info.',
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
      text: 'If only one offer - go straight to checkout.',
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
      text: 'Popup is immediately shown in an expanded form. If only one offer - go straight to checkout.',
    },
    {
      text: 'The user has to respond to the popup. There\'s no close button.',
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
      pointTo: '.amp-paywall-popup-expanded-offer-button',
    },
    {
      text: 'If there\'s only one offer - bypass this view and go straight to checkout.',
    },
    {
      text: 'Important! Once subscription is successful, the authorization should be re-run for this paywall service.',
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
      pointTo: '.amp-paywall-popup-signin-button',
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
      text: 'Next, the user can take the offer and go to checkout, or select "already a subscriber".',
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
      text: `Important! This is a legacy multi-choice hell! Critical to resolve well.
          Some confusions:
              (a) In the old world, the user may have signed in with Google Sign-in but account is in Vampire Chron. User might be confused which one to select.
              (b) If user selects Vampire Chron, how to bind it back to Google Subscriptions, even if user wanted?
              (c) If user used X Sign-in, but X does not offer subscriptions, how confusing is that?
          `,
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


GUIDES.ACCESS_AND_EXPANDED_OFFER = {
  title: 'Expanded offer',
  sections: [
    {
      text: 'The detailed offer details are shown. It might take a bit to load.',
      pointTo: '.amp-paywall-popup-expanded-offer-button',
    },
    {
      text: 'If only one offer - go straight to checkout.',
    },
    {
      text: 'More space for branded messaging as well.',
    },
    {
      text: 'Important! Once subscription is successful, the authorization should be re-run for this paywall service.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Close',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


GUIDES.SUBSCRIBER_BROKEN = {
  title: 'Problems with the subscription',
  sections: [
    {
      text: 'A problem. E.g. a canceled credit-card. Need to fix or cancel',
    },
    {
      buttonBar: [
        {
          buttonText: 'Close',
          action: {verb: 'close'},
        },
      ],
    },
  ],
};


GUIDES.CHECKOUT = {
  title: 'Checkout',
  sections: [
    {
      text: 'User is ready to checkout.',
    },
    {
      text: 'This is an inline checkout flow provided by the iframe. It\'s not yet clear if this is ok. If not ok, this will have to be a 1p dialog.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Some details...',
          action: {verb: 'guide', scene: 'CHECKOUT_CARD'},
        },
      ],
    },
  ],
};

GUIDES.CHECKOUT_CARD = {
  title: 'Checkout: payment info',
  sections: [
    {
      text: 'Payment info is shown',
      pointTo: '.amp-paywall-popup-checkout-card',
    },
    {
      text: 'Important! What would happen if user wants to pick another payment instrument? Most likely have to go to the 1p dialog and finish checkout there.',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'CHECKOUT_PRODUCT'},
        },
      ],
    },
  ],
};

GUIDES.CHECKOUT_PRODUCT = {
  title: 'Checkout: charge',
  sections: [
    {
      text: 'User is explained unambiguously when and what the charges will be and how often.',
      pointTo: '.amp-paywall-popup-checkout-product',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'CHECKOUT_TERMS'},
        },
      ],
    },
  ],
};

GUIDES.CHECKOUT_TERMS = {
  title: 'Checkout: terms',
  sections: [
    {
      text: 'Among other things, terms will explain the multi-device sign-in opt-in.',
      pointTo: '.amp-paywall-popup-checkout-terms',
    },
    {
      buttonBar: [
        {
          buttonText: 'Next',
          action: {verb: 'guide', scene: 'CHECKOUT_CONFIRM'},
        },
      ],
    },
  ],
};

GUIDES.CHECKOUT_CONFIRM = {
  title: 'Checkout: subscribe',
  sections: [
    {
      text: 'Subscribe and done.',
      pointTo: '.amp-paywall-popup-subscribe-google-button',
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

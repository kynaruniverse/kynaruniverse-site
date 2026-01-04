/* ==========================================================================
   CORE | EVENT BUS (PUB/SUB ENGINE)
   ========================================================================== */
export const EventBus = {
  events: {},
  on(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(callback);
  },
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
};

export const EVENTS = {
  APP_INIT:      'app:init',
  CART_ADD:      'cart:add',
  CART_REMOVE:   'cart:remove',
  CART_TOGGLE:   'cart:toggle',
  CHECKOUT_INIT: 'checkout:init',
  FILTER_CHANGE: 'shop:filter',
  MODAL_OPEN:    'modal:open',
  MODAL_CLOSE:   'modal:close',
  THEME_TOGGLE:  'theme:toggle',
  MENU_TOGGLE:   'menu:toggle',
  SEARCH_TOGGLE: 'search:toggle'
};

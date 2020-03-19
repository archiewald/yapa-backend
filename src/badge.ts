// https://web.dev/badging-api/#supporting

// TODO: ty już wiesz co hultaju ( ͡° ͜ʖ ͡°)
const anyNavigator = navigator as any;
const anyWindow = window as any;

export function setBadge(value?: number) {
  if (anyNavigator.setExperimentalAppBadge) {
    anyNavigator.setExperimentalAppBadge(value);
    return;
  }

  if (anyWindow.setAppBadge) {
    anyWindow.setAppBadge(value);
  }
}

export function clearBadge() {
  if (anyNavigator.clearExperimentalAppBadge) {
    anyNavigator.clearExperimentalAppBadge();
  }

  if (anyWindow.clearAppBadge) {
    anyWindow.clearAppBadge();
  }
}

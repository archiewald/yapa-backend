// https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user

import pomodoroIcon from "./assets/tomato-icon.png";

export function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("We weren't granted permission.");
    }
  });
}

export async function showNotification(message: string) {
  const registration = await navigator.serviceWorker.getRegistration();

  if (registration) {
    registration.showNotification(message, {
      icon: pomodoroIcon
    });
  }
}

/**
 * returns time string in a form of MM:SS
 * @param timeInMs
 */
export function renderTimeString(timeInMs: number) {
  if (timeInMs < 0) {
    console.warn(`time should be > 0, got ${timeInMs}`);
    return "0:00";
  }

  const minutes = Math.floor(timeInMs / 60000);
  const seconds = Math.round((timeInMs % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function minutesToMs(minutes: number) {
  return minutes * 60 * 1000;
}

export function msToFullMinutes(ms: number) {
  return Math.floor(ms / 60000);
}

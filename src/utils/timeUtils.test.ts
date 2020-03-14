import { renderTimeString } from "./timeUtils";

describe("renderTimeString", () => {
  test.each([
    [20 * 60 * 1000, "20:00"],
    [10 * 60 * 1000, "10:00"],
    [0, "0:00"],
    [-1 * 60 * 1000, "0:00"]
  ])("From %i ms should render %s", (timeInMs, timeString) => {
    expect(renderTimeString(timeInMs)).toBe(timeString);
  });
});

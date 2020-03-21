import { createStoreon } from "storeon";
import { storeonDevtools } from "storeon/devtools";

import { TimerEvents, TimerState, TimerModule } from "./timer";

export type AppEvents = TimerEvents;
export interface AppState extends TimerState {}

export const store = createStoreon<AppState, AppEvents>([
  TimerModule,
  process.env.NODE_ENV !== "production" && storeonDevtools
]);

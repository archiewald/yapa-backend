import { createStoreon } from "storeon";

import { TimerEvents, TimerState, TimerModule } from "./timer";

export type AppEvents = TimerEvents;
export interface AppState extends TimerState {}

export const store = createStoreon<AppState, AppEvents>([TimerModule]);

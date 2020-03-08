import { createStoreon } from "storeon";

import { ClockEvents, ClockState, clockModule } from "./clock";

export type AppEvents = ClockEvents;
export interface AppState extends ClockState {}

export const store = createStoreon<AppState, AppEvents>([clockModule]);

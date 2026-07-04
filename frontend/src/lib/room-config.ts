import { useLocalState } from "./local-store";

export const DEFAULT_FLOORS = ["Ground", "First", "Second", "Third", "Fourth", "Fifth"];
export const DEFAULT_ROOM_TYPES = ["Single", "Double", "Triple"];
export const AC_OPTIONS = ["Non-AC", "AC"] as const;
export type AcOption = (typeof AC_OPTIONS)[number];

export type RoomConfig = { floors: string[]; types: string[] };

const KEY = "hostly.owner.room-config";
const DEFAULTS: RoomConfig = { floors: DEFAULT_FLOORS, types: DEFAULT_ROOM_TYPES };

export function useRoomConfig() {
  return useLocalState<RoomConfig>(KEY, DEFAULTS);
}

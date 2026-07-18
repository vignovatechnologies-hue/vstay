import { n as useLocalState } from "./local-store-DgaIVLg3.js";
//#region src/lib/room-config.ts
var DEFAULT_FLOORS = [
	"Ground",
	"First",
	"Second",
	"Third",
	"Fourth",
	"Fifth"
];
var DEFAULT_ROOM_TYPES = [
	"Single",
	"Double",
	"Triple"
];
var AC_OPTIONS = ["Non-AC", "AC"];
var KEY = "hostly.owner.room-config";
var DEFAULTS = {
	floors: DEFAULT_FLOORS,
	types: DEFAULT_ROOM_TYPES
};
function useRoomConfig() {
	return useLocalState(KEY, DEFAULTS);
}
//#endregion
export { useRoomConfig as i, DEFAULT_FLOORS as n, DEFAULT_ROOM_TYPES as r, AC_OPTIONS as t };

export const useRoomStore = defineStore("roomStore", {
  state: () => ({
    room: {
      id: 1,
    } as any | null,
  }),
});

export default {}
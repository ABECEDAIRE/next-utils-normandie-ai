import { create } from "zustand";
import { RecordList } from "../types/record";

export interface ModalStore {
  isVisible: boolean;
  userData: RecordList | null;
  showModal: () => void;
  hideModal: () => void;
  setUserData: (userData: RecordList | null) => void;
  resetData: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  isVisible: false,
  userData: null,
  showModal: () => set({ isVisible: true }),
  hideModal: () => set({ isVisible: false }),
  setUserData: (userData: RecordList | null) => set(() => ({ userData })),
  resetData: () => set(() => ({ userData: null })),
}));

export { useModalStore };

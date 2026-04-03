import { create } from "zustand";

// ── Types ────────────────────────────────────────────────────────────────────

type ModalId =
  | "buy-points"
  | "confirm-logout"
  | "delete-account"
  | "result-detail"
  | null;

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;

  // Mobile nav
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;

  // Modals
  activeModal: ModalId;
  modalData: Record<string, unknown>;
  openModal: (id: ModalId, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Global loading (e.g. page transitions)
  isPageLoading: boolean;
  setPageLoading: (v: boolean) => void;

  // Toast queue (consumed by Sonner provider)
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed:   false,
  toggleSidebar:      () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed:(v) => set({ sidebarCollapsed: v }),

  mobileMenuOpen:    false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  activeModal:  null,
  modalData:    {},
  openModal:    (id, data = {}) => set({ activeModal: id, modalData: data }),
  closeModal:   () => set({ activeModal: null, modalData: {} }),

  isPageLoading:   false,
  setPageLoading:  (v) => set({ isPageLoading: v }),

  commandPaletteOpen:    false,
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
}));





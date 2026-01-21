import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MemberData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  membership: "BRONZE" | "SILVER" | "GOLD";
  totalSpent: number;
  orderCount: number;
  createdAt: string;
}

interface MemberState {
  member: MemberData | null;
  isLoggedIn: boolean;

  login: (data: MemberData) => void;
  logout: () => void;
  updateMember: (data: Partial<MemberData>) => void;
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      member: null,
      isLoggedIn: false,

      login: (data) => set({ member: data, isLoggedIn: true }),

      logout: () => set({ member: null, isLoggedIn: false }),

      updateMember: (data) =>
        set((state) => ({
          member: state.member ? { ...state.member, ...data } : null,
        })),
    }),
    {
      name: "seblak-member-session",
    },
  ),
);

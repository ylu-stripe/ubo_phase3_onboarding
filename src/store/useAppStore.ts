import { create } from "zustand";
import type { AppState, Discovery, Person, Role } from "./types";

export const useAppStore = create<AppState>((set) => ({
  config: {
    ownersFound: true,
    directorsFound: false,
    prefillOwners: [],
    prefillDirectors: [],
  },
  owners: [],
  directors: [],
  emailOutbox: {},
  attestation: undefined,
  ownersConfirmed: false,
  directorsConfirmed: false,
  isInitialized: false,

  initFromConfig: (cfg: Discovery) => {
    const makePerson = (id: string, name: string, role: Role): Person => ({
      id,
      role,
      name,
      status: "missing",
      origin: "prefill",
    });

    set({
      config: cfg,
      owners: cfg.ownersFound ? cfg.prefillOwners.map(o => makePerson(o.id, o.name, "owner")) : [],
      directors: cfg.directorsFound ? cfg.prefillDirectors.map(d => makePerson(d.id, d.name, "director")) : [],
      emailOutbox: {},
      attestation: undefined,
      isInitialized: true,
    });
  },

  addPerson: (p) => {
    const arrKey = p.role === "owner" ? "owners" : "directors";
    set(state => ({ [arrKey]: [...(state as any)[arrKey], p] } as any));
  },

  updatePerson: (id, patch) => {
    set(state => ({
      owners: state.owners.map(o => (o.id === id ? { ...o, ...patch } : o)),
      directors: state.directors.map(d => (d.id === id ? { ...d, ...patch } : d)),
    }));
  },

  removePerson: (id, role) => {
    const arrKey = role === "owner" ? "owners" : "directors";
    set(state => ({
      [arrKey]: (state as any)[arrKey].map((p: Person) => p.id === id ? { ...p, removed: true } : p)
    } as any));
  },

  undoRemovePerson: (id, role) => {
    const arrKey = role === "owner" ? "owners" : "directors";
    set(state => ({
      [arrKey]: (state as any)[arrKey].map((p: Person) => p.id === id ? { ...p, removed: false } : p)
    } as any));
  },

  deletePerson: (id, role) => {
    const arrKey = role === "owner" ? "owners" : "directors";
    set(state => ({
      [arrKey]: (state as any)[arrKey].filter((p: Person) => p.id !== id)
    } as any));
  },

  sendEmailInvite: (id, to, message) => {
    const out = { to, message, sentAt: Date.now(), status: "pending" as const };
    set(state => {
      return {
        emailOutbox: { ...state.emailOutbox, [id]: out },
        owners: state.owners.map(p => p.id === id ? { ...p, status: "pending_email", email: to } : p),
        directors: state.directors.map(p => p.id === id ? { ...p, status: "pending_email", email: to } : p),
      };
    });
  },

  setAttestation: (att) => set({ attestation: att }),
  
  confirmOwners: () => set({ ownersConfirmed: true }),
  
  confirmDirectors: () => set({ directorsConfirmed: true }),
}));


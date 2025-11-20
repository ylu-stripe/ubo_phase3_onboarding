export type Role = "owner" | "director";

export type Person = {
  id: string;
  role: Role;
  name: string;
  address?: string;
  dateOfBirth?: string;
  email?: string; // invite target
  status: "missing" | "complete" | "pending_email";
  origin: "prefill" | "user_added";
  removed?: boolean;
};

export type Discovery = {
  ownersFound: boolean;
  directorsFound: boolean;
  prefillOwners: Array<{ id: string; name: string }>; // name+id only
  prefillDirectors: Array<{ id: string; name: string }>;
};

export type AppState = {
  config: Discovery;
  owners: Person[];
  directors: Person[];
  emailOutbox: Record<string, { to: string; message: string; sentAt: number; status: "pending" | "delivered" | "bounced" }>;
  attestation?: {
    required: boolean;
    signerName?: string;
    timestamp?: number;
    diff?: { removed: string[]; added: string[]; edited: string[] };
    context?: "owners" | "directors" | "both";
    finalList?: string[]; // The final list of people to attest to
  };
  ownersConfirmed: boolean;
  directorsConfirmed: boolean;
  isInitialized: boolean;
  // actions
  initFromConfig: (cfg: Discovery) => void;
  addPerson: (p: Person) => void;
  updatePerson: (id: string, patch: Partial<Person>) => void;
  removePerson: (id: string, role: Role) => void;
  undoRemovePerson: (id: string, role: Role) => void;
  deletePerson: (id: string, role: Role) => void;
  sendEmailInvite: (id: string, to: string, message: string) => void;
  setAttestation: (att: AppState["attestation"]) => void;
  confirmOwners: () => void;
  confirmDirectors: () => void;
};


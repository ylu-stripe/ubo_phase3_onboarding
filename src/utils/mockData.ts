import { v4 as uuidv4 } from "uuid";
import type { Discovery } from "../store/types";

export const mockDiscoveryWithOwners: Discovery = {
  ownersFound: true,
  directorsFound: false,
  prefillOwners: [
    { id: uuidv4(), name: "Alice Example" },
    { id: uuidv4(), name: "Bob Example" }
  ],
  prefillDirectors: []
};

export const mockDiscoveryWithDirectors: Discovery = {
  ownersFound: false,
  directorsFound: true,
  prefillOwners: [],
  prefillDirectors: [
    { id: uuidv4(), name: "Carol Director" }
  ]
};

export const mockDiscoveryWithBoth: Discovery = {
  ownersFound: true,
  directorsFound: true,
  prefillOwners: [
    { id: uuidv4(), name: "Alice Example" },
    { id: uuidv4(), name: "Bob Example" }
  ],
  prefillDirectors: [
    { id: uuidv4(), name: "Carol Director" },
    { id: uuidv4(), name: "David Director" }
  ]
};

export const mockDiscoveryEmpty: Discovery = {
  ownersFound: false,
  directorsFound: false,
  prefillOwners: [],
  prefillDirectors: []
};



import type { Discovery } from "../store/types";

/**
 * Determines the initial route based on discovery configuration
 */
export function getInitialRoute(config: Discovery): string {
  if (config.ownersFound) {
    return "/owners/prefill";
  } else if (config.directorsFound) {
    return "/directors/prefill";
  } else {
    return "/owners/edit";
  }
}

/**
 * Checks if attestation is required by comparing discovered vs final persons
 */
export function isAttestationRequired(
  discoveredIds: string[],
  finalIds: string[]
): boolean {
  if (discoveredIds.length !== finalIds.length) {
    return true;
  }

  const discoveredSet = new Set(discoveredIds);
  const finalSet = new Set(finalIds);

  for (const id of discoveredIds) {
    if (!finalSet.has(id)) {
      return true;
    }
  }

  for (const id of finalIds) {
    if (!discoveredSet.has(id)) {
      return true;
    }
  }

  return false;
}

/**
 * Computes the diff between discovered and final persons
 */
export function computeDiff(
  discoveredPersons: Array<{ id: string; name: string }>,
  finalPersons: Array<{ id: string; name: string }>
): { removed: string[]; added: string[]; edited: string[] } {
  const discoveredMap = new Map(discoveredPersons.map(p => [p.id, p.name]));
  const finalMap = new Map(finalPersons.map(p => [p.id, p.name]));

  const removed: string[] = [];
  const added: string[] = [];
  const edited: string[] = [];

  // Find removed
  for (const [id, name] of discoveredMap) {
    if (!finalMap.has(id)) {
      removed.push(name);
    }
  }

  // Find added
  for (const [id, name] of finalMap) {
    if (!discoveredMap.has(id)) {
      added.push(name);
    }
  }

  // Find edited (same id, different name)
  for (const [id, finalName] of finalMap) {
    const discoveredName = discoveredMap.get(id);
    if (discoveredName && discoveredName !== finalName) {
      edited.push(`${discoveredName} → ${finalName}`);
    }
  }

  return { removed, added, edited };
}



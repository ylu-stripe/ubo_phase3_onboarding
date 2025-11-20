Design brief: Owner/Director verification prototype (Found UBOs first)
Objective

Build a guided flow to verify company owners and/or directors during onboarding.
Core rules:

Users must accept the discovered owners/directors or provide a digital attestation if they differ.
Each person in the system must have minimum details: address and phone number.
Submission is allowed if, for each required person, the info is either completed or an email invite has been sent to collect it (status pending).



Out-of-scope placeholders

Non-relevant onboarding steps.
Identity/KYC checks beyond address and phone.
Email delivery infrastructure (stub a send action and set status to pending).

Prototype configuration (first screen)

Found UBOs: boolean
Found Directors: boolean
Optional toggles for testing:

Force owners mismatch -> require attestation: boolean
Seed prefill owners: list of names (default 2–3)
Seed prefill directors: list of names (default 1–2)



High-level flow states

Found UBOs

Owners prefill -> confirm or edit
If confirm: go to owners list -> per-owner details -> optional email invite -> summary -> submit
If edit: go to owners CRUD -> possibly remove all -> transition to directors if none -> otherwise continue as confirm path
If final owners differ from discovered owners: require attestation step before summary


No UBOs, Directors found

Go directly to directors prefill (same mechanics as owners), but must have at least one director


Nobody found

Owners edit first; user may remove all -> transition to directors; directors edit must have at least one



Routes/screens

/config
/owners/prefill
/owners/edit (CRUD)
/owners (owners list/status overview)
/owners/:id (owner details)
/owners/:id/email (compose invite)
/transition-to-directors
/directors/prefill
/directors/edit
/directors
/directors/:id
/directors/:id/email
/attestation
/summary

Data model (client state)
typescriptCopy codetype Person = {
  id: string
  role: "owner" | "director"
  name: string
  address?: string
  phone?: string
  email?: string // email used for invite
  status: "missing" | "complete" | "pending_email"
  origin: "prefill" | "user_added"
  removed?: boolean
}

type Discovery = {
  ownersFound: boolean
  directorsFound: boolean
  prefillOwners: Person[] // name+id only, status "missing", origin "prefill"
  prefillDirectors: Person[]
}

type AppState = {
  config: Discovery
  owners: Person[] // includes removed:true for soft-delete
  directors: Person[]
  path: "owners" | "directors"
  attestation?: {
    required: boolean
    signerName?: string
    timestamp?: number
    diff?: {
      removed: string[] // names or ids from discovery not in final
      added: string[]   // names or ids in final not in discovery
      edited: string[]  // same identities but changed names (if applicable)
    }
  }
  emailOutbox: {
    [personId: string]: {
      to: string
      message: string
      sentAt: number
      status: "pending" | "delivered" | "bounced" // stubbed: default "pending"
    }
  }
}

Person completeness rule

A person is complete if both address and phone are present.
A person is pending_email if an email invite has been sent for them.
Otherwise missing.

Gating rules

Owners path:

You may proceed to summary if every non-removed owner is complete or pending_email.
If final owners set differs from discovered owners set, attestation is required before summary.
You may remove all owners, but that triggers a transition screen to move to directors.


Directors path:

Must have at least one director (non-removed) to proceed.
Same completeness/pending rule as owners for submission.


Submission:

Allowed if all required persons in the active path satisfy completeness rule; attestation satisfied if required.



Set matching and attestation

Define the discovered set $D$ and final set $F$ for the active role by person identity.
Identity match key: use id assigned during discovery. For user-added persons, assign new ids.
Attestation is required if $D != F$ by ids (ignoring removed:true), or if config forces mismatch.
Attestation screen:

Show diff (removed, added, edited).
Require text input signerName and a checkbox “I attest…”.
On confirm, store attestation.required=true, signerName, timestamp, and allow forward navigation.



Detailed flow: Found UBOs

/owners/prefill


Inputs: config.prefillOwners
UI:

Show discovered owner names.
Actions: Confirm or Edit


Confirm -> /owners
Edit -> /owners/edit

2A) Confirm path -> /owners

Show cards/rows of owners with status chips:

Missing info (yellow), Complete (green), Pending email (blue)


CTA on each owner: Provide details and Send email instead
Global CTA: Continue (disabled until all owners are complete or pending)
Owner click -> /owners/:id
Send email -> /owners/:id/email

2A.i) /owners/:id (details)

Fields: address, phone
Save sets status to complete
Link: Can't provide now? Send email to collect -> /owners/:id/email

2A.ii) /owners/:id/email

Prefill: owner name in email template
Inputs: owner.email (required to send), optional custom message
Action: Send
On Send:

Create emailOutbox[owner.id] with status="pending"
Set owner status to pending_email
Return to /owners (or next owner shortcut)



2A.iii) Attestation gate

When navigating from /owners to /summary, compute diff vs discovery.
If different, route to /attestation first. On completion, proceed to /summary.

2B) Edit path -> /owners/edit

Pre-populated list “Your owners” with all discovered owners, each with:

Status chip: Missing information
Actions per row: Edit name, Remove


Secondary section “Removed” showing soft-deleted owners with Undo.
Actions:

Add owner (user-added owner starts with status missing)

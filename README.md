# UBO Verification Prototype

A React + TypeScript prototype for verifying company owners and directors during onboarding, built with Vite, React Router, and Zustand.

## Overview

This prototype implements a guided flow to verify company owners (Ultimate Beneficial Owners - UBOs) and/or directors with the following core features:

- **Discovery-based flow**: Start with discovered owners/directors or manually add them
- **Flexible verification**: Collect details directly or send email invites
- **Digital attestation**: Required when the final list differs from discovered persons
- **Gating rules**: Ensures minimum required information before submission

## Project Structure

```
src/
├── store/
│   ├── types.ts          # TypeScript types and interfaces
│   └── useAppStore.ts    # Zustand state management
├── pages/               # Route components
│   ├── ConfigPage.tsx
│   ├── OwnersPrefill.tsx
│   ├── OwnersEdit.tsx
│   ├── OwnersList.tsx
│   ├── OwnerDetails.tsx
│   ├── OwnerEmailCompose.tsx
│   ├── TransitionToDirectors.tsx
│   ├── DirectorsPrefill.tsx
│   ├── DirectorsEdit.tsx
│   ├── DirectorsList.tsx
│   ├── DirectorDetails.tsx
│   ├── DirectorEmailCompose.tsx
│   ├── Attestation.tsx
│   └── Summary.tsx
├── components/          # Reusable components
│   ├── PersonCard.tsx
│   ├── PersonForm.tsx
│   ├── EmailComposer.tsx
│   └── AttestationForm.tsx
├── utils/
│   ├── mockData.ts      # Mock data for testing
│   └── routing.ts       # Routing utilities
├── App.tsx
├── main.tsx
└── routes.tsx
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Features

### Configuration Screen
- Toggle whether owners/directors were found
- Seed prefill data for testing different scenarios

### Person Completeness Rules
- **Complete**: Both address and phone are provided
- **Pending Email**: An email invite has been sent
- **Missing**: Neither complete nor pending

### Gating Rules

**Owners Path:**
- May proceed to summary if all owners are complete or pending_email
- If final owners differ from discovered, attestation is required
- May remove all owners, triggering transition to directors

**Directors Path:**
- Must have at least one director to proceed
- Same completeness rules as owners

### Attestation
- Required when final list differs from discovered list
- Captures signer name, timestamp, and diff (removed/added/edited)
- Shows clear diff visualization before requiring confirmation

## Technical Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Webpack 5** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Zustand** - State management
- **uuid** - Unique ID generation

## Design Brief

See `designbrief.md` for the complete specification and requirements.


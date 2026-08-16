# Plurse Access Key - Complete State & Transition Matrix

This document maps every possible combination of database flags in the `access_keys` table. Use these combinations when constructing Prisma/Supabase queries, RLS policies, or Server Action filters.

---

## 1. Complete Visual Transition Flow

```mermaid
graph TD
    %% Base States
    ST_INV[1. Standalone Inventory]
    SELF_BIZ[2. Self-Owned Business]
    PTN_DIST[3. Partner Distributed]
    DIR_COMP[4. Direct Company Key]
    GHOST_UNL[5. Historical Unlinked Partner Key]

    %% Transitions
    Mint((Mint Key)) -->|User mints floating key| ST_INV
    Mint -->|Admin/System assigns direct| DIR_COMP
    
    ST_INV -->|Link to Self Wizard Toggle| SELF_BIZ
    ST_INV -->|Link to External Client| PTN_DIST
    
    PTN_DIST -->|Client breaks contract / Unlinks| GHOST_UNL
    GHOST_UNL -->|Re-assigned to new client| PTN_DIST

    %% Styles
    style ST_INV fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style SELF_BIZ fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style PTN_DIST fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style DIR_COMP fill:#f3f4f6,stroke:#4b5563,stroke-width:2px
    style GHOST_UNL fill:#fee2e2,stroke:#dc2626,stroke-width:2px
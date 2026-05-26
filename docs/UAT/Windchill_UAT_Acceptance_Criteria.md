# Windchill PLM – UAT Acceptance Criteria
## CAD Data Management & BOM Management

**Project Context:** Fresh Windchill Implementation | Medical Device Company | Creo Integration  
**Regulatory Context:** 21 CFR Part 11 · 21 CFR Part 820 · ISO 13485  
**Document Type:** User Acceptance Test (UAT) Acceptance Criteria  
**Format:** Narrative (User Story + Acceptance Checklist)  
**Status:** Draft  

---

## Glossary

| Term | Definition |
|---|---|
| CAD Doc | A Windchill EPMDocument representing a Creo file (part, assembly, drawing) |
| CommonSpace | Windchill server-side storage (PDM vault) |
| Workspace | User's working area in Windchill used for check-out/check-in |
| EBOM | Engineering Bill of Materials |
| ECR | Engineering Change Request |
| ECO | Engineering Change Order |
| DHF | Design History File |
| Part | Windchill Part object linked to CAD Doc |
| Iteration | Minor save (not released); Revision = released version (A, B, C…) |
| Lifecycle | Set of states an object passes through (In Work → Under Review → Released) |

---

## MODULE 1: CAD Data Management

---

### US-CAD-01 · CAD Workspace Setup & Creo Integration

**As a** CAD engineer,  
**I want to** connect Creo to Windchill and create a personal workspace,  
**So that** I can check out, modify, and check in CAD files in a controlled manner.

#### Acceptance Criteria

- [ ] **AC-CAD-01-01** — A user can log in to Windchill from within Creo using their corporate credentials (SSO or username/password). Login failure with invalid credentials returns a clear error message and does not grant access.
- [ ] **AC-CAD-01-02** — After login, the Windchill server context (host, product context) is visible in the Creo file browser under "Windchill."
- [ ] **AC-CAD-01-03** — A user can create a new personal Workspace from within Creo (File > Manage Session > Server Workspaces > New) and the workspace is visible in the Windchill web client immediately.
- [ ] **AC-CAD-01-04** — A user can set an active workspace, and all subsequent check-out/check-in operations are scoped to that workspace.
- [ ] **AC-CAD-01-05** — Workspace creation is captured in the Windchill audit trail with user ID, timestamp, and workspace name.

---

### US-CAD-02 · Uploading CAD Files to Windchill (First-Time Check-In)

**As a** CAD engineer,  
**I want to** upload a new Creo CAD file (part, assembly, or drawing) to Windchill for the first time,  
**So that** the file is stored securely in the vault and becomes version-controlled.

#### Acceptance Criteria

- [ ] **AC-CAD-02-01** — A user can upload a new Creo `.prt`, `.asm`, or `.drw` file to Windchill via Creo (File > Save > Save to Windchill). The system creates a corresponding **EPMDocument** in Windchill.
- [ ] **AC-CAD-02-02** — On first check-in, the system auto-generates a unique part/document number per the configured numbering scheme (no manual number required unless policy mandates it).
- [ ] **AC-CAD-02-03** — The CAD document is created at **Revision A, Iteration 1** in the **"In Work"** lifecycle state.
- [ ] **AC-CAD-02-04** — The check-in wizard prompts the user to fill in required metadata attributes (e.g., Description, Product Line, Owner). The system prevents check-in if mandatory attributes are empty.
- [ ] **AC-CAD-02-05** — For a Creo Assembly, all dependent child parts and drawings are uploaded together (family tree / dependency check), and their relationships are preserved in Windchill.
- [ ] **AC-CAD-02-06** — The newly uploaded CAD document appears in the user's active workspace and is searchable by name and number in Windchill within 60 seconds.
- [ ] **AC-CAD-02-07** — An audit log entry is created recording: user, action (Upload/Check-In), document number, revision, timestamp, and Creo client version.

---

### US-CAD-03 · Check-Out of CAD Files

**As a** CAD engineer,  
**I want to** check out a CAD file from Windchill before editing it,  
**So that** no other user can make conflicting changes while I am working on it.

#### Acceptance Criteria

- [ ] **AC-CAD-03-01** — A user with **Modify** permission can check out a CAD document from Windchill (from Creo or from the web client). The object's status changes to **"Checked Out"** and the checkout owner is displayed.
- [ ] **AC-CAD-03-02** — Other users viewing the same object see a **lock icon** and the name of the user who has it checked out. They cannot check out the same file simultaneously.
- [ ] **AC-CAD-03-03** — A user without **Modify** permission receives a clear permission-denied message when attempting to check out.
- [ ] **AC-CAD-03-04** — A user can perform a **"Get Latest"** (read-only copy) of a checked-out file without breaking the lock.
- [ ] **AC-CAD-03-05** — An administrator can **undo checkout** (break lock) with justification, and the action is recorded in the audit trail.
- [ ] **AC-CAD-03-06** — Check-out event is recorded in the audit trail: user, file, revision, timestamp.

---

### US-CAD-04 · Check-In of Modified CAD Files

**As a** CAD engineer,  
**I want to** check in my modified CAD file back to Windchill after editing,  
**So that** the new version is saved and the file is unlocked for others.

#### Acceptance Criteria

- [ ] **AC-CAD-04-01** — A user can check in a modified CAD file from Creo (File > Check In). The system creates a new **iteration** of the same revision.
- [ ] **AC-CAD-04-02** — The user is prompted for a mandatory **change description / iteration note** before check-in completes.
- [ ] **AC-CAD-04-03** — After check-in, the file lock is released and the status returns to **"Checked In."**
- [ ] **AC-CAD-04-04** — The previous iterations (history) remain accessible and viewable; no iteration is deleted on check-in.
- [ ] **AC-CAD-04-05** — For an Assembly check-in, unchanged children are not re-checked-in unnecessarily; only modified components are updated.
- [ ] **AC-CAD-04-06** — The check-in event is logged in the audit trail with: user, iteration number, change description, and timestamp.
- [ ] **AC-CAD-04-07** — The **associated Windchill Part** (if linked) is automatically updated to reference the new CAD iteration.

---

### US-CAD-05 · Version & Revision History

**As a** design engineer or quality engineer,  
**I want to** view the full version and revision history of a CAD document,  
**So that** I can trace changes over time and meet Design History File (DHF) requirements.

#### Acceptance Criteria

- [ ] **AC-CAD-05-01** — The Windchill object information page displays all **revisions** (A, B, C…) and **iterations** (A.1, A.2, A.3…) of a CAD document in chronological order.
- [ ] **AC-CAD-05-02** — Each iteration record shows: revision, iteration number, check-in user, check-in timestamp, and change description.
- [ ] **AC-CAD-05-03** — A user can open and view (read-only) any prior iteration of a CAD document from the history.
- [ ] **AC-CAD-05-04** — Revisions increment (A → B → C) only when the object passes through the **Release** lifecycle gate, not on every check-in.
- [ ] **AC-CAD-05-05** — Deletion of any revision or iteration is **prevented** for released objects; an attempt returns a clear error message compliant with 21 CFR Part 11 record retention requirements.
- [ ] **AC-CAD-05-06** — A user can compare two iterations or revisions to identify attribute and metadata differences.

---

### US-CAD-06 · CAD Lifecycle Management

**As a** design/quality engineer,  
**I want to** progress a CAD document through defined lifecycle states (In Work → Under Review → Released → Obsolete),  
**So that** only approved designs are accessible for production use.

#### Acceptance Criteria

- [ ] **AC-CAD-06-01** — A CAD document's lifecycle states are: **In Work → Under Review → Released → Obsolete**. The states are displayed prominently on the object page.
- [ ] **AC-CAD-06-02** — A user can **promote** a document to "Under Review" only when all mandatory attributes are populated and the document is checked in (not locked).
- [ ] **AC-CAD-06-03** — Transition from "Under Review" to "Released" requires an **electronic signature** with username, password, and signature meaning (e.g., "Approved") per 21 CFR Part 11 §11.50.
- [ ] **AC-CAD-06-04** — The electronic signature captures and stores: signer name, role, date/time, and signature meaning — this is immutable once signed.
- [ ] **AC-CAD-06-05** — A released CAD document **cannot be modified** (checked out) without initiating a change process (ECR/ECO). Attempting to do so returns a clear error.
- [ ] **AC-CAD-06-06** — Only users with the **Release** role can transition an object to "Released."
- [ ] **AC-CAD-06-07** — Transition to "Obsolete" is audited and requires a mandatory reason/justification entry.
- [ ] **AC-CAD-06-08** — All lifecycle state transitions are recorded in the audit trail.

---

### US-CAD-07 · CAD Search & Retrieval

**As a** design engineer or document controller,  
**I want to** search for CAD files using various criteria,  
**So that** I can quickly locate the correct file without browsing folder hierarchies.

#### Acceptance Criteria

- [ ] **AC-CAD-07-01** — A user can search for CAD documents by: **number, name, description, revision, lifecycle state, owner, creation date range, and product context**.
- [ ] **AC-CAD-07-02** — Wildcard search (e.g., `MDV-*`, `*motor*`) is supported and returns results within **5 seconds** for a dataset of up to 10,000 objects.
- [ ] **AC-CAD-07-03** — Search results display: document number, name, revision, state, owner, and last modified date.
- [ ] **AC-CAD-07-04** — A user can filter search results by lifecycle state (e.g., show only "Released" files).
- [ ] **AC-CAD-07-05** — A user **cannot see** CAD documents for contexts/products to which they do not have read access (access control enforcement validated).
- [ ] **AC-CAD-07-06** — Search results can be exported to CSV/Excel for reporting purposes.

---

### US-CAD-08 · CAD Visualization (View Without Creo)

**As a** manufacturing engineer, quality engineer, or reviewer,  
**I want to** view CAD geometry and drawings in Windchill without a Creo license,  
**So that** I can review designs without needing CAD software.

#### Acceptance Criteria

- [ ] **AC-CAD-08-01** — A user without a Creo license can open and rotate/pan/zoom a 3D CAD model using the **Creo View** embedded viewer in the Windchill web client.
- [ ] **AC-CAD-08-02** — Creo drawings (`.drw`) are viewable in the web client with correct rendering of dimensions, title block, and GD&T annotations.
- [ ] **AC-CAD-08-03** — The viewer correctly renders the **Released** revision of an assembly with all sub-components.
- [ ] **AC-CAD-08-04** — A user can take **measurements** (distance, angle) in the 3D viewer without a Creo license.
- [ ] **AC-CAD-08-05** — The viewing action is recorded in the audit trail (user, document, revision, timestamp) — required for 21 CFR Part 11 access logging.

---

### US-CAD-09 · Access Control & Permissions

**As a** system administrator,  
**I want to** enforce role-based access control on all CAD objects,  
**So that** only authorized users can read, modify, or release design data.

#### Acceptance Criteria

- [ ] **AC-CAD-09-01** — Access to CAD documents is governed by **Windchill Access Control Policies** tied to product context and lifecycle state.
- [ ] **AC-CAD-09-02** — Roles tested at minimum: **Read-only Viewer, CAD Author, Change Analyst, Quality Reviewer, Release Manager, Administrator**.
- [ ] **AC-CAD-09-03** — A **Read-only Viewer** can view and download but cannot check out, modify, or promote lifecycle.
- [ ] **AC-CAD-09-04** — A **CAD Author** can create, check out, check in, and upload but cannot release.
- [ ] **AC-CAD-09-05** — Access control changes are logged in the audit trail.
- [ ] **AC-CAD-09-06** — Unauthorized access attempts (403 responses) are logged.

---

## MODULE 2: BOM Management

---

### US-BOM-01 · Automatic EBOM Creation from Creo Assembly

**As a** design engineer,  
**I want to** automatically generate an Engineering BOM in Windchill when I check in a Creo assembly,  
**So that** the BOM always reflects the CAD assembly structure without manual re-entry.

#### Acceptance Criteria

- [ ] **AC-BOM-01-01** — When a Creo assembly (`.asm`) is checked into Windchill, the system **automatically creates or updates the EBOM** structure under the associated Windchill Part, reflecting the CAD assembly hierarchy.
- [ ] **AC-BOM-01-02** — Each BOM line item includes: **Part Number, Part Name, Revision, Quantity, Unit of Measure, and Find Number** (balloon number from assembly).
- [ ] **AC-BOM-01-03** — Multi-level assembly structures are reflected as a **multi-level BOM** in Windchill (not flattened).
- [ ] **AC-BOM-01-04** — If a sub-assembly contains a sub-sub-assembly, all levels are captured correctly (minimum 5-level nesting validated).
- [ ] **AC-BOM-01-05** — BOM generation completes within **60 seconds** for assemblies with up to 500 components.
- [ ] **AC-BOM-01-06** — The BOM creation/update is recorded in the audit trail with timestamp and triggering user.

---

### US-BOM-02 · Manual BOM Creation & Editing in Windchill

**As a** design engineer or configuration manager,  
**I want to** create and manually edit an EBOM in Windchill,  
**So that** I can add, remove, or update components when CAD is not the source of truth (e.g., purchased parts, software components).

#### Acceptance Criteria

- [ ] **AC-BOM-02-01** — A user with appropriate permissions can create a new **Windchill Part** and manually add children to form a BOM structure (without CAD).
- [ ] **AC-BOM-02-02** — The BOM editor allows adding: **existing parts** (search and add), **new parts** (create in-line), and **substitute parts**.
- [ ] **AC-BOM-02-03** — The user can set and edit the following attributes per BOM line: Quantity, Unit of Measure, Find Number, Reference Designator, and Notes.
- [ ] **AC-BOM-02-04** — A user can **remove a child** from the BOM; the removal is tracked in version history.
- [ ] **AC-BOM-02-05** — BOM edits are only possible when the parent Part is in **"In Work"** lifecycle state. Attempting to edit a Released BOM returns a clear error.
- [ ] **AC-BOM-02-06** — All BOM additions, removals, and attribute changes are captured in the object's version history and audit trail.
- [ ] **AC-BOM-02-07** — A user can reorder BOM line items by Find Number or manually.

---

### US-BOM-03 · BOM Viewing & Navigation

**As a** stakeholder (engineer, quality, manufacturing, procurement),  
**I want to** view the full BOM structure in Windchill,  
**So that** I can understand the product structure at any point in its lifecycle.

#### Acceptance Criteria

- [ ] **AC-BOM-03-01** — The BOM is viewable as a **tree (hierarchical)** and as a **flat/indented table** from the Windchill web client.
- [ ] **AC-BOM-03-02** — Each BOM view shows: Part Number, Name, Revision, Quantity, UoM, Find Number, Lifecycle State, and CAD link indicator.
- [ ] **AC-BOM-03-03** — A user can expand and collapse BOM levels interactively.
- [ ] **AC-BOM-03-04** — Clicking a part in the BOM navigates to that Part's detail page (including its associated CAD doc, attributes, and history).
- [ ] **AC-BOM-03-05** — The **"Where Used"** function correctly identifies all parent assemblies that reference a given part, across the full product catalog.
- [ ] **AC-BOM-03-06** — A user can toggle between viewing the **latest iteration** vs. a **specific revision** of the BOM.

---

### US-BOM-04 · BOM Revision & Lifecycle Management

**As a** design engineer and quality engineer,  
**I want to** control the revision and lifecycle of BOM structures,  
**So that** only approved BOMs are used for production and the history is preserved for regulatory traceability.

#### Acceptance Criteria

- [ ] **AC-BOM-04-01** — The BOM (Parent Part) follows the same lifecycle as its CAD document: **In Work → Under Review → Released → Obsolete**.
- [ ] **AC-BOM-04-02** — When a Part is **Released**, its BOM structure (children and quantities) is **frozen** — no edits can be made without a change process.
- [ ] **AC-BOM-04-03** — A new revision of a Part (e.g., A → B) creates a **new editable BOM** that initially copies the structure from the prior revision. The prior released BOM remains accessible and unchanged.
- [ ] **AC-BOM-04-04** — Releasing a top-level assembly **does not force-release** child parts; each child part/BOM manages its own lifecycle independently (unless a mass-release workflow is triggered).
- [ ] **AC-BOM-04-05** — **Electronic signatures** are required to transition the Part/BOM from "Under Review" to "Released," capturing signer, role, date/time, and meaning (per 21 CFR Part 11).
- [ ] **AC-BOM-04-06** — All BOM lifecycle transitions are recorded in the audit trail.

---

### US-BOM-05 · BOM Comparison

**As a** change analyst or quality engineer,  
**I want to** compare two versions of a BOM side by side,  
**So that** I can identify exactly what changed between revisions (e.g., for change impact analysis or regulatory review).

#### Acceptance Criteria

- [ ] **AC-BOM-05-01** — A user can select two revisions (or iterations) of the same Part and initiate a **BOM Compare** from the Windchill web UI.
- [ ] **AC-BOM-05-02** — The comparison report highlights: **Added parts, Removed parts, Changed quantities, Changed attributes** (UoM, Find Number, reference designator).
- [ ] **AC-BOM-05-03** — The comparison correctly handles multi-level BOMs, showing changes at all levels.
- [ ] **AC-BOM-05-04** — The comparison results can be **exported to PDF or Excel** for inclusion in change packages or DHF documentation.
- [ ] **AC-BOM-05-05** — Comparison of two different parts (not just revisions of the same part) is also supported (for platform/variant analysis).

---

### US-BOM-06 · Part Number Management

**As a** configuration manager or design engineer,  
**I want to** create and manage Part Numbers in Windchill with controlled numbering,  
**So that** every component has a unique, traceable identifier aligned with our numbering convention.

#### Acceptance Criteria

- [ ] **AC-BOM-06-01** — New Part numbers are generated using the configured **auto-numbering scheme** (e.g., prefix + sequence). Manual override (if permitted by policy) requires elevated role.
- [ ] **AC-BOM-06-02** — Part numbers are **unique** system-wide; attempting to create a duplicate number returns an error.
- [ ] **AC-BOM-06-03** — Required Part attributes (e.g., Description, Type, Owner, Product Line) must be populated before a Part can be checked in. Missing attributes block the operation with a clear message.
- [ ] **AC-BOM-06-04** — Part Types defined in the system (e.g., Raw Material, Subassembly, Finished Good, Purchased Part, Software Component) can be assigned and are filterable in search.
- [ ] **AC-BOM-06-05** — A Part can be linked to one or more **CAD documents** (EPMDocuments), and this association is visible on both the Part and the CAD document pages.
- [ ] **AC-BOM-06-06** — Part number creation is recorded in the audit trail.

---

### US-BOM-07 · BOM Export & Reporting

**As a** manufacturing engineer, procurement lead, or quality engineer,  
**I want to** export the BOM in standard formats,  
**So that** I can share it with ERP systems, suppliers, or include it in regulatory documentation.

#### Acceptance Criteria

- [ ] **AC-BOM-07-01** — A user can export a BOM to **Excel (.xlsx)** with all levels of hierarchy and all standard attributes (Part Number, Name, Revision, Quantity, UoM, Find Number, State).
- [ ] **AC-BOM-07-02** — A user can export a BOM to **CSV** format for ERP import (e.g., SAP, Oracle).
- [ ] **AC-BOM-07-03** — A user can generate a **PDF BOM report** stamped with the Part Number, Revision, Export Date, and the exporting user's name.
- [ ] **AC-BOM-07-04** — Export of a **Released** BOM includes the revision that was in effect at the time, not a later In-Work revision.
- [ ] **AC-BOM-07-05** — Export actions are recorded in the audit trail (user, BOM part number, revision, export format, timestamp).
- [ ] **AC-BOM-07-06** — For regulated submissions, the exported BOM clearly identifies: Part Number, Revision Letter, Release Date, and Releasing Authority.

---

### US-BOM-08 · BOM Configuration & Variants (Optional/Configurable Items)

**As a** configuration manager,  
**I want to** define variant BOMs or option sets in Windchill,  
**So that** a single product family can be managed with one master BOM and variant rules, rather than separate BOMs per model.

#### Acceptance Criteria

- [ ] **AC-BOM-08-01** — The system supports marking BOM line items as **"Optional"** or assigning **effectivity rules** (e.g., effective for serial numbers 001–100 only).
- [ ] **AC-BOM-08-02** — A user can define **Choice sets** (variant options) at the BOM level (e.g., Country Kit A vs Country Kit B).
- [ ] **AC-BOM-08-03** — The system can generate a **filtered BOM view** based on a selected variant/option combination.
- [ ] **AC-BOM-08-04** — Variant rules are versioned and released along with the master BOM.
- [ ] **AC-BOM-08-05** — *(If not implemented in Phase 1)* — The system provides a clear error or "not available" message rather than incorrect data when variant features are accessed.

---

### US-BOM-09 · Change-Controlled BOM Update (ECO Integration)

**As a** change analyst or design engineer,  
**I want to** update a released BOM only via an approved Engineering Change Order (ECO),  
**So that** all BOM changes in a regulated product are fully traceable, approved, and documented.

#### Acceptance Criteria

- [ ] **AC-BOM-09-01** — A released BOM **cannot be directly edited**. A user must initiate an **ECR or ECO** in Windchill to unlock and revise it.
- [ ] **AC-BOM-09-02** — The ECO includes a **"Before" and "After"** BOM comparison, generated automatically by Windchill, as part of the change package.
- [ ] **AC-BOM-09-03** — Approval of an ECO (with required electronic signatures) promotes the new BOM revision to **Released**, simultaneously obsoleting the previous revision.
- [ ] **AC-BOM-09-04** — The ECO number is traceable from the new BOM revision — a user can navigate from the released BOM directly to the ECO that authorized the change.
- [ ] **AC-BOM-09-05** — Rejected ECOs result in no change to the released BOM.
- [ ] **AC-BOM-09-06** — All ECO-related BOM changes are captured in the audit trail with full approval chain.

---

## Cross-Cutting Acceptance Criteria (Applicable to All Modules)

---

### US-CC-01 · Audit Trail & 21 CFR Part 11 Compliance

**As a** quality/regulatory manager,  
**I want to** confirm that Windchill maintains a complete, tamper-proof audit trail of all actions,  
**So that** we meet FDA 21 CFR Part 11 electronic records and electronic signature requirements.

#### Acceptance Criteria

- [ ] **AC-CC-01-01** — Every create, read (where required), update, delete, and lifecycle transition action on a CAD Document or Part/BOM is recorded in the Windchill audit log.
- [ ] **AC-CC-01-02** — Each audit entry includes: **who** (user ID + display name), **what** (action + object number), **when** (timestamp with timezone), and **old/new value** (for attribute changes).
- [ ] **AC-CC-01-03** — Audit log records **cannot be edited or deleted** by any user, including system administrators.
- [ ] **AC-CC-01-04** — Audit log can be **searched and exported** by quality managers for a defined date range, user, or object.
- [ ] **AC-CC-01-05** — Electronic signatures used in lifecycle promotion meet 21 CFR Part 11 §11.50 requirements: unique to individual, non-repudiable, linked to the specific record.
- [ ] **AC-CC-01-06** — System time is synchronized to a trusted NTP source; timestamp accuracy is within ±1 second.

---

### US-CC-02 · System Performance

**As a** end user,  
**I want to** perform routine PLM tasks without unacceptable delays,  
**So that** the system is usable in day-to-day engineering workflows.

#### Acceptance Criteria

- [ ] **AC-CC-02-01** — Windchill web pages (object detail, BOM view, search results) load within **5 seconds** for a concurrent user load of 20 users.
- [ ] **AC-CC-02-02** — Check-in of a Creo assembly with up to 100 components completes within **3 minutes**.
- [ ] **AC-CC-02-03** — BOM generation from a 500-component assembly completes within **60 seconds**.
- [ ] **AC-CC-02-04** — Search results for up to 10,000 objects are returned within **5 seconds**.

---

### US-CC-03 · Data Integrity

**As a** quality engineer,  
**I want to** confirm that relationships between CAD files and Parts/BOMs are always consistent,  
**So that** the released BOM always matches the released CAD design.

#### Acceptance Criteria

- [ ] **AC-CC-03-01** — The CAD document and its linked Windchill Part are always at the same revision when both are released together via ECO.
- [ ] **AC-CC-03-02** — Deleting a CAD document that is linked to a Part is **blocked** by the system with a referential integrity error.
- [ ] **AC-CC-03-03** — A BOM referencing a part at Revision A continues to reference Revision A even after Revision B is released (revision-specific BOM links).
- [ ] **AC-CC-03-04** — The system detects and alerts users to **out-of-date CAD references** in an assembly (e.g., a sub-part has a newer released revision than what the assembly references).

---

## UAT Sign-Off Checklist

| # | Module | User Story | Tester | Test Date | Result (Pass/Fail) | Defect ID | Sign-Off |
|---|---|---|---|---|---|---|---|
| 1 | CAD | US-CAD-01 – Workspace Setup | | | | | |
| 2 | CAD | US-CAD-02 – First Check-In | | | | | |
| 3 | CAD | US-CAD-03 – Check-Out | | | | | |
| 4 | CAD | US-CAD-04 – Check-In After Edit | | | | | |
| 5 | CAD | US-CAD-05 – Version History | | | | | |
| 6 | CAD | US-CAD-06 – Lifecycle Management | | | | | |
| 7 | CAD | US-CAD-07 – Search & Retrieval | | | | | |
| 8 | CAD | US-CAD-08 – Visualization | | | | | |
| 9 | CAD | US-CAD-09 – Access Control | | | | | |
| 10 | BOM | US-BOM-01 – Auto EBOM from Creo | | | | | |
| 11 | BOM | US-BOM-02 – Manual BOM Edit | | | | | |
| 12 | BOM | US-BOM-03 – BOM View & Navigation | | | | | |
| 13 | BOM | US-BOM-04 – BOM Lifecycle | | | | | |
| 14 | BOM | US-BOM-05 – BOM Comparison | | | | | |
| 15 | BOM | US-BOM-06 – Part Number Mgmt | | | | | |
| 16 | BOM | US-BOM-07 – BOM Export | | | | | |
| 17 | BOM | US-BOM-08 – Variants (if in scope) | | | | | |
| 18 | BOM | US-BOM-09 – ECO-Controlled Change | | | | | |
| 19 | Cross | US-CC-01 – Audit Trail / 21 CFR 11 | | | | | |
| 20 | Cross | US-CC-02 – Performance | | | | | |
| 21 | Cross | US-CC-03 – Data Integrity | | | | | |

---

*Document Owner: [TBD] | Review Cycle: Before each UAT sprint | Next Review: [TBD]*

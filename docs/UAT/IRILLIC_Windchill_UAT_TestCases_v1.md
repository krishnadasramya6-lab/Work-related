# IRILLIC — Windchill PLM 13.x
## UAT Test Case Document

| Field | Value |
|---|---|
| Client | IRILLIC |
| Windchill Version | Windchill 13.x (PDMLink) |
| CAD Tool | Creo Parametric 12 |
| Document Ref | IRILLIC-WC-UAT-TC-v1.0 |
| Prepared By | *(to be filled)* |
| Status | DRAFT |
| Date | 10 Jul 2026 |

**Products:** OAK001 (.NM) · ELM001 (L.NM) · XNM001 (X.NM)  
**Libraries:** Library – Irillic QMS · Library – QMS Records  
**Lifecycle states:** In Work → Under Review → Approved Not Effective → Released → Obsolete  
**Versioning:** 0.1 → 0.2 → … → 1.0 (Release)  
**Auto-number pattern:** `OAK001-W-0001` *(type code per Document Numbering sheet — to be confirmed)*  
**No-delete policy:** ALL non-admin roles — delete blocked at every lifecycle state  
**Publish on Release:** PDF, STEP, DXF, STL, DWG  
**Regulatory context:** FDA 21 CFR Part 11 · 21 CFR Part 820 · ISO 13485  

---

## Priority & Severity Legend

| Priority | Meaning |
|---|---|
| Critical | Blocker — UAT cannot proceed or phase sign-off fails if this TC fails |
| High | Must pass for sign-off; deferral requires QA approval |
| Medium | Should pass; deferral allowed with documented justification |

| Severity | Definition |
|---|---|
| S1 – Blocker | System unusable; no workaround; blocks phase |
| S2 – Major | Core function broken; workaround possible but unacceptable |
| S3 – Minor | Non-critical function impaired; workaround exists |
| S4 – Cosmetic | UI/label issue; no functional impact |

---

## PHASE 0 — Pre-UAT Environment Setup

> ⚠ All 8 items below are **blocker checks**, not test cases. Every item must be confirmed ✓ before Phase 1 begins.

| ENV # | Checklist Item | Acceptance Criterion | Owner | Result (✓ / ✗) | Date | Notes |
|---|---|---|---|---|---|---|
| ENV-001 | Windchill 13.x server accessible | HTTPS URL confirmed; no certificate errors; login page loads in browser | PDS Team | | | |
| ENV-002 | Creo 12 installed on test machines | Creo 12 launches on all UAT machines post IRILLIC licence sharing; Windchill toolbar visible in Creo | PDS Team | | | |
| ENV-003 | CAD Worker configured | Upload a `.prt` → promote to Released → verify PDF, STEP, DXF, STL, DWG generated and attached to object | PDS Team | | | |
| ENV-004 | MS Office Worker configured | Upload a `.docx` → PDF representation generated automatically; visible in content tab | PDS Team | | | |
| ENV-005 | Thumbnail Worker configured | Upload CAD `.prt` and a `.docx` → thumbnail visible on object card in Windchill | PDS Team | | | |
| ENV-006 | Test user accounts created | Accounts active for: Designer, Reviewer, Manager, Lead, Guest, Product Manager (wcadmin) — all with correct roles assigned | PDS Team | | | |
| ENV-007 | Test environment isolated from Production | Separate URL; dedicated containers OAK001/ELM001/XNM001 in test env; no live production data present | PDS / IT | | | |
| ENV-008 | Mail server configured | Send a test workflow notification → email received in Reviewer inbox; required for Phases 6–7 email tests | PDS / IRILLIC IT | | | |

---

## PHASE 1 — Administration

**Goal:** Validate IRILLIC org structure, user/role mapping, custom attributes, product & library containers, project template, and worker smoke tests.  
**Requirement IDs:** ADM-001 to ADM-011  
**Depends On:** Phase 0 complete  
**Est. Test Cases:** 12

---

### ADM-TC-001 · Organisation & Site Configuration

| Field | Value |
|---|---|
| TC ID | ADM-TC-001 |
| Title | Verify IRILLIC organisation and site configuration |
| Requirement Ref | ADM-001 |
| Priority | Critical |
| Test Role | Product Manager (wcadmin) |

**Preconditions:**
- Windchill 13.x server is accessible (ENV-001 confirmed)
- Logged in as wcadmin

**Test Steps:**
1. Navigate to **Site > Organizations**
2. Confirm organisation named **"IRILLIC"** exists
3. Open the IRILLIC org settings; verify site name, locale, and timezone are correctly configured
4. Navigate to **Site > Administrators** and confirm wcadmin is listed

**Expected Results:**
1. IRILLIC organisation is present in the org list
2. Org settings show correct site name, locale (English), and timezone aligned with IRILLIC operations
3. wcadmin is listed as site administrator

**Pass Criteria:** All 3 expected results confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-002 · User Creation & Role Mapping

| Field | Value |
|---|---|
| TC ID | ADM-TC-002 |
| Title | Verify test user accounts exist with correct roles |
| Requirement Ref | ADM-002 |
| Priority | Critical |
| Test Role | Product Manager (wcadmin) |

**Preconditions:**
- ENV-006 confirmed

**Test Steps:**
1. Navigate to **Site > Participants > Users**
2. Verify the following user accounts exist: Designer (test_designer), Reviewer (test_reviewer), Manager (test_manager), Lead (test_lead), Guest (test_guest)
3. For each user, open their profile and confirm their **context role** assignment in each product (OAK001, ELM001, XNM001)
4. Confirm the **Guest** role is assigned read-only access
5. Confirm a **wcadmin** account exists with site administrator rights

**Expected Results:**
1. All 5 test user accounts exist and are active
2. Each user has the correct role assigned in each product context per the ACL matrix (ACL_All_Objects_v2 document)
3. Guest role grants only Read + Download on Released objects
4. wcadmin has site administrator rights

**Pass Criteria:** All user accounts exist with correct roles; role assignment matches ACL document  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-003 · Custom Attribute Definitions

| Field | Value |
|---|---|
| TC ID | ADM-TC-003 |
| Title | Verify custom attributes are defined on correct object types |
| Requirement Ref | ADM-003 |
| Priority | Critical |
| Test Role | Product Manager (wcadmin) |

**Preconditions:**
- Phase 0 complete; logged in as wcadmin with access to Type and Attribute Management

**Test Steps:**
1. Navigate to **Site > Utilities > Type and Attribute Management**
2. Open **WTPart** subtypes and verify type-specific custom attributes per subtype:

   | WTPart Subtype | Custom Attributes |
   |---|---|
   | Sheet Metal Part | Material, Grade, Mass, Surface Area, Bounding Box |
   | Machining Part | Material, Grade, Mass, Surface Area, Bounding Box |
   | Casting Part | Material, Grade, Mass, Surface Area, Bounding Box |
   | Plastic IM Part | Material, Grade, Mass, Surface Area, Bounding Box |
   | Plastic Fab Part | Material, Grade, Mass, Surface Area, Bounding Box |
   | 3D Printing Part | Material, Finish, Bounding Box |
   | Printing Part | Material, Finish, Bounding Box |
   | Mechanical Assembly | Mass, Bounding Box |
   | Optics Assembly | Mass, Bounding Box |
   | Optics Part | Material, Surface Area, Mass, Bounding Box |
   | Electrical Part | MPN, Manufacturer, Description, Voltage Rating, Current Rating, Power Rating, Category, Temperature Range |
   | Packaging Part | Material, Mass, Bounding Box |

3. Open **WTDocument** type → verify the following **common custom attributes** are present across ALL document subtypes:
   `Document Sub-Type`, `DHF Category`, `Owning Business`, `Owning Site`, `Impacted Sites`, `Affected Process`, `Language`, `Date Released`, `Periodic Review Interval (in Years)`, `Last Reviewed Date`, `Training`, `Legacy Number`, `Legacy Revision`, `Process Owner`

4. Open **WTDocument > QSM Datasets** sub-type → additionally verify: `Class`, `QMS Chapter`

5. Open **EPMDocument** (CAD Document) type → verify CAD-specific attributes are present (as configured by Windchill/Creo integration)

6. For each attribute, verify:
   - Data type is correct (e.g., `Periodic Review Interval` = Integer; `Date Released` = Date; `DHF Category`, `Language`, `Owning Business` = Enumeration/dropdown; text fields = String)
   - Mandatory / optional setting matches requirements

7. Attempt to save a **WTPart** (Sheet Metal) without `Material` populated (if configured mandatory) → confirm save is blocked with an error message

**Expected Results:**
1. All WTPart subtype-specific attributes present and correctly typed
2. All 14 WTDocument common custom attributes present on all document types
3. QSM Datasets additionally show `Class` and `QMS Chapter`
4. Mandatory attribute enforcement triggers error on blank save
5. Dropdown enumerations are populated with correct values

**Pass Criteria:** All custom attributes confirmed present per subtype; data types and mandatory rules verified  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-004 · Product Container OAK001 (.NM)

| Field | Value |
|---|---|
| TC ID | ADM-TC-004 |
| Title | Verify product container OAK001 is correctly configured |
| Requirement Ref | ADM-004 |
| Priority | Critical |
| Test Role | Product Manager; Designer |

**Preconditions:**
- Phase 0 complete; logged in as Designer

**Test Steps:**
1. Log in as **Designer** → navigate to **Products** → confirm **OAK001** is listed
2. Open OAK001 → verify product context name and type `.NM`
3. Attempt to create a new Part in OAK001 → confirm creation succeeds
4. Log in as **Guest** → open OAK001 → confirm read-only view (no create/edit options visible)
5. Log in as a user **not assigned** to OAK001 → confirm OAK001 is not visible

**Expected Results:**
1. OAK001 visible to assigned users with correct container type `.NM`
2. Designer can create objects inside OAK001
3. Guest sees only read-only view
4. Unassigned user cannot see OAK001

**Pass Criteria:** All access control and container type verified  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-005 · Product Container ELM001 (L.NM)

| Field | Value |
|---|---|
| TC ID | ADM-TC-005 |
| Title | Verify product container ELM001 is correctly configured |
| Requirement Ref | ADM-004 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 0 complete

**Test Steps:**
1. Log in as **Designer** → navigate to Products → confirm **ELM001** is listed with type `L.NM`
2. Create a Part in ELM001 → confirm auto-numbering applies `ELM001-*-XXXX` pattern
3. Confirm context isolation: objects created in ELM001 do not appear in OAK001 browse view

**Expected Results:**
1. ELM001 exists with type `L.NM`
2. Auto-numbering follows IRILLIC pattern for ELM001
3. Context isolation confirmed — objects scoped correctly

**Pass Criteria:** Container exists, auto-numbering correct, context isolation verified  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-006 · Product Container XNM001 (X.NM)

| Field | Value |
|---|---|
| TC ID | ADM-TC-006 |
| Title | Verify product container XNM001 is correctly configured |
| Requirement Ref | ADM-004 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 0 complete

**Test Steps:**
1. Log in as **Designer** → confirm **XNM001** listed with type `X.NM`
2. Create a Part in XNM001 → confirm auto-numbering applies `XNM001-*-XXXX` pattern
3. Confirm context isolation from OAK001 and ELM001

**Expected Results:**
1. XNM001 exists with correct type
2. Auto-numbering follows IRILLIC pattern for XNM001
3. Context isolation confirmed

**Pass Criteria:** Container configured correctly and isolated  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-007 · Library Container — Irillic QMS

| Field | Value |
|---|---|
| TC ID | ADM-TC-007 |
| Title | Verify Library – Irillic QMS container exists with correct access |
| Requirement Ref | ADM-005 |
| Priority | Critical |
| Test Role | Designer; Guest |

**Preconditions:** Phase 0 complete

**Test Steps:**
1. Navigate to **Libraries** → confirm **Library – Irillic QMS** is present
2. Log in as **QA/Reviewer** → confirm read + upload access to the library
3. Log in as **Designer** → confirm access per ACL
4. Log in as **Guest** → confirm read-only access to Released documents in library
5. Attempt to delete a document in the library as **Designer** → confirm blocked

**Expected Results:**
1. Library – Irillic QMS exists and is accessible
2. Roles have access per ACL matrix
3. Guest: read-only on Released content only
4. Delete blocked for Designer

**Pass Criteria:** Library accessible with correct role-based permissions  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-008 · Library Container — QMS Records

| Field | Value |
|---|---|
| TC ID | ADM-TC-008 |
| Title | Verify Library – QMS Records container exists with correct access |
| Requirement Ref | ADM-005 |
| Priority | Critical |
| Test Role | Designer; Guest |

**Preconditions:** Phase 0 complete

**Test Steps:**
1. Navigate to **Libraries** → confirm **Library – QMS Records** is present
2. Confirm access control mirrors ACL matrix for this library
3. Confirm objects stored here are visible from OAK001/ELM001 product contexts as needed (cross-context linking)

**Expected Results:**
1. Library – QMS Records exists
2. Access control matches ACL matrix
3. Cross-context visibility works as configured

**Pass Criteria:** Library exists and access control is correct  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-009 · Project Template Creation

| Field | Value |
|---|---|
| TC ID | ADM-TC-009 |
| Title | Verify IRILLIC project template exists and is selectable |
| Requirement Ref | ADM-006 |
| Priority | High |
| Test Role | Product Manager |

**Preconditions:** Stage Gate framework (IRILLIC Product Lifecycle Framework) has been configured as a ProjectLink template

**Test Steps:**
1. Navigate to **ProjectLink > Create Project**
2. In the template picker, confirm **IRILLIC** project template is listed
3. Select the template → confirm the following milestones/phases are present: M0 – Concept & Feasibility, M1 – Design & Development, M2 – Design Transfer & Regulatory, M3 – Commercial Readiness, M4 – Commercial Launch
4. Confirm each milestone contains the correct phases and activities per the IRILLIC Stage Gate document

**Expected Results:**
1. IRILLIC template is selectable in project creation
2. All 5 milestones (M0–M4) are present
3. Milestone phases and activities match the IRILLIC Stage Gate framework

**Pass Criteria:** Template exists with all milestones correctly populated  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-010 · Gantt Chart (OOTB)

| Field | Value |
|---|---|
| TC ID | ADM-TC-010 |
| Title | Verify OOTB Gantt chart is accessible and functional from project folder |
| Requirement Ref | ADM-007 |
| Priority | High |
| Test Role | Product Manager |

**Preconditions:** A test project exists with at least 3 tasks with start/end dates and dependencies

**Test Steps:**
1. Open the test project → navigate to the **project folder level**
2. Select **Gantt Chart** view
3. Confirm tasks are displayed as horizontal bars with correct start/end dates
4. Confirm task dependencies are shown as connecting arrows
5. Confirm the chart renders without errors in the OOTB Windchill ProjectLink UI

**Expected Results:**
1. Gantt chart is accessible from the project folder level
2. Tasks are plotted with correct dates
3. Dependencies are visualized correctly
4. No rendering errors

**Pass Criteria:** Gantt chart visible and functional with correct task/dependency display  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-011 · CAD Worker Smoke Test

| Field | Value |
|---|---|
| TC ID | ADM-TC-011 |
| Title | Verify CAD Worker publishes PDF, STEP, DXF, STL, DWG on Release |
| Requirement Ref | ADM-008 · ADM-009 |
| Priority | Critical |
| Test Role | Designer; Product Manager |

**Preconditions:** ENV-003 confirmed; a Creo `.prt` file is uploaded to OAK001 in In Work state

**Test Steps:**
1. Log in as **Designer** → locate the test `.prt` file in OAK001
2. Progress the part through lifecycle to **Released** state (via approval workflow)
3. After release, navigate to the part's **Content** tab
4. Verify published representations are attached: **PDF**, **STEP**, **DXF**, **STL**, **DWG**
5. Open each published format and confirm it renders/downloads correctly

**Expected Results:**
1. On transition to Released, the CAD Worker automatically generates all 5 publish formats
2. PDF, STEP, DXF, STL, DWG are all attached as representations
3. All formats open/download without errors

**Pass Criteria:** All 5 publish formats generated and accessible after Release  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### ADM-TC-012 · MS Office Worker & Thumbnail Worker

| Field | Value |
|---|---|
| TC ID | ADM-TC-012 |
| Title | Verify Office Worker generates PDF and Thumbnail Worker generates preview |
| Requirement Ref | ADM-010 · ADM-011 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** ENV-004 and ENV-005 confirmed

**Test Steps:**
1. Log in as **Designer** → create a new WTDocument in OAK001
2. Upload a `.docx` file as the primary content
3. Save the document → navigate to its **Content** tab
4. Confirm a **PDF representation** has been auto-generated by the Office Worker
5. Navigate to the document's card/tile view → confirm a **thumbnail preview** is displayed
6. Repeat steps 2–5 with a `.xlsx` file

**Expected Results:**
1. `.docx` → PDF representation auto-generated
2. Thumbnail preview visible on document card
3. `.xlsx` → PDF representation auto-generated
4. All conversions complete within 60 seconds

**Pass Criteria:** PDF and thumbnail generated for both `.docx` and `.xlsx` uploads  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

## PHASE 2 — Part Management

**Goal:** Validate WTPart creation, attribute population, lifecycle transitions, version control, Exempt from IQC flag, no-delete policy, and Where Used query.  
**Requirement IDs:** PM-001 · PM-002 (OOTB) · PM-003 (OOTB) · PM-004 (OOTB)  
**Depends On:** Phase 1 complete  
**Runs in parallel with:** Phase 3  
**Est. Test Cases:** 10

---

### PM-TC-001 · Manual WTPart Creation

| Field | Value |
|---|---|
| TC ID | PM-TC-001 |
| Title | Create a WTPart manually and verify auto-numbering and initial state |
| Requirement Ref | PM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 1 complete; logged in as Designer in OAK001

**Test Steps:**
1. Navigate to **OAK001 > Parts** → select **New Part**
2. Enter Description: `Test Sheet Metal Bracket`; select Type: `Sheet Metal Part`; leave Number blank
3. Save the part
4. Confirm the part number has been **auto-assigned** in the format `OAK001-[TypeCode]-XXXX`
5. Confirm the part is created at **Version 0.1**, lifecycle state **In Work**
6. Confirm the part owner is the creating Designer
7. Repeat for types: `Machining Part`, `Mechanical Assembly`, `Optics Part`, `Electrical Part`, `Packaging Part`, `Miscellaneous Part` (spot check 3 types)

**Expected Results:**
1. Auto-number assigned on save — no manual number entry required
2. Initial version is 0.1; lifecycle state is In Work
3. Part owner = creating Designer
4. Different part types produce numbers with the correct type code

**Test Data:** OAK001 product; Types: Sheet Metal Part, Machining Part, Mechanical Assembly  
**Pass Criteria:** Auto-numbering and initial state correct for all tested types  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-002 · Part Attribute Population

| Field | Value |
|---|---|
| TC ID | PM-TC-002 |
| Title | Populate and save all custom attributes on a WTPart |
| Requirement Ref | ADM-003 · PM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** PM-TC-001 passed; a Part in In Work state exists

**Test Steps:**
1. Open the test Part (In Work) → click **Edit**
2. Populate all custom attributes: `Make/Buy` = Make; `Item Description` = Test Part; `Qty` = 1; `Unit` = EA; `Level` = 1; `Unit Price` = 500.00; `Line Price` = 500.00; `Manufacturer Name` = IRILLIC
3. Save the part
4. Reload the page and confirm all values persisted
5. Attempt to save with a **mandatory attribute left blank** (e.g., clear Description) → confirm save is blocked

**Expected Results:**
1. All attribute values save and persist correctly
2. Mandatory attribute enforcement: save blocked with a clear validation message when mandatory field is empty
3. Numeric fields (Unit Price, Line Price) accept decimal values

**Pass Criteria:** All attributes save; mandatory enforcement confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-003 · Part Lifecycle — In Work to Under Review

| Field | Value |
|---|---|
| TC ID | PM-TC-003 |
| Title | Promote WTPart from In Work to Under Review |
| Requirement Ref | PM-001 |
| Priority | Critical |
| Test Role | Designer (promote); Reviewer (review) |

**Preconditions:** A Part at version 0.1, In Work state, with all mandatory attributes populated

**Test Steps:**
1. Log in as **Designer** → open the test Part → click **Promote** (or Set State)
2. Confirm target state is **Under Review** → submit
3. Confirm **Reviewer** receives workflow notification (email if mail server is live)
4. Log in as **Designer** → attempt to **Modify** the part now in Under Review → confirm only Read, Download, Modify Content, Modify Identity are available (per ACL)
5. Log in as **Reviewer** → open the part → confirm Read, Download, Modify, Modify Content are available

**Expected Results:**
1. Part transitions to Under Review state
2. Workflow notification sent to Reviewer
3. Designer access in Under Review = Read, Download, Modify Content, Modify Identity only (cannot Set State)
4. Reviewer access in Under Review = Read, Download, Modify, Modify Content

**Pass Criteria:** State transition succeeds; access control matches ACL matrix  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-004 · Part Lifecycle — Under Review to Approved Not Effective (e-Signature)

| Field | Value |
|---|---|
| TC ID | PM-TC-004 |
| Title | Approve WTPart with electronic signature — transition to Approved Not Effective |
| Requirement Ref | PM-001 · FDA 21 CFR Part 11 §11.50 |
| Priority | Critical |
| Test Role | Manager (approver) |

**Preconditions:** Part is in Under Review state

**Test Steps:**
1. Log in as **Manager** → open the part in Under Review
2. Initiate approval action → system prompts for **electronic signature**
3. Enter Manager's username, password, and select signature meaning: `Approved`
4. Confirm the part transitions to **Approved Not Effective**
5. Navigate to the part's **History/Audit** tab → confirm the e-signature record shows: signer name, role, timestamp, and meaning
6. Confirm the timestamp is immutable (cannot be edited)
7. Attempt the same action as **Designer** → confirm Set State is blocked in Under Review for Designer

**Expected Results:**
1. E-signature prompt appears with fields: username, password, signature meaning
2. Part transitions to Approved Not Effective after valid e-signature
3. Audit record shows: signer = Manager, timestamp (locked), meaning = "Approved"
4. Designer cannot approve (Set State blocked per ACL in Under Review)

**Pass Criteria:** E-signature captured; state transition correct; audit record immutable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-005 · Part Lifecycle — Release

| Field | Value |
|---|---|
| TC ID | PM-TC-005 |
| Title | Release a WTPart and verify it becomes read-only |
| Requirement Ref | PM-001 |
| Priority | Critical |
| Test Role | Lead (release); Designer (verify read-only) |

**Preconditions:** Part is in Approved Not Effective state

**Test Steps:**
1. Log in as **Lead** → open the part → promote to **Released**
2. Confirm part version increments to **1.0** on release
3. Log in as **Designer** → open the Released part → confirm available actions are Read and Download only (no Edit, no Check Out)
4. Attempt to modify an attribute as Designer → confirm blocked
5. Confirm **Lead** can still Revise, New View Version, Change Permission on Released parts (per ACL)
6. Confirm **Guest** can Read and Download the Released part

**Expected Results:**
1. Part Released at version 1.0
2. Designer: Read + Download only; no modify/edit access
3. Attribute edit blocked for Designer on Released part
4. Lead: Revise + NVV + Change Permission available
5. Guest: Read + Download on Released

**Pass Criteria:** Released state enforces read-only for Designer; Lead and Guest permissions correct  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-006 · Part Lifecycle — Obsolete

| Field | Value |
|---|---|
| TC ID | PM-TC-006 |
| Title | Transition a Released WTPart to Obsolete |
| Requirement Ref | PM-001 |
| Priority | High |
| Test Role | Lead |

**Preconditions:** A Released part (version 1.0) exists

**Test Steps:**
1. Log in as **Lead** → open the Released part → promote to **Obsolete**
2. Confirm the part is **no longer returned in default active search results**
3. Search with filter "Include Obsolete" → confirm part appears
4. Open the Obsolete part → confirm full history retained (version 0.1 → 0.2 → 1.0 iterations all visible)
5. Confirm **Designer** has Read-only access in Obsolete state (per ACL)
6. Confirm **Lead** has Read, Download, Change Permission in Obsolete state

**Expected Results:**
1. Part transitions to Obsolete; excluded from default search results
2. Accessible with "Include Obsolete" search filter
3. Full iteration history retained and readable
4. Designer: Read only in Obsolete; Lead: Read + Download + Change Permission

**Pass Criteria:** Obsolete state correct; history retained; access control matches ACL  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-007 · Part Version Control (0.1 → 0.2 → 1.0)

| Field | Value |
|---|---|
| TC ID | PM-TC-007 |
| Title | Verify version increments correctly through the part lifecycle |
| Requirement Ref | PM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A new Part at 0.1 In Work

**Test Steps:**
1. Check in the part as **Designer** with a change note: `Initial version 0.1`
2. Make a change to an attribute → save → confirm version increments to **0.2**
3. Add another change → save → confirm version increments to **0.3**
4. Progress through lifecycle to **Released** → confirm version number becomes **1.0**
5. Open the History tab → confirm all prior iterations (0.1, 0.2, 0.3) are visible, read-only, with user name, date, and change note per iteration
6. Open version 0.1 → confirm original attribute values are preserved

**Expected Results:**
1. Version 0.1 → 0.2 → 0.3 increments correctly on each save/check-in
2. Released state = version 1.0
3. All prior iterations accessible read-only with full audit data
4. Older iteration values correctly preserved

**Pass Criteria:** Version sequence correct; history complete and accessible  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-008 · Exempt from IQC Flag (PM-001)

| Field | Value |
|---|---|
| TC ID | PM-TC-008 |
| Title | Verify Exempt from IQC attribute is set and visible in BOM Exempt View |
| Requirement Ref | PM-001 |
| Priority | High |
| Test Role | Designer |

**Preconditions:** A Part exists in OAK001; BOM with multiple parts exists (can reuse PM-TC-001 parts)

**Test Steps:**
1. Open a Part → Edit → set `Exempt from IQC` = **Yes** → save
2. Open a second Part → leave `Exempt from IQC` = **No** (or blank)
3. Navigate to the parent Assembly's BOM → select **Exempt from IQC View**
4. Confirm only the part with `Exempt from IQC = Yes` is displayed in this view
5. Confirm the non-exempt part is filtered out

**Expected Results:**
1. `Exempt from IQC` attribute is editable on the Part
2. BOM Exempt from IQC View shows only flagged parts
3. Non-exempt parts are correctly filtered out

**Pass Criteria:** Attribute and BOM view filter work correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-009 · No-Delete Policy for WTPart (All Roles)

| Field | Value |
|---|---|
| TC ID | PM-TC-009 |
| Title | Verify no-delete policy is enforced for all non-admin roles on WTPart |
| Requirement Ref | ADM-002 · Delete Policy |
| Priority | Critical |
| Test Role | Designer; Reviewer; Lead; Guest |

**Preconditions:** Test parts exist in various lifecycle states (In Work, Released)

**Test Steps:**
1. Log in as **Designer** → attempt to delete a Part in **In Work** state → confirm blocked
2. Log in as **Designer** → attempt to delete a Part in **Released** state → confirm blocked
3. Log in as **Reviewer** → attempt to delete a Part in **Under Review** state → confirm blocked
4. Log in as **Lead** → attempt to delete a Released Part → confirm blocked
5. Log in as **Guest** → confirm delete option is not even visible
6. For each blocked attempt, navigate to **Audit Trail** → confirm the blocked delete attempt is logged with user ID and timestamp

**Expected Results:**
1. Delete is blocked for Designer at all lifecycle states
2. Delete is blocked for Reviewer at all lifecycle states
3. Delete is blocked for Lead at Released and Obsolete states
4. Delete option not visible to Guest
5. All blocked attempts are logged in the audit trail

**Pass Criteria:** Delete blocked for all tested non-admin roles; audit trail records each attempt  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PM-TC-010 · Where Used Query

| Field | Value |
|---|---|
| TC ID | PM-TC-010 |
| Title | Verify Where Used query returns all parent assemblies for a component part |
| Requirement Ref | PM-001 (OOTB) |
| Priority | High |
| Test Role | Designer |

**Preconditions:** At least one Part is used as a child component in 2 different parent assemblies in OAK001

**Test Steps:**
1. Open the **child part** → select **Where Used** (right-click or Actions menu)
2. Confirm the Where Used results list both parent assemblies
3. Confirm each result shows: Assembly Part Number, Assembly Name, Assembly Revision, Lifecycle State
4. Click one parent assembly in the results → confirm navigation to that assembly's page
5. Repeat query for a part used in only 1 parent → confirm exactly 1 result

**Expected Results:**
1. Where Used returns all parent assemblies that include the selected part
2. Result shows Part Number, Name, Revision, State for each parent
3. Navigation from Where Used result to parent assembly works
4. Single-parent part returns exactly 1 result

**Pass Criteria:** Where Used returns correct and complete parent list  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

## PHASE 3 — Document Management

**Goal:** Validate document types, lifecycle, auto-numbering, workflow approvals, version control, access control, file handling, linking, search, publishing, baseline, retention, and export.  
**Requirement IDs:** DM-001 to DM-042  
**Depends On:** Phase 1 complete  
**Runs in parallel with:** Phase 2  
**Note — Watermarking (DM-016):** Windchill Wincom extension not yet installed. TC marked DEFERRED — do not execute until PDS confirms installation.  
**Note — Document Numbering:** Test with placeholder `OAK001-W-0001` format until IRILLIC shares the Document Numbering sheet with full type codes.

---

### DM-TC-001 · Document Type Creation

| Field | Value |
|---|---|
| TC ID | DM-TC-001 |
| Title | Verify all IRILLIC document types are available and selectable |
| Requirement Ref | DM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 1 complete; logged in as Designer in OAK001

**Test Steps:**
1. Navigate to **OAK001 > Documents > New Document**
2. In the **Type** dropdown, confirm all the following IRILLIC document types (and sub-types) are available:

   | Type | Sub-Types |
   |---|---|
   | External | Standards, Regulations, Agreements, Other |
   | QSM Datasets (Policy) | Quality Manual, Quality Plan/Policy, Process, Policy |
   | QA Certificate or License | Certificate, License |
   | Quality Audit | Internal Audit, External Audit |
   | Quality Form | Evaluation, Other |
   | Quality Procedure | Procedure, Reference Material, Work Instruction |
   | Non-Product Training | Training Material, Training Plan |
   | Clinical Affairs | Clinical Evaluation, Clinical Study |
   | Drawing | Integrated CAD, Non-Native |
   | Manufacturing Form | Manufacturing, Quality Inspection, Service |
   | Manufacturing Procedure | Equipment, Manufacturing, Quality, Service |
   | Marketing | Covered, Promotional, Sales and Support |
   | Process Design | Analysis, Plan, Review, Specifications |
   | Product Design | Analysis, Design Review, Design Review Action Items, Design V&V, Design Validation, Design Verification, Detailed Design, DHF Supporting Document, Plan, Review, Software Document, Specifications, Standards Compliance Checklist, Traceability |
   | Project Documentation | Financial, Intellectual Property, OEM, Other, Plan, Process, Product, Review, Supplier, Voice of Customer |
   | Regulatory | Design Dossier, Essential Requirements Checklist, Intended Use, Technical File, Regulatory Document, Regulatory Plan, Risk Management File, Documents |
   | Risk Management | Analysis, Plan, Report |
   | Specification | Equipment, Labeling, Material, Packaging, Process, Software |
   | Training | Training Material, Training Plan |
   | Validation | Audits, Validation Package |

3. Select **Product Design** type, sub-type **Specifications** → confirm the 14 common custom attributes are present
4. Select **QSM Datasets** (Policy/Process) → confirm `Class` and `QMS Chapter` are additionally present
5. Create one document of type **Product Design**, sub-type **Design Verification** → confirm creation succeeds and auto-number is assigned

**Expected Results:**
1. All 20 document types with their sub-types are listed in the type picker
2. QSM Datasets present `Class` and `QMS Chapter`; all other types show the 14 common custom attributes
3. Document created with auto-assigned number following IRILLIC numbering pattern

**Pass Criteria:** All document types and sub-types available; type-specific attributes displayed correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-002 · Document Auto-Numbering

| Field | Value |
|---|---|
| TC ID | DM-TC-002 |
| Title | Verify document auto-numbering assigns unique numbers per IRILLIC pattern |
| Requirement Ref | DM-003 · DM-035 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 1 complete; numbering rules configured per Requirements Gathering Worksheet

**IRILLIC Document Numbering Reference:**

*Product context documents* — pattern `[ProjectCode]-[TypeCode]-XXXX` where ProjectCode ∈ {OAK001, ELM001, XNM001}:

| Document | Number Pattern | Example |
|---|---|---|
| Hardware Schematic | [ProjectCode]-A-XXXX | OAK001-A-0001 |
| Mechanical (non-sheet metal) Drawing | [ProjectCode]-B-XXXX | OAK001-B-0001 |
| Cable/Schematic Drawing | [ProjectCode]-C-XXXX | OAK001-C-0001 |
| Data Sheets / PCB Gerbers / Operators Manual / System Variant | [ProjectCode]-D-XXXX | OAK001-D-0001 |
| Label Artwork | [ProjectCode]-M-XXXX | OAK001-M-0001 |
| BOM / Critical Component List | [ProjectCode]-R-XXXX | OAK001-R-0001 |
| Datasheets | [ProjectCode]-S-XXXX | OAK001-S-0001 |
| Assembly / IQC Test Procedure | [ProjectCode]-T-XXXX | OAK001-T-0001 |
| Design History File (DHF) | [ProjectCode]-DHF-XX | OAK001-DHF-01 |
| Design Input Requirement | [ProjectCode]-DIR-XX | OAK001-DIR-01 |
| Design Review Report | [ProjectCode]-DRR-XX | OAK001-DRR-01 |
| Design Output File | [ProjectCode]-DOF-XX | OAK001-DOF-01 |
| Design Verification Plan | [ProjectCode]-VEP-XX | OAK001-VEP-01 |
| Design Verification Report | [ProjectCode]-VER-XX | OAK001-VER-01 |
| Design Validation Plan | [ProjectCode]-VAP-XX | OAK001-VAP-01 |
| Design Validation Report | [ProjectCode]-VAR-XX | OAK001-VAR-01 |
| Risk Management File | [ProjectCode]-RMF-XX | OAK001-RMF-01 |
| Risk Management Plan | [ProjectCode]-RMP-XX | OAK001-RMP-01 |
| Medical Device File | [ProjectCode]-MDF-XX | OAK001-MDF-01 |
| First Article Inspection Report | [ProjectCode]-FAI-XXXXX | OAK001-FAI-00001 |
| OQC Report | [ProjectCode]-OQC-XXXXX | OAK001-OQC-00001 |
| Certificate of Analysis | [ProjectCode]-COA-XXXXX | OAK001-COA-00001 |
| Deviation Note | [ProjectCode]-DN-XXXX | OAK001-DN-0001 |
| Assembly Work Instruction | [ProjectCode]-WI-XXXX | OAK001-WI-0001 |
| Software Requirements Specification | [ProjectCode]-SRS-XX | OAK001-SRS-01 |
| Software Verification Report | [ProjectCode]-SVR-XX | OAK001-SVR-01 |

*QMS Library documents* — prefix `IPL-`:

| Document | Number Pattern | Example |
|---|---|---|
| Supplier Evaluation | IPL-SER-XXXX | IPL-SER-0001 |
| Supplier Trend Analysis | IPL-STA-XXXX | IPL-STA-0001 |
| Supplier Re-evaluation | IPL-SRR-XXXX | IPL-SRR-0001 |
| Calibration Status & History | IPL-CSH-EQP-XXX | IPL-CSH-EQP-001 |
| Internal Audit Schedule | IPL-IAS-XXXX | IPL-IAS-0001 |
| Internal Audit Report | IPL-IAR-XXXX | IPL-IAR-0001 |
| CAPA Report | CAPA-[DEP]-XX | CAPA-QA-01, CAPA-RND-01 |
| Master Lists (all) | IPL-ML-[suffix]-XX | IPL-ML-TM-01, IPL-ML-QP-02 |
| SLS Dataset Forms | IPL-SLS-F-XX | IPL-SLS-F-01 |
| RND Dataset Forms | IPL-RND-F-XX | IPL-RND-F-01 |
| MFG Dataset Forms | IPL-MFG-F-XX | IPL-MFG-F-01 |
| RA Dataset Forms | IPL-RA-F-XX | IPL-RA-F-01 |
| HR Dataset Forms | IPL-HR-F-XX | IPL-HR-F-01 |

**Test Steps:**
1. Create a new **Product Design** document (sub-type: Design Verification) in **OAK001** → leave Number blank → save
2. Confirm auto-number assigned follows pattern `OAK001-VER-XX` (e.g., `OAK001-VER-01`)
3. Create a second document of the same type → confirm sequence increments (e.g., `OAK001-VER-02`)
4. Create a document of type **Drawing** (sub-type: Non-Native) in OAK001 → confirm pattern `OAK001-D-XXXX`
5. Create the same type of document in **ELM001** → confirm prefix changes to `ELM001-VER-01`
6. Navigate to **Library — Irillic QMS** → create a **Quality Audit** (sub-type: Internal Audit) document → confirm number follows `IPL-IAR-XXXX`
7. Attempt to manually enter a number that already exists → confirm duplicate is rejected with error

**Expected Results:**
1. Auto-number assigned on save following the IRILLIC numbering matrix above
2. Sequence increments correctly on each new creation within same type
3. Different product contexts (OAK001, ELM001) use their respective prefixes
4. QMS Library documents use `IPL-` prefix with correct type code
5. Duplicate number rejected with error message

**Pass Criteria:** Auto-numbering consistent with IRILLIC numbering worksheet; unique, context-scoped, and type-differentiated  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-003 · Document Lifecycle — In Work to Under Review

| Field | Value |
|---|---|
| TC ID | DM-TC-003 |
| Title | Promote a document from In Work to Under Review |
| Requirement Ref | DM-005 |
| Priority | Critical |
| Test Role | Designer (promote); Reviewer (review) |

**Preconditions:** A document at version 0.1, In Work, with primary content uploaded

**Test Steps:**
1. Log in as **Designer** → open document → promote to **Under Review**
2. Confirm document state changes to Under Review; version remains 0.1 (or increments to 0.2 per config)
3. Confirm **Designer** can no longer Set State (per ACL for WTDocument In Work → Under Review)
4. Log in as **Reviewer** → confirm document is in their workflow task list
5. Confirm **Reviewer** has Read, Download, Modify, Modify Content in Under Review (per ACL)

**Expected Results:**
1. State = Under Review after promotion
2. Reviewer receives workflow task notification
3. Designer access in Under Review = Read, Download, Modify Content, Modify Identity (no Set State)
4. Reviewer access = Read, Download, Modify, Modify Content

**Pass Criteria:** State transition and access controls match ACL matrix  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-004 · Document Lifecycle — Approved Not Effective (e-Signature)

| Field | Value |
|---|---|
| TC ID | DM-TC-004 |
| Title | Approve document with e-signature and transition to Approved Not Effective |
| Requirement Ref | DM-005 · FDA 21 CFR Part 11 §11.50 |
| Priority | Critical |
| Test Role | Manager (approver) |

**Preconditions:** Document is in Under Review state

**Test Steps:**
1. Log in as **Manager** → open the document → initiate approval
2. System prompts for **e-signature**: enter username, password, signature meaning = `Approved`
3. Confirm document transitions to **Approved Not Effective**
4. Navigate to audit/history tab → confirm e-signature record: signer name, role, timestamp (immutable), meaning
5. Attempt approval with **wrong password** → confirm rejected; document remains in Under Review
6. Confirm wrong-password attempt is logged in audit trail

**Expected Results:**
1. Valid e-signature → document moves to Approved Not Effective
2. Audit record captures: signer, role, timestamp (locked), meaning = "Approved"
3. Invalid credentials → approval rejected; no state change
4. Failed attempt logged in audit

**Pass Criteria:** E-signature enforced; audit record immutable; incorrect credentials rejected  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-005 · Document Lifecycle — Released

| Field | Value |
|---|---|
| TC ID | DM-TC-005 |
| Title | Release a document and verify PDF representation is published |
| Requirement Ref | DM-005 · DM-015 |
| Priority | Critical |
| Test Role | Lead (release) |

**Preconditions:** Document is in Approved Not Effective state

**Test Steps:**
1. Log in as **Lead** → open document → promote to **Released**
2. Confirm version increments to **1.0** on Release
3. Navigate to Content tab → confirm **PDF representation** is auto-generated and attached
4. Open the PDF → confirm it renders the document content correctly
5. Log in as **Designer** → attempt to edit the Released document → confirm blocked (Read + Download only)
6. Confirm release event is logged in audit trail with user ID and timestamp

**Expected Results:**
1. Document Released at version 1.0
2. PDF representation auto-generated on Release
3. Designer: Read + Download only on Released document
4. Audit trail records release event

**Pass Criteria:** Release and PDF publish succeed; Designer access locked down  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-006 · Document Lifecycle — Obsolete

| Field | Value |
|---|---|
| TC ID | DM-TC-006 |
| Title | Transition a Released document to Obsolete and verify retention |
| Requirement Ref | DM-005 |
| Priority | High |
| Test Role | Lead |

**Preconditions:** A Released document (version 1.0) exists

**Test Steps:**
1. Log in as **Lead** → open Released document → promote to **Obsolete**
2. Confirm document is excluded from **default active search results**
3. Search with filter **"Include Obsolete"** → confirm document appears
4. Open Obsolete document → confirm all version history (0.1 → 1.0) is retained and readable
5. Confirm the Obsolete document's metadata includes the date it was set to Obsolete
6. Confirm retention: the document must be retained for a minimum of **10 years** (system must not allow permanent deletion by any non-admin role)

**Expected Results:**
1. Document transitions to Obsolete; excluded from default searches
2. Accessible via Include Obsolete filter
3. Full version history preserved
4. Obsolete timestamp recorded
5. No delete option for non-admin roles on Obsolete document

**Pass Criteria:** Obsolete state correct; 10-year retention enforced (no-delete for all non-admin roles)  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-007 · Workflow Approval Routing

| Field | Value |
|---|---|
| TC ID | DM-TC-007 |
| Title | Verify document approval workflow routes correctly to Reviewer and Approver |
| Requirement Ref | DM-007 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Manager |

**Preconditions:** ENV-008 (mail server) confirmed; a document at In Work state

**Test Steps:**
1. **Designer** promotes document to Under Review → confirm **Reviewer** receives workflow task and email notification
2. **Reviewer** approves → confirm document moves to next state and **Manager** receives approval task
3. **Manager** applies e-signature → confirm document moves to Approved Not Effective
4. Verify each approval step is logged in the workflow audit trail with: user, action, timestamp
5. Test **rejection**: Reviewer rejects document → confirm it returns to In Work and Designer is notified

**Expected Results:**
1. Workflow routes to Reviewer on promotion to Under Review
2. Manager receives task after Reviewer approval
3. Each step logged with user + timestamp
4. Rejection returns document to In Work; Designer notified

**Pass Criteria:** Workflow routes correctly through all approval steps; rejection handled correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-008 · Document Version Control

| Field | Value |
|---|---|
| TC ID | DM-TC-008 |
| Title | Verify document version increments and full history is retained |
| Requirement Ref | DM-008 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A document in In Work state

**Test Steps:**
1. Upload a `.docx` as primary content → version = **0.1**
2. Edit an attribute → save → confirm version increments to **0.2**
3. Replace primary content file → save → confirm version increments to **0.3**
4. Progress to Released → confirm version becomes **1.0**
5. Open History tab → confirm all iterations (0.1, 0.2, 0.3) are listed with: user, date, change comment
6. Open version 0.1 → confirm original content is accessible (read-only)
7. Confirm no iteration can be deleted by Designer or Reviewer

**Expected Results:**
1. Version sequence: 0.1 → 0.2 → 0.3 → 1.0 (on release)
2. All iterations retained with full audit data
3. Older iteration content accessible read-only
4. Iterations cannot be deleted by non-admin roles

**Pass Criteria:** Version sequence correct; all iterations retained and accessible  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-009 · Role-Based Access Control on Documents

| Field | Value |
|---|---|
| TC ID | DM-TC-009 |
| Title | Verify document access control per role and lifecycle state |
| Requirement Ref | DM-017 · ADM-002 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Lead; Guest |

**Preconditions:** A document exists in each lifecycle state: In Work, Under Review, Approved Not Effective, Released, Obsolete

**Test Steps — In Work state:**
1. **Designer**: confirm Read, Download, Modify, Modify Content, Modify Identity, Create, Set State ✓
2. **Reviewer**: confirm no access (or Read only per ACL config)
3. **Guest**: confirm no access to In Work document

**Test Steps — Under Review state:**
4. **Designer**: Read, Download, Modify Content, Modify Identity only (no Set State)
5. **Reviewer**: Read, Download, Modify, Modify Content

**Test Steps — Released state:**
6. **Designer**: Read, Download only
7. **Reviewer**: Read, Download only
8. **Lead**: Read, Download, Revise, New View Version, Change Permission
9. **Guest**: Read, Download only

**Expected Results:**
- Each role has exactly the permissions specified in the ACL matrix (ACL_All_Objects_v2, WTDocument sheet) at each lifecycle state
- No role has excess permissions beyond what the ACL specifies

**Pass Criteria:** All role/state combinations match the ACL matrix exactly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-010 · No-Delete Policy on Documents (All Roles)

| Field | Value |
|---|---|
| TC ID | DM-TC-010 |
| Title | Verify delete is blocked for all non-admin roles at every document lifecycle state |
| Requirement Ref | Delete Policy · ADM-002 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Lead; Guest |

**Preconditions:** Documents exist in In Work, Under Review, Released, and Obsolete states

**Test Steps:**
1. **Designer** attempts delete on In Work document → blocked; logged in audit trail
2. **Designer** attempts delete on Released document → blocked; logged
3. **Reviewer** attempts delete on Under Review document → blocked; logged
4. **Lead** attempts delete on Released document → blocked; logged
5. **Guest** — delete option not visible at any state
6. For each blocked attempt, check audit trail → confirm entry with: user ID, attempted action (Delete), object number, timestamp

**Expected Results:**
1. Delete blocked for Designer, Reviewer, Lead, Guest at ALL lifecycle states
2. Every blocked attempt is recorded in the audit trail
3. Delete option not visible in Guest UI

**Pass Criteria:** Zero successful deletes by non-admin roles; audit trail records all attempts  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-011 · Watermarking via Wincom Extension

| Field | Value |
|---|---|
| TC ID | DM-TC-011 |
| Title | Verify Released document displays watermark on view and print |
| Requirement Ref | DM-016 |
| Priority | High |
| Test Role | Designer |
| **STATUS** | **⚠ DEFERRED — Wincom extension not yet installed (PDS Vision). Execute only after PDS confirms Wincom is live in test environment.** |

**Test Steps (when unblocked):**
1. Release a document that has a `.docx` primary file
2. Open the document's PDF representation via the Windchill viewer
3. Confirm a **watermark** (e.g., "IRILLIC CONFIDENTIAL" or "Released") is visible on each page
4. Print the document → confirm watermark appears on print output
5. Confirm watermark is NOT present on In Work documents

**Expected Results:** Watermark visible on view and print for Released documents only  
**Pass Criteria:** Watermark displayed correctly; absent on non-released documents  
**Result:** DEFERRED &nbsp;&nbsp; **Unblock Date:** ___________

---

### DM-TC-012 · Primary & Secondary File Attachments

| Field | Value |
|---|---|
| TC ID | DM-TC-012 |
| Title | Verify primary and secondary file attachments on a WTDocument |
| Requirement Ref | DM-018 |
| Priority | High |
| Test Role | Designer |

**Preconditions:** A document in In Work state

**Test Steps:**
1. Open a document → upload a `.docx` as **Primary Content**
2. Add a `.pdf` as a **Secondary Attachment**
3. Add a `.xlsx` as a second Secondary Attachment
4. Save and reload → confirm both primary and secondary files are visible in the Content tab
5. Download the primary `.docx` → confirm correct file
6. Download each secondary file → confirm correct files
7. Attempt to upload a second primary file → confirm system allows replacement (not duplication) of primary

**Expected Results:**
1. Primary and secondary files attach and persist correctly
2. Files downloadable and correct
3. Primary replacement works correctly (old primary superseded)

**Pass Criteria:** Primary and secondary attachments work; replacement allowed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-013 · Document Linking to WTPart

| Field | Value |
|---|---|
| TC ID | DM-TC-013 |
| Title | Link a WTDocument to a WTPart and verify bi-directional relationship |
| Requirement Ref | DM-019 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A Part and a Document both exist in OAK001 in In Work state

**Test Steps:**
1. Open the **WTDocument** → navigate to **Related Objects** tab → add **Reference** link to the test WTPart
2. Save the relationship
3. Navigate to the **WTPart** → confirm the linked document appears in its Related Objects/Relationships tab
4. Click the link from the Part side → confirm it navigates to the WTDocument
5. Click the link from the Document side → confirm it navigates to the WTPart
6. Confirm the relationship is visible in both directions

**Expected Results:**
1. Link created from Document to Part
2. Relationship visible on Part's Related Objects tab
3. Bi-directional navigation works

**Pass Criteria:** Document-to-Part link is bi-directional and navigable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-014 · Document Linking to CAD Object

| Field | Value |
|---|---|
| TC ID | DM-TC-014 |
| Title | Link a WTDocument to a CAD document and verify relationship |
| Requirement Ref | DM-020 |
| Priority | High |
| Test Role | Designer |

**Preconditions:** A WTDocument and an EPMDocument (CAD file) both exist in OAK001

**Test Steps:**
1. Open the **WTDocument** → Related Objects → add link to the **EPMDocument**
2. Navigate to the **EPMDocument** → confirm linked WTDocument appears in relationships
3. Confirm the link is visible in the Structure/Relationships view
4. Confirm the relationship persists after both objects are checked in/saved

**Expected Results:**
1. Document-to-CAD link established
2. Relationship visible on both objects
3. Link persists through subsequent saves

**Pass Criteria:** Document-to-CAD link works bi-directionally  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-015 · Document Linking to Change Object (ECO)

| Field | Value |
|---|---|
| TC ID | DM-TC-015 |
| Title | Verify document can be linked to an ECO as an affected/reference object |
| Requirement Ref | DM-021 |
| Priority | High |
| Test Role | Designer; Change Admin I |

**Preconditions:** An ECO exists (created in Phase 6 — or use a stub ECO for this standalone test)

**Test Steps:**
1. Open an ECO → navigate to **Affected Objects** or **Reference Documents**
2. Add the test WTDocument as a reference/affected document
3. Navigate to the WTDocument → confirm ECO reference appears in Related Objects
4. Confirm the document appears in the ECO's affected objects list with its current revision

**Expected Results:**
1. Document linkable to ECO from both sides
2. ECO reference visible on the document
3. Document listed in ECO's affected objects with correct revision

**Pass Criteria:** Document-to-ECO linkage confirmed bi-directionally  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-016 · Metadata Search & Full-Text Search

| Field | Value |
|---|---|
| TC ID | DM-TC-016 |
| Title | Verify document search by attributes, full text, and wildcard |
| Requirement Ref | DM-022 |
| Priority | High |
| Test Role | Designer; Guest |

**Preconditions:** At least 5 documents exist in OAK001 with varied types, names, and states

**Test Steps:**
1. Use **Advanced Search** → search by **Document Number** (exact match) → confirm correct document returned
2. Search by **Document Type** = Engineering Document → confirm only Engineering Documents returned
3. Search by **Description** using wildcard `*bracket*` → confirm matching documents returned
4. Search by **Lifecycle State** = Released → confirm only Released documents returned
5. Search by **Date Created** range → confirm results within the date range
6. Log in as **Guest** → run search → confirm only **Released** documents are returned (In Work documents not visible)

**Expected Results:**
1. All search criteria (number, type, wildcard, state, date) return correct results
2. Guest sees only Released documents in search results (access control enforced in search)
3. Wildcard `*keyword*` works correctly

**Pass Criteria:** All search types return correct results; access control enforced in search  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-017 · Search Results Export to Excel and PDF

| Field | Value |
|---|---|
| TC ID | DM-TC-017 |
| Title | Export document search results to Excel and PDF |
| Requirement Ref | DM-022 *(Ramya comment: "export the search list into Excel and PDF")* |
| Priority | High |
| Test Role | Designer |

**Preconditions:** A search returning at least 5 documents

**Test Steps:**
1. Perform a search that returns multiple documents in OAK001
2. Select **Export** or **Download results** → choose **Excel (.xlsx)**
3. Confirm the exported file contains all result rows with columns: Document Number, Name, Type, Revision, Lifecycle State, Owner, Date Modified
4. Repeat the export → choose **PDF**
5. Confirm the PDF contains all search result rows in a readable table format
6. Confirm export works for both an empty result set (returns "No results" message) and a full result set

**Expected Results:**
1. Excel export contains all result rows with correct columns
2. PDF export contains all result rows in readable format
3. Both export formats complete without errors

**Pass Criteria:** Both Excel and PDF export of search results confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DM-TC-018 · Baseline Creation and Change History

| Field | Value |
|---|---|
| TC ID | DM-TC-018 |
| Title | Create a document baseline and verify it captures the pre-change version |
| Requirement Ref | DM-024 |
| Priority | High |
| Test Role | Designer; Lead |

**Preconditions:** A Released document (version 1.0) exists in OAK001

**Test Steps:**
1. Navigate to OAK001 → create a **Baseline** including the Released document (version 1.0)
2. Name the baseline: `OAK001-BL-001`; record the document number and version included
3. Revise the document (via ECO process) → new version released (version 2.0)
4. Open baseline `OAK001-BL-001` → confirm it still references the **original version 1.0** of the document
5. Open the current document outside the baseline → confirm it shows version 2.0
6. Confirm the baseline itself is read-only and cannot be modified

**Expected Results:**
1. Baseline captures document at version 1.0 at time of baseline creation
2. Baseline remains at version 1.0 even after document is revised to 2.0
3. Baseline is read-only

**Pass Criteria:** Baseline correctly freezes document version; baseline is immutable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________


---

## PHASE 4 — CAD Data Management

**Goal:** Validate Creo 12 ↔ Windchill integration, check-in/out, assembly dependencies, attribute sync, lifecycle, publishing, family tables, WTPart auto-creation, no-delete, and ECO linkage.  
**Requirement IDs:** CAD Data Mgmt sheet · ADM-008 to ADM-011  
**Depends On:** Phase 1 + Phase 2 complete  
**Feeds Into:** Phase 5 (BOM), Phase 6 (Change Mgmt), Phase 7 (DHF)  
**Note:** WGM is NOT in scope. Creo 12 is the only CAD tool. ECAD (Altium) is OUT OF SCOPE.

---

### CAD-TC-001 · Creo-Windchill Login & Workspace Registration

| Field | Value |
|---|---|
| TC ID | CAD-TC-001 |
| Title | Verify Creo 12 connects to Windchill and workspace is created |
| Requirement Ref | ADM-008 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** ENV-002 confirmed; Creo 12 installed on test machine; Windchill server URL known

**Test Steps:**
1. Launch **Creo Parametric 12** on the test machine
2. Navigate to **File > Manage Session > Server Registrations > New Server**
3. Enter the Windchill server URL → register
4. Confirm the **Windchill toolbar** appears in the Creo ribbon/menu bar
5. Login with Designer credentials → confirm login succeeds
6. Navigate to **File > Manage Session > Server Workspaces > New** → create workspace `UAT_WS_01`
7. Confirm workspace `UAT_WS_01` is visible in the **Windchill web client > My Workspaces**

**Expected Results:**
1. Creo 12 connects to Windchill server without errors
2. Windchill toolbar visible in Creo after registration
3. Login succeeds with valid credentials; invalid credentials rejected with error message
4. Workspace created in Creo is immediately visible in the Windchill web UI

**Pass Criteria:** Creo-Windchill connection established; workspace creation confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-002 · Check-Out a Creo Part File

| Field | Value |
|---|---|
| TC ID | CAD-TC-002 |
| Title | Check out a .prt file from Windchill and verify lock is applied |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer (checkout); second Designer user (verify lock) |

**Preconditions:** CAD-TC-001 passed; a `.prt` file exists in Windchill at In Work state

**Test Steps:**
1. Log in as **Designer** in Creo → browse to the test `.prt` in Windchill → **Check Out**
2. Confirm the file opens in Creo for editing
3. In Windchill web UI, navigate to the part → confirm status shows **"Checked Out"** with the Designer's name
4. Log in as a **second Designer** in Windchill → attempt to check out the same part → confirm blocked with "Checked Out By [user]" message
5. Second Designer selects **Get Latest** (read-only copy) → confirm they receive a read-only copy without breaking the lock

**Expected Results:**
1. File checks out successfully; opens in Creo
2. Lock icon and "Checked Out By" user name visible in Windchill
3. Second user cannot check out the locked file
4. Second user can Get Latest (read-only) without disrupting the lock

**Pass Criteria:** Check-out locks file; concurrent checkout blocked; Get Latest works  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-003 · Check-In with Version Increment

| Field | Value |
|---|---|
| TC ID | CAD-TC-003 |
| Title | Check in a modified .prt and verify version increment and audit trail |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** CAD-TC-002 passed; `.prt` file is checked out to Designer

**Test Steps:**
1. Modify the part geometry or an attribute in Creo
2. Select **File > Check In** in Creo → enter change description: `Modified flange dimension for tolerance`
3. Confirm check-in completes; file is no longer checked out (lock released)
4. In Windchill web UI, navigate to the part → confirm version increments (e.g., 0.1 → 0.2)
5. Open the **History** tab → confirm new iteration entry shows: user = Designer, timestamp, change description
6. Confirm the previous version (0.1) is still accessible read-only in history

**Expected Results:**
1. Check-in completes; lock released
2. Version increments correctly
3. History tab shows new iteration with user, timestamp, and change description
4. Previous version preserved and accessible

**Pass Criteria:** Version increments; history recorded; lock released; prior version accessible  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-004 · Upload New Creo Part (.prt) — First Check-In

| Field | Value |
|---|---|
| TC ID | CAD-TC-004 |
| Title | Upload a new Creo .prt file to Windchill and verify WTPart auto-creation |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** CAD-TC-001 passed; a new Creo `.prt` file not yet in Windchill

**Test Steps:**
1. In Creo, open the new `.prt` → **File > Save > Save to Windchill** (first check-in)
2. In the check-in dialog, assign to **OAK001**, enter Description, confirm auto-number is generated
3. Complete check-in
4. Navigate to Windchill web UI → confirm:
   - An **EPMDocument** (CAD Document) is created at version 0.1, In Work
   - A **WTPart** is **automatically created** and linked to this EPMDocument
5. Confirm the EPMDocument and WTPart share the same auto-generated number (or follow the configured linkage pattern)
6. Confirm mandatory attributes are prompted and must be populated before check-in completes

**Expected Results:**
1. EPMDocument created at version 0.1, In Work state in OAK001
2. WTPart automatically created and linked to the EPMDocument
3. Auto-numbering applied to both objects
4. Mandatory attributes enforced at check-in

**Pass Criteria:** First check-in creates both EPMDocument and WTPart; auto-numbering applied  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-005 · Upload Assembly with Dependencies (.asm)

| Field | Value |
|---|---|
| TC ID | CAD-TC-005 |
| Title | Upload a Creo assembly with all child parts and verify dependency preservation |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A Creo assembly (`.asm`) with at least 3 child `.prt` files exists locally; files not yet in Windchill

**Test Steps:**
1. In Creo, open the assembly (`.asm`) → **File > Save to Windchill**
2. In the check-in dialog, confirm all **child parts** are listed for upload (dependency tree displayed)
3. Confirm all children → complete check-in
4. In Windchill web UI, navigate to the Assembly EPMDocument → open **Structure** tab
5. Confirm all child parts appear as children in the correct hierarchy (parent-child relationships preserved)
6. Confirm no "Broken References" messages appear
7. Click on a child part in the structure → confirm it navigates to that child's EPMDocument

**Expected Results:**
1. Assembly and all child parts uploaded in a single check-in operation
2. Windchill Structure tab shows correct parent-child hierarchy
3. No broken references
4. Child navigation from Structure tab works

**Test Data:** Assembly with min. 3 child parts (1 assembly, 2 parts minimum — nested structure preferred)  
**Pass Criteria:** Assembly hierarchy preserved; all children linked; no broken references  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-006 · Upload Creo Drawing (.drw)

| Field | Value |
|---|---|
| TC ID | CAD-TC-006 |
| Title | Upload a Creo drawing and verify its link to the parent part |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A Creo drawing (`.drw`) linked to a part already in Windchill

**Test Steps:**
1. In Creo, open the `.drw` → save to Windchill
2. In check-in dialog, confirm the drawing is linked to its parent part
3. In Windchill, navigate to the parent **EPMDocument** (`.prt`) → open Relationships/Structure tab
4. Confirm the `.drw` EPMDocument appears as a **drawing** relationship under the parent part
5. Open the drawing EPMDocument → confirm the parent part link is visible
6. In Windchill viewer, open the drawing → confirm it renders with correct title block, dimensions, and GD&T

**Expected Results:**
1. Drawing EPMDocument created at version 0.1, In Work
2. Drawing linked to parent part (bi-directional relationship)
3. Drawing renders correctly in the Windchill viewer (Creo View embedded viewer)

**Pass Criteria:** Drawing uploaded and linked to parent part; renders correctly in viewer  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-007 · Drawing Template Management

| Field | Value |
|---|---|
| TC ID | CAD-TC-007 |
| Title | Verify IRILLIC standard Creo drawing templates are available in Creo |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | High |
| Test Role | Designer |

**Preconditions:** IRILLIC standard drawing templates have been uploaded to Windchill by PDS Team

**Test Steps:**
1. In Creo, create a **New Drawing** → open the template picker
2. Confirm IRILLIC standard templates (e.g., A0, A1, A3 IRILLIC title block) are listed
3. Select the IRILLIC A3 template → confirm new drawing opens with the correct IRILLIC title block
4. Confirm title block fields (Part Number, Description, Revision, Author, Date) are pre-mapped to Windchill attributes

**Expected Results:**
1. IRILLIC standard templates visible in Creo template picker
2. Drawing opens with correct IRILLIC title block
3. Title block fields are attribute-linked

**Pass Criteria:** Templates available and correctly formatted  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-008 · Geometry Publishing on Release (PDF, STEP, DXF, STL, DWG)

| Field | Value |
|---|---|
| TC ID | CAD-TC-008 |
| Title | Verify all 5 publish formats are auto-generated when a CAD object is Released |
| Requirement Ref | ADM-008 · Publishing Trigger |
| Priority | Critical |
| Test Role | Lead (release) |

**Preconditions:** A CAD part (`.prt`) exists in Approved Not Effective state; CAD Worker confirmed (ENV-003)

**Test Steps:**
1. Log in as **Lead** → promote the CAD part to **Released**
2. After release, navigate to the part's EPMDocument → open **Content** tab
3. Confirm the following published representations are attached: **PDF**, **STEP**, **DXF**, **STL**, **DWG**
4. Download each format → confirm each file opens/imports correctly in the appropriate viewer
5. Confirm publishing is triggered **automatically** (no manual publish action required)
6. Confirm publish is NOT triggered on earlier lifecycle states (In Work, Under Review)

**Expected Results:**
1. On Release: PDF, STEP, DXF, STL, DWG all auto-generated and attached
2. All formats download and open correctly
3. Publish triggered by Release only — not by earlier states
4. CAD Worker completes publishing within 5 minutes of Release

**Pass Criteria:** All 5 formats published on Release; triggered automatically  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-009 · Bi-Directional Attribute Synchronisation

| Field | Value |
|---|---|
| TC ID | CAD-TC-009 |
| Title | Verify attribute changes sync between Creo and Windchill in both directions |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A `.prt` is checked out; it has attributes mapped between Creo parameters and Windchill attributes (e.g., Description, Material)

**Test Steps:**
1. In **Creo**, change a mapped parameter value (e.g., Material = `Stainless Steel 316L`)
2. Check in the part to Windchill
3. In **Windchill web UI**, open the part → confirm the `Material` attribute now shows `Stainless Steel 316L`
4. In **Windchill web UI**, edit the `Description` attribute (in-place on the web) → save
5. In **Creo**, update the workspace (Get → Update) for the same part
6. Confirm the updated `Description` value is now reflected in the Creo parameter

**Expected Results:**
1. Creo → Windchill: attribute change after check-in reflects in Windchill
2. Windchill → Creo: attribute change in Windchill web UI reflects in Creo after workspace update

**Pass Criteria:** Bi-directional attribute sync confirmed for mapped attributes  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-010 · Auto-Numbering for CAD Objects

| Field | Value |
|---|---|
| TC ID | CAD-TC-010 |
| Title | Verify CAD objects receive auto-generated numbers on first check-in |
| Requirement Ref | ADM-003 · Auto-Numbering |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Auto-numbering rule configured for EPMDocument in Windchill

**Test Steps:**
1. Upload a new `.prt` to OAK001 (first check-in) → leave number field blank
2. Confirm auto-number assigned: `OAK001-[CAD TypeCode]-XXXX`
3. Upload a second new `.prt` → confirm number increments: `OAK001-[CAD TypeCode]-XXXX+1`
4. Upload a `.asm` → confirm it receives a different type-code if applicable
5. Attempt to manually enter a duplicate number → confirm rejected

**Expected Results:**
1. Auto-number assigned on first check-in; no manual entry required
2. Sequence increments consistently
3. Duplicate number rejected

**Pass Criteria:** Auto-numbering consistent and unique for all CAD uploads  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-011 · Workspace Management (Update, Sync, Conflict Detection)

| Field | Value |
|---|---|
| TC ID | CAD-TC-011 |
| Title | Verify Windchill workspace operations — update, sync, and conflict detection |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | High |
| Test Role | Designer (two users) |

**Preconditions:** Two Designer users share access to the same part in OAK001; part at version 0.1

**Test Steps:**
1. **Designer A**: add the part to workspace → Get (download to local)
2. **Designer B**: check out the part → modify → check in → version becomes 0.2
3. **Designer A**: in Creo, attempt **Update** from workspace → confirm system notifies that a newer server version (0.2) exists
4. **Designer A**: accept the server version → part updates to 0.2 in their workspace
5. Simulate a local modification by Designer A on an older version + update → confirm **conflict warning** is displayed
6. Confirm Designer A can resolve the conflict by choosing to keep local or take server version

**Expected Results:**
1. Workspace update notifies Designer A of newer server version
2. Conflict detected when local changes exist against a newer server version
3. Conflict resolution options are clear (keep local / take server)

**Pass Criteria:** Update, sync, and conflict detection work correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-012 · CAD Lifecycle — Full Progression

| Field | Value |
|---|---|
| TC ID | CAD-TC-012 |
| Title | Progress a CAD EPMDocument through all lifecycle states |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer; Reviewer; Manager; Lead |

**Preconditions:** A new `.prt` EPMDocument at version 0.1, In Work

**Test Steps:**
1. **Designer** promotes to **Under Review** → confirm state change; Reviewer notified
2. **Manager** applies e-signature → **Approved Not Effective**; confirm e-signature audit record
3. **Lead** promotes to **Released** → confirm version = 1.0; PDF/STEP/DXF/STL/DWG published
4. **Lead** promotes to **Obsolete** → confirm excluded from default search
5. At each state, verify access control matches the ACL matrix (CAD Document sheet — MCAD Documents)

**Expected Results:**
1. All 5 lifecycle states traversed in sequence
2. E-signature captured at Approved Not Effective
3. Publishing triggered on Release
4. ACL enforced at each state: Designer loses modify access after Under Review; Released = read-only for Designer

**Pass Criteria:** Full lifecycle traversal correct; e-signatures and publishing verified  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-013 · CAD Version / Iteration History

| Field | Value |
|---|---|
| TC ID | CAD-TC-013 |
| Title | Verify CAD object version history is complete and prior iterations are accessible |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A `.prt` has been checked in at least 3 times (versions 0.1, 0.2, 0.3)

**Test Steps:**
1. Navigate to the EPMDocument → open **History / Iterations** tab
2. Confirm all 3 iterations are listed: 0.1, 0.2, 0.3 with user name, date, and change comment per iteration
3. Click on version 0.1 → confirm it opens in the Creo View viewer (read-only geometry)
4. Confirm version 0.1 geometry differs from 0.3 (change history is real, not just metadata)
5. Attempt to delete version 0.1 as Designer → confirm blocked
6. Attempt to delete version 0.1 as Reviewer → confirm blocked

**Expected Results:**
1. All iterations listed with complete audit data
2. Prior versions viewable read-only in viewer
3. Geometry differences preserved across iterations
4. No non-admin role can delete an iteration

**Pass Criteria:** Full iteration history accessible; older iterations preserved with correct geometry  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-014 · Family Table Support

| Field | Value |
|---|---|
| TC ID | CAD-TC-014 |
| Title | Upload a Creo part with a family table and verify generic + instances in Windchill |
| Requirement Ref | CAD Data Mgmt sheet |
| Priority | High |
| Test Role | Designer |

**Preconditions:** A Creo `.prt` with a family table (1 generic + at least 2 instances) exists locally

**Test Steps:**
1. In Creo, open the generic family table part → check in to OAK001
2. In Windchill, navigate to the generic EPMDocument → confirm it exists
3. Confirm all **instances** are listed as separate EPMDocument objects linked to the generic
4. Open Instance 1 → confirm attributes reflect the instance dimensions/parameters
5. Open Instance 2 → confirm attributes differ from Instance 1 (instance-specific values preserved)

**Expected Results:**
1. Generic part uploaded as one EPMDocument
2. All instances appear as linked EPMDocuments in Windchill
3. Instance-specific attribute values are preserved correctly

**Pass Criteria:** Generic + all instances present in Windchill with correct attributes  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-015 · WTPart Auto-Creation on CAD Check-In

| Field | Value |
|---|---|
| TC ID | CAD-TC-015 |
| Title | Verify WTPart is automatically created and linked when a new CAD file is checked in |
| Requirement Ref | CAD Data Mgmt sheet · PM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** A new `.prt` not yet in Windchill

**Test Steps:**
1. First check-in a new `.prt` to OAK001 (same as CAD-TC-004 if not already done)
2. In Windchill, navigate to the EPMDocument
3. Open **Relationships** tab → confirm a **WTPart** is listed as an "Described By" or "Consists Of" relationship
4. Click the linked WTPart → confirm it exists with:
   - Same or linked number as the EPMDocument
   - Lifecycle state: In Work
   - Version: 0.1
5. Confirm the WTPart has the Part type correctly set (e.g., Sheet Metal Part, Machining Part)

**Expected Results:**
1. WTPart auto-created on CAD first check-in
2. WTPart linked to EPMDocument via correct relationship type
3. WTPart at version 0.1, In Work
4. Part type correctly assigned

**Pass Criteria:** WTPart auto-created, correctly linked, and at correct initial state  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-016 · No-Delete Policy for CAD Objects (All Roles)

| Field | Value |
|---|---|
| TC ID | CAD-TC-016 |
| Title | Verify delete is blocked for all non-admin roles on CAD EPMDocuments |
| Requirement Ref | Delete Policy · ADM-002 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Lead; Guest |

**Preconditions:** CAD EPMDocuments exist in In Work, Released, and Obsolete states

**Test Steps:**
1. **Designer** attempts delete on an In Work EPMDocument → blocked; audit log entry created
2. **Designer** attempts delete on a Released EPMDocument → blocked; audit log entry created
3. **Reviewer** attempts delete on an Under Review EPMDocument → blocked; audit log entry created
4. **Lead** attempts delete on a Released EPMDocument → blocked; audit log entry created
5. **Guest** — confirm delete option not visible in UI at any state
6. Verify audit trail contains all blocked delete attempts with user ID, object number, and timestamp

**Expected Results:**
1. Delete blocked for Designer, Reviewer, Lead, Guest at ALL lifecycle states for CAD objects
2. Every blocked attempt recorded in audit trail
3. Delete option not visible for Guest

**Pass Criteria:** No successful deletes by non-admin roles; all attempts logged  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CAD-TC-017 · ECR/ECO Linkage for Released CAD Change

| Field | Value |
|---|---|
| TC ID | CAD-TC-017 |
| Title | Verify a Released CAD part can only be modified under an approved ECO |
| Requirement Ref | CAD Data Mgmt sheet · CM-001 |
| Priority | Critical |
| Test Role | Designer; Change Admin I; Lead |

**Preconditions:** A Released CAD part (version 1.0) exists; an ECO has been created and approved (or use stub ECO for this TC)

**Test Steps:**
1. **Designer** attempts to check out the Released part without an ECO → confirm blocked: "Object is Released — change process required"
2. Open the **ECO** → list the Released CAD part as an affected object
3. **Designer** checks out the CAD part **under the ECO context** → confirm checkout succeeds
4. Modify the part → check in with change description referencing the ECO number
5. In Windchill, navigate to the new version (1.1 or 2.0) → confirm **ECO reference** is stored in the part's attributes or relationship
6. Navigate from the new part version to the ECO → confirm the part appears in the ECO's affected objects

**Expected Results:**
1. Direct check-out of Released part blocked without ECO
2. Check-out succeeds under ECO context
3. New part version stores ECO reference
4. Bi-directional traceability: part → ECO and ECO → part

**Pass Criteria:** Released CAD can only be modified under ECO; ECO reference stored and traceable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________


---

## PHASE 5 — BOM Management

**Goal:** Validate EBOM auto-generation from Creo assemblies, all 7 BOM views, EBOM attribute completeness, BOM version control, structure comparison, lifecycle, access control, no-delete, and EBOM-to-MBOM view.  
**Requirement IDs:** BOM-001 to BOM-007 · BOM Mgmt sheet  
**Depends On:** Phase 2 (WTParts) + Phase 4 (CAD assemblies)  
**Note:** Full MBOM/MPMLink is out of scope. However, EBOM generated from CAD must support transformation to an MBOM view (Ramya comment — included as BOM-TC-016).

---

### BOM-TC-001 · EBOM Auto-Generation from Creo Assembly

| Field | Value |
|---|---|
| TC ID | BOM-TC-001 |
| Title | Verify EBOM is auto-generated in Windchill when a Creo assembly is checked in |
| Requirement Ref | BOM-001 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** Phase 4 complete; a multi-level Creo assembly (`.asm`) is checked into Windchill with all child parts

**Test Steps:**
1. Navigate to the assembly's **WTPart** (auto-created in Phase 4) in Windchill
2. Open the **Structure** or **BOM** tab
3. Confirm an **EBOM is automatically present** — no manual BOM entry required
4. Confirm the EBOM hierarchy matches the Creo assembly structure exactly (same parent-child relationships and quantities)
5. Verify for a minimum 3-level assembly: Level 1 (top assembly), Level 2 (sub-assembly), Level 3 (components)
6. Confirm each BOM line shows at minimum: Part Number, Part Name, Revision, Quantity, Unit

**Expected Results:**
1. EBOM auto-generated on CAD assembly check-in — no manual entry needed
2. BOM hierarchy matches Creo assembly exactly
3. Multi-level (min. 3 levels) structure visible and correct
4. All required attributes populated on each BOM line

**Pass Criteria:** EBOM auto-generated with correct hierarchy and attributes from CAD check-in  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-002 · Multi-Level BOM Viewing

| Field | Value |
|---|---|
| TC ID | BOM-TC-002 |
| Title | Verify multi-level BOM can be expanded and navigated in Windchill |
| Requirement Ref | BOM-002 |
| Priority | Critical |
| Test Role | Designer; Guest |

**Preconditions:** BOM-TC-001 passed; a 3+ level assembly BOM exists

**Test Steps:**
1. Navigate to the top-level assembly WTPart → open BOM/Structure tab
2. Confirm Level 1 (direct children) are visible
3. Expand Level 1 sub-assembly → confirm Level 2 children are displayed
4. Expand Level 2 component → confirm Level 3 (if applicable) is displayed
5. Verify quantities are correct at each level (as per the Creo assembly)
6. Log in as **Guest** → navigate to the Released assembly → confirm BOM is viewable (read-only)
7. Click on a child part in the BOM → confirm navigation to that part's detail page

**Expected Results:**
1. All levels expand correctly in the BOM view
2. Quantities correct at each level
3. Guest can view BOM of Released assembly (read-only)
4. Click-through navigation from BOM row to part page works

**Pass Criteria:** Multi-level BOM expandable; quantities correct; navigation works; Guest access works  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-003 · EBOM Attribute Completeness

| Field | Value |
|---|---|
| TC ID | BOM-TC-003 |
| Title | Verify all required IRILLIC EBOM attributes are present and populated on BOM lines |
| Requirement Ref | BOM-003 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** An EBOM exists with at least 5 component lines; attributes populated per IRILLIC requirements

**Required EBOM Attributes (from BOM Mgmt sheet):**
Part No · Designator · Assembly · Parent Assembly · Make/Buy · Qty · Unit · Level · Unit Price · Line Price · Manufacturer Name · MFG Part No / Drawing No · Rev No · Drawing Revised? · Vendor Name · Vendor Order Code · Vendor Link · Remarks (optional)

**Test Steps:**
1. Navigate to an EBOM → open the BOM table/edit view
2. Confirm ALL required column headers are visible: Part No, Designator, Assembly, Parent Assembly, Make/Buy, Qty, Unit, Level, Unit Price, Line Price, Manufacturer Name, MFG Part No/Drawing No, Rev No, Drawing Revised?, Vendor Name, Vendor Order Code, Vendor Link
3. Populate the following for one component row: Make/Buy = Buy; Qty = 2; Unit = EA; Unit Price = 150.00; Manufacturer Name = Supplier ABC; Vendor Order Code = SUP-XYZ-001 → save
4. Confirm all values persist on reload
5. Confirm `Line Price` is auto-calculated: Qty × Unit Price = 300.00
6. Confirm mandatory attributes are enforced (test by leaving a mandatory field blank)

**Expected Results:**
1. All 17 required attributes are present as columns in the BOM view
2. Attribute values save and persist correctly
3. Line Price auto-calculated from Qty × Unit Price
4. Mandatory attributes enforced at BOM line level

**Pass Criteria:** All required EBOM attributes present, editable, and calculated correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-004 · BOM View — Manufacturing View

| Field | Value |
|---|---|
| TC ID | BOM-TC-004 |
| Title | Verify Manufacturing BOM View shows correct filtered components |
| Requirement Ref | BOM-004 |
| Priority | High |
| Test Role | Designer; Manufacturing Engineer |

**Preconditions:** A BOM exists with parts of varied types (Make and Buy parts)

**Test Steps:**
1. Navigate to the assembly BOM → select **Manufacturing View** from the view selector
2. Confirm the view shows only components relevant to manufacturing (Make parts, sub-assemblies to be built internally)
3. Confirm purchased/off-the-shelf parts are filtered out (or displayed per Manufacturing View config)
4. Confirm the column set in Manufacturing View is appropriate (e.g., Qty, Unit, Make/Buy, Level)
5. Verify at least one Make part is visible and one Buy-only part is handled per the view definition

**Expected Results:**
1. Manufacturing View loads without errors
2. Correct components shown/hidden per view definition
3. View is read-only for Guest role

**Pass Criteria:** Manufacturing View filters components correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-005 · BOM View — Purchase Part View

| Field | Value |
|---|---|
| TC ID | BOM-TC-005 |
| Title | Verify Purchase Part BOM View shows only purchased/off-the-shelf parts |
| Requirement Ref | BOM-004 |
| Priority | High |
| Test Role | Designer; Procurement |

**Preconditions:** BOM contains a mix of Make and Buy parts

**Test Steps:**
1. Navigate to the assembly BOM → select **Purchase Part View**
2. Confirm only parts with `Make/Buy = Buy` (or equivalent purchased part flag) are displayed
3. Confirm Make parts are filtered out
4. Confirm displayed columns include: Part No, Description, Qty, Unit, Vendor Name, Vendor Order Code, Manufacturer Name, MFG Part No

**Expected Results:**
1. Purchase Part View shows only Buy/purchased parts
2. Make parts filtered out
3. Procurement-relevant columns visible

**Pass Criteria:** Purchase Part View filters correctly; purchased parts and vendor attributes visible  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-006 · BOM View — Appearance Part View

| Field | Value |
|---|---|
| TC ID | BOM-TC-006 |
| Title | Verify Appearance Part BOM View filters for visual/cosmetic parts |
| Requirement Ref | BOM-004 |
| Priority | Medium |
| Test Role | Designer |

**Preconditions:** BOM contains at least one part flagged as an appearance/cosmetic part (via a part type or attribute)

**Test Steps:**
1. Flag a part in the BOM as an appearance part (via the relevant attribute or part type)
2. Navigate to BOM → select **Appearance Part View**
3. Confirm only the appearance-flagged part is displayed; non-appearance parts filtered out
4. Confirm filter logic is correct (based on the attribute used to define appearance parts)

**Expected Results:**
1. Appearance Part View loads correctly
2. Only appearance-flagged parts visible
3. Non-appearance parts filtered out

**Pass Criteria:** Appearance Part View filter works correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-007 · BOM View — Shelf-Life View

| Field | Value |
|---|---|
| TC ID | BOM-TC-007 |
| Title | Verify Shelf-Life BOM View shows only parts with a shelf-life attribute |
| Requirement Ref | BOM-004 |
| Priority | High |
| Test Role | Designer; QA |

**Preconditions:** BOM contains at least one part with a `Shelf Life` attribute populated and one without

**Test Steps:**
1. Set `Shelf Life` attribute on one BOM component (e.g., Shelf Life = 24 months)
2. Leave `Shelf Life` blank on another component
3. Navigate to BOM → select **Shelf-Life View**
4. Confirm only the part with `Shelf Life` populated is displayed
5. Confirm the Shelf-Life duration value is visible in this view

**Expected Results:**
1. Shelf-Life View shows only shelf-life-attributed parts
2. Parts without shelf-life attribute are filtered out
3. Shelf-life value is displayed

**Pass Criteria:** Shelf-Life View filters correctly; shelf-life values visible  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-008 · BOM View — Exempt from IQC View

| Field | Value |
|---|---|
| TC ID | BOM-TC-008 |
| Title | Verify Exempt from IQC BOM View shows only parts flagged Exempt from IQC |
| Requirement Ref | BOM-004 · PM-001 |
| Priority | High |
| Test Role | Designer; QA |

**Preconditions:** BOM with mix of parts — some with `Exempt from IQC = Yes`, some No/blank

**Test Steps:**
1. Navigate to the assembly BOM → select **Exempt from IQC View**
2. Confirm only parts with `Exempt from IQC = Yes` are displayed
3. Confirm parts with `Exempt from IQC = No` or blank are filtered out
4. Confirm the view is linked to the `Exempt from IQC` attribute set in PM-TC-008

**Expected Results:**
1. Only Exempt from IQC = Yes parts are visible
2. Non-exempt parts filtered out
3. Consistent with the attribute set at the WTPart level (PM-TC-008)

**Pass Criteria:** Exempt from IQC View filters correctly and links to the Part attribute  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-009 · BOM View — Safety Critical Part View

| Field | Value |
|---|---|
| TC ID | BOM-TC-009 |
| Title | Verify Safety Critical BOM View shows only parts flagged as Safety Critical |
| Requirement Ref | BOM-004 |
| Priority | High |
| Test Role | Designer; QA; RA |

**Preconditions:** BOM with at least one part with `Safety Critical = Yes`

**Test Steps:**
1. Set `Safety Critical = Yes` on one BOM component
2. Navigate to BOM → select **Safety Critical Part View**
3. Confirm only the Safety Critical-flagged part is shown
4. Confirm non-flagged parts are filtered out
5. Confirm the `Safety Critical` attribute value is visible in the view

**Expected Results:**
1. Safety Critical View shows only flagged parts
2. Non-flagged parts filtered out
3. Safety Critical attribute value visible

**Pass Criteria:** Safety Critical View filters correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-010 · BOM View — Design Alternate View

| Field | Value |
|---|---|
| TC ID | BOM-TC-010 |
| Title | Verify Design Alternate BOM View and mandatory justification when no alternate exists |
| Requirement Ref | BOM-004 |
| Priority | High |
| Test Role | Designer |

**Preconditions:** BOM with at least one component that has an alternate part defined, and one without

**Test Steps:**
1. Define an alternate part for Component A in the BOM (using Substitute Parts feature)
2. Leave Component B with no alternate; populate `Justification (No Alternate)` field: `Single-source supplier — no approved alternate`
3. Navigate to BOM → select **Design Alternate View**
4. Confirm Component A shows its alternate part
5. Confirm Component B shows the justification text (mandatory field enforced when no alternate)
6. Attempt to save Component B without a justification → confirm save blocked

**Expected Results:**
1. Components with alternates show alternate part in this view
2. Components without alternates require mandatory justification text
3. Missing justification blocks save

**Pass Criteria:** Design Alternate View shows alternates and enforces justification for no-alternate cases  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-011 · BOM Version Control

| Field | Value |
|---|---|
| TC ID | BOM-TC-011 |
| Title | Verify BOM version increments when BOM is modified and prior versions are retained |
| Requirement Ref | BOM-005 |
| Priority | Critical |
| Test Role | Designer |

**Preconditions:** An EBOM at version 0.1 exists in In Work state

**Test Steps:**
1. Navigate to the assembly WTPart BOM (In Work) → add a new component → save → confirm version increments to 0.2
2. Remove a component → save → confirm version increments to 0.3
3. Change a quantity → save → confirm version increments
4. Open History tab on the assembly WTPart → confirm all BOM iterations (0.1, 0.2, 0.3) are listed
5. Open BOM at version 0.1 → confirm original component list is preserved read-only
6. Confirm no non-admin role can delete a BOM iteration

**Expected Results:**
1. BOM version increments on each modification
2. Full BOM history preserved
3. Prior BOM versions accessible read-only with correct component lists
4. BOM iterations cannot be deleted by non-admin roles

**Pass Criteria:** BOM versioning correct; history complete and correct  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-012 · BOM Structure Comparison

| Field | Value |
|---|---|
| TC ID | BOM-TC-012 |
| Title | Compare two BOM versions and verify added, removed, and changed rows are highlighted |
| Requirement Ref | BOM-006 |
| Priority | High |
| Test Role | Designer; Change Analyst |

**Preconditions:** An assembly WTPart with BOM at version 0.1 and version 0.3 (with known changes between them)

**Test Steps:**
1. Navigate to the assembly WTPart → open **BOM Compare** function
2. Select version 0.1 as Baseline and version 0.3 as Current
3. Confirm comparison results show:
   - **Added rows** (components in 0.3 not in 0.1) — highlighted in green or annotated "Added"
   - **Removed rows** (components in 0.1 not in 0.3) — highlighted in red or annotated "Removed"
   - **Changed rows** (quantity or attribute differences) — highlighted/annotated "Changed"
   - **Unchanged rows** — shown without annotation
4. Export the comparison result to **Excel** → confirm all changes listed
5. Export to **PDF** → confirm readable format with change annotations

**Expected Results:**
1. BOM Compare shows all 4 categories: Added, Removed, Changed, Unchanged
2. Change highlighting is correct and matches known changes
3. Excel and PDF export work and correctly reflect all comparison data

**Pass Criteria:** BOM Compare correctly identifies all changes; both export formats work  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-013 · BOM Access Control

| Field | Value |
|---|---|
| TC ID | BOM-TC-013 |
| Title | Verify BOM access control per role — Designer can edit In Work BOM; Read-Only cannot |
| Requirement Ref | BOM-007 · ADM-002 |
| Priority | Critical |
| Test Role | Designer; Guest |

**Preconditions:** An assembly BOM in In Work state; a Released assembly BOM

**Test Steps (In Work BOM):**
1. **Designer**: open BOM → confirm can add/remove components, edit attributes → save succeeds
2. **Guest**: open BOM → confirm add/remove/edit options are not available (view-only UI)
3. **Guest**: attempt to directly edit a BOM attribute → confirm blocked

**Test Steps (Released BOM):**
4. **Designer**: attempt to edit a component in the Released BOM → confirm blocked
5. **Guest**: open Released BOM → confirm view and download only
6. Confirm all blocked edit attempts are logged in the audit trail

**Expected Results:**
1. Designer: full edit on In Work BOM; read-only on Released BOM
2. Guest: read-only at all lifecycle states
3. All unauthorized edit attempts blocked and logged

**Pass Criteria:** BOM access control matches ACL matrix at all states  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-014 · BOM Release Workflow

| Field | Value |
|---|---|
| TC ID | BOM-TC-014 |
| Title | Verify BOM release workflow requires approval and locks BOM on release |
| Requirement Ref | BOM-007 |
| Priority | Critical |
| Test Role | Designer; Manager; Lead |

**Preconditions:** An assembly WTPart BOM at version 0.x, all mandatory BOM attributes populated

**Test Steps:**
1. **Designer** promotes assembly WTPart to Under Review → workflow routes to Reviewer
2. **Manager** applies e-signature → Approved Not Effective
3. **Lead** releases the assembly WTPart → version becomes 1.0
4. Navigate to the Released BOM → attempt to add/remove a component as **Designer** → confirm blocked
5. Confirm released BOM can only be modified via an ECO (see CAD-TC-017 and CM-TC-005 for ECO flow)
6. Confirm e-signature on release is captured in audit trail

**Expected Results:**
1. BOM release follows same approval workflow as Parts and Documents
2. Released BOM is locked — no direct edits by any non-admin role
3. E-signature captured at Approved Not Effective and Release
4. ECO required for any post-release change

**Pass Criteria:** BOM release workflow complete; Released BOM locked; e-signature captured  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-015 · No-Delete Policy on Released BOM

| Field | Value |
|---|---|
| TC ID | BOM-TC-015 |
| Title | Verify delete is blocked for all non-admin roles on Released BOM components |
| Requirement Ref | Delete Policy · BOM-007 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Lead; Guest |

**Preconditions:** A Released assembly BOM exists

**Test Steps:**
1. **Designer** attempts to delete a component from the Released BOM → confirm blocked; logged
2. **Reviewer** attempts to delete a component from the Released BOM → confirm blocked; logged
3. **Lead** attempts to delete a component from the Released BOM → confirm blocked; logged
4. **Guest** → confirm delete option not visible
5. Verify audit trail entries for all blocked attempts: user ID, action (Delete BOM component), object, timestamp

**Expected Results:**
1. Delete blocked for all non-admin roles on Released BOM
2. Audit trail records each blocked attempt

**Pass Criteria:** No non-admin role can delete from Released BOM; all attempts logged  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### BOM-TC-016 · EBOM to MBOM View / Transformation

| Field | Value |
|---|---|
| TC ID | BOM-TC-016 |
| Title | Verify EBOM can be viewed/transformed as an MBOM structure in Windchill |
| Requirement Ref | BOM Mgmt sheet *(Ramya comment: "EBOM generated through CAD should be able to transform the EBOM to MBOM")* |
| Priority | High |
| Test Role | Designer; Manufacturing Engineer |

**Preconditions:** An EBOM for a Released assembly exists in OAK001

**Test Steps:**
1. Navigate to the assembly WTPart BOM
2. Locate the **MBOM view** or **Manufacturing BOM** transformation option in Windchill
3. Confirm the EBOM structure is displayed in a manufacturing-ready view (MBOM perspective)
4. Confirm the MBOM view supports adding/modifying manufacturing-specific attributes without altering the underlying EBOM
5. Confirm the EBOM and any MBOM representation remain linked (EBOM is the source of truth)
6. Document the exact mechanism used (OOTB view vs. MPMLink transformation) for tester reference

**Expected Results:**
1. An MBOM view/transformation is accessible from the EBOM
2. MBOM view shows manufacturing-relevant structure and attributes
3. EBOM remains unchanged when MBOM view is used
4. Linkage between EBOM and MBOM view is maintained

**Note:** If MBOM transformation via MPMLink is out of scope in Phase 1, document the specific OOTB mechanism available and flag for Phase 2 scope definition.  
**Pass Criteria:** MBOM view/transformation accessible and linked to EBOM without altering EBOM  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________


---

## PHASE 6 — Change Management

**Goal:** Validate the full ECR (Problem Report) → ECO (Change Activity) → ECN (Change Notice) lifecycle, parallel ECR handling, affected objects, cross-module propagation, BOM effectivity, email notifications, impact analysis, and audit trail.  
**Requirement IDs:** CM-001 to CM-009  
**Depends On:** Phases 2–5 complete (Parts, Docs, CAD, BOM must exist as affected objects)  
**Change Object Mapping (from ACL):** ECR = Problem Report (PR) / Change Request (CR) · ECO = Change Activity · ECN = Change Notice (CN)

---

### CM-TC-001 · ECR (Problem Report) Creation

| Field | Value |
|---|---|
| TC ID | CM-TC-001 |
| Title | Create an ECR (Problem Report) and attach affected objects |
| Requirement Ref | CM-002 |
| Priority | Critical |
| Test Role | Designer (Team Member) |

**Preconditions:** Phases 2–5 complete; at least one Released Part, CAD doc, BOM, and Document exist

**Test Steps:**
1. Log in as **Designer** → navigate to **Change Management > New Problem Report**
2. Populate: Title = `PR-UAT-001 Test Change Request`; Description = `Flange dimension incorrect in OAK001-XXXX`; Reason = `Design error identified during prototype testing`
3. Add **Affected Objects**: add the Released Part, its CAD EPMDocument, its BOM assembly, and a related WTDocument
4. Submit the PR
5. Confirm the PR is created in **In Work** state with auto-number assigned
6. Confirm Designer (Team Member) has Read, Download, Modify, Modify Content, Modify Identity, Create, Set State in In Work state (per ACL)

**Expected Results:**
1. PR created with auto-number in In Work state
2. All 4 affected objects listed correctly
3. Designer access matches Change Process ACL for Team Members — In Work

**Pass Criteria:** PR created with correct affected objects; ACL confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-002 · Parallel ECR Management (CM-001)

| Field | Value |
|---|---|
| TC ID | CM-TC-002 |
| Title | Create two simultaneous ECRs on the same assembly and verify conflict management |
| Requirement Ref | CM-001 |
| Priority | Critical |
| Test Role | Designer A; Designer B; Change Review Board |

**Preconditions:** A Released assembly with its BOM exists; two Designer users available

**Test Steps:**
1. **Designer A** creates PR #1 on the Released assembly (same as CM-TC-001)
2. **Designer B** simultaneously creates PR #2 on the same Released assembly
3. Navigate to the Released assembly's **Related Objects** → confirm **both** PRs are listed
4. Log in as **Change Review Board** → open both PRs → review for conflict
5. CRB decision: merge both PRs into one ECO OR sequence them (PR #1 first, PR #2 on hold)
6. Confirm the hold/merge action is recorded in the audit trail for both PRs

**Expected Results:**
1. Both PRs visible on the same affected assembly
2. No system error from two concurrent PRs on same object
3. CRB can manage conflict: merge or sequence
4. CRB decision recorded in audit trail

**Pass Criteria:** Parallel ECR conflict is surfaced to CRB; resolution options available  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-003 · ECR to ECO Conversion (Change Request → Change Activity)

| Field | Value |
|---|---|
| TC ID | CM-TC-003 |
| Title | Convert an approved ECR to an ECO (Change Activity) with all affected objects |
| Requirement Ref | CM-003 |
| Priority | Critical |
| Test Role | Change Admin I; Change Review Board |

**Preconditions:** A PR/CR is in Under Review state; Change Review Board has reviewed and approved

**Test Steps:**
1. **Change Review Board** approves the PR → PR moves to Released/Approved state
2. **Change Admin I** (or CRB) converts the PR to a **Change Activity (ECO)**
3. Confirm all affected objects from the PR are automatically listed in the ECO
4. Confirm ECO is created in **In Work** state with auto-number
5. Confirm ECO references the originating PR number

**Expected Results:**
1. PR → ECO conversion creates a Change Activity
2. All affected objects carried over automatically
3. ECO created at In Work state with reference to source PR

**Pass Criteria:** ECO created from approved PR with all affected objects and source reference  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-004 · Affected Objects Completeness Verification

| Field | Value |
|---|---|
| TC ID | CM-TC-004 |
| Title | Verify ECO affected objects list includes all impacted Parts, CAD, BOMs, and Documents |
| Requirement Ref | CM-004 |
| Priority | Critical |
| Test Role | Change Admin I |

**Preconditions:** An ECO (Change Activity) exists from CM-TC-003

**Test Steps:**
1. Open the ECO → navigate to **Affected Objects** tab
2. Confirm all of the following are listed: the impacted WTPart, its linked EPMDocument (CAD), the assembly BOM WTPart, the linked WTDocument
3. For each affected object, confirm the current revision is listed
4. Attempt to remove an affected object → confirm only authorized Change Admin roles can modify the affected objects list
5. Add an additional affected document manually → confirm it saves correctly

**Expected Results:**
1. All 4 object types (Part, CAD, BOM, Document) listed as affected objects
2. Current revision shown for each affected object
3. Only Change Admin can modify affected objects list

**Pass Criteria:** Affected objects list complete and correctly permissioned  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-005 · ECO Implementation — CAD Revision Under ECO

| Field | Value |
|---|---|
| TC ID | CM-TC-005 |
| Title | Revise a Released CAD file under ECO control and verify ECO reference is stored |
| Requirement Ref | CM-005 |
| Priority | Critical |
| Test Role | Designer; Change Admin II |

**Preconditions:** An approved ECO exists with the CAD EPMDocument listed as an affected object

**Test Steps:**
1. **Designer** opens the ECO → checks out the affected Released CAD part **under the ECO context**
2. Modifies the part in Creo → checks in with change description referencing ECO number
3. Confirm a new version of the CAD EPMDocument is created (e.g., 1.1 or new revision A→B)
4. Confirm the new version stores the **ECO number** in its attributes or history
5. Navigate from the new CAD version → Related Objects → confirm ECO is linked
6. Navigate from the ECO → Affected Objects → confirm new CAD version is reflected

**Expected Results:**
1. CAD revision created under ECO context
2. ECO number stored on the new CAD version
3. Bi-directional traceability: new CAD version ↔ ECO

**Pass Criteria:** CAD revised under ECO; ECO reference stored and traceable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-006 · ECO Implementation — BOM Update Under ECO

| Field | Value |
|---|---|
| TC ID | CM-TC-006 |
| Title | Update a Released BOM under ECO control and verify new BOM version references the ECO |
| Requirement Ref | CM-006 |
| Priority | Critical |
| Test Role | Designer; Change Admin II |

**Preconditions:** An approved ECO exists; a Released assembly BOM is listed as an affected object

**Test Steps:**
1. Under the ECO context, **Designer** revises the assembly WTPart → a new BOM version is created (In Work)
2. Make a BOM change: add a component or change a quantity
3. Progress the new BOM version through review and release
4. Confirm the released new BOM version stores the **ECO reference**
5. Confirm the prior Released BOM version remains accessible (not overwritten)
6. Navigate from the ECO → Affected Objects → confirm new BOM version is listed

**Expected Results:**
1. New BOM version created under ECO
2. ECO reference stored on the new BOM version
3. Prior released BOM version preserved (accessible in history)
4. ECO lists updated BOM version as affected object

**Pass Criteria:** BOM updated under ECO; ECO reference stored; prior version preserved  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-007 · ECN (Change Notice) Workflow

| Field | Value |
|---|---|
| TC ID | CM-TC-007 |
| Title | Create and distribute an ECN after ECO close |
| Requirement Ref | CM-007 |
| Priority | High |
| Test Role | Change Admin II; Manufacturing Engineering Manager |

**Preconditions:** An ECO has been completed/closed

**Test Steps:**
1. **Change Admin II** creates a **Change Notice (CN)** referencing the closed ECO
2. CN is distributed to stakeholders (Manufacturing Engineering Manager is a required recipient per ACL)
3. Confirm **Manufacturing Engineering Manager** receives CN notification and has Read, Download, New View Version access (per Change Process ACL)
4. Stakeholder acknowledgement is captured (e.g., signature or workflow task completion)
5. CN moves to Released state; confirm audit trail records the distribution and acknowledgements

**Expected Results:**
1. CN created and linked to the ECO
2. Distribution to Manufacturing Engineering Manager confirmed
3. Acknowledgement captured in system
4. CN Released and audit trail records all distribution events

**Pass Criteria:** ECN distributed to correct stakeholders; acknowledgement captured; audit trail complete  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-008 · BOM Effectivity (Date-Based)

| Field | Value |
|---|---|
| TC ID | CM-TC-008 |
| Title | Set date-based effectivity on a BOM change and verify correct BOM version per date |
| Requirement Ref | CM-008 |
| Priority | High |
| Test Role | Change Admin II; Designer |

**Preconditions:** Two released BOM versions exist (old and new); effectivity date set to a future date

**Test Steps:**
1. Set the new BOM version's effective date to **[today + 7 days]**
2. View the BOM as of **today** → confirm the **old BOM** version is displayed
3. Set system date to **[today + 8 days]** (or use Windchill date filter) → confirm **new BOM** version is displayed
4. Confirm a user can query "BOM as of [specific date]" and receive the correct version

**Expected Results:**
1. Before effectivity date: old BOM version is the active BOM
2. On/after effectivity date: new BOM version becomes the active BOM
3. Date-based query returns the correct BOM version

**Pass Criteria:** Date-based BOM effectivity works correctly  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-009 · Email Notifications for ECR/ECO Workflow

| Field | Value |
|---|---|
| TC ID | CM-TC-009 |
| Title | Verify email notifications are sent at each ECR/ECO workflow step |
| Requirement Ref | CM-008 |
| Priority | High |
| Test Role | Designer; Change Admin I; Change Review Board |

**Preconditions:** ENV-008 (mail server) confirmed

**Test Steps:**
1. Designer submits PR → confirm **Change Admin I** receives email notification with PR number and link
2. Change Admin I promotes PR to Under Review → confirm **Change Review Board** is notified
3. CRB approves → confirm **Change Admin II** (implementor) is notified to begin implementation
4. ECO implementation complete → confirm **Change Admin III** (auditor) is notified to review
5. For each email, verify: sender is Windchill system, email contains object number, current state, and direct link to the object

**Expected Results:**
1. Email notifications sent at each workflow transition to the correct role
2. Emails contain required information: object number, state, and Windchill link
3. No duplicate notifications

**Pass Criteria:** All workflow transitions generate correct email notifications to correct roles  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-010 · Change Impact Analysis

| Field | Value |
|---|---|
| TC ID | CM-TC-010 |
| Title | Run impact analysis on a Part to identify all linked CAD, BOMs, Documents, and ECOs |
| Requirement Ref | CM-009 |
| Priority | Critical |
| Test Role | Change Admin I |

**Preconditions:** A Part is linked to a CAD doc, BOM, at least one WTDocument, and referenced in an ECO

**Test Steps:**
1. Navigate to the impacted **WTPart** → select **Impact Analysis** or **Where Used / Related Objects**
2. Confirm the impact tree shows:
   - Linked **EPMDocument** (CAD)
   - Parent **BOM assembly** (Where Used)
   - Linked **WTDocument** references
   - Related **ECO / PR** objects
3. Confirm all results include object number, type, revision, and lifecycle state
4. Confirm the impact analysis result can be exported to Excel/PDF for inclusion in the change package

**Expected Results:**
1. Impact tree shows all 4 object categories linked to the Part
2. Each result shows object number, type, revision, state
3. Export of impact analysis confirmed

**Pass Criteria:** Impact analysis covers all linked object types; export works  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-011 · Audit Trail for All Change Actions

| Field | Value |
|---|---|
| TC ID | CM-TC-011 |
| Title | Verify every ECR/ECO/ECN action is captured in the audit trail |
| Requirement Ref | CM-009 · FDA 21 CFR Part 11 |
| Priority | Critical |
| Test Role | QA; Product Manager |

**Preconditions:** Phases CM-TC-001 through CM-TC-007 have been executed

**Test Steps:**
1. Navigate to the Windchill **Audit Trail** (Site or Product level)
2. Filter by the PR/ECO/CN numbers from previous test cases
3. Verify the following events are each recorded: PR Created, PR Submitted, PR Approved, ECO Created, ECO Implementation actions, ECN Distributed, ECN Acknowledged
4. For each audit entry, confirm: user ID (not just name), timestamp (with timezone), object number, action taken, previous state → new state
5. Attempt to **edit or delete** an audit trail record as Product Manager → confirm blocked

**Expected Results:**
1. All change workflow events are in the audit trail
2. Each entry has complete data: user ID, timestamp, object, action, state change
3. Audit trail records are immutable — no edit or delete possible

**Pass Criteria:** Complete, immutable audit trail for all change lifecycle events  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### CM-TC-012 · DHF/DMR Update via ECO Close

| Field | Value |
|---|---|
| TC ID | CM-TC-012 |
| Title | Verify DHF change records are updated with ECO reference when ECO closes |
| Requirement Ref | CM-009 · DHF sheet |
| Priority | Critical |
| Test Role | Change Admin III; QA |

**Preconditions:** A DHF exists for OAK001; an ECO affecting DHF documents has been implemented

**Test Steps:**
1. Close the ECO (Change Admin III completes audit review → ECO transitions to Released/Closed)
2. Navigate to the affected **DHF document** → confirm it shows the new version (released under ECO)
3. Confirm the DHF document's history/relationships reference the ECO number
4. Navigate to the DHF container for OAK001 → confirm the updated DHF document version is the current active version
5. Confirm the prior DHF document version remains accessible in history (not deleted)

**Expected Results:**
1. DHF updated to reflect new document version released under ECO
2. ECO reference visible on the updated DHF document
3. Prior DHF version preserved in history

**Pass Criteria:** ECO close propagates correctly to DHF; ECO reference stored; prior version preserved  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

## PHASE 7 — DHF & DMR

**Goal:** Validate DHF structure per product, all DHF document categories, design traceability chain (User Need → Validation), e-signatures, audit trail, DMR-EBOM linkage, access control, no-delete.  
**Requirement IDs:** DHF & DMR sheet · DM-005 (lifecycle) · ADM-002 (access control)  
**Depends On:** Phases 2, 3, 5, 6 complete  
**Regulatory context:** FDA 21 CFR Part 820 Design Controls · FDA 21 CFR Part 11 e-Signatures · ISO 13485 § 7.3

---

### DHF-TC-001 · DHF Container Structure per Product

| Field | Value |
|---|---|
| TC ID | DHF-TC-001 |
| Title | Verify a DHF container exists for each IRILLIC product |
| Requirement Ref | DHF & DMR sheet |
| Priority | Critical |
| Test Role | Product Manager; QA |

**Preconditions:** Phase 1 complete; products OAK001, ELM001, XNM001 created

**Test Steps:**
1. Navigate to **OAK001** → confirm a **DHF folder/container** is present (named "Design History File" or per IRILLIC naming)
2. Navigate to **ELM001** → confirm DHF container present
3. Navigate to **XNM001** → confirm DHF container present
4. Open OAK001 DHF container → confirm access is restricted: QA and RA have read access; RND (Designer) has read/create; Reviewer/Manager have approval access
5. Confirm DHF containers are not accessible to **Guest** or roles without explicit access

**Expected Results:**
1. DHF container exists for all 3 products
2. Access control on DHF containers matches the ACL matrix (DHF & DMR sheet)
3. Unauthorized users cannot access DHF containers

**Pass Criteria:** DHF containers exist for all 3 products with correct access control  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-002 · DHF Document — Product Needs (PND)

| Field | Value |
|---|---|
| TC ID | DHF-TC-002 |
| Title | Create and classify a Product Needs (PND) document in the OAK001 DHF |
| Requirement Ref | DHF & DMR sheet · Stage Gate M0 |
| Priority | Critical |
| Test Role | Designer (RND) |

**Preconditions:** DHF-TC-001 passed; OAK001 DHF container exists

**Test Steps:**
1. Navigate to OAK001 DHF container → create a new **WTDocument** of type: `Product Needs Document (PND)` (or closest document type)
2. Populate: Title = `OAK001 Product Needs v0.1`; Description = `Voice of Customer and user needs for OAK001`
3. Upload a `.docx` PND file as primary content
4. Confirm the document is placed **within the OAK001 DHF container**
5. Confirm document is at version 0.1, In Work state
6. Confirm a relationship link to the OAK001 product context is established

**Expected Results:**
1. PND document created within the DHF container
2. Correct type classification applied
3. Document at version 0.1, In Work
4. Placed in DHF container (not loose in the product folder)

**Pass Criteria:** PND document created and classified correctly in DHF container  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-003 · DHF Document — Design Input Requirements (DIR)

| Field | Value |
|---|---|
| TC ID | DHF-TC-003 |
| Title | Create a Design Input Requirements document and link it to the PND (Traceability Step 1) |
| Requirement Ref | DHF & DMR sheet · Stage Gate M1 |
| Priority | Critical |
| Test Role | Designer (RND) |

**Preconditions:** DHF-TC-002 passed; PND document exists in OAK001 DHF

**Test Steps:**
1. Create a new DHF document of type: `Design Input Requirements (DIR)`
2. Upload DIR content → place in OAK001 DHF container
3. In the DIR's **Related Objects** tab → add a link to the **PND document** (traceability relationship)
4. From the PND document → confirm the DIR link is visible in Related Objects (bi-directional)
5. Confirm the relationship type is clearly labeled (e.g., "Input Derived From User Need")

**Expected Results:**
1. DIR created and placed in DHF
2. DIR → PND link established
3. Bi-directional: PND also shows DIR as a related object
4. Relationship type clearly labeled for traceability

**Pass Criteria:** DIR created and linked to PND (Traceability Step 1 confirmed)  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-004 · DHF Document — Design Output File

| Field | Value |
|---|---|
| TC ID | DHF-TC-004 |
| Title | Create a Design Output document linked to the DIR (Traceability Step 2) |
| Requirement Ref | DHF & DMR sheet · Stage Gate M1 |
| Priority | Critical |
| Test Role | Designer (RND) |

**Preconditions:** DHF-TC-003 passed; DIR exists in OAK001 DHF

**Test Steps:**
1. Create a DHF document of type: `Design Output` (e.g., a Creo drawing or engineering spec)
2. Place in OAK001 DHF container → add link to the **DIR document**
3. Confirm DIR also shows the Design Output in its Related Objects (bi-directional)
4. Confirm the Design Output document can also be linked to the released **CAD drawing EPMDocument** (cross-reference to Design Output artifact in Windchill)

**Expected Results:**
1. Design Output created and linked to DIR (Traceability Step 2)
2. Bi-directional link: DIR ↔ Design Output
3. Design Output also linkable to CAD drawing EPMDocument

**Pass Criteria:** Design Output linked to DIR; traceability chain extends from PND → DIR → Design Output  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-005 · DHF Documents — V&V Plan and Report

| Field | Value |
|---|---|
| TC ID | DHF-TC-005 |
| Title | Create V&V Plan and V&V Report linked to the Design Output (Traceability Steps 3–4) |
| Requirement Ref | DHF & DMR sheet · Stage Gate M1 |
| Priority | Critical |
| Test Role | Designer (RND — V&V) |

**Preconditions:** DHF-TC-004 passed; Design Output document exists

**Test Steps:**
1. Create `Design Verification Plan` document → place in DHF → link to **Design Output**
2. Create `Design Verification Report` document → place in DHF → link to **Design Verification Plan**
3. Create `Design Validation Plan` document → place in DHF → link to **Design Output**
4. Create `Design Validation Report` document → place in DHF → link to **Design Validation Plan**
5. Open the Design Output document → confirm all 4 V&V documents are visible in Related Objects

**Expected Results:**
1. Verification Plan linked to Design Output (Step 3a)
2. Verification Report linked to Verification Plan (Step 3b)
3. Validation Plan linked to Design Output (Step 4a)
4. Validation Report linked to Validation Plan (Step 4b)
5. Design Output has all 4 V&V documents visible in relationships

**Pass Criteria:** Full V&V traceability chain linked from Design Output  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-006 · DHF Documents — Risk Management (FMEA / Hazard Analysis)

| Field | Value |
|---|---|
| TC ID | DHF-TC-006 |
| Title | Create Risk Management documents (FMEA, Hazard Analysis) in the DHF |
| Requirement Ref | DHF & DMR sheet · Stage Gate M1 |
| Priority | Critical |
| Test Role | Designer (RND); QA |

**Preconditions:** OAK001 DHF container exists

**Test Steps:**
1. Create a document of type `DFMEA` → place in OAK001 DHF → upload FMEA content
2. Create a document of type `Hazard Analysis / PHA` → place in DHF
3. Confirm both are correctly classified in the DHF under the Risk Management sub-section (if applicable)
4. Link both to the relevant **Design Input Requirements (DIR)** document
5. Confirm risk management documents follow the same lifecycle (In Work → Under Review → Approved Not Effective → Released) with e-signature enforcement

**Expected Results:**
1. DFMEA and Hazard Analysis created and classified in DHF
2. Linked to DIR for traceability
3. Same lifecycle and e-signature requirements as other DHF docs

**Pass Criteria:** Risk documents created, classified, and linked in DHF  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-007 · DHF Document — Design Transfer Checklist

| Field | Value |
|---|---|
| TC ID | DHF-TC-007 |
| Title | Create a Design Transfer Checklist in the DHF linked to Design Outputs |
| Requirement Ref | DHF & DMR sheet · Stage Gate M2 |
| Priority | High |
| Test Role | Designer (RND); Manufacturing |

**Preconditions:** Design Output documents exist in DHF

**Test Steps:**
1. Create `Design Transfer Checklist` document → place in OAK001 DHF
2. Link to relevant **Design Output** documents
3. Populate checklist content (upload `.docx` or fill attributes per IRILLIC template)
4. Progress through lifecycle → release with e-signature
5. Confirm checklist appears in the DHF as a released, traceable document

**Expected Results:**
1. Design Transfer Checklist created and linked to Design Outputs
2. Released with e-signature captured
3. Visible in DHF as a completed, released checklist

**Pass Criteria:** Design Transfer Checklist created, linked, and released in DHF  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-008 · Full Design Traceability Chain

| Field | Value |
|---|---|
| TC ID | DHF-TC-008 |
| Title | Verify full traceability chain from User Need to Validation is visible and auditable |
| Requirement Ref | DHF & DMR sheet · ISO 13485 § 7.3 · FDA 21 CFR Part 820.30 |
| Priority | Critical |
| Test Role | QA; RA |

**Preconditions:** DHF-TC-002 through DHF-TC-005 passed; all traceability links created

**Test Steps:**
1. Starting from the **PND document** → navigate Related Objects → reach the DIR
2. From DIR → navigate to Design Output
3. From Design Output → navigate to Verification Plan → Verification Report
4. From Design Output → navigate to Validation Plan → Validation Report
5. Confirm the full chain can be traversed in **5 navigation steps** from PND to Validation Report
6. Confirm each node in the chain shows: document number, title, revision, lifecycle state
7. Confirm no "dead end" links (all links are navigable)

**Expected Results:**
1. Full traceability chain traversable: PND → DIR → Design Output → V-Plan → V-Report AND → Val-Plan → Val-Report
2. Each step shows correct document metadata
3. No broken links in the chain

**Pass Criteria:** Full 5-step traceability chain verified and auditable end-to-end  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-009 · DHF Lifecycle — Full Progression with e-Signature

| Field | Value |
|---|---|
| TC ID | DHF-TC-009 |
| Title | Progress a DHF document through all lifecycle states with e-signature at each approval gate |
| Requirement Ref | DM-005 · FDA 21 CFR Part 11 §11.50 |
| Priority | Critical |
| Test Role | Designer; Reviewer; Manager; Lead |

**Preconditions:** A DHF document (e.g., DIR) is at version 0.1, In Work

**Test Steps:**
1. Designer promotes to **Under Review** → Reviewer notified
2. Manager applies **e-signature** → `Approved` → document moves to **Approved Not Effective**
3. E-signature record verified: signer, role, timestamp, meaning = "Approved"
4. Lead releases → document moves to **Released** at version 1.0
5. Release e-signature record verified
6. Lead moves to **Obsolete** → confirm all history and e-signature records preserved
7. Attempt to alter any e-signature record → confirm system prevents modification

**Expected Results:**
1. All 5 lifecycle states traversed
2. E-signature captured at Approved Not Effective and Release
3. E-signature records immutable
4. All transitions logged in audit trail

**Pass Criteria:** Full lifecycle with e-signatures confirmed; records immutable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-010 · System Timestamp Policy (21 CFR Part 11 §11.10(e))

| Field | Value |
|---|---|
| TC ID | DHF-TC-010 |
| Title | Verify system timestamps are accurate and immutable on DHF document events |
| Requirement Ref | FDA 21 CFR Part 11 §11.10(e) |
| Priority | Critical |
| Test Role | QA; Product Manager |

**Preconditions:** A DHF document has been created, approved, and released (events with timestamps)

**Test Steps:**
1. Note the exact time (to the minute) when a DHF document is promoted to Released
2. Navigate to the audit trail → locate the Release event for that document
3. Confirm the audit trail timestamp matches the actual system time (within ±60 seconds)
4. Confirm the timestamp includes **date, time, and timezone**
5. Attempt to change the timestamp on the audit event → confirm system blocks modification
6. Confirm the Windchill server time is synchronized to NTP (check server configuration or confirm with PDS)

**Expected Results:**
1. Audit trail timestamp matches actual event time within ±60 seconds
2. Timestamp includes date, time, and timezone
3. Timestamp cannot be altered
4. NTP synchronization confirmed

**Pass Criteria:** Timestamps accurate, complete, and immutable; NTP confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-011 · DMR Container Linked to EBOM

| Field | Value |
|---|---|
| TC ID | DHF-TC-011 |
| Title | Verify DMR container is created and linked to the EBOM for each product |
| Requirement Ref | DHF & DMR sheet |
| Priority | Critical |
| Test Role | Product Manager; QA |

**Preconditions:** Released EBOM exists for OAK001; DHF container exists for OAK001

**Test Steps:**
1. Navigate to **OAK001** → confirm a **DMR (Device Master Record)** container/structure is present
2. Open the DMR container → confirm it is linked to the EBOM (WTPart assembly) for OAK001
3. Confirm the DMR link is navigable: click from DMR → reach the Released EBOM assembly
4. Confirm the EBOM shows the DMR as a related object in its relationship tab
5. Repeat for ELM001 and XNM001

**Expected Results:**
1. DMR container exists for all 3 products
2. DMR linked to the corresponding product's EBOM assembly
3. Bi-directional navigation: DMR ↔ EBOM

**Pass Criteria:** DMR containers created and linked to correct EBOM for all 3 products  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-012 · DHF Access Control (RA, QA, RND, MFG)

| Field | Value |
|---|---|
| TC ID | DHF-TC-012 |
| Title | Verify DHF access control per role — RA, QA, RND, MFG |
| Requirement Ref | ADM-002 · DHF sheet |
| Priority | Critical |
| Test Role | Designer (RND); QA; RA; Guest |

**Preconditions:** DHF documents exist in multiple lifecycle states

**Test Steps:**
1. **RND/Designer**: confirm can create, upload, and progress DHF documents to Under Review
2. **QA**: confirm can read, comment, and review DHF documents; cannot directly release
3. **RA**: confirm can read all DHF documents including Obsolete; can approve release (if RA = Manager/Lead role)
4. **Guest**: confirm cannot access any DHF documents (DHF container not visible to Guest)
5. For each role, verify access matches the ACL defined in the DHF & DMR sheet of the ACL document

**Expected Results:**
1. RND: create and promote DHF documents
2. QA: read + review access; cannot directly release
3. RA: read + approve access per their role assignment
4. Guest: no DHF access

**Pass Criteria:** DHF access control matches ACL matrix for RA, QA, RND, MFG roles  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-013 · No-Delete Policy on DHF Documents

| Field | Value |
|---|---|
| TC ID | DHF-TC-013 |
| Title | Verify delete is blocked for all non-admin roles on DHF documents at all states |
| Requirement Ref | Delete Policy · FDA 21 CFR Part 11 |
| Priority | Critical |
| Test Role | Designer; QA; RA; Guest |

**Preconditions:** DHF documents exist in Released and Obsolete states

**Test Steps:**
1. **Designer (RND)** attempts to delete a Released DHF document → blocked; logged
2. **QA** attempts to delete a Released DHF document → blocked; logged
3. **RA** attempts to delete a Released DHF document → blocked; logged
4. **Guest** → delete option not visible
5. Verify each blocked attempt is in the audit trail with user ID, object, and timestamp

**Expected Results:**
1. Delete blocked for all tested non-admin roles on DHF documents at all states
2. All blocked attempts logged in audit trail
3. 21 CFR Part 11 record retention confirmed by inability of any non-admin to delete DHF records

**Pass Criteria:** Zero successful deletes on DHF; all attempts logged  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### DHF-TC-014 · Obsolete Document 10-Year Retention Validation

| Field | Value |
|---|---|
| TC ID | DHF-TC-014 |
| Title | Verify Obsolete DHF documents are retained and inaccessible for deletion for 10 years |
| Requirement Ref | DM-005 *(Ramya comment: retention period = 10 years)* · FDA 21 CFR Part 820 |
| Priority | Critical |
| Test Role | Product Manager; QA |

**Preconditions:** At least one DHF document in Obsolete state

**Test Steps:**
1. Locate an Obsolete DHF document → confirm it is accessible with "Include Obsolete" search filter
2. Open the Obsolete document → confirm all version history is preserved and readable
3. Confirm no non-admin role has a delete option on the Obsolete document
4. Log in as **wcadmin** → confirm delete is available to admin but requires explicit justification/confirmation prompt before proceeding *(do NOT execute the delete — step is to verify the prompt exists)*
5. Verify system documentation or PDS configuration confirms retention policy = 10 years (confirm in system settings or project documentation)

**Expected Results:**
1. Obsolete documents accessible via Include Obsolete filter
2. Full history preserved in readable state
3. No delete for non-admin roles
4. Admin delete requires confirmation prompt (safeguard against accidental deletion)
5. 10-year retention policy confirmed in system configuration

**Pass Criteria:** Retention verified; non-admin delete blocked; history intact  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

## PHASE 8 — ProjectLink

**Goal:** Validate project creation from IRILLIC Stage Gate template, OOTB Gantt chart, PLM data linking, role-based access, deliverable tracking, and project data isolation.  
**Requirement IDs:** PJL-001 to PJL-003 · ADM-006 · ADM-007  
**Note:** PJL-001, PJL-002, PJL-003 have no detailed requirement descriptions. Testing is based on OOTB behaviour + IRILLIC Stage Gate framework (M0–M4) as provided. Testing team to validate and confirm/expand scope.

---

### PJL-TC-001 · Create Project from IRILLIC Stage Gate Template

| Field | Value |
|---|---|
| TC ID | PJL-TC-001 |
| Title | Create a project using the IRILLIC Stage Gate template and verify all milestones |
| Requirement Ref | ADM-006 · PJL-001 |
| Priority | High |
| Test Role | Product Manager |

**Preconditions:** ADM-TC-009 passed; IRILLIC project template configured with M0–M4 milestones

**Test Steps:**
1. Navigate to **ProjectLink > New Project** → select **IRILLIC** template
2. Set: Project Name = `OAK001 Product Development`; Product = OAK001; Start Date = today
3. Create the project
4. Navigate to the project folder → confirm all 5 milestones present: M0 – Concept & Feasibility, M1 – Design & Development, M2 – Design Transfer & Regulatory, M3 – Commercial Readiness, M4 – Commercial Launch
5. Expand **M1 – Design & Development** → confirm the following phases/activities are present: Design Planning & Input, Development, Design Verification & Validation (per IRILLIC Stage Gate framework)
6. Confirm deliverables are listed per phase (e.g., DDP, DIR, DFMEA, V&V Plans under M1)

**Expected Results:**
1. Project created from IRILLIC template
2. All 5 milestones (M0–M4) present
3. M1 phases and deliverables match the IRILLIC Stage Gate document
4. Project is scoped to OAK001 product

**Pass Criteria:** Project template creates all milestones with correct phases and deliverables  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-002 · Gantt Chart — Tasks, Dates, Dependencies

| Field | Value |
|---|---|
| TC ID | PJL-TC-002 |
| Title | Verify OOTB Gantt chart renders tasks with dates and dependencies at project folder level |
| Requirement Ref | ADM-007 |
| Priority | High |
| Test Role | Product Manager |

**Preconditions:** PJL-TC-001 passed; at least 5 project tasks have start/end dates and dependencies set

**Test Steps:**
1. Navigate to the project created in PJL-TC-001 → open the **project folder level**
2. Select **Gantt Chart** view
3. Confirm all tasks are displayed as bars with correct start and end dates
4. Confirm task-to-task dependencies are shown as connecting arrows
5. Modify a task end date → confirm dependent tasks shift accordingly
6. Export or print the Gantt chart → confirm it renders correctly

**Expected Results:**
1. Gantt chart accessible from project folder level
2. All tasks displayed with correct dates
3. Dependencies visualized correctly
4. Date shift propagates through dependencies

**Pass Criteria:** Gantt chart functional with correct task/dependency display and date propagation  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-003 · Link CAD, Part, BOM Data to Project

| Field | Value |
|---|---|
| TC ID | PJL-TC-003 |
| Title | Link PLM objects (Part, CAD, BOM) to project tasks as deliverables |
| Requirement Ref | PJL-002 (OOTB) |
| Priority | High |
| Test Role | Product Manager |

**Preconditions:** PJL-TC-001 passed; Released Part, CAD EPMDocument, and BOM assembly exist in OAK001

**Test Steps:**
1. Open the project → navigate to the M1 phase task for `Design Output creation`
2. Add a **PLM deliverable link** to the Released CAD EPMDocument (`.prt`)
3. Add a PLM deliverable link to the associated WTPart
4. Add a PLM deliverable link to the assembly BOM
5. Confirm all 3 PLM objects appear as linked deliverables on the project task
6. Click the link → confirm navigation to the PLM object in Windchill

**Expected Results:**
1. Part, CAD, and BOM linkable as deliverables to a project task
2. Links navigable from project to PLM object
3. PLM object's current revision and state visible from the project link

**Pass Criteria:** PLM objects linkable to project tasks; navigation confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-004 · Document Sharing Within Project

| Field | Value |
|---|---|
| TC ID | PJL-TC-004 |
| Title | Upload a project document and verify it is accessible only to project members |
| Requirement Ref | PJL-003 (OOTB) |
| Priority | High |
| Test Role | Product Manager; Designer; Guest |

**Preconditions:** Project exists with Designer and Product Manager assigned; Guest not assigned to project

**Test Steps:**
1. Upload a `.docx` document directly to the project folder (not to OAK001 product)
2. **Designer** (project member) → confirm document is visible and accessible
3. **Product Manager** (project member) → confirm document accessible
4. Log in as **Guest** (not a project member) → confirm project document is NOT visible
5. Confirm the document's permissions are scoped to project membership

**Expected Results:**
1. Document visible to project members (Designer, Product Manager)
2. Document NOT visible to Guest or non-project-members
3. Project-scoped document isolation confirmed

**Pass Criteria:** Document sharing within project members only; isolated from non-members  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-005 · Role-Based Access Within Project

| Field | Value |
|---|---|
| TC ID | PJL-TC-005 |
| Title | Verify project-level RBAC — Project Manager has full access; Team Member has edit on assigned tasks; Read-Only has view only |
| Requirement Ref | PJL-001 (OOTB) |
| Priority | High |
| Test Role | Product Manager; Designer; Guest |

**Preconditions:** Project exists with Designer as Team Member; separate user as Read-Only viewer

**Test Steps:**
1. **Product Manager**: confirm full project edit access — create/edit/delete tasks, set dates, assign members
2. **Designer (Team Member)**: confirm can edit tasks assigned to them; cannot edit/delete tasks assigned to others
3. **Read-Only user**: confirm view-only access — no task creation, edit, or assignment
4. Attempt as Designer to delete the project itself → confirm blocked

**Expected Results:**
1. Product Manager: full project control
2. Team Member: edit own assigned tasks only
3. Read-Only: view only; no edit or create
4. Designer cannot delete project

**Pass Criteria:** Project RBAC enforced correctly for all 3 access levels  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-006 · Deliverable Tracking — PLM Object Release Flagging

| Field | Value |
|---|---|
| TC ID | PJL-TC-006 |
| Title | Verify project task is flagged for review when its linked PLM deliverable is released |
| Requirement Ref | PJL-002 (OOTB) |
| Priority | Medium |
| Test Role | Product Manager; Designer |

**Preconditions:** A project task is linked to a Part in In Work state (from PJL-TC-003)

**Test Steps:**
1. Note the project task linked to the test WTPart (currently In Work)
2. Release the WTPart (progress through lifecycle to Released)
3. Navigate back to the project task → confirm a status indicator shows the linked deliverable is now Released
4. Confirm Project Manager receives a notification or the task updates to reflect the deliverable state change

**Expected Results:**
1. Project task reflects the Released state of its linked PLM deliverable
2. Product Manager notified or task status updated when deliverable is released

**Pass Criteria:** PLM deliverable state change reflected in project task tracking  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### PJL-TC-007 · Project Data Isolation

| Field | Value |
|---|---|
| TC ID | PJL-TC-007 |
| Title | Verify project-specific data is isolated — not visible to users not assigned to the project |
| Requirement Ref | PJL-003 (OOTB) |
| Priority | High |
| Test Role | Product Manager (Project A); Designer (only in Project B) |

**Preconditions:** Two separate projects exist: Project A and Project B. Designer is only a member of Project B.

**Test Steps:**
1. Create documents and tasks specific to **Project A**
2. Log in as **Designer** (Project B member only) → navigate to Projects list
3. Confirm **Project A** is not listed (or if listed, its content is not accessible)
4. Attempt to directly access a Project A task URL → confirm access denied
5. Confirm a Global Search does not return Project A's project-scoped documents to Project B members

**Expected Results:**
1. Project A not accessible to users not assigned to it
2. Direct URL access blocked
3. Project-scoped documents not returned in search for non-members

**Pass Criteria:** Project data isolated; cross-project access blocked for unassigned users  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________


---

## PHASE 9 — Cross-Module Integration (Flows A–J)

**Goal:** Validate real-world end-to-end workflows spanning multiple Windchill modules. These integration flows are the most critical UAT test cases, directly supporting FDA 21 CFR Part 820 design control requirements.  
**Depends On:** Phases 1–8 complete  
**Priority:** All flows are Critical unless noted

---

### INT-TC-001 · Flow A — CAD to BOM to DHF

| Field | Value |
|---|---|
| TC ID | INT-TC-001 |
| Title | Flow A: Engineer checks in Creo part → WTPart auto-created → EBOM generated → linked to DHF |
| Requirement Ref | Flows A · FDA 21 CFR Part 820.30 |
| Priority | Critical |
| Modules | CAD Mgmt → Part Mgmt → BOM Mgmt → DHF & DMR |

**Preconditions:** Phase 4 and Phase 7 setup complete; OAK001 DHF container exists

**Test Steps:**
1. **Designer** checks in a new Creo assembly (`.asm`) with 3 child parts to **OAK001**
2. Confirm **WTPart** auto-created and linked to the assembly EPMDocument
3. Confirm **EBOM** is auto-generated from the assembly structure
4. Navigate to OAK001 DHF container → link the assembly WTPart/BOM as a Design Output deliverable in the DHF
5. Confirm the full chain is navigable: CAD EPMDocument → WTPart → EBOM → DHF Design Output link
6. Release the assembly via the full lifecycle → confirm EBOM released and DHF updated with Released version reference

**Expected Results:**
1. CAD check-in triggers WTPart creation and EBOM generation (automatic)
2. EBOM correctly reflects CAD assembly structure
3. DHF Design Output link established to the assembly
4. End-to-end chain navigable from any node
5. Released status propagates: CAD Released → BOM Released → DHF shows Released design output

**Pass Criteria:** Complete CAD → WTPart → EBOM → DHF chain established and navigable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-002 · Flow B — Change Propagation (ECR → ECO → CAD → BOM → DHF)

| Field | Value |
|---|---|
| TC ID | INT-TC-002 |
| Title | Flow B: Full change lifecycle — ECR raised → ECO approved → CAD revised → BOM updated → DHF updated |
| Requirement Ref | Flow B · FDA 21 CFR Part 820.30 |
| Priority | Critical |
| Modules | Change Mgmt → CAD → BOM → DHF & DMR |

**Preconditions:** A Released assembly with EBOM and DHF linkage exists (from INT-TC-001); mail server configured

**Test Steps:**
1. **Designer** raises an **ECR (PR)** for the Released assembly: "Flange hole diameter needs to increase from 6mm to 8mm"
2. **Change Review Board** reviews and approves ECR → converts to **ECO (Change Activity)**
3. **Designer** checks out the Released CAD part **under the ECO** → modifies geometry in Creo → checks in new version
4. **Designer** updates the **EBOM** under the ECO (if BOM attributes change) → new BOM version created
5. ECO goes through approval → **Released** → change notice (ECN) distributed
6. Navigate to DHF → confirm new CAD and BOM versions are referenced in the Design Output DHF record
7. Confirm full audit trail: ECR → ECO → new CAD version → new BOM version → DHF update, all traceable

**Expected Results:**
1. Full change lifecycle executed across 4 modules without data loss or broken references
2. New CAD and BOM versions linked to ECO
3. DHF updated to reflect new Released versions
4. Complete audit trail from ECR to DHF update

**Pass Criteria:** Full cross-module change propagation confirmed; end-to-end traceability intact  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-003 · Flow C — Document to Part to DMR

| Field | Value |
|---|---|
| TC ID | INT-TC-003 |
| Title | Flow C: Technical document uploaded → linked to WTPart → Released → appears in DMR |
| Requirement Ref | Flow C · FDA 21 CFR Part 820.181 |
| Priority | Critical |
| Modules | Doc Mgmt → Part Mgmt → DHF/DMR |

**Preconditions:** A WTPart in Released state exists; DMR container for OAK001 exists

**Test Steps:**
1. **Designer** creates a new WTDocument (type: Engineering Document) and uploads `.docx` content
2. Links the document to the Released WTPart (Related Objects → add Part reference)
3. Progresses document through lifecycle → **Released** with **e-signature** (approval by Manager)
4. Navigates to the **DMR container** for OAK001 → confirms the Released document appears as a DMR record (linked via the WTPart)
5. Confirms e-signature record is visible on the Released document
6. From the DMR → navigates to the document → navigates to the Part → all 3 objects navigable in a chain

**Expected Results:**
1. Document released with e-signature captured
2. Document appears in DMR via its link to the WTPart
3. Full traceability: DMR → Document → Part navigable

**Pass Criteria:** Document-Part-DMR traceability confirmed; e-signature captured  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-004 · Flow D — New Product Full Stack (XNM001)

| Field | Value |
|---|---|
| TC ID | INT-TC-004 |
| Title | Flow D: New product XNM001 created → project in ProjectLink → CAD/BOM/DHF all scoped to XNM001 |
| Requirement Ref | Flow D |
| Priority | Critical |
| Modules | Admin → ProjectLink → CAD → BOM → DHF |

**Preconditions:** XNM001 product container exists (ADM-TC-006); Stage Gate template ready

**Test Steps:**
1. Create a new **ProjectLink project** scoped to **XNM001** using the IRILLIC Stage Gate template
2. Upload a new CAD `.prt` to **XNM001** (not OAK001) → confirm auto-number uses XNM001 prefix
3. Confirm EBOM is created under XNM001 (not visible in OAK001 or ELM001)
4. Create a DHF container for XNM001 → add a Product Needs document
5. Link the XNM001 project milestones to the XNM001 CAD, BOM, and DHF deliverables
6. Confirm a Designer assigned only to OAK001 cannot see XNM001 content
7. Confirm the full XNM001 stack (project + CAD + BOM + DHF) is self-contained within XNM001

**Expected Results:**
1. New product XNM001 fully set up across all modules in isolation
2. XNM001 data not accessible to OAK001-scoped users
3. Project, CAD, BOM, DHF all correctly scoped to XNM001

**Pass Criteria:** New product created end-to-end across all modules; context isolation confirmed  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-005 · Flow E — No-Delete Policy (Global Enforcement)

| Field | Value |
|---|---|
| TC ID | INT-TC-005 |
| Title | Flow E: All non-admin roles attempt to delete Released objects across all modules — ALL must be blocked |
| Requirement Ref | Flow E · Delete Policy |
| Priority | Critical |
| Modules | Admin ACL → All Modules |

**Preconditions:** Released objects exist: 1 Released WTPart, 1 Released EPMDocument (CAD), 1 Released BOM (assembly), 1 Released WTDocument, 1 Released DHF document

**Test Steps for each role (Designer, Reviewer, Lead, Guest):**
1. Attempt to delete the Released WTPart → **must be blocked**; audit trail entry created
2. Attempt to delete the Released EPMDocument (CAD) → **must be blocked**; logged
3. Attempt to delete the Released BOM (assembly WTPart) → **must be blocked**; logged
4. Attempt to delete the Released WTDocument → **must be blocked**; logged
5. Attempt to delete the Released DHF document → **must be blocked**; logged
6. After all 5 × 4 = 20 attempted deletes, open Audit Trail → confirm 20 blocked-delete log entries with correct user IDs

**Expected Results:**
1. 0 successful deletes by any non-admin role across all object types and lifecycle states
2. 20 audit trail entries (4 roles × 5 object types) each recording: user, action = "Delete Attempted", object, result = "Blocked", timestamp

**Pass Criteria:** 100% block rate for non-admin delete; all 20 attempts in audit trail  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-006 · Flow F — Version Progression Consistency Across Object Types

| Field | Value |
|---|---|
| TC ID | INT-TC-006 |
| Title | Flow F: Verify version number, lifecycle state, and audit trail are consistent across Part, CAD, and Document simultaneously |
| Requirement Ref | Flow F |
| Priority | Critical |
| Modules | CAD Mgmt ↔ Part Mgmt ↔ Doc Mgmt |

**Preconditions:** A Part, a CAD EPMDocument, and a WTDocument are all at version 0.1, In Work, at the same time

**Test Steps:**
1. Make an incremental change to each object → all 3 increment to **version 0.2**
2. Make another change → all 3 increment to **version 0.3**
3. Progress all 3 through full approval lifecycle → all 3 reach **version 1.0 Released** 
4. For each object, open the History tab → confirm: version sequence (0.1 → 0.2 → 0.3 → 1.0) is identical; user, date, and change note recorded per iteration
5. Cross-check: confirm the Released version of all 3 objects has the same version number (1.0) and the same release timestamp (within the same test session)

**Expected Results:**
1. All 3 object types follow identical version progression: 0.1 → 0.2 → 0.3 → 1.0 on release
2. Audit trails are consistent across all 3 object types
3. No discrepancies in version numbering between object types

**Pass Criteria:** Version progression and audit trail consistent across Part, CAD, and Document  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-007 · Flow G — Lifecycle State Gate Enforcement

| Field | Value |
|---|---|
| TC ID | INT-TC-007 |
| Title | Flow G: Verify lifecycle state gates are enforced across linked objects — BOM cannot release if a component is In Work |
| Requirement Ref | Flow G |
| Priority | Critical |
| Modules | Part Mgmt ↔ BOM Mgmt ↔ CAD Mgmt |

**Preconditions:** An assembly BOM exists. One child component is still in **In Work** state. Parent assembly is ready for release.

**Test Steps:**
1. Attempt to **Release the parent assembly BOM** while one child component is still In Work
2. Confirm system **blocks** the release with a message identifying the In Work child component
3. Release the child component → then re-attempt parent assembly release → confirm it succeeds
4. Verify the block message correctly identifies which child component is not yet Released
5. Repeat: attempt to promote the parent assembly when one linked CAD EPMDocument is still In Work → confirm blocked

**Expected Results:**
1. Release blocked when child components or linked CAD objects are not yet Released
2. Block message identifies the specific In Work object
3. Release succeeds after all dependencies are Released
4. Gate applies to both Part dependencies and CAD linkages

**Pass Criteria:** Lifecycle state gate blocks release when dependencies are not Ready  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-008 · Flow H — DHF Traceability Chain (Full)

| Field | Value |
|---|---|
| TC ID | INT-TC-008 |
| Title | Flow H: Full DHF traceability chain — User Need → Design Input → Design Output → Verification → Validation |
| Requirement Ref | Flow H · ISO 13485 § 7.3 · IEC 62304 |
| Priority | Critical |
| Modules | DHF/DMR → Doc Mgmt → Part Mgmt |

**Preconditions:** All DHF documents created in Phase 7 (DHF-TC-002 through DHF-TC-005)

**Test Steps:**
1. Starting from **Product Needs (PND)** document → navigate to linked **Design Input (DIR)** — Step 1
2. From DIR → navigate to linked **Design Output** — Step 2
3. From Design Output → navigate to linked **Verification Plan** — Step 3
4. From Verification Plan → navigate to linked **Verification Report** — Step 4
5. From Design Output → navigate to linked **Validation Plan** → then **Validation Report** — Steps 5–6
6. Confirm each step is navigable; no broken links
7. Open any node and confirm: document number, title, revision, lifecycle state, and e-signature records are visible
8. Confirm the chain is traversable in **reverse** (Validation Report → Validation Plan → Design Output → DIR → PND)

**Expected Results:**
1. All 6 steps in the traceability chain navigable forward and backward
2. Each document node shows complete metadata and e-signature records
3. No broken links at any node in the chain

**Pass Criteria:** Full bidirectional DHF traceability chain confirmed; all links navigable  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-009 · Flow I — Access Control State Gate Enforcement

| Field | Value |
|---|---|
| TC ID | INT-TC-009 |
| Title | Flow I: Verify state-based access control gates across lifecycle — Designer loses edit in Under Review; Released requires ECO |
| Requirement Ref | Flow I · ADM-002 |
| Priority | Critical |
| Modules | Admin ACL → All Modules |

**Preconditions:** A WTPart progresses through all lifecycle states during this test

**Test Steps — In Work:**
1. **Designer**: confirm can Edit, Modify Content, Set State → ✓
2. **Reviewer**: confirm no access or Read only → per ACL

**Test Steps — Under Review:**
3. **Designer**: confirm Read + Download + Modify Content, Modify Identity only (no Set State) → verify blocked on Set State attempt
4. **Reviewer**: confirm Read + Download + Modify + Modify Content → ✓

**Test Steps — Approved Not Effective:**
5. **Designer**: confirm Read only → verify Edit blocked
6. **Manager**: confirm Set State → ✓; Designer Set State → blocked
7. **Lead**: confirm Revise + New View Version + Change Permission → ✓

**Test Steps — Released:**
8. **Designer**: confirm Read + Download only; Edit blocked; verify "ECO required" message on checkout attempt
9. **Lead**: confirm Revise + New View Version → ✓ (Lead can initiate revision)
10. **Guest**: confirm Read + Download → ✓

**Expected Results:**
- At each lifecycle state, all role permissions match the ACL matrix exactly
- State transitions enforce access restrictions (Designer loses edit after In Work)
- "ECO required" message appears when Designer attempts to check out a Released object

**Pass Criteria:** Access control enforced correctly at every lifecycle state for every role  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

### INT-TC-010 · Flow J — Parallel ECR Conflict Resolution

| Field | Value |
|---|---|
| TC ID | INT-TC-010 |
| Title | Flow J: Two simultaneous ECRs on the same assembly — CRB conflict check → merge or sequence |
| Requirement Ref | Flow J · CM-001 |
| Priority | Critical |
| Modules | Change Mgmt → CAD → BOM → DHF |

**Preconditions:** A Released assembly with EBOM exists; two Designer users available; Change Review Board user available

**Test Steps:**
1. **Designer A** creates **ECR #1** on the Released assembly: "Increase wall thickness from 2mm to 3mm"
2. **Designer B** simultaneously creates **ECR #2** on the same Released assembly: "Change material from Al 6061 to Al 7075"
3. Navigate to the Released assembly → Related Objects → confirm **both ECR #1 and ECR #2** are listed
4. **Change Review Board** reviews both ECRs → identifies conflict (both affect the same component)
5. CRB decision: merge both into a single ECO covering both changes
6. **Change Admin I** creates one ECO referencing both ECR #1 and ECR #2
7. Under the merged ECO: Designer implements both changes → new CAD version → new BOM version
8. ECO released → DHF updated → confirm ECO references both originating ECRs
9. Confirm ECR #2's requirements are addressed in the merged ECO (no requirement lost)
10. Audit trail: confirm all decisions (both ECRs, merge decision, ECO creation) are recorded

**Expected Results:**
1. Both ECRs visible on the same assembly simultaneously (no system conflict error)
2. CRB can merge both ECRs into one ECO
3. Merged ECO references both ECRs
4. Both changes implemented in the merged ECO with full traceability
5. Audit trail records: ECR #1 creation, ECR #2 creation, CRB merge decision, ECO creation, ECO implementation, ECO release, DHF update

**Pass Criteria:** Parallel ECR conflict surfaced; CRB can merge; merged ECO traceable to both source ECRs  
**Result:** Pass / Fail &nbsp;&nbsp; **Tester:** ___________ &nbsp;&nbsp; **Date:** ___________ &nbsp;&nbsp; **Defect ID:** ___________

---

## UAT Sign-Off Criteria

| Level | Threshold |
|---|---|
| Critical test cases | 100% must pass |
| High test cases | ≥ 95% must pass |
| Medium test cases | ≥ 80% must pass |

Any open S1 or S2 defect blocks UAT sign-off. S3/S4 defects may be deferred with documented justification.

## UAT Sign-Off Table

| Role | Name | Signature | Date |
|---|---|---|---|
| UAT Lead (IRILLIC) | | | |
| Quality / Regulatory (IRILLIC) | | | |
| PDS Implementation Lead | | | |
| Business Owner (IRILLIC) | | | |

---

## Test Case Count Summary

| Phase | Module | Test Cases | Status |
|---|---|---|---|
| Phase 0 | Pre-UAT Environment | 8 checks | ENV-001 to ENV-008 |
| Phase 1 | Administration | 12 | ADM-TC-001 to ADM-TC-012 |
| Phase 2 | Part Management | 10 | PM-TC-001 to PM-TC-010 |
| Phase 3 | Document Management | 18 | DM-TC-001 to DM-TC-018 |
| Phase 4 | CAD Data Management | 17 | CAD-TC-001 to CAD-TC-017 |
| Phase 5 | BOM Management | 16 | BOM-TC-001 to BOM-TC-016 |
| Phase 6 | Change Management | 12 | CM-TC-001 to CM-TC-012 |
| Phase 7 | DHF & DMR | 14 | DHF-TC-001 to DHF-TC-014 |
| Phase 8 | ProjectLink | 7 | PJL-TC-001 to PJL-TC-007 |
| Phase 9 | Cross-Module Integration | 10 | INT-TC-001 to INT-TC-010 |
| **TOTAL** | | **124** | |

---

## Open Items — Pending Before Full Test Execution

| # | Status | Item | Owner | Impact |
|---|---|---|---|---|
| OI-01 | **CLOSED** | Document Numbering sheet — full type codes per document type | IRILLIC (Ramya) | DM-TC-002 updated with full IRILLIC numbering matrix (Requirements Gathering Worksheet, 24 Mar 2026) |
| OI-02 | **CLOSED** | Custom attribute complete list for all object types | IRILLIC (Ramya) | ADM-TC-003 updated with all WTPart subtype attributes and WTDocument common attributes (Requirements Gathering Worksheet, 24 Mar 2026) |
| OI-03 | Open | Watermarking (Wincom extension) installation | PDS Team | DM-TC-011 deferred until resolved |
| OI-04 | Open | Mail server configuration confirmation | PDS / IRILLIC IT | CM-TC-009, DM-TC-007 depend on this |
| OI-05 | Open | ProjectLink requirement details (PJL-001–003) | IRILLIC testing team | PJL-TC-001–007 based on OOTB |
| OI-06 | Open | MBOM transformation mechanism confirmation | PDS Team | BOM-TC-016 — clarify OOTB vs. MPMLink |

---

*IRILLIC — Windchill PLM 13.x UAT Test Case Document | CONFIDENTIAL — Not for Distribution | v1.1 Draft | 10 Jul 2026 | PDS Implementation Team*
*v1.1 — Updated ADM-TC-003, DM-TC-001, DM-TC-002 with IRILLIC custom attributes and document numbering from Requirements Gathering Worksheet (24 Mar 2026); OI-01 and OI-02 closed*

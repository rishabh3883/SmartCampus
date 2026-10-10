# SmartCampus – Logged Logic Issues & Data Anomalies

> **Note:** As mandated by the **Functionality Freeze Rule**, this document logs non-presentation anomalies discovered during recon for tracking purposes. These issues have **not** been modified in the backend or API layer.

---

### 1. Sustainability Score Calculation Anomaly
- **File / Component:** `client/src/pages/Dashboard.jsx` (and corresponding backend calculation endpoint `/dashboard/stats`).
- **Observation:** If resource consumption metrics (water, electricity, waste) are returned as `0` or null on fresh dates or initial seeding, the sustainability score defaults or evaluates to `100/100` rather than indicating an uncalculated/zero-telemetry state.

### 2. Emergency Modal Global Trigger Shape
- **File / Component:** `client/src/components/EmergencyModal.jsx`
- **Observation:** Modal listens to `emergency-alert` socket events. If an event payload lacks an explicit `location` or `title`, the UI falls back gracefully to "Campus Security Alert", but socket emitter payloads vary slightly between student SOS triggers and admin broadcasts.

### 3. Date Parsing & Local Time Synchronization
- **File / Component:** `client/src/pages/admin/Dashboard.jsx` & `client/src/pages/student/Dashboard.jsx`
- **Observation:** Some broadcast dates use `b.date` while others use `b.createdAt` depending on whether they were created via the legacy seed script or the new API controller. (Handled gracefully in presentation layer with `b.date || b.createdAt`).

### 4. Library Seat Count Aggregation Fallback
- **File / Component:** `client/src/pages/student/Dashboard.jsx`
- **Observation:** If the library endpoint returns an array of multiple zones vs a single aggregated object, the total seats fallback computation uses `library.reduce(...) || 12` when an empty array is received.

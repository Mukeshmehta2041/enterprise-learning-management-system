# 4. Database Design (Per Service)

## Principles

- One logical database (or schema) per service; no shared tables across services.
- Transactions only within a single service; cross-service consistency via events and idempotent handlers.
- Use B-tree indexes on FKs and filter columns; composite indexes for list queries; cursor-based pagination for large lists.

---

## User Service – `lms_user`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `users` | id (PK), email (unique), password_hash, status, created_at, updated_at | — |
| `profiles` | id (PK), user_id (FK), display_name, avatar_url, etc. | user_id unique |
| `roles` | id (PK), name (e.g. STUDENT, INSTRUCTOR, ADMIN), description | — |
| `user_roles` | user_id (FK), role_id (FK), assigned_at | PK (user_id, role_id) |
| `organizations` | id (PK), name, slug, settings (JSONB) | optional, for multi-tenant |

**Indexes:** `users(email)`, `users(status)`, `user_roles(user_id)`, `profiles(user_id)`.

---

## Course Service – `lms_course`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `courses` | id (PK), title, slug (unique), description, status, created_at, updated_at | — |
| `modules` | id (PK), course_id (FK), title, sort_order | — |
| `lessons` | id (PK), module_id (FK), title, type, duration_minutes, sort_order | — |
| `course_instructors` | course_id (FK), user_id (FK), role | PK (course_id, user_id) |

**Indexes:** `courses(status)`, `courses(slug)`, `courses(created_at)`, `modules(course_id)`, `lessons(module_id)`.

---

## Enrollment Service – `lms_enrollment`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `enrollments` | id (PK), user_id, course_id, status, progress_pct, completed_at, enrolled_at, updated_at | unique (user_id, course_id) |
| `lesson_progress` | id (PK), enrollment_id (FK), lesson_id, completed_at, updated_at | unique (enrollment_id, lesson_id) |

**Indexes:** `enrollments(user_id, status)`, `enrollments(course_id)`, `enrollments(user_id, course_id)`, `lesson_progress(enrollment_id)`.

---

## Content Service – `lms_content`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `content_items` | id (PK), course_id, lesson_id, type (video/pdf/quiz), title, created_at, updated_at | — |
| `content_versions` | id (PK), content_item_id (FK), version, storage_path, checksum, published_at | — |
| `quiz_questions` | id (PK), content_item_id (FK), question_text, options (JSONB), correct_option_id, sort_order | — |
| `content_metadata` | content_item_id (PK, FK), duration_secs, size_bytes, mime_type, etc. | — |

**Indexes:** `content_items(course_id)`, `content_items(lesson_id)`, `content_items(type)`, `content_versions(content_item_id)`, `quiz_questions(content_item_id)`.

---

## Assignment Service – `lms_assignment`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `assignments` | id (PK), course_id, lesson_id, title, description, due_at, max_score, created_at | — |
| `submissions` | id (PK), assignment_id (FK), user_id, submitted_at, content (JSONB or ref), status | — |
| `grades` | id (PK), submission_id (FK), score, feedback, graded_at, graded_by | submission_id unique |

**Indexes:** `assignments(course_id)`, `submissions(assignment_id)`, `submissions(user_id)`, `submissions(submitted_at)`, `grades(submission_id)`.

---

## Payment Service – `lms_payment`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `plans` | id (PK), name, price, currency, interval, features (JSONB) | — |
| `invoices` | id (PK), user_id, plan_id, amount, status, due_at, paid_at | — |
| `payments` | id (PK), invoice_id (FK), gateway_id, gateway_status, idempotency_key (unique), created_at | — |

**Indexes:** `invoices(user_id)`, `payments(invoice_id)`, `payments(idempotency_key)`.

---

## Analytics Service – `lms_analytics`

| Table | Columns (main) | Constraints |
|-------|----------------|-------------|
| `event_snapshots` | id (PK), event_id, event_type, aggregate_id, payload (JSONB), received_at | — |
| `aggregates` | id (PK), dimension (e.g. course_id, user_id), period (day/week), metric_name, value, computed_at | unique (dimension, period, metric_name) |

**Indexes:** `event_snapshots(event_type, received_at)`, `aggregates(dimension, period)`.

---

## Transaction Boundaries

- Run all writes for a single use case inside one service and one DB transaction (e.g. create enrollment + first lesson_progress in Enrollment Service).
- Cross-service: do not use distributed transactions. Publish events after commit; consumers handle idempotently and eventually consistent.

## Pagination

- **Cursor-based:** For large lists (e.g. “my enrollments”, “courses”), use cursor on `(created_at, id)` or similar. Response includes `nextCursor`; client sends it for the next page. Prefer this for feeds and infinite scroll.
- **Offset-based:** Acceptable for small admin lists (e.g. first 50 users). Document max page size and avoid deep offsets (e.g. page 1000).

## Query Patterns

- List “my enrollments”: `enrollments` by `user_id` with optional `status`, ordered by `enrolled_at DESC`, cursor on `(enrolled_at, id)`.
- List courses (catalog): `courses` by `status = PUBLISHED`, ordered by `created_at` or relevance; filter/sort as needed; cursor or offset.
- Progress for one enrollment: `lesson_progress` by `enrollment_id`; compute progress_pct from completed lessons vs total lessons (total can come from Course Service or cached).

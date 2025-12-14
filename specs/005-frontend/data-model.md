# Data Model: Phase 2 Frontend

## User Entity
- **Fields**:
  - id: string (unique identifier)
  - email: string (user's email address)
  - name: string (optional, user's display name)
  - createdAt: Date (account creation timestamp)
  - updatedAt: Date (last update timestamp)
- **Validation**: Email must be valid format
- **Relationships**: Owns multiple Todo items

## Todo Entity
- **Fields**:
  - id: string (unique identifier)
  - title: string (task title, max 255 chars)
  - description: string (optional, task details)
  - completed: boolean (completion status)
  - createdAt: Date (creation timestamp)
  - updatedAt: Date (last update timestamp)
  - userId: string (foreign key to User)
- **Validation**: Title is required, max length enforced
- **State transitions**: pending → completed, completed → pending

## Authentication Session
- **Fields**:
  - token: string (JWT token)
  - expiresAt: Date (token expiration)
  - userId: string (associated user)
- **Validation**: Token format and expiration checked
- **State**: active/inactive based on expiration
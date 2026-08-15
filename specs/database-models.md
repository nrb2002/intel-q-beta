# Intel-Q Database Models

## Overview
Three Mongoose models back the MVP: `User`, `Branch`, and `QueueTicket`.
All models use Mongoose schema validation and automatic `createdAt`/`updatedAt`
timestamps via the `{ timestamps: true }` option.

## User
| Field     | Type    | Required | Notes                                      |
|-----------|---------|----------|---------------------------------------------|
| name      | String  | Yes      | 2–100 characters                            |
| email     | String  | Yes      | Unique, lowercased, validated email format  |
| password  | String  | Yes      | Min 8 chars, hashed before save, `select: false` (excluded from queries by default) |
| role      | String  | Yes      | Enum: `customer`, `staff`, `admin`. Defaults to `customer` |
| isActive  | Boolean | No       | Defaults to `true`. Used for soft-delete/deactivation |

**Note:** Password hashing (e.g. via bcrypt) should happen in a pre-save hook
or in the Auth.js credentials logic — this schema stores the hash, not plaintext.

## Branch
| Field             | Type    | Required | Notes                          |
|-------------------|---------|----------|----------------------------------|
| name              | String  | Yes      | Unique                          |
| address           | String  | Yes      |                                  |
| location          | String  | No       | Optional city/region label       |
| numberOfCounters  | Number  | Yes      | Min 1, max 50, defaults to 1     |
| isActive          | Boolean | No       | Defaults to `true`               |

## QueueTicket
| Field         | Type       | Required | Notes                                                    |
|---------------|------------|----------|-----------------------------------------------------------|
| ticketNumber  | String     | Yes      | Unique                                                    |
| customerId    | ObjectId   | Yes      | References `User`                                         |
| branch        | ObjectId   | Yes      | References `Branch`                                       |
| serviceType   | String     | Yes      |                                                             |
| status        | String     | Yes      | Enum: `waiting`, `called`, `completed`, `cancelled`. Defaults to `waiting` |
| calledAt      | Date       | No       | Set when staff calls the customer                         |
| completedAt   | Date       | No       | Set when service finishes                                 |

A compound index on `{ branch, status, createdAt }` optimizes the most common
query: fetching the live, ordered queue for a specific branch.

## Relationships
- `QueueTicket.customerId` → `User._id`
- `QueueTicket.branch` → `Branch._id`

## Connection
`lib/prisma.ts` exports `connectDB()`, which caches the Mongoose connection across
Next.js hot reloads in development and reuses a single connection in
production (serverless-safe pattern). All API routes and Server Components
must call `await connectDB()` before querying any model.
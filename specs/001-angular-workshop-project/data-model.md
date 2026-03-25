# Data Model: Advanced Angular Workshop Enterprise Project

**Date**: 2026-03-25
**Branch**: `001-angular-workshop-project`

## Overview

The application is a multi-domain enterprise platform with four feature modules. Each module has its own domain entities managed by a dedicated NgRx SignalStore. All data is served via interceptor-based in-memory mock API (default) or optional JSON Server.

## Feature Module 1: E-Commerce

### Product

| Field       | Type     | Constraints                    |
| ----------- | -------- | ------------------------------ |
| id          | string   | Unique identifier              |
| name        | string   | Required, 1-200 chars          |
| description | string   | Optional, max 2000 chars       |
| price       | number   | Required, > 0                  |
| currency    | string   | ISO 4217 code (default: EUR)   |
| category    | string   | Required                       |
| imageUrl    | string   | Optional                       |
| inStock     | boolean  | Default: true                  |
| createdAt   | datetime | Auto-generated                 |

### CartItem

| Field     | Type   | Constraints               |
| --------- | ------ | ------------------------- |
| productId | string | References Product.id     |
| quantity  | number | Required, >= 1            |
| unitPrice | number | Snapshot of Product.price |

### Order

| Field     | Type       | Constraints                                        |
| --------- | ---------- | -------------------------------------------------- |
| id        | string     | Unique identifier                                  |
| items     | CartItem[] | At least one item                                  |
| total     | number     | Computed from items                                |
| status    | enum       | `draft` → `submitted` → `confirmed` → `cancelled` |
| createdAt | datetime   | Auto-generated                                     |

**State transitions (Order.status)**:
- `draft` → `submitted` (user submits cart)
- `submitted` → `confirmed` (system confirms)
- `submitted` → `cancelled` (user cancels)
- `confirmed` → `cancelled` (user cancels)

## Feature Module 2: Task/Project Management

### Project

| Field       | Type     | Constraints           |
| ----------- | -------- | --------------------- |
| id          | string   | Unique identifier     |
| name        | string   | Required, 1-100 chars |
| description | string   | Optional              |
| createdAt   | datetime | Auto-generated        |

### Task

| Field       | Type     | Constraints                                                  |
| ----------- | -------- | ------------------------------------------------------------ |
| id          | string   | Unique identifier                                            |
| projectId   | string   | References Project.id                                        |
| title       | string   | Required, 1-200 chars                                        |
| description | string   | Optional                                                     |
| status      | enum     | `todo` → `in-progress` → `review` → `done`                  |
| priority    | enum     | `low`, `medium`, `high`, `critical`                          |
| assigneeId  | string   | Optional, references Employee.id                             |
| dueDate     | datetime | Optional                                                     |
| createdAt   | datetime | Auto-generated                                               |

**State transitions (Task.status)**:
- `todo` → `in-progress` (work starts)
- `in-progress` → `review` (submitted for review)
- `review` → `done` (approved)
- `review` → `in-progress` (changes requested)
- Any → `todo` (reset)

## Feature Module 3: HR/Employee Portal

### Employee

| Field      | Type     | Constraints                          |
| ---------- | -------- | ------------------------------------ |
| id         | string   | Unique identifier                    |
| firstName  | string   | Required                             |
| lastName   | string   | Required                             |
| email      | string   | Required, valid email, unique        |
| department | string   | Required                             |
| position   | string   | Required                             |
| startDate  | datetime | Required                             |
| avatarUrl  | string   | Optional                             |

### TimeEntry

| Field      | Type     | Constraints               |
| ---------- | -------- | ------------------------- |
| id         | string   | Unique identifier         |
| employeeId | string   | References Employee.id    |
| date       | date     | Required                  |
| hours      | number   | Required, 0.25-24         |
| project    | string   | Required                  |
| description| string   | Optional                  |

### LeaveRequest

| Field     | Type     | Constraints                                        |
| --------- | -------- | -------------------------------------------------- |
| id        | string   | Unique identifier                                  |
| employeeId| string   | References Employee.id                             |
| type      | enum     | `vacation`, `sick`, `personal`, `other`            |
| startDate | date     | Required                                           |
| endDate   | date     | Required, >= startDate                             |
| status    | enum     | `pending` → `approved` → `rejected`               |
| reason    | string   | Optional                                           |

**State transitions (LeaveRequest.status)**:
- `pending` → `approved` (manager approves)
- `pending` → `rejected` (manager rejects)

## Feature Module 4: CRM

### Contact

| Field     | Type     | Constraints                      |
| --------- | -------- | -------------------------------- |
| id        | string   | Unique identifier                |
| firstName | string   | Required                         |
| lastName  | string   | Required                         |
| email     | string   | Required, valid email            |
| company   | string   | Optional                         |
| phone     | string   | Optional                         |
| tags      | string[] | Optional                         |
| createdAt | datetime | Auto-generated                   |

### Deal

| Field     | Type     | Constraints                                                      |
| --------- | -------- | ---------------------------------------------------------------- |
| id        | string   | Unique identifier                                                |
| contactId | string   | References Contact.id                                            |
| title     | string   | Required                                                         |
| value     | number   | Required, >= 0                                                   |
| currency  | string   | ISO 4217 (default: EUR)                                          |
| stage     | enum     | `lead` → `qualified` → `proposal` → `negotiation` → `won`/`lost`|
| createdAt | datetime | Auto-generated                                                   |

**State transitions (Deal.stage)**:
- `lead` → `qualified` (initial contact made)
- `qualified` → `proposal` (proposal sent)
- `proposal` → `negotiation` (terms discussed)
- `negotiation` → `won` (deal closed)
- `negotiation` → `lost` (deal lost)
- Any stage → `lost` (deal can be lost at any point)

### Activity

| Field     | Type     | Constraints                        |
| --------- | -------- | ---------------------------------- |
| id        | string   | Unique identifier                  |
| contactId | string   | References Contact.id              |
| dealId    | string   | Optional, references Deal.id       |
| type      | enum     | `call`, `email`, `meeting`, `note` |
| summary   | string   | Required                           |
| date      | datetime | Required                           |

## Cross-Module Relationships

- `Task.assigneeId` → `Employee.id` (tasks can be assigned to employees)
- All other relationships are within their respective feature modules
- Each feature module manages its own data independently via its NgRx SignalStore

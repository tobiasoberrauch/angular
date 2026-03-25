# Mock API Contract

**Date**: 2026-03-25
**Branch**: `001-angular-workshop-project`

## Overview

The project exposes a RESTful mock API via Angular HttpInterceptors. All endpoints follow the same pattern and return the same data shapes whether using the in-memory interceptor or the optional JSON Server.

## Base URL

- **In-memory mock**: No base URL (intercepted before HTTP)
- **JSON Server**: `http://localhost:3001`

## Endpoints

### E-Commerce

| Method | Path                  | Request Body          | Response              |
| ------ | --------------------- | --------------------- | --------------------- |
| GET    | `/api/products`       | -                     | `Product[]`           |
| GET    | `/api/products/:id`   | -                     | `Product`             |
| POST   | `/api/products`       | `Partial<Product>`    | `Product`             |
| PUT    | `/api/products/:id`   | `Partial<Product>`    | `Product`             |
| DELETE | `/api/products/:id`   | -                     | `void`                |
| GET    | `/api/orders`         | -                     | `Order[]`             |
| POST   | `/api/orders`         | `{ items: CartItem[] }` | `Order`             |
| PATCH  | `/api/orders/:id`     | `{ status: string }`  | `Order`              |

### Task/Project Management

| Method | Path                  | Request Body          | Response              |
| ------ | --------------------- | --------------------- | --------------------- |
| GET    | `/api/projects`       | -                     | `Project[]`           |
| POST   | `/api/projects`       | `Partial<Project>`    | `Project`             |
| GET    | `/api/tasks`          | -                     | `Task[]`              |
| GET    | `/api/tasks?projectId=:id` | -                | `Task[]`              |
| POST   | `/api/tasks`          | `Partial<Task>`       | `Task`                |
| PUT    | `/api/tasks/:id`      | `Partial<Task>`       | `Task`                |
| PATCH  | `/api/tasks/:id`      | `{ status: string }`  | `Task`               |
| DELETE | `/api/tasks/:id`      | -                     | `void`                |

### HR/Employee Portal

| Method | Path                        | Request Body              | Response              |
| ------ | --------------------------- | ------------------------- | --------------------- |
| GET    | `/api/employees`            | -                         | `Employee[]`          |
| GET    | `/api/employees/:id`        | -                         | `Employee`            |
| POST   | `/api/employees`            | `Partial<Employee>`       | `Employee`            |
| PUT    | `/api/employees/:id`        | `Partial<Employee>`       | `Employee`            |
| GET    | `/api/time-entries`         | -                         | `TimeEntry[]`         |
| POST   | `/api/time-entries`         | `Partial<TimeEntry>`      | `TimeEntry`           |
| GET    | `/api/leave-requests`       | -                         | `LeaveRequest[]`      |
| POST   | `/api/leave-requests`       | `Partial<LeaveRequest>`   | `LeaveRequest`        |
| PATCH  | `/api/leave-requests/:id`   | `{ status: string }`      | `LeaveRequest`       |

### CRM

| Method | Path                        | Request Body              | Response              |
| ------ | --------------------------- | ------------------------- | --------------------- |
| GET    | `/api/contacts`             | -                         | `Contact[]`           |
| GET    | `/api/contacts/:id`         | -                         | `Contact`             |
| POST   | `/api/contacts`             | `Partial<Contact>`        | `Contact`             |
| PUT    | `/api/contacts/:id`         | `Partial<Contact>`        | `Contact`             |
| DELETE | `/api/contacts/:id`         | -                         | `void`                |
| GET    | `/api/deals`                | -                         | `Deal[]`              |
| POST   | `/api/deals`                | `Partial<Deal>`           | `Deal`                |
| PATCH  | `/api/deals/:id`            | `{ stage: string }`       | `Deal`               |
| GET    | `/api/activities`           | -                         | `Activity[]`          |
| POST   | `/api/activities`           | `Partial<Activity>`       | `Activity`            |

## Common Patterns

### Query Parameters (all GET list endpoints)

| Parameter | Type   | Description            |
| --------- | ------ | ---------------------- |
| `_page`   | number | Page number (1-based)  |
| `_limit`  | number | Items per page         |
| `_sort`   | string | Sort field             |
| `_order`  | string | `asc` or `desc`        |
| `q`       | string | Full-text search       |

### Error Responses

| Status | Meaning               |
| ------ | --------------------- |
| 400    | Validation error      |
| 404    | Resource not found    |
| 409    | Conflict (duplicate)  |
| 500    | Server error          |

### Response Envelope (list endpoints)

```typescript
// GET /api/products?_page=1&_limit=10
{
  data: Product[],
  total: number,
  page: number,
  limit: number
}
```

### ID Generation

All entities use UUID v4 strings generated client-side. The mock API accepts provided IDs or generates them if omitted.

/**
 * MOCK API INTERCEPTOR
 *
 * This interceptor catches all HTTP requests to `/api/*` and returns
 * mock data from an in-memory store instead of hitting a real backend.
 *
 * HOW ANGULAR INTERCEPTORS WORK:
 * - Angular 21 uses functional interceptors (HttpInterceptorFn) instead of class-based ones.
 * - An interceptor receives the outgoing HttpRequest and a `next` handler.
 * - It can modify the request, short-circuit it (return a mock response),
 *   or pass it along via `next(req)` to reach the server (or the next interceptor).
 * - Interceptors are registered in app.config.ts via `provideHttpClient(withInterceptors([...]))`.
 *
 * WHY THIS PATTERN?
 * - Lets the team build the full frontend without a running backend.
 * - The same HttpClient calls used here will work with a real API later --
 *   just remove or disable this interceptor.
 * - Keeps seed data in one place, matching the SignalStore defaults.
 */

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

// ---------------------------------------------------------------------------
// Seed data -- mirrors the initial state in each SignalStore
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  assigneeId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  startDate: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  tags: string[];
  phone?: string;
}

interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  currency: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: string;
}

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  contactId: string;
  dealId?: string;
  subject: string;
  date: string;
  completed: boolean;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'parental';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  date: string;
  hours: number;
  description: string;
}

// ---------------------------------------------------------------------------
// In-memory data store
// ---------------------------------------------------------------------------

const products: Product[] = [
  { id: '1', name: 'Angular Workshop Book', price: 49.99, category: 'Books', inStock: true },
  { id: '2', name: 'TypeScript Masterclass', price: 39.99, category: 'Courses', inStock: true },
  { id: '3', name: 'RxJS Deep Dive', price: 29.99, category: 'Courses', inStock: false },
  { id: '4', name: 'NgRx Signals Guide', price: 19.99, category: 'Books', inStock: true },
  { id: '5', name: 'Angular Testing Pro', price: 44.99, category: 'Courses', inStock: true },
];

const tasks: Task[] = [
  { id: '1', title: 'Setup project structure', description: 'Initialize Angular 21 project', status: 'done', priority: 'high', projectId: '1' },
  { id: '2', title: 'Implement product catalog', description: 'Build product listing with signals', status: 'in-progress', priority: 'high', projectId: '1' },
  { id: '3', title: 'Create user dashboard', description: 'Design and build main dashboard', status: 'todo', priority: 'medium', projectId: '1' },
  { id: '4', title: 'Add authentication', description: 'Implement JWT auth flow', status: 'todo', priority: 'critical', projectId: '2' },
  { id: '5', title: 'Write unit tests', description: 'Cover core services with tests', status: 'review', priority: 'medium', projectId: '1' },
  { id: '6', title: 'API integration', description: 'Connect to backend services', status: 'todo', priority: 'high', projectId: '2' },
];

const projects: Project[] = [
  { id: '1', name: 'Angular Workshop', description: 'Enterprise Angular 21 training project', status: 'active' },
  { id: '2', name: 'API Migration', description: 'Migrate REST endpoints to GraphQL', status: 'active' },
  { id: '3', name: 'Legacy Cleanup', description: 'Remove deprecated NgModule patterns', status: 'completed' },
];

const employees: Employee[] = [
  { id: '1', firstName: 'Anna', lastName: 'Schmidt', email: 'a.schmidt@dvc.de', department: 'Engineering', position: 'Senior Developer', startDate: '2022-03-15' },
  { id: '2', firstName: 'Max', lastName: 'Mueller', email: 'm.mueller@dvc.de', department: 'Engineering', position: 'Tech Lead', startDate: '2020-06-01' },
  { id: '3', firstName: 'Lisa', lastName: 'Weber', email: 'l.weber@dvc.de', department: 'Design', position: 'UX Designer', startDate: '2023-01-10' },
  { id: '4', firstName: 'Tom', lastName: 'Fischer', email: 't.fischer@dvc.de', department: 'Product', position: 'Product Manager', startDate: '2021-09-20' },
  { id: '5', firstName: 'Julia', lastName: 'Wagner', email: 'j.wagner@dvc.de', department: 'Engineering', position: 'Junior Developer', startDate: '2024-07-01' },
];

const contacts: Contact[] = [
  { id: '1', firstName: 'Konstantin', lastName: 'Merker', email: 'k.merker@dvc.de', company: 'DVC', tags: ['lead', 'angular'], phone: '+49 170 1234567' },
  { id: '2', firstName: 'Sarah', lastName: 'Koch', email: 's.koch@example.de', company: 'TechCorp', tags: ['prospect'] },
  { id: '3', firstName: 'Jan', lastName: 'Braun', email: 'j.braun@example.de', company: 'DataFlow', tags: ['customer', 'enterprise'] },
  { id: '4', firstName: 'Maria', lastName: 'Lang', email: 'm.lang@example.de', company: 'CloudNine', tags: ['prospect', 'angular'] },
];

const deals: Deal[] = [
  { id: '1', title: 'Angular Training Package', contactId: '1', value: 15000, currency: 'EUR', stage: 'negotiation', expectedCloseDate: '2026-04-15' },
  { id: '2', title: 'React Migration Consulting', contactId: '2', value: 8000, currency: 'EUR', stage: 'qualified', expectedCloseDate: '2026-05-01' },
  { id: '3', title: 'Enterprise License', contactId: '3', value: 45000, currency: 'EUR', stage: 'proposal', expectedCloseDate: '2026-06-30' },
  { id: '4', title: 'Support Contract', contactId: '1', value: 5000, currency: 'EUR', stage: 'closed-won', expectedCloseDate: '2026-03-01' },
];

const activities: Activity[] = [
  { id: '1', type: 'call', contactId: '1', dealId: '1', subject: 'Discuss training scope', date: '2026-03-24', completed: true },
  { id: '2', type: 'email', contactId: '2', subject: 'Send proposal', date: '2026-03-25', completed: false },
  { id: '3', type: 'meeting', contactId: '3', dealId: '3', subject: 'License review meeting', date: '2026-03-26', completed: false },
  { id: '4', type: 'note', contactId: '1', subject: 'Follow up on pricing', date: '2026-03-25', completed: false },
];

const leaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '1', type: 'vacation', startDate: '2026-04-10', endDate: '2026-04-18', status: 'approved', reason: 'Spring break' },
  { id: '2', employeeId: '3', type: 'personal', startDate: '2026-03-28', endDate: '2026-03-28', status: 'pending', reason: 'Appointment' },
  { id: '3', employeeId: '2', type: 'sick', startDate: '2026-03-20', endDate: '2026-03-21', status: 'approved', reason: 'Flu' },
];

const timeEntries: TimeEntry[] = [
  { id: '1', employeeId: '1', projectId: '1', date: '2026-03-24', hours: 8, description: 'Signal Forms implementation' },
  { id: '2', employeeId: '1', projectId: '1', date: '2026-03-25', hours: 6, description: 'Angular Aria integration' },
  { id: '3', employeeId: '2', projectId: '2', date: '2026-03-24', hours: 7, description: 'API migration planning' },
  { id: '4', employeeId: '2', projectId: '1', date: '2026-03-25', hours: 4, description: 'Code review' },
];

// ---------------------------------------------------------------------------
// Helper: wrap any array in the standard API envelope
// ---------------------------------------------------------------------------

/**
 * Every list response uses this envelope so the frontend can rely on a
 * consistent shape: `{ data: T[], total: number }`.
 */
function envelope<T>(data: T[]): { data: T[]; total: number } {
  return { data, total: data.length };
}

/**
 * Return a successful HttpResponse observable.
 * `delay(0)` is omitted intentionally -- synchronous responses make
 * debugging easier in a workshop. Add `delay(300)` from 'rxjs' if
 * you want to simulate network latency.
 */
function respond<T>(body: T, status = 200) {
  return of(new HttpResponse({ status, body: body as any }));
}

// ---------------------------------------------------------------------------
// URL matching helpers
// ---------------------------------------------------------------------------

/** Extract URL path without query string */
function urlPath(url: string): string {
  return url.split('?')[0];
}

/** Check if a path matches `/api/<resource>` exactly */
function isCollection(path: string, resource: string): boolean {
  return path === `/api/${resource}`;
}

/** Check if a path matches `/api/<resource>/:id` and return the id */
function extractId(path: string, resource: string): string | null {
  const match = path.match(new RegExp(`^/api/${resource}/([^/]+)$`));
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Filtering helpers
// ---------------------------------------------------------------------------

/**
 * Generic search: checks if `term` appears in any string value of the item.
 * This keeps the interceptor simple -- real backends would use full-text search.
 */
function matchesSearch(item: Record<string, any>, term: string): boolean {
  const lower = term.toLowerCase();
  return Object.values(item).some((val) => {
    if (typeof val === 'string') return val.toLowerCase().includes(lower);
    if (Array.isArray(val)) return val.some((v) => typeof v === 'string' && v.toLowerCase().includes(lower));
    return false;
  });
}

/**
 * Apply query-param filters to an array.
 * Supported params:
 *   - `search`      -- full-text search across all string fields
 *   - any other key  -- exact match on that property (e.g. `?department=Engineering`)
 */
function applyFilters<T extends Record<string, any>>(items: T[], params: URLSearchParams): T[] {
  let result = [...items];

  const search = params.get('search');
  if (search) {
    result = result.filter((item) => matchesSearch(item, search));
  }

  // Apply exact-match filters for any other query params
  params.forEach((value, key) => {
    if (key === 'search') return; // already handled above
    result = result.filter((item) => {
      const prop = item[key];
      if (prop === undefined) return true; // unknown property -- don't filter
      if (typeof prop === 'string') return prop.toLowerCase() === value.toLowerCase();
      if (typeof prop === 'number') return prop === Number(value);
      if (typeof prop === 'boolean') return prop === (value === 'true');
      return true;
    });
  });

  return result;
}

// ---------------------------------------------------------------------------
// The interceptor
// ---------------------------------------------------------------------------

/**
 * FUNCTIONAL INTERCEPTOR (Angular 21 pattern)
 *
 * Registered in app.config.ts like this:
 * ```ts
 * provideHttpClient(
 *   withInterceptors([mockApiInterceptor])
 * )
 * ```
 *
 * The function signature is `(req, next) => Observable<HttpEvent>`.
 * - `req`  -- the outgoing HttpRequest (immutable)
 * - `next` -- a function that forwards the request to the next handler
 *
 * Returning `next(req)` passes the request through (e.g. to the real server).
 * Returning `of(new HttpResponse(...))` short-circuits and returns mock data.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept requests targeting our mock API
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const path = urlPath(req.url);
  const params = new URLSearchParams(req.url.split('?')[1] ?? '');
  const method = req.method.toUpperCase();

  // -----------------------------------------------------------------------
  // PRODUCTS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'products') && method === 'GET') {
    return respond(envelope(applyFilters(products, params)));
  }

  if (isCollection(path, 'products') && method === 'POST') {
    const body = req.body as Omit<Product, 'id'>;
    const newProduct: Product = { ...body, id: crypto.randomUUID() };
    products.push(newProduct);
    return respond(newProduct, 201);
  }

  const productId = extractId(path, 'products');
  if (productId && method === 'GET') {
    const product = products.find((p) => p.id === productId);
    return product
      ? respond(product)
      : respond({ error: 'Product not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // TASKS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'tasks') && method === 'GET') {
    return respond(envelope(applyFilters(tasks, params)));
  }

  if (isCollection(path, 'tasks') && method === 'POST') {
    const body = req.body as Omit<Task, 'id'>;
    const newTask: Task = { ...body, id: crypto.randomUUID() };
    tasks.push(newTask);
    return respond(newTask, 201);
  }

  const taskId = extractId(path, 'tasks');
  if (taskId && method === 'GET') {
    const task = tasks.find((t) => t.id === taskId);
    return task
      ? respond(task)
      : respond({ error: 'Task not found' }, 404);
  }

  if (taskId && method === 'PATCH') {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return respond({ error: 'Task not found' }, 404);
    tasks[idx] = { ...tasks[idx], ...(req.body as Partial<Task>), id: taskId };
    return respond(tasks[idx]);
  }

  // -----------------------------------------------------------------------
  // PROJECTS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'projects') && method === 'GET') {
    return respond(envelope(applyFilters(projects, params)));
  }

  const projectId = extractId(path, 'projects');
  if (projectId && method === 'GET') {
    const project = projects.find((p) => p.id === projectId);
    return project
      ? respond(project)
      : respond({ error: 'Project not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // EMPLOYEES
  // -----------------------------------------------------------------------

  if (isCollection(path, 'employees') && method === 'GET') {
    return respond(envelope(applyFilters(employees, params)));
  }

  const employeeId = extractId(path, 'employees');
  if (employeeId && method === 'GET') {
    const employee = employees.find((e) => e.id === employeeId);
    return employee
      ? respond(employee)
      : respond({ error: 'Employee not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // CONTACTS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'contacts') && method === 'GET') {
    return respond(envelope(applyFilters(contacts, params)));
  }

  const contactId = extractId(path, 'contacts');
  if (contactId && method === 'GET') {
    const contact = contacts.find((c) => c.id === contactId);
    return contact
      ? respond(contact)
      : respond({ error: 'Contact not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // DEALS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'deals') && method === 'GET') {
    return respond(envelope(applyFilters(deals, params)));
  }

  const dealId = extractId(path, 'deals');
  if (dealId && method === 'GET') {
    const deal = deals.find((d) => d.id === dealId);
    return deal
      ? respond(deal)
      : respond({ error: 'Deal not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // ACTIVITIES
  // -----------------------------------------------------------------------

  if (isCollection(path, 'activities') && method === 'GET') {
    return respond(envelope(applyFilters(activities, params)));
  }

  const activityId = extractId(path, 'activities');
  if (activityId && method === 'GET') {
    const activity = activities.find((a) => a.id === activityId);
    return activity
      ? respond(activity)
      : respond({ error: 'Activity not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // LEAVE REQUESTS
  // -----------------------------------------------------------------------

  if (isCollection(path, 'leave-requests') && method === 'GET') {
    return respond(envelope(applyFilters(leaveRequests, params)));
  }

  const leaveId = extractId(path, 'leave-requests');
  if (leaveId && method === 'GET') {
    const request = leaveRequests.find((r) => r.id === leaveId);
    return request
      ? respond(request)
      : respond({ error: 'Leave request not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // TIME ENTRIES
  // -----------------------------------------------------------------------

  if (isCollection(path, 'time-entries') && method === 'GET') {
    return respond(envelope(applyFilters(timeEntries, params)));
  }

  const timeEntryId = extractId(path, 'time-entries');
  if (timeEntryId && method === 'GET') {
    const entry = timeEntries.find((e) => e.id === timeEntryId);
    return entry
      ? respond(entry)
      : respond({ error: 'Time entry not found' }, 404);
  }

  // -----------------------------------------------------------------------
  // FALLTHROUGH -- unmatched /api/* routes get a 404
  // -----------------------------------------------------------------------

  // For any /api/ path we don't recognise, pass through to the real server.
  // This lets you gradually replace mock endpoints with real ones.
  return next(req);
};

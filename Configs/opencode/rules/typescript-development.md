Read this when developing/coding in TypeScript/JavaScript (typescript). This consolidated file merges all TypeScript/JavaScript rule topics; follow it consistently.

---
paths:
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript/JavaScript Development


## TypeScript/JavaScript Coding Style

## Types and Interfaces

Use types to make public APIs, shared models, and component props explicit, readable, and reusable.

### Public APIs

- Add parameter and return types to exported functions, shared utilities, and public class methods
- Let TypeScript infer obvious local variable types
- Extract repeated inline object shapes into named types or interfaces

```typescript
// WRONG: Exported function without explicit types
export function formatUser(user) {
  return `${user.firstName} ${user.lastName}`
}

// CORRECT: Explicit types on public APIs
interface User {
  firstName: string
  lastName: string
}

export function formatUser(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
```

### Interfaces vs. Type Aliases

- Use `interface` for object shapes that may be extended or implemented
- Use `type` for unions, intersections, tuples, mapped types, and utility types
- Prefer string literal unions over `enum` unless an `enum` is required for interoperability

```typescript
interface User {
  id: string
  email: string
}

type UserRole = 'admin' | 'member'
type UserWithRole = User & {
  role: UserRole
}
```

### Avoid `any`

- Avoid `any` in application code
- Use `unknown` for external or untrusted input, then narrow it safely
- Use generics when a value's type depends on the caller

```typescript
// WRONG: any removes type safety
function getErrorMessage(error: any) {
  return error.message
}

// CORRECT: unknown forces safe narrowing
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}
```

### React Props

- Define component props with a named `interface` or `type`
- Type callback props explicitly
- Do not use `React.FC` unless there is a specific reason to do so

```typescript
interface User {
  id: string
  email: string
}

interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

function UserCard({ user, onSelect }: UserCardProps) {
  return <button onClick={() => onSelect(user.id)}>{user.email}</button>
}
```

### JavaScript Files

- In `.js` and `.jsx` files, use JSDoc when types improve clarity and a TypeScript migration is not practical
- Keep JSDoc aligned with runtime behavior

```javascript
/**
 * @param {{ firstName: string, lastName: string }} user
 * @returns {string}
 */
export function formatUser(user) {
  return `${user.firstName} ${user.lastName}`
}
```

## Immutability

Use spread operator for immutable updates:

```typescript
interface User {
  id: string
  name: string
}

// WRONG: Mutation
function updateUser(user: User, name: string): User {
  user.name = name // MUTATION!
  return user
}

// CORRECT: Immutability
function updateUser(user: Readonly<User>, name: string): User {
  return {
    ...user,
    name
  }
}
```

## Error Handling

Use async/await with try-catch and narrow unknown errors safely:

```typescript
interface User {
  id: string
  email: string
}

declare function riskyOperation(userId: string): Promise<User>

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

const logger = {
  error: (message: string, error: unknown) => {
    // Replace with your production logger (for example, pino or winston).
  }
}

async function loadUser(userId: string): Promise<User> {
  try {
    const result = await riskyOperation(userId)
    return result
  } catch (error: unknown) {
    logger.error('Operation failed', error)
    throw new Error(getErrorMessage(error))
  }
}
```

## Input Validation

Use Zod for schema-based validation and infer types from the schema:

```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

type UserInput = z.infer<typeof userSchema>

const validated: UserInput = userSchema.parse(input)
```

## Console.log

- No `console.log` statements in production code
- Use proper logging libraries instead
- See hooks for automatic detection


## TypeScript/JavaScript Patterns

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

## Custom Hooks Pattern

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

## Repository Pattern

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```


## TypeScript/JavaScript Security

## Secret Management

```typescript
// NEVER: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ALWAYS: Environment variables
const apiKey = process.env.API_KEY

if (!apiKey) {
  throw new Error('API_KEY not configured')
}
```

## Security Agent Support

- Use **security-reviewer** skill for comprehensive security audits


## TypeScript/JavaScript Testing

## E2E Testing

Use **Playwright** as the E2E testing framework for critical user flows.

## Testing Agent Support

- **e2e-runner** - Playwright E2E testing specialist


## TypeScript/JavaScript Hooks

## `tool.execute.before` Hooks

### File Size Guard (TS/JS Specific)

Block writes to `.ts`, `.tsx`, `.js`, `.jsx` files that exceed 800 lines. Single-file bloat accumulates technical debt - split large files into modules:

```json
{
  "hooks": {
    "tool.execute.before": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const c=i.tool_input?.content||'';const lines=c.split('\\\\n').length;if(lines>800){console.error('[Hook] BLOCKED: TS/JS file exceeds 800 lines ('+lines+' lines). Split into smaller modules.');process.exit(2)}console.log(d)})\"",
        "description": "Block TS/JS writes that exceed 800 lines"
      }
    ]
  }
}
```

### Credential Leak Prevention (TS/JS)

Before writing `.ts`/`.tsx`/`.js`/`.jsx` files, scan content for hardcoded credentials, API tokens, and secrets:

```json
{
  "hooks": {
    "tool.execute.before": [
      {
        "matcher": "Write",
        "file_paths": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        "command": "node -e \"const p=require('fs').readFileSync('/dev/stdin','utf8');const patterns=[{re:/AKIA[0-9A-Z]{16}/g,name:'AWS Key'},{re:/sk-[a-zA-Z0-9]{32,}/g,name:'Secret Key'},{re:/gh[pousr]_[a-zA-Z0-9]{36,}/g,name:'GitHub Token'},{re:/-----BEGIN.*PRIVATE KEY-----/g,name:'Private Key'},{re:/(password|pwd|secret)=[^\\\\.\\\\s]{8,}/gi,name:'Plaintext Credential'}];const m=patterns.flatMap(({re,name})=>(p.match(re)||[]).map(m=>({name,m})));if(m.length){console.error('[Hook] BLOCKED: '+m.length+' credential pattern(s) detected:',m.map(x=>x.name+' ('+x.m.substring(0,8)+'...)').join(', '));process.exit(2)}\"
      }
    ]
  }
}
```

## `tool.execute.after` Hooks

Configure via OpenCode hooks plugin or project-local tooling:

- **Prettier**: Auto-format JS/TS files after edit (`prettier --write $FILE`)
- **TypeScript check**: Run `tsc --noEmit --incremental` after editing `.ts`/`.tsx` files
- **console.log warning**: Warn about `console.log` in edited files

## `session.idle` Hooks

- **console.log audit**: Check all modified files for `console.log` before session ends

# effect-a2a

An opinionated Effect implementation of the A2A protocol, intended to make it easy to add A2A client or server capabilities to any Effect project.

The goal is not to mirror the protocol as a pile of unstructured JSON helpers. This project aims to provide a typed, Effect-native foundation for building A2A integrations:

- schema-first protocol models with `effect/Schema`
- branded identifiers for protocol concepts like tasks, contexts, messages, and artifacts
- server utilities for exposing A2A-compatible endpoints
- client utilities for calling A2A agents from Effect applications
- clear defaults for task state, message handling, artifacts, agent cards, and security metadata

## Status

This is currently an early implementation.

The core protocol schema is being built in [`packages/core-schema.ts`](./packages/core-schema.ts). A minimal Bun-based Effect HTTP server exists in [`packages/server.ts`](./packages/server.ts), with placeholder handlers in [`packages/handlers.ts`](./packages/handlers.ts).

## Development

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Typecheck:

```bash
bun run typecheck
```

## Intended Shape

The package is expected to grow around two use cases.

### Server

Use Effect services, layers, and schemas to expose an A2A-compatible agent from an existing Effect application.

The server side should handle protocol boundaries while letting application code stay focused on domain-specific agent behavior.

### Client

Use typed Effect APIs to discover agents, send tasks/messages, consume task updates, and decode protocol responses safely.

The client side should make remote A2A agents feel like ordinary Effect services.

## Design Direction

This project is intentionally opinionated:

- Effect schemas are the source of truth for protocol data.
- Protocol identifiers use branded types instead of plain strings.
- Runtime decoding should happen at boundaries.
- Server and client APIs should compose through Effect layers.
- Internal conversation or agent state does not need to use the wire format directly; it can be converted to A2A format at the edge.

See [`docs/todo.md`](./docs/todo.md) for current notes and open design questions.

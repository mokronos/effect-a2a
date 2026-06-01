import { Effect, Schema } from "effect"
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"
import { A2aAgent, A2aError } from "../../agent"
import { CancelTaskRequest, GetTaskRequest, ListTasksRequest, SendMessageRequest } from "../../core-schema"
import { JsonRpcRequest } from "./schema"

const parseParams = <A>(schema: Schema.Schema<A>, params: unknown) =>
  Schema.decodeUnknownEffect(schema)(params ?? {})

const toJsonRpcError = (id: string | number | null, error: unknown) => {
  if (error instanceof A2aError) {
    return {
      jsonrpc: "2.0" as const,
      id,
      error: {
        code: error.code,
        message: error.message,
        data: error.data,
      },
    }
  }

  return {
    jsonrpc: "2.0" as const,
    id,
    error: {
      code: -32603,
      message: "Internal error",
      data: String(error),
    },
  }
}

const dispatch = (request: JsonRpcRequest) =>
  Effect.gen(function* () {
    const agent = yield* A2aAgent

    switch (request.method) {
      case "message/send":
        return yield* agent.sendMessage(yield* parseParams(SendMessageRequest, request.params))
      case "tasks/get":
        return yield* agent.getTask(yield* parseParams(GetTaskRequest, request.params))
      case "tasks/list":
        return yield* agent.listTasks(yield* parseParams(ListTasksRequest, request.params))
      case "tasks/cancel":
        return yield* agent.cancelTask(yield* parseParams(CancelTaskRequest, request.params))
      case "agent/getAuthenticatedExtendedCard":
        return agent.card
      default:
        return yield* new A2aError({
          code: -32601,
          message: "Method not found",
          data: { method: request.method },
        })
    }
  })

export const jsonRpcHandler = Effect.gen(function* () {
  const httpRequest = yield* HttpServerRequest.HttpServerRequest
  const body = yield* httpRequest.json
  const request = yield* Schema.decodeUnknownEffect(JsonRpcRequest)(body)

  const response = yield* dispatch(request).pipe(
    Effect.map((result) => ({ jsonrpc: "2.0" as const, id: request.id, result })),
    Effect.catch((error) => Effect.succeed(toJsonRpcError(request.id, error))),
  )

  return yield* HttpServerResponse.json(response)
}).pipe(
  Effect.catch((error) =>
    Effect.succeed(HttpServerResponse.jsonUnsafe(toJsonRpcError(null, error), { status: 400 }))
  ),
)

export const agentCardHandler = Effect.gen(function* () {
  const agent = yield* A2aAgent
  return yield* HttpServerResponse.json(agent.card)
})

export const makeJsonRpcRouter = HttpRouter.addAll([
  HttpRouter.route("POST", "/rpc", jsonRpcHandler),
  HttpRouter.route("GET", "/.well-known/agent-card.json", agentCardHandler),
])

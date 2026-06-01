import { Effect, Schema } from "effect"
import { HttpBody, HttpClient, HttpClientResponse } from "effect/unstable/http"
import { A2aError } from "../../agent"
import {
  AgentCard,
  CancelTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  SendMessageRequest,
  Task,
  TaskOrMessage,
} from "../../core-schema"
import { JsonRpcErrorResponse, JsonRpcResponse } from "./schema"

export class JsonRpcClientConfig extends Schema.Class<JsonRpcClientConfig>("JsonRpcClientConfig")({
  baseUrl: Schema.String,
}) {}

const decodeResult = <A>(schema: Schema.Schema<A>, response: JsonRpcResponse) => {
  if ("error" in response) {
    const error = response.error as JsonRpcErrorResponse["error"]
    return Effect.fail(
      new A2aError({
        code: error.code,
        message: error.message,
        data: error.data,
      }),
    )
  }

  return Schema.decodeUnknownEffect(schema)(response.result)
}

export const makeJsonRpcClient = (config: JsonRpcClientConfig) =>
  Effect.gen(function* () {
    const http = yield* HttpClient.HttpClient

    const call = <A>(method: string, params: unknown, schema: Schema.Schema<A>) =>
      Effect.gen(function* () {
        const response = yield* http.post(`${config.baseUrl}/rpc`, {
          body: HttpBody.jsonUnsafe({
            jsonrpc: "2.0",
            id: crypto.randomUUID(),
            method,
            params,
          }),
        })
        const rpc = yield* HttpClientResponse.schemaBodyJson(JsonRpcResponse)(response)
        return yield* decodeResult(schema, rpc)
      })

    return {
      getAgentCard: () =>
        http.get(`${config.baseUrl}/.well-known/agent-card.json`).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(AgentCard)),
        ),
      sendMessage: (request: SendMessageRequest) => call("message/send", request, TaskOrMessage),
      getTask: (request: GetTaskRequest) => call("tasks/get", request, Task),
      listTasks: (request: ListTasksRequest) => call("tasks/list", request, ListTasksResponse),
      cancelTask: (request: CancelTaskRequest) => call("tasks/cancel", request, Task),
    }
  })

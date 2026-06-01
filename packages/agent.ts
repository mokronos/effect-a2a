import { Context, Effect, Schema } from "effect"
import type {
  AgentCard,
  CancelTaskRequest,
  GetTaskRequest,
  ListTasksRequest,
  ListTasksResponse,
  SendMessageRequest,
  Task,
  TaskOrMessage,
} from "./core-schema"

export class A2aError extends Schema.TaggedErrorClass<A2aError>()("A2aError", {
  code: Schema.Number,
  message: Schema.String,
  data: Schema.optional(Schema.Unknown),
}) {}

export class A2aAgent extends Context.Service<
  A2aAgent,
  {
    readonly card: AgentCard
    readonly sendMessage: (request: SendMessageRequest) => Effect.Effect<TaskOrMessage, A2aError>
    readonly getTask: (request: GetTaskRequest) => Effect.Effect<Task, A2aError>
    readonly listTasks: (request: ListTasksRequest) => Effect.Effect<ListTasksResponse, A2aError>
    readonly cancelTask: (request: CancelTaskRequest) => Effect.Effect<Task, A2aError>
  }
>()("@effect-a2a/A2aAgent") {}

export const taskNotFound = (id: string) =>
  new A2aError({
    code: -32001,
    message: "Task not found",
    data: { id },
  })

export const unsupportedOperation = (operation: string) =>
  new A2aError({
    code: -32004,
    message: "Unsupported operation",
    data: { operation },
  })

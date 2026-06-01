import { Effect, Layer } from "effect"
import { A2aAgent, taskNotFound, unsupportedOperation } from "../packages/agent"
import { AgentCard, AgentCapabilities, AgentInterface, AgentName, AgentVersion, ListTasksResponse, Url } from "../packages/core-schema"
import { TaskStore } from "../packages/task-store"
import { createCompletedTextTask, getTextFromMessage } from "../packages/utils"

const responses = [
  "The protocol boundary is where boring code should live.",
  "A small fake agent is enough to prove the server and client shape.",
  "Clean transports let custom agents focus on behavior, not JSON-RPC.",
  "Effect layers make swapping memory storage for durable storage straightforward.",
]

const pickResponse = (input: string) => responses[input.length % responses.length]

export const RandomTextAgentLive = Layer.effect(
  A2aAgent,
  Effect.gen(function* () {
    const store = yield* TaskStore

    const card = new AgentCard({
      name: AgentName.make("Random Text Agent"),
      description: "Example A2A agent that replies with predefined text.",
      version: AgentVersion.make("0.0.1"),
      supportedInterfaces: [
        new AgentInterface({
          url: Url.make("http://localhost:11111/rpc"),
          protocolBinding: "json-rpc",
          protocolVersion: "2.0",
        }),
      ],
      capabilities: new AgentCapabilities({ streaming: false, pushNotifications: false }),
      defaultInputModes: ["text/plain"],
      defaultOutputModes: ["text/plain"],
    })

    return {
      card,
      sendMessage: (request) =>
        Effect.gen(function* () {
          const text = getTextFromMessage(request.message)
          const task = createCompletedTextTask({
            userMessage: request.message,
            responseText: `${pickResponse(text)} You said: ${text}`,
          })

          yield* store.put(task)
          return task
        }),
      getTask: (request) =>
        Effect.gen(function* () {
          const task = yield* store.get(request.id)
          if (task === undefined) {
            return yield* taskNotFound(request.id)
          }
          return task
        }),
      listTasks: () =>
        Effect.gen(function* () {
          const tasks = yield* store.list()
          return new ListTasksResponse({ tasks: [...tasks] })
        }),
      cancelTask: (request) => Effect.fail(unsupportedOperation(`cancel task ${request.id}`)),
    }
  }),
)

export const RandomTextAgentLayer = RandomTextAgentLive.pipe(Layer.provide(TaskStore.memoryLayer))

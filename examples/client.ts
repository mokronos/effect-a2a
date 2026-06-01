import { BunHttpClient, BunRuntime } from "@effect/platform-bun"
import { Effect } from "effect"
import { JsonRpcClientConfig, makeJsonRpcClient } from "../packages/bindings/json-rpc/client"
import { createUserTextMessage } from "../packages/utils"

const program = Effect.gen(function* () {
  const client = yield* makeJsonRpcClient(new JsonRpcClientConfig({ baseUrl: "http://localhost:11111" }))

  const card = yield* client.getAgentCard()
  yield* Effect.logInfo(`Discovered agent: ${card.name} (${card.version})`)

  const result = yield* client.sendMessage({
    message: createUserTextMessage("Hello from the example client"),
  })

  yield* Effect.logInfo("Send message result", result)

  if ("id" in result) {
    const task = yield* client.getTask({ id: result.id })
    yield* Effect.logInfo("Fetched task", task)

    const tasks = yield* client.listTasks({})
    yield* Effect.logInfo(`Server has ${tasks.tasks.length} task(s)`)
  }
})

BunRuntime.runMain(program.pipe(Effect.provide(BunHttpClient.layer)) as Effect.Effect<void, never, never>)

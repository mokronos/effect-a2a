import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { makeJsonRpcRouter } from "../packages/bindings/json-rpc/server"
import { RandomTextAgentLayer } from "./random-text-agent"

const port = 11111

const App = makeJsonRpcRouter.pipe(
  HttpRouter.serve,
  Layer.provide(RandomTextAgentLayer),
)

BunRuntime.runMain(Layer.launch(Layer.provide(App, BunHttpServer.layer({ port }))) as Effect.Effect<never, never, never>)

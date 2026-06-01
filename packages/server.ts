import { Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { makeJsonRpcRouter } from "./bindings/json-rpc/server"

export const makeJsonRpcServerLayer = (agentLayer: Layer.Layer<never>) =>
  makeJsonRpcRouter.pipe(
    HttpRouter.serve,
    Layer.provide(agentLayer),
  )

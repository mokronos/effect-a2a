import { getTasks } from "./handlers";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { Effect, Layer } from "effect";
import { HttpRouter, HttpServer, HttpServerResponse } from "effect/unstable/http";

const App = HttpRouter.add("GET", "/tasks",
                           HttpServerResponse.json(getTasks)
).pipe(HttpRouter.serve, HttpServer.withLogAddress)

const port = 11111

const ServerLive = BunHttpServer.layer({ port })

BunRuntime.runMain(Layer.launch(Layer.provide(App, ServerLive)))

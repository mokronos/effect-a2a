import { Effect } from "effect"

const program = Effect.gen(function* () {
    const data = yield* Effect.succeed("hello world")
    yield* Effect.logInfo(`Processing data: ${data}`)
    return data.toUpperCase()
});

Effect.runSync(program);

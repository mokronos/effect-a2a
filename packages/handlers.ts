import { Effect } from "effect";

export const getTasks = () =>
    Effect.gen(function* () {
        return yield* Effect.succeed([]);
    });

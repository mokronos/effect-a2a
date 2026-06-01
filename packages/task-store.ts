import { Context, Effect, Layer } from "effect"
import type { Task, TaskId } from "./core-schema"

export class TaskStore extends Context.Service<
  TaskStore,
  {
    readonly put: (task: Task) => Effect.Effect<void>
    readonly get: (id: TaskId) => Effect.Effect<Task | undefined>
    readonly list: () => Effect.Effect<readonly Task[]>
  }
>()("@effect-a2a/TaskStore") {
  static readonly memoryLayer = Layer.sync(TaskStore, () => {
    const tasks = new Map<string, Task>()

    return {
      put: (task) => Effect.sync(() => void tasks.set(task.id, task)),
      get: (id) => Effect.succeed(tasks.get(id)),
      list: () => Effect.succeed([...tasks.values()]),
    }
  })
}

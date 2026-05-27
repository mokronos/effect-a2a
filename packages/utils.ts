import { ContextId, Task, TaskId } from "./core-schema";


export const createTask = (text: String): Task => ({
    id: Math.random().toString(36).slice(2),
    contextId: Math.random().toString(36).slice(2),
    status: {
        state: "TASK_STATE_UNSPECIFIED",
        message: {
            messageId: Math.random().toString(36).slice(2),
            contextId: Math.random().toString(36).slice(2),
            taskId: Math.random().toString(36).slice(2),
            role: "ROLE_USER",
            metadata: {},
            extensions: [],
            referenceTaskIds: [],
        },
        timestamp: new Date(),
    },
    artifacts: [],
    history: [],
    metadata: {},
});

export const createTaskId = (): TaskId => TaskId.make(Math.random().toString(36).slice(2));
export const createContextId = (): ContextId => ContextId.make(Math.random().toString(36).slice(2));

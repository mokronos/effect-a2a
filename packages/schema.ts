import { Schema } from "effect";

// IDs
export const ContextId = Schema.String.pipe(Schema.brand("ContextId"));
export type ContextId = typeof ContextId.Type

export const MessageId = Schema.String.pipe(Schema.brand("MessageId"));
export type MessageId = typeof MessageId.Type

export const TaskId = Schema.String.pipe(Schema.brand("TaskId"));
export type TaskId = typeof TaskId.Type

export const ExtensionUri = Schema.String.pipe(Schema.brand("ExtensionUri"));
export type ExtensionUri = typeof ExtensionUri.Type


export const TaskState = Schema.Literals([
    "TASK_STATE_UNSPECIFIED",
    "TASK_STATE_SUBMITTED",
    "TASK_STATE_WORKING",
    "TASK_STATE_COMPLETED",
    "TASK_STATE_FAILED",
    "TASK_STATE_CANCELED",
    "TASK_STATE_INPUT_REQUIRED",
    "TASK_STATE_REJECTED",
    "TASK_STATE_AUTH_REQUIRED",
]);

export const Role = Schema.Literals([
    "ROLE_UNSPECIFIED",
    "ROLE_USER",
    "ROLE_AGENT",
]);

export class Message extends Schema.Class<Message>("Message")({
    messageId: MessageId,
    contextId: Schema.optional(ContextId),
    taskId: Schema.optional(TaskId),
    role: Role,
    metadata: Schema.optional(Schema.ObjectKeyword),
    extensions: Schema.optional(Schema.Array(ExtensionUri)),
    referenceTaskIds: Schema.optional(Schema.Array(TaskId)),
}){};


export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")({
    state: TaskState,
    message: Schema.optional(Message),
    timestamp: Schema.optional(Schema.Date),
}){};

export class Task extends Schema.Class<Task>("Task")({
    id: TaskId,
    contextId: Schema.optional(ContextId),
    status: TaskStatus,
    artifacts: Schema.optional(Schema.Array(Artifact)),
    history: Schema.optional(Schema.Array(Message)),
    metadata: Schema.optional(Schema.ObjectKeyword),
}){};

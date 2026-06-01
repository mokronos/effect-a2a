import { Schema } from "effect"

export const ContextId = Schema.String.pipe(Schema.brand("ContextId"))
export type ContextId = typeof ContextId.Type

export const MessageId = Schema.String.pipe(Schema.brand("MessageId"))
export type MessageId = typeof MessageId.Type

export const TaskId = Schema.String.pipe(Schema.brand("TaskId"))
export type TaskId = typeof TaskId.Type

export const ArtifactId = Schema.String.pipe(Schema.brand("ArtifactId"))
export type ArtifactId = typeof ArtifactId.Type

export const AgentName = Schema.String.pipe(Schema.brand("AgentName"))
export type AgentName = typeof AgentName.Type

export const AgentVersion = Schema.String.pipe(Schema.brand("AgentVersion"))
export type AgentVersion = typeof AgentVersion.Type

export const Url = Schema.String.pipe(Schema.brand("Url"))
export type Url = typeof Url.Type

export const MediaType = Schema.String.pipe(Schema.brand("MediaType"))
export type MediaType = typeof MediaType.Type

export const Metadata = Schema.Record(Schema.String, Schema.Unknown)
export type Metadata = typeof Metadata.Type

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
])
export type TaskState = typeof TaskState.Type

export const Role = Schema.Literals(["ROLE_USER", "ROLE_AGENT"])
export type Role = typeof Role.Type

export class TextPart extends Schema.Class<TextPart>("TextPart")({
  kind: Schema.Literal("text"),
  text: Schema.String,
  metadata: Schema.optional(Metadata),
}) {}

export class DataPart extends Schema.Class<DataPart>("DataPart")({
  kind: Schema.Literal("data"),
  data: Schema.Unknown,
  metadata: Schema.optional(Metadata),
}) {}

export class FilePart extends Schema.Class<FilePart>("FilePart")({
  kind: Schema.Literal("file"),
  url: Schema.optional(Url),
  bytes: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  mediaType: Schema.optional(MediaType),
  metadata: Schema.optional(Metadata),
}) {}

export const Part = Schema.Union([TextPart, DataPart, FilePart])
export type Part = typeof Part.Type

export class Message extends Schema.Class<Message>("Message")({
  messageId: MessageId,
  contextId: Schema.optional(ContextId),
  taskId: Schema.optional(TaskId),
  role: Role,
  parts: Schema.Array(Part),
  metadata: Schema.optional(Metadata),
  extensions: Schema.optional(Schema.Array(Schema.String)),
  referenceTaskIds: Schema.optional(Schema.Array(TaskId)),
}) {}

export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")({
  state: TaskState,
  message: Schema.optional(Message),
  timestamp: Schema.optional(Schema.String),
}) {}

export class Artifact extends Schema.Class<Artifact>("Artifact")({
  artifactId: ArtifactId,
  name: Schema.optional(Schema.String),
  description: Schema.optional(Schema.String),
  parts: Schema.Array(Part),
  metadata: Schema.optional(Metadata),
  extensions: Schema.optional(Schema.Array(Schema.String)),
}) {}

export class Task extends Schema.Class<Task>("Task")({
  id: TaskId,
  contextId: Schema.optional(ContextId),
  status: TaskStatus,
  artifacts: Schema.optional(Schema.Array(Artifact)),
  history: Schema.optional(Schema.Array(Message)),
  metadata: Schema.optional(Metadata),
}) {}

export class TaskStatusUpdateEvent extends Schema.Class<TaskStatusUpdateEvent>("TaskStatusUpdateEvent")({
  taskId: TaskId,
  contextId: Schema.optional(ContextId),
  status: TaskStatus,
  final: Schema.optional(Schema.Boolean),
  metadata: Schema.optional(Metadata),
}) {}

export class TaskArtifactUpdateEvent extends Schema.Class<TaskArtifactUpdateEvent>("TaskArtifactUpdateEvent")({
  taskId: TaskId,
  contextId: Schema.optional(ContextId),
  artifact: Artifact,
  append: Schema.optional(Schema.Boolean),
  lastChunk: Schema.optional(Schema.Boolean),
  metadata: Schema.optional(Metadata),
}) {}

export const TaskOrMessage = Schema.Union([Task, Message])
export type TaskOrMessage = typeof TaskOrMessage.Type

export class SendMessageConfiguration extends Schema.Class<SendMessageConfiguration>("SendMessageConfiguration")({
  acceptedOutputModes: Schema.optional(Schema.Array(Schema.String)),
  blocking: Schema.optional(Schema.Boolean),
  historyLength: Schema.optional(Schema.Number),
}) {}

export class SendMessageRequest extends Schema.Class<SendMessageRequest>("SendMessageRequest")({
  message: Message,
  configuration: Schema.optional(SendMessageConfiguration),
  metadata: Schema.optional(Metadata),
}) {}

export class GetTaskRequest extends Schema.Class<GetTaskRequest>("GetTaskRequest")({
  id: TaskId,
  historyLength: Schema.optional(Schema.Number),
  metadata: Schema.optional(Metadata),
}) {}

export class ListTasksRequest extends Schema.Class<ListTasksRequest>("ListTasksRequest")({
  contextId: Schema.optional(ContextId),
  state: Schema.optional(TaskState),
  limit: Schema.optional(Schema.Number),
  cursor: Schema.optional(Schema.String),
  metadata: Schema.optional(Metadata),
}) {}

export class ListTasksResponse extends Schema.Class<ListTasksResponse>("ListTasksResponse")({
  tasks: Schema.Array(Task),
  nextCursor: Schema.optional(Schema.String),
}) {}

export class CancelTaskRequest extends Schema.Class<CancelTaskRequest>("CancelTaskRequest")({
  id: TaskId,
  metadata: Schema.optional(Metadata),
}) {}

export class AgentInterface extends Schema.Class<AgentInterface>("AgentInterface")({
  url: Url,
  protocolBinding: Schema.String,
  protocolVersion: Schema.optional(Schema.String),
}) {}

export class AgentCapabilities extends Schema.Class<AgentCapabilities>("AgentCapabilities")({
  streaming: Schema.optional(Schema.Boolean),
  pushNotifications: Schema.optional(Schema.Boolean),
  extendedAgentCard: Schema.optional(Schema.Boolean),
}) {}

export class AgentCard extends Schema.Class<AgentCard>("AgentCard")({
  name: AgentName,
  description: Schema.String,
  version: AgentVersion,
  supportedInterfaces: Schema.Array(AgentInterface),
  capabilities: AgentCapabilities,
  defaultInputModes: Schema.optional(Schema.Array(Schema.String)),
  defaultOutputModes: Schema.optional(Schema.Array(Schema.String)),
}) {}

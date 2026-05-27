// https://a2a-protocol.org/latest/specification

import { Schema } from "effect";

// IDs
export const ContextId = Schema.String.pipe(Schema.brand("ContextId"));
export type ContextId = typeof ContextId.Type

export const MessageId = Schema.String.pipe(Schema.brand("MessageId"));
export type MessageId = typeof MessageId.Type

export const TaskId = Schema.String.pipe(Schema.brand("TaskId"));
export type TaskId = typeof TaskId.Type

export const ArtifactId = Schema.String.pipe(Schema.brand("ArtifactId"));
export type ArtifactId = typeof ArtifactId.Type

export const ExtensionUri = Schema.String.pipe(Schema.brand("ExtensionUri"));
export type ExtensionUri = typeof ExtensionUri.Type

export const Metadata = Schema.ObjectKeyword.pipe(Schema.brand("Metadata"));
export type Metadata = typeof Metadata.Type

export const Url = Schema.String.pipe(Schema.brand("Url"));
export type Url = typeof Url.Type

export const Description = Schema.String.pipe(Schema.brand("Description"));
export type Description = typeof Description.Type

export const Filename = Schema.String.pipe(Schema.brand("Filename"));
export type Filename = typeof Filename.Type

export const MediaType = Schema.String.pipe(Schema.brand("MediaType"));
export type MediaType = typeof MediaType.Type

export const ProtocolBinding = Schema.String.pipe(Schema.brand("ProtocolBinding"));
export type ProtocolBinding = typeof ProtocolBinding.Type

export const ProtocolVersion = Schema.String.pipe(Schema.brand("ProtocolVersion"));
export type ProtocolVersion = typeof ProtocolVersion.Type

export const AgentName = Schema.String.pipe(Schema.brand("AgentName"));
export type AgentName = typeof AgentName.Type

export const AgentVersion = Schema.String.pipe(Schema.brand("AgentVersion"));
export type AgentVersion = typeof AgentVersion.Type


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
    metadata: Schema.optional(Metadata),
    extensions: Schema.optional(Schema.Array(ExtensionUri)),
    referenceTaskIds: Schema.optional(Schema.Array(TaskId)),
}) { };


export class TaskStatus extends Schema.Class<TaskStatus>("TaskStatus")({
    state: TaskState,
    message: Schema.optional(Message),
    timestamp: Schema.optional(Schema.Date),
}) { };


export class TextPart extends Schema.Class<TextPart>("TextPart")({
    text: Schema.String,
    metadata: Metadata,
    filename: Schema.optional(Filename),
    mediaType: Schema.optional(MediaType),
}) { };

export class RawPart extends Schema.Class<RawPart>("RawPart")({
    raw: Schema.String,
    metadata: Metadata,
    filename: Schema.optional(Filename),
    mediaType: Schema.optional(MediaType),
}) { };


export class UrlPart extends Schema.Class<UrlPart>("UrlPart")({
    url: Url,
    metadata: Metadata,
    filename: Schema.optional(Filename),
    mediaType: Schema.optional(MediaType),
}) { };

export class DataPart extends Schema.Class<DataPart>("DataPart")({
    data: Schema.Any,
    metadata: Metadata,
    filename: Schema.optional(Filename),
    mediaType: Schema.optional(MediaType),
}) { };


export const Part = Schema.Union([
    TextPart,
    RawPart,
    UrlPart,
    DataPart,
]);

export class Artifact extends Schema.Class<Artifact>("Artifact")({
    artifactId: ArtifactId,
    name: Schema.optional(Schema.String),
    description: Schema.optional(Description),
    parts: Schema.Array(Part),
    metadata: Metadata,
    extensions: Schema.optional(Schema.Array(ExtensionUri)),
}) { };

export class Task extends Schema.Class<Task>("Task")({
    id: TaskId,
    contextId: Schema.optional(ContextId),
    status: TaskStatus,
    artifacts: Schema.optional(Schema.Array(Artifact)),
    history: Schema.optional(Schema.Array(Message)),
    metadata: Metadata,
}) { };



export class TaskStatusUpdateEvent extends Schema.Class<TaskStatusUpdateEvent>("TaskStatusUpdateEvent")({
    taskId: TaskId,
    contextId: ContextId,
    status: TaskStatus,
    metadata: Schema.optional(Metadata),
}) { };


export class TaskArtifactUpdateEvent extends Schema.Class<TaskArtifactUpdateEvent>("TaskArtifactUpdateEvent")({
    taskId: TaskId,
    contextId: ContextId,
    artifact: Artifact,
    append: Schema.optional(Schema.Boolean),
    lastChunk: Schema.optional(Schema.Boolean),
    metadata: Schema.optional(Metadata),
}) { };

export class AgentInterface extends Schema.Class<AgentInterface>("AgentInterface")({
    url: Url,
    protocolBinding: ProtocolBinding,
    tenant: Schema.optional(Schema.String).pipe(Schema.brand("tenant")),
    protocolVersion: Schema.optional(ProtocolVersion),
}) { };

export class AgentProvider extends Schema.Class<AgentProvider>("AgentProvider")({
    url: Url,
    organization: Schema.optional(Schema.String).pipe(Schema.brand("organization")),
}) { };

export class AgentExtension extends Schema.Class<AgentExtension>("AgentExtension")({
    uri: Schema.optional(ExtensionUri),
    description: Schema.optional(Description),
    required: Schema.optional(Schema.Boolean),
    params: Schema.optional(Schema.ObjectKeyword).pipe(Schema.brand("params")),
}) { };

export class AgentCapability extends Schema.Class<AgentCapability>("AgentCapability")({
    streaming: Schema.optional(Schema.Boolean),
    pushNotifications: Schema.optional(Schema.Boolean),
    extensions: Schema.optional(Schema.Array(AgentExtension)),
    extendedAgentCard: Schema.optional(Schema.Boolean),
}) { };


export class APIKeySecurityScheme extends Schema.Class<APIKeySecurityScheme>("APIKeySecurityScheme")({
    description: Schema.optional(Description),
    location: Schema.Literals(["query", "header", "cookie"]).pipe(Schema.brand("location")),
    name: Schema.String.pipe(Schema.brand("name")),
}) { };

export class HTTPAuthSecurityScheme extends Schema.Class<HTTPAuthSecurityScheme>("HTTPAuthSecurityScheme")({
    description: Schema.optional(Description),
    scheme: Schema.Literals(["Basic", "Bearer", "Digest", "Negotiate", "HOBA", "Mutual"]).pipe(Schema.brand("scheme")),
    bearerFormat: Schema.optional(Schema.String).pipe(Schema.brand("bearerFormat")),
}) { };

export class AuthorizationCodeOAuthFlow extends Schema.Class<AuthorizationCodeOAuthFlow>("AuthorizationCodeOAuthFlow")({
    authorizationUrl: Url,
    tokenUrl: Url,
    refreshUrl: Schema.optional(Url),
    scopes: Schema.Record(Schema.String, Schema.String),
    pkceRequired: Schema.optional(Schema.Boolean),
}) { };

export class ClientCredentialsOauthFlow extends Schema.Class<ClientCredentialsOauthFlow>("ClientCredentialsOauthFlow")({
    tokenUrl: Url,
    refreshUrl: Schema.optional(Url),
    scopes: Schema.Record(Schema.String, Schema.String),
}) { };

export class DeviceCodeOAuthFlow extends Schema.Class<DeviceCodeOAuthFlow>("DeviceCodeOAuthFlow")({
    deviceAuthorizationUrl: Url,
    tokenUrl: Url,
    refreshUrl: Schema.optional(Url),
    scopes: Schema.Record(Schema.String, Schema.String),
}) { };

export const OauthFlows = Schema.Union([
    Schema.Struct({authorizationCode: AuthorizationCodeOAuthFlow}),
    Schema.Struct({clientCredentials: ClientCredentialsOauthFlow}),
    Schema.Struct({deviceCode: DeviceCodeOAuthFlow}),
]);

export class OAuth2SecurityScheme extends Schema.Class<OAuth2SecurityScheme>("OAuth2SecurityScheme")({
    description: Schema.optional(Description),
    flows: OauthFlows,
    oauth2MetadataUrl: Schema.optional(Url).pipe(Schema.brand("oauth2MetadataUrl")),
}) { };

export class OpenIdConnectSecurityScheme extends Schema.Class<OpenIdConnectSecurityScheme>("OpenIdConnectSecurityScheme")({
    description: Schema.optional(Description),
    openIdConnectUrl: Schema.optional(Url).pipe(Schema.brand("openIdConnectUrl")),
}) { };

export class MutualTlsSecurityScheme extends Schema.Class<MutualTlsSecurityScheme>("MutualTlsSecurityScheme")({
    description: Schema.optional(Description),
}) { };


export const SecurityScheme = Schema.Union([
    APIKeySecurityScheme,
    HTTPAuthSecurityScheme,
    OAuth2SecurityScheme,
    OpenIdConnectSecurityScheme,
    MutualTlsSecurityScheme,
]);

export const SecuritySchemes = Schema.Record(
    Schema.String,
    SecurityScheme,
);

export class AgentCard extends Schema.Class<AgentCard>("AgentCard")({
    name: AgentName,
    description: Description,
    supportedInterfaces: Schema.Array(AgentInterface),
    provider: Schema.optional(AgentProvider),
    version: AgentVersion,
    documentationUrl: Schema.optional(Schema.String).pipe(Schema.brand("documentationUrl")),
    capabilities: Schema.Array(AgentCapability),
    securitySchemes: Schema.optional(SecuritySchemes),
}) { };

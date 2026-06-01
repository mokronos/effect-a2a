import { Schema } from "effect"

export const JsonRpcId = Schema.Union([Schema.String, Schema.Number, Schema.Null])
export type JsonRpcId = typeof JsonRpcId.Type

export class JsonRpcRequest extends Schema.Class<JsonRpcRequest>("JsonRpcRequest")({
  jsonrpc: Schema.Literal("2.0"),
  id: JsonRpcId,
  method: Schema.String,
  params: Schema.optional(Schema.Unknown),
}) {}

export class JsonRpcErrorObject extends Schema.Class<JsonRpcErrorObject>("JsonRpcErrorObject")({
  code: Schema.Number,
  message: Schema.String,
  data: Schema.optional(Schema.Unknown),
}) {}

export class JsonRpcSuccessResponse extends Schema.Class<JsonRpcSuccessResponse>("JsonRpcSuccessResponse")({
  jsonrpc: Schema.Literal("2.0"),
  id: JsonRpcId,
  result: Schema.Unknown,
}) {}

export class JsonRpcErrorResponse extends Schema.Class<JsonRpcErrorResponse>("JsonRpcErrorResponse")({
  jsonrpc: Schema.Literal("2.0"),
  id: JsonRpcId,
  error: JsonRpcErrorObject,
}) {}

export const JsonRpcResponse = Schema.Union([JsonRpcSuccessResponse, JsonRpcErrorResponse])
export type JsonRpcResponse = typeof JsonRpcResponse.Type

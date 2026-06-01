import { ContextId, Message, MessageId, Task, TaskId, TextPart } from "./core-schema"

export const createTaskId = (): TaskId => TaskId.make(crypto.randomUUID())
export const createContextId = (): ContextId => ContextId.make(crypto.randomUUID())
export const createMessageId = (): MessageId => MessageId.make(crypto.randomUUID())

export const createUserTextMessage = (text: string): Message =>
  new Message({
    messageId: createMessageId(),
    role: "ROLE_USER",
    parts: [new TextPart({ kind: "text", text })],
  })

export const createAgentTextMessage = (input: { readonly text: string; readonly contextId?: ContextId; readonly taskId?: TaskId }): Message =>
  new Message({
    messageId: createMessageId(),
    contextId: input.contextId,
    taskId: input.taskId,
    role: "ROLE_AGENT",
    parts: [new TextPart({ kind: "text", text: input.text })],
  })

export const createCompletedTextTask = (input: {
  readonly userMessage: Message
  readonly responseText: string
  readonly taskId?: TaskId
  readonly contextId?: ContextId
}): Task => {
  const id = input.taskId ?? createTaskId()
  const contextId = input.contextId ?? input.userMessage.contextId ?? createContextId()
  const userMessage = new Message({ ...input.userMessage, contextId, taskId: id })
  const agentMessage = createAgentTextMessage({ text: input.responseText, contextId, taskId: id })

  return new Task({
    id,
    contextId,
    status: {
      state: "TASK_STATE_COMPLETED",
      message: agentMessage,
      timestamp: new Date().toISOString(),
    },
    history: [userMessage, agentMessage],
  })
}

export const getTextFromMessage = (message: Message): string =>
  message.parts
    .filter((part): part is TextPart => part.kind === "text")
    .map((part) => part.text)
    .join("\n")

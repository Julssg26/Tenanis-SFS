// lib/chat/types.ts
// Mirrors future Supabase tables: conversations, messages

export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  createdAt: string   // ISO — maps to Supabase created_at
}

export interface Conversation {
  id: string
  title: string
  preview: string     // last message snippet
  createdAt: string
  updatedAt: string
  messages: Message[]
}

'use client'

import { useState, useCallback } from 'react'
import ConversationSidebar from '@/components/chat/ConversationSidebar'
import ChatMessages from '@/components/chat/ChatMessages'
import ChatInput from '@/components/chat/ChatInput'
import type { Conversation, Message } from '@/lib/chat/types'
import {
  getInitialConversations,
  getSimulatedReply,
  createConversation,
} from '@/lib/chat/mockConversations'

function uid() { return Math.random().toString(36).slice(2, 10) }

// ── Call /api/ai endpoint ───────────────────────────────────────────────────────────
async function fetchReply(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<{ reply: string; source: 'simulated' | 'fallback'; reason?: string }> {
  try {
    const res = await fetch('/api/ai', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message, history }),
    })
    if (!res.ok) throw new Error(`/api/ai returned ${res.status}`)
    return await res.json() as { reply: string; source: 'simulated' | 'fallback'; reason?: string }
  } catch (err) {
    console.warn('[Chat] /api/ai failed, using local fallback:', err)
    return { reply: getSimulatedReply(message), source: 'simulated' }
  }
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(getInitialConversations)
  const [activeId,      setActiveId]      = useState<string | null>(conversations[0]?.id ?? null)
  const [isTyping,      setIsTyping]      = useState(false)
  const [aiSource,      setAiSource]      = useState<'simulated' | 'fallback' | null>(null)
  const [aiReason,      setAiReason]      = useState<string | null>(null)

  const activeConv = conversations.find(c => c.id === activeId) ?? null

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNew = useCallback(() => {
    const conv = { ...createConversation('New conversation'), messages: [] as Message[] }
    setConversations(prev => [conv, ...prev])
    setActiveId(conv.id)
  }, [])

  const handleSelect = useCallback((id: string) => setActiveId(id), [])

  const handleDelete = useCallback((id: string) => {
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeId === id) setActiveId(next[0]?.id ?? null)
      return next
    })
  }, [activeId])

  const handleSend = useCallback(async (text: string) => {
    const now = new Date().toISOString()
    const userMsg: Message = { id: uid(), role: 'user', content: text, createdAt: now }

    // ── Ensure we have an active conversation ────────────────────────────
    let targetId = activeId
    if (!targetId) {
      const conv = { ...createConversation(text), messages: [userMsg] }
      targetId = conv.id
      setConversations(prev => [conv, ...prev])
      setActiveId(targetId)
    } else {
      setConversations(prev => prev.map(c => {
        if (c.id !== targetId) return c
        const isFirst = c.messages.length === 0
        return {
          ...c,
          title:    isFirst ? (text.length > 40 ? text.slice(0, 40) + '…' : text) : c.title,
          preview:  text,
          updatedAt: now,
          messages: [...c.messages, userMsg],
        }
      }))
    }

    setIsTyping(true)
    const capturedId = targetId

    // ── Build history from current conversation for context ───────────────
    const history = (activeConv?.messages ?? []).slice(-10).map(m => ({
      role: m.role, content: m.content,
    }))

    // ── Call /api/ai (simulated local) ──────────────────────────────────────────────
    const { reply, source, reason } = await fetchReply(text, history)

    setAiSource(source)
    setAiReason(reason ?? null)
    setIsTyping(false)

    const assistantMsg: Message = {
      id: uid(), role: 'assistant', content: reply,
      createdAt: new Date().toISOString(),
    }

    setConversations(prev => prev.map(c => {
      if (c.id !== capturedId) return c
      return {
        ...c,
        preview:   reply.slice(0, 60) + (reply.length > 60 ? '…' : ''),
        updatedAt: new Date().toISOString(),
        messages:  [...c.messages, assistantMsg],
      }
    }))
  }, [activeId, activeConv])

  return (
    <div
      className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      style={{ height: 'calc(100vh - 56px - 48px)' }}
    >
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <div>
            <h1 className="text-[14px] font-semibold text-gray-800">
              {activeConv?.title ?? 'AI Assistant'}
            </h1>
            <p className="text-[11px] text-gray-400">
              'Tenaris SFS · Simulated MVP Assistant'
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-gray-500">Ready</span>
          </div>
        </div>

        <ChatMessages messages={activeConv?.messages ?? []} isTyping={isTyping} />
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  )
}

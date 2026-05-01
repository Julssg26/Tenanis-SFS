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

function msgId() { return Math.random().toString(36).slice(2, 10) }

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(getInitialConversations)
  const [activeId,      setActiveId]      = useState<string | null>(conversations[0]?.id ?? null)
  const [isTyping,      setIsTyping]      = useState(false)

  const activeConv = conversations.find(c => c.id === activeId) ?? null

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNew = useCallback(() => {
    const conv = createConversation('New conversation')
    // New empty conv — don't add to list until first message
    setConversations(prev => [{ ...conv, messages: [] }, ...prev])
    setActiveId(conv.id)
  }, [])

  const handleSelect = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  const handleDelete = useCallback((id: string) => {
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeId === id) setActiveId(next[0]?.id ?? null)
      return next
    })
  }, [activeId])

  const handleSend = useCallback((text: string) => {
    const now = new Date().toISOString()

    const userMsg: Message = {
      id: msgId(), role: 'user', content: text, createdAt: now,
    }

    // If no active conversation, create one
    let targetId = activeId
    if (!targetId) {
      const newConv = createConversation(text)
      targetId = newConv.id
      setConversations(prev => [{ ...newConv, messages: [userMsg] }, ...prev])
      setActiveId(targetId)
    } else {
      // Append user message
      setConversations(prev => prev.map(c => {
        if (c.id !== targetId) return c
        const isFirstMessage = c.messages.length === 0
        return {
          ...c,
          title: isFirstMessage
            ? (text.length > 40 ? text.slice(0, 40) + '…' : text)
            : c.title,
          preview: text,
          updatedAt: now,
          messages: [...c.messages, userMsg],
        }
      }))
    }

    // Simulate typing + reply
    setIsTyping(true)
    const delay = 800 + Math.random() * 1200  // 0.8–2s for realism

    setTimeout(() => {
      const reply = getSimulatedReply(text)
      const assistantMsg: Message = {
        id: msgId(), role: 'assistant', content: reply, createdAt: new Date().toISOString(),
      }
      setIsTyping(false)
      const capturedTarget = targetId
      setConversations(prev => prev.map(c => {
        if (c.id !== capturedTarget) return c
        return {
          ...c,
          preview: reply.slice(0, 60) + '…',
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, assistantMsg],
        }
      }))
    }, delay)
  }, [activeId])

  return (
    // Full-height page — subtract topbar (56px) and AppShell padding
    <div
      className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      style={{ height: 'calc(100vh - 56px - 48px)' }}
    >
      {/* Left sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 flex-shrink-0">
          <div>
            <h1 className="text-[14px] font-semibold text-gray-800">
              {activeConv?.title ?? 'AI Assistant'}
            </h1>
            <p className="text-[11px] text-gray-400">
              Tenaris SFS · Simulated responses · Claude API coming soon
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-gray-500">Online</span>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={activeConv?.messages ?? []}
          isTyping={isTyping}
        />

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  )
}

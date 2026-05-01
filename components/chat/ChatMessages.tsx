'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Message } from '@/lib/chat/types'

// ── Lightweight markdown renderer (no deps) ───────────────────────────────────
// ── CT link parser — [[CT:unitId:label]] → navigation button ─────────────────
function CTLinks({ text, onNavigate }: { text: string; onNavigate: (unitId: string) => void }): React.ReactElement {
  const parts = text.split(/(\[\[CT:[A-Z0-9-]+:[^\]]+\]\])/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/\[\[CT:([A-Z0-9-]+):([^\]]+)\]\]/)
        if (m) {
          return (
            <button
              key={i}
              onClick={() => onNavigate(m[1])}
              className="inline-flex items-center gap-1 bg-[#1a237e]/10 hover:bg-[#1a237e]/20 text-[#1a237e] text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-colors mx-0.5"
            >
              📍 {m[2]}
            </button>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function renderContent(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const result: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Blank line
    if (line.trim() === '') {
      result.push(<div key={key++} className="h-2" />)
      continue
    }

    // Table row
    if (line.startsWith('|')) {
      // Skip separator rows
      if (/^\|[\s\-|]+\|$/.test(line)) continue
      const cells = line.split('|').filter(c => c.trim() !== '')
      const isHeader = i > 0 && lines[i - 1]?.startsWith('|') === false
      result.push(
        <div key={key++} className="flex text-[12px] border-b border-gray-100 py-1">
          {cells.map((cell, ci) => (
            <div key={ci} className={`flex-1 px-2 ${isHeader ? 'font-semibold' : ''}`}>
              {inlineFormat(cell.trim())}
            </div>
          ))}
        </div>
      )
      continue
    }

    // Bullet
    if (line.startsWith('- ') || line.startsWith('• ')) {
      result.push(
        <div key={key++} className="flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>
      )
      continue
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)?.[1]
      result.push(
        <div key={key++} className="flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="text-gray-400 mt-0.5 flex-shrink-0 w-4">{num}.</span>
          <span>{inlineFormat(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
      continue
    }

    // Heading
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2,-2).includes('**')) {
      result.push(
        <div key={key++} className="text-[13px] font-bold text-gray-900 mt-1">
          {line.slice(2, -2)}
        </div>
      )
      continue
    }

    // Default paragraph
    result.push(
      <p key={key++} className="text-[13px] leading-relaxed">
        {inlineFormat(line)}
      </p>
    )
  }

  return result
}

function inlineFormat(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  if (parts.length === 1) return text
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

interface Props {
  messages: Message[]
  isTyping: boolean
}

export default function ChatMessages({ messages, isTyping }: Props) {
  const router    = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Empty state
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1a237e]/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z"
              fill="#1a237e" opacity=".15" />
            <path d="M8 10h8M8 14h5" stroke="#1a237e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-gray-800 mb-2">Tenaris SFS AI Assistant</h2>
          <p className="text-[13px] text-gray-500 max-w-[340px] leading-relaxed">
            Ask me about fleet status, active alerts, route delays, yard capacity, or any operational data.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
          {[
            'Show active alerts',
            'Fleet performance summary',
            'Which unit needs maintenance?',
            'Yard capacity status',
          ].map(suggestion => (
            <div
              key={suggestion}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[11px] text-gray-600 text-left cursor-default hover:bg-gray-100 transition-colors"
            >
              {suggestion}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map(msg => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.role === 'assistant' && (
            <div className="w-7 h-7 rounded-full bg-[#1a237e] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 12c-2.7 0-5.1-1.38-6.5-3.47.03-2.16 4.34-3.33 6.5-3.33s6.47 1.17 6.5 3.33C17.1 16.62 14.7 18 12 18Z"/>
              </svg>
            </div>
          )}
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-[#1a237e] text-white rounded-tr-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
            }`}
          >
            {msg.role === 'user' ? (
              <p className="text-[13px] leading-relaxed">{msg.content}</p>
            ) : (
              <div className="space-y-1">
                {renderContent(msg.content).map((node, ni) => {
                  if (typeof node === 'string') {
                    return <CTLinks key={ni} text={node} onNavigate={uid => router.push(`/control-tower?unit=${uid}`)} />
                  }
                  return <span key={ni}>{node}</span>
                })}
              </div>
            )}
            <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="w-7 h-7 rounded-full bg-[#1a237e] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 12c-2.7 0-5.1-1.38-6.5-3.47.03-2.16 4.34-3.33 6.5-3.33s6.47 1.17 6.5 3.33C17.1 16.62 14.7 18 12 18Z"/>
            </svg>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm">
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

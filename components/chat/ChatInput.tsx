'use client'

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function submit() {
    const msg = value.trim()
    if (!msg || disabled) return
    onSend(msg)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    // Auto-grow
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#1a237e] focus-within:ring-1 focus-within:ring-[#1a237e]/20 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Ask about fleet status, alerts, routes…"
          rows={1}
          className="flex-1 resize-none bg-transparent text-[13px] text-gray-800 placeholder-gray-400 outline-none leading-relaxed"
          style={{ minHeight: 24 }}
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            value.trim() && !disabled
              ? 'bg-[#1a237e] text-white hover:bg-[#283593]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={14} />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}

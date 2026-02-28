'use client'

import { useState } from 'react'
import { Send, X, RotateCcw, Bot } from 'lucide-react'

interface Message {
  role: 'bot' | 'user'
  text: string
}

const QUICK_ACTIONS = [
  'Test a Sample on Simulator.',
  'Look Performance and Estadistics.',
  'Search for Drivers Activitites.',
  'Generate a Report.',
]

const INITIAL_MESSAGES: Message[] = [
  { role: 'bot', text: '¡Hi! I\'m your smart assistant. What can I do for you today?' }
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'bot', text: 'I\'m processing your request. This feature will be connected to the AI backend.' }
    ])
    setInput('')
  }

  const reset = () => setMessages(INITIAL_MESSAGES)

  return (
    <>
      {/* Toggle button - right edge */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#1a237e] text-white rounded-l-xl px-2 py-5 z-50 shadow-lg hover:bg-[#283593] transition-colors"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-widest">
            <Bot size={14} className="rotate-90" />
            ChatBot
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed right-0 top-14 bottom-0 w-80 bg-white border-l border-gray-200 flex flex-col z-50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1a237e] text-white">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px]">ChatBot</div>
              <div className="text-[11px] text-white/70">Smart Assitant</div>
            </div>
            <button onClick={reset} className="text-white/70 hover:text-white p-1">
              <RotateCcw size={15} />
            </button>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-[#1a237e] text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick actions after initial message */}
            {messages.length === 1 && (
              <div className="space-y-2 mt-2">
                <div className="text-[11px] font-semibold text-gray-500 px-1">Quick Actions:</div>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => send(action)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-700 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Make a Question..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1a237e]"
              />
              <button
                onClick={() => send(input)}
                className="w-8 h-8 bg-[#1a237e] rounded-lg flex items-center justify-center text-white hover:bg-[#283593] transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

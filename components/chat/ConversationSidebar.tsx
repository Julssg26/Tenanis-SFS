'use client'

import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import type { Conversation } from '@/lib/chat/types'

function timeLabel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

interface Props {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export default function ConversationSidebar({
  conversations, activeId, onSelect, onNew, onDelete,
}: Props) {
  return (
    <aside className="flex flex-col h-full bg-[#f8f9fc] border-r border-gray-200 w-[260px] flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-[13px] font-bold text-[#1a237e] mb-3">AI Assistant</div>
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 bg-[#1a237e] hover:bg-[#283593] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={15} />
          New Conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-[12px]">
            No conversations yet
          </div>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`group relative flex items-start gap-3 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-colors ${
              activeId === conv.id
                ? 'bg-[#1a237e]/8 border border-[#1a237e]/15'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <MessageSquare
              size={15}
              className={`flex-shrink-0 mt-0.5 ${activeId === conv.id ? 'text-[#1a237e]' : 'text-gray-400'}`}
            />
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] font-medium truncate ${activeId === conv.id ? 'text-[#1a237e]' : 'text-gray-700'}`}>
                {conv.title}
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5">{conv.preview}</div>
              <div className="text-[10px] text-gray-300 mt-0.5">{timeLabel(conv.updatedAt)}</div>
            </div>
            {/* Delete button — appears on hover */}
            <button
              onClick={e => { e.stopPropagation(); onDelete(conv.id) }}
              className="absolute right-2 top-2.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-[10px] text-gray-400 text-center">
          Claude API integration coming soon
        </p>
      </div>
    </aside>
  )
}

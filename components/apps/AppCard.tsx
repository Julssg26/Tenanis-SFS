interface AppCardProps {
  icon: string
  label: string
  sublabel?: string
}

export default function AppCard({ icon, label, sublabel }: AppCardProps) {
  return (
    <div className="flex items-center gap-3 bg-[#e8eaf0] hover:bg-[#dde0ea] transition-colors rounded-xl px-4 py-2.5 cursor-pointer select-none">
      {/* Icon — 28px, matches Figma sizing */}
      <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt={label} className="w-7 h-7 object-contain" />
      </div>

      {/* Labels */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-[#1a237e] truncate">
          {label}
        </span>
        {sublabel && (
          <span className="text-[12px] text-gray-500 flex-shrink-0">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}

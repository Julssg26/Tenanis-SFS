interface SectionHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function SectionHeader({ title, subtitle, children }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-[22px] font-bold text-[#1a237e] leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-[#16a34a] font-medium mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

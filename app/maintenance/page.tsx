export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* SAP logo — transparent PNG, no background container */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/sap-logo.png"
        alt="SAP"
        width={140}
        height={140}
        style={{ objectFit: 'contain' }}
      />
      <div className="text-center">
        <h1 className="text-[32px] font-black text-[#1a237e] tracking-tight uppercase">
          Working in Progress
        </h1>
        <p className="text-[14px] text-gray-400 mt-2">
          This module is currently under development.
        </p>
      </div>
    </div>
  )
}

import {
  ClipboardList, Clock, Users, Timer,
  CheckCircle2, Circle, AlertCircle, Loader2,
} from 'lucide-react'

// ── Mock data ──────────────────────────────────────────────────────────────────
const SUMMARY_CARDS = [
  {
    label: "Today's Tasks",
    value: '18',
    sub:   '12 completed',
    Icon:  ClipboardList,
    color: 'text-[#1a237e]',
  },
  {
    label: 'Pending Assignments',
    value: '6',
    sub:   'Awaiting operator confirmation',
    Icon:  Clock,
    color: 'text-[#1a237e]',
  },
  {
    label: 'Active Operators',
    value: '9',
    sub:   '7 currently in field',
    Icon:  Users,
    color: 'text-[#1a237e]',
  },
  {
    label: 'Avg Task Duration',
    value: '2.8 h',
    sub:   'Per operation',
    Icon:  Timer,
    color: 'text-[#1a237e]',
  },
]

type TaskStatus = 'completed' | 'in-progress' | 'pending' | 'high-priority'

interface ScheduleItem {
  time:     string
  task:     string
  operator: string
  status:   TaskStatus
}

interface UpcomingItem {
  date: string
  task: string
}

const STATUS_CFG: Record<TaskStatus, { label: string; Icon: typeof CheckCircle2; color: string; bg: string }> = {
  'completed':    { label: 'Completed',    Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50  border-green-200'  },
  'in-progress':  { label: 'In Progress',  Icon: Loader2,      color: 'text-blue-600',  bg: 'bg-blue-50   border-blue-200'   },
  'pending':      { label: 'Pending',      Icon: Circle,       color: 'text-gray-400',  bg: 'bg-gray-50   border-gray-200'   },
  'high-priority':{ label: 'High Priority',Icon: AlertCircle,  color: 'text-red-600',   bg: 'bg-red-50    border-red-200'    },
}

const SCHEDULE: ScheduleItem[] = [
  { time: '08:00', task: 'Forklift pre-shift inspection',     operator: 'Carlos Méndez',  status: 'completed'     },
  { time: '09:30', task: 'Pipe Yard material movement',       operator: 'Ramón Torres',   status: 'completed'     },
  { time: '11:00', task: 'Crane safety check',                operator: 'Ana Guzmán',     status: 'in-progress'   },
  { time: '13:30', task: 'Warehouse to MOTU transfer',        operator: 'Luis Paredes',   status: 'in-progress'   },
  { time: '15:00', task: 'Maintenance support route',         operator: 'Jorge Salinas',  status: 'pending'       },
  { time: '16:30', task: 'Yard congestion assessment',        operator: 'Carlos Méndez',  status: 'high-priority' },
  { time: '17:00', task: 'End-of-shift fleet status report',  operator: 'Ana Guzmán',     status: 'pending'       },
]

const UPCOMING: UpcomingItem[] = [
  { date: 'Tomorrow',  task: 'Preventive maintenance review'       },
  { date: 'Wed, 15',   task: 'Operator safety briefing'            },
  { date: 'Thu, 16',   task: 'Yard congestion audit'               },
  { date: 'Fri, 17',   task: 'Route efficiency evaluation'         },
  { date: 'Mon, 20',   task: 'Fleet utilization report'            },
  { date: 'Tue, 21',   task: 'Crane certification renewal'         },
  { date: 'Wed, 22',   task: 'Quarterly operator performance review'},
]

export default function DriversPage() {
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-0.5 bg-[#e91e8c] rounded-full" />
          <span className="text-[12px] font-semibold text-[#e91e8c] uppercase tracking-wide">
            Operator Task Monitoring
          </span>
        </div>
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
          Planned Operations
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Daily internal fleet operations — Tenaris Tamsa
        </p>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_CARDS.map(({ label, value, sub, Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-[13px] text-gray-500 font-medium mb-1">{label}</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[32px] font-black text-gray-900 leading-none mb-1">{value}</div>
                <div className="text-[12px] text-gray-400">{sub}</div>
              </div>
              <Icon size={28} className="text-[#1a237e] opacity-20 mb-1 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Two panels ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_1fr] gap-4">

        {/* Left: Today's Schedule */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-1">
            {SCHEDULE.map((item, i) => {
              const cfg = STATUS_CFG[item.status]
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  {/* Time */}
                  <span className="text-[13px] font-bold text-[#1a237e] w-12 flex-shrink-0">
                    {item.time}
                  </span>

                  {/* Task + operator */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-800 truncate">{item.task}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">👤 {item.operator}</div>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                    <cfg.Icon size={10} />
                    {cfg.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-[15px] font-bold text-gray-900 mb-4">Upcoming Tasks</h2>
          <div className="space-y-1">
            {UPCOMING.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="text-[12px] font-bold text-[#e91e8c] w-20 flex-shrink-0">
                  {item.date}
                </span>
                <span className="text-[13px] text-gray-700 font-medium">
                  {item.task}
                </span>
              </div>
            ))}
          </div>

          {/* Status legend */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Task Status
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUS_CFG) as [TaskStatus, typeof STATUS_CFG[TaskStatus]][]).map(
                ([, cfg]) => (
                  <div
                    key={cfg.label}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}
                  >
                    <cfg.Icon size={10} />
                    {cfg.label}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

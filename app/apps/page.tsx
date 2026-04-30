import AppCard from '@/components/apps/AppCard'

const LEFT_APPS = [
  { label: 'Revision',                      sublabel: 'Equipos a Revisar',    icon: '/images/apps-icons/revision.png'         },
  { label: 'Date and Time Used Hours',      sublabel: 'Fecha y Horas',        icon: '/images/apps-icons/fecha-hora.png'        },
  { label: 'Used Hours Report',             sublabel: 'Informe de Horas',     icon: '/images/apps-icons/used-hours.png'        },
  { label: 'Equipment System Status Check', sublabel: 'Equipos: Estado',      icon: '/images/apps-icons/equipment-system.png'  },
  { label: 'Equipment: Zone Permanence',    sublabel: 'Equipos: Permanencia', icon: '/images/apps-icons/equipment-zone.png'    },
  { label: "Shift's Summary",               sublabel: 'Resumen de Turnos',    icon: '/images/apps-icons/shifts-summary.png'    },
  { label: 'Equipment Record',              sublabel: 'Equipos: Registros',   icon: '/images/apps-icons/equipment-records.png' },
  { label: 'Route Replay',                  sublabel: 'Reproductor de Rutas', icon: '/images/apps-icons/route-replay.png'      },
  { label: 'Event Logger',                  sublabel: 'Registro de Eventos',  icon: '/images/apps-icons/event-logger.png'      },
  { label: 'Driver Records',                sublabel: 'Pilotos: Registros',   icon: '/images/apps-icons/driver-records.png'    },
  { label: 'Mapa GPS',                      sublabel: 'Mapa GPS',             icon: '/images/apps-icons/mapa-gps.png'          },
]

const RIGHT_APPS = [
  { label: 'Enganches Trailers',    sublabel: undefined,              icon: '/images/apps-icons/enganches-trailers.png'  },
  { label: 'Ubicación Individual',  sublabel: undefined,              icon: '/images/apps-icons/ubicacion-individual.png'},
  { label: 'Tutorials',             sublabel: 'Tutoriales',           icon: '/images/apps-icons/tutorials.png'           },
  { label: 'Task Browser',          sublabel: 'Navegador de Tareas',  icon: '/images/apps-icons/task-browser.png'        },
  { label: 'Tasks and Stock Status',sublabel: 'Estado de Tareas',     icon: '/images/apps-icons/task-and-spot.png'       },
  { label: 'Telemétrico',           sublabel: 'Gráficos',             icon: '/images/apps-icons/telemetrico.png'         },
  { label: 'Trailers Status',       sublabel: undefined,              icon: '/images/apps-icons/trailer-status.png'      },
  { label: 'Light Map',             sublabel: undefined,              icon: '/images/apps-icons/light-map.png'           },
  { label: 'Trips Records',         sublabel: undefined,              icon: '/images/apps-icons/trips-records.png'       },
  { label: 'Workshop Cockpit',      sublabel: 'Panel TAUT',           icon: '/images/apps-icons/workshop-cockpit.png'    },
]

export default function AppsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-[#1a237e]">Apps</h1>
        <p className="text-[13px] text-[#16a34a] font-medium mt-0.5">All functions</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          {LEFT_APPS.map(app => (
            <AppCard key={app.label} icon={app.icon} label={app.label} sublabel={app.sublabel} />
          ))}
        </div>
        <div className="space-y-1.5">
          {RIGHT_APPS.map(app => (
            <AppCard key={app.label} icon={app.icon} label={app.label} sublabel={app.sublabel} />
          ))}
        </div>
      </div>
    </div>
  )
}

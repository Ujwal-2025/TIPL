"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  scope?: 'group' | 'individual'
  onScopeChange?: (s: 'group' | 'individual') => void
  viewMode: 'daily' | 'monthly'
  onViewModeChange: (v: 'daily' | 'monthly') => void
  showScope?: boolean
  showView?: boolean
}

export default function AttendanceNav({ scope = 'group', onScopeChange, viewMode, onViewModeChange, showScope = true, showView = true }: Props) {
  const router = useRouter()

  const handleScope = (s: 'group' | 'individual') => {
    if (onScopeChange) return onScopeChange(s)
    // default behavior: navigate
    if (s === 'group') router.push('/admin/attendance/group')
    else router.push('/admin/attendance/employee')
  }

  return (
    <nav className="glassy-nav" aria-label="Attendance navigation">
      {/* Scope toggles (optional) */}
      {showScope && (
        <>
          <button
            onClick={() => handleScope('group')}
            className={`glassy-nav__item ${scope === 'group' ? 'glassy-nav__item--active' : ''}`}
            aria-pressed={scope === 'group'}
          >
            Group
          </button>
          <button
            onClick={() => handleScope('individual')}
            className={`glassy-nav__item ${scope === 'individual' ? 'glassy-nav__item--active' : ''}`}
            aria-pressed={scope === 'individual'}
          >
            Individual
          </button>
        </>
      )}

      {/* Spacer when both sections shown */}
      {showScope && showView && <div style={{ width: 12 }} />}

      {/* View toggles (optional) */}
      {showView && (
        <>
          <button
            onClick={() => onViewModeChange('daily')}
            className={`glassy-nav__item ${viewMode === 'daily' ? 'glassy-nav__item--active' : ''}`}
            aria-pressed={viewMode === 'daily'}
          >
            Daily
          </button>
          <button
            onClick={() => onViewModeChange('monthly')}
            className={`glassy-nav__item ${viewMode === 'monthly' ? 'glassy-nav__item--active' : ''}`}
            aria-pressed={viewMode === 'monthly'}
          >
            Monthly
          </button>
        </>
      )}
    </nav>
  )
}

"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  scope?: 'group' | 'individual'
  onScopeChange?: (s: 'group' | 'individual') => void
  viewMode: 'daily' | 'monthly'
  onViewModeChange: (v: 'daily' | 'monthly') => void
}

export default function AttendanceNav({ scope = 'group', onScopeChange, viewMode, onViewModeChange }: Props) {
  const router = useRouter()

  const handleScope = (s: 'group' | 'individual') => {
    if (onScopeChange) return onScopeChange(s)
    // default behavior: navigate
    if (s === 'group') router.push('/admin/attendance/group')
    else router.push('/admin/attendance/employee')
  }

  return (
    <nav className="glassy-nav" aria-label="Attendance navigation">
      {/* Scope toggles */}
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

      {/* Spacer */}
      <div style={{ width: 12 }} />

      {/* View toggles */}
      <button
        onClick={() => onViewModeChange('daily')}
        className={`glassy-nav__item ${viewMode === 'daily' ? 'glassy-nav__item--active' : ''}`}
        aria-pressed={viewMode === 'daily'}
      >
        Daily View
      </button>
      <button
        onClick={() => onViewModeChange('monthly')}
        className={`glassy-nav__item ${viewMode === 'monthly' ? 'glassy-nav__item--active' : ''}`}
        aria-pressed={viewMode === 'monthly'}
      >
        Monthly View
      </button>
    </nav>
  )
}

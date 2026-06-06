import React from 'react'

function Footer() {
  return (
    <footer className="w-full shadow-[0_-1px_6px_rgba(0,0,0,0.08)] bg-[var(--bg-color)] py-4 px-6">
      <p className="text-center text-xs text-[var(--secondary-text)]">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-[var(--primary-text)]">NovaShare</span>. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer

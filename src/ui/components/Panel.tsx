import type { ReactNode } from 'react'

/** Self-contained panel; later these can go into a draggable/resizable grid. */
export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

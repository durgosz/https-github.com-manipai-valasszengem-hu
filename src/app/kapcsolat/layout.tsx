import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kapcsolat – Időpontfoglalás és üzenetküldés',
  description:
    'Vedd fel a kapcsolatot! Foglalj időpontot közvetlenül a naptárból, vagy küldj üzenetet. Az első egyeztetés díjmentes és kötelezettségmentes.',
}

export default function KapcsolatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

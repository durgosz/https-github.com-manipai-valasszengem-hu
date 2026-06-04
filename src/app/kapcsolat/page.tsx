export const revalidate = 60

import { getPageSections } from '@/lib/cms'
import KapcsolatClient from './KapcsolatClient'

export default async function KapcsolatPage() {
  const sections = await getPageSections('contact')
  return (
    <KapcsolatClient
      title={sections.title}
      subtitle={sections.subtitle}
      email={sections.email}
      phone={sections.phone}
    />
  )
}

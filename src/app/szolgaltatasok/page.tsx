export const revalidate = 60

import type { Metadata } from 'next'
import SzolgaltatasokClient from './SzolgaltatasokClient'
import { getPageSections } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Szolgáltatások',
  description:
    'Önismereti és mentálhigiénés szemléletű beszélgetések egyénileg. Biztonságos tér a belső minták, kapcsolatok és elakadások feltárásához.',
}

export default async function SzolgaltatasokPage() {
  const sections = await getPageSections('services')
  return <SzolgaltatasokClient sections={sections} />
}

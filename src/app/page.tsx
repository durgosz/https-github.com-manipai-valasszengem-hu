export const revalidate = 60

import Hero from '@/components/home/Hero'
import AboutPreview from '@/components/home/AboutPreview'
import ServicesPreview from '@/components/home/ServicesPreview'
import Testimonials from '@/components/home/Testimonials'
import FAQSection from '@/components/home/FAQSection'
import CalSection from '@/components/home/CalSection'
import BlogPreview from '@/components/home/BlogPreview'
import ContactCTA from '@/components/home/ContactCTA'
import { getPageSections, getSiteImages, getDesignSettings } from '@/lib/cms'

export default async function HomePage() {
  const [sections, images, design] = await Promise.all([
    getPageSections('home'),
    getSiteImages(),
    getDesignSettings(),
  ])

  return (
    <>
      <Hero
        title={sections.hero_title}
        subtitle={sections.hero_subtitle}
        ctaText={sections.hero_cta || design.cta_text}
        bgImage={images['hero']}
        overlayOpacity={design.hero_overlay}
      />
      <AboutPreview text={sections.about_preview} />
      <ServicesPreview />
      <Testimonials />
      <CalSection />
      <FAQSection />
      <BlogPreview />
      <ContactCTA />
    </>
  )
}

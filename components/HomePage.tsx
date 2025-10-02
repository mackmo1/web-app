import { SearchBar } from './SearchBar'
import { PropertyListings } from './PropertyListings'
import { HeroSection } from './HeroSection'
import Image from 'next/image'

export function HomePage() {
  return (
    <>
      <section className="home-banner">
        <figure className="bannerImage">
          <Image src="/banner.jpg" alt='banner' width={1920} height={600}
            className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] object-cover"
            sizes="100vw" priority />
        </figure>
      </section>
      <div className="homeSearch">
        <SearchBar />
      </div>
      <main className="flex-1">
        <PropertyListings />
        <HeroSection />
      </main>
    </>
  )
}
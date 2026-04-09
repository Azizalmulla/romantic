import fs from "node:fs/promises"
import path from "node:path"
import Image from "next/image"
import {
  ArrowDown,
  Heart,
  Quote,
  Sparkles,
  Star,
} from "lucide-react"
import { Envelope } from "@/components/envelope"

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"])
const BABY_KEYWORDS = ["baby", "child", "kid", "little", "mini", "toddler", "young"]
const TOGETHER_KEYWORDS = ["couple", "date", "love", "together", "us", "we"]
const BABY_FALLBACKS = ["/placeholder.svg", "/placeholder-logo.svg"]
const TOGETHER_FALLBACKS = ["/placeholder-logo.svg", "/placeholder.svg", "/placeholder-logo.svg"]

type PhotoCollections = {
  all: string[]
  baby: string[]
  together: string[]
}

async function collectImagePaths(directory: string, webPrefix = "/images"): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const imagePaths = await Promise.all(
      entries.map(async (entry) => {
        const absolutePath = path.join(directory, entry.name)
        const publicPath = `${webPrefix}/${entry.name}`

        if (entry.isDirectory()) {
          return collectImagePaths(absolutePath, publicPath)
        }

        return IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [publicPath] : []
      }),
    )

    return imagePaths.flat().sort((left, right) => left.localeCompare(right))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return []
    }

    throw error
  }
}

function dedupe(values: string[]) {
  return Array.from(new Set(values))
}

function categorizeImages(images: string[]): PhotoCollections {
  const babyMatches = images.filter((src) => {
    const value = src.toLowerCase()
    return value.includes("/baby/") || BABY_KEYWORDS.some((keyword) => value.includes(keyword))
  })

  const togetherMatches = images.filter((src) => {
    const value = src.toLowerCase()
    return value.includes("/us/") || TOGETHER_KEYWORDS.some((keyword) => value.includes(keyword))
  })

  const uncategorized = images.filter(
    (src) => !babyMatches.includes(src) && !togetherMatches.includes(src),
  )

  let baby = dedupe(babyMatches)
  let together = dedupe(togetherMatches)

  if (!baby.length && uncategorized.length) {
    baby = uncategorized.slice(0, Math.min(3, uncategorized.length))
  }

  if (!together.length) {
    together = uncategorized.filter((src) => !baby.includes(src))
  }

  if (!together.length && baby.length > 1) {
    together = baby.slice(1)
  }

  return {
    all: dedupe(images),
    baby: baby.length ? baby : BABY_FALLBACKS,
    together: together.length ? together : TOGETHER_FALLBACKS,
  }
}

function PhotoCard({
  alt,
  priority = false,
  sizes,
  src,
  className = "",
}: {
  alt: string
  priority?: boolean
  sizes: string
  src: string
  className?: string
}) {
  return (
    <div className={`photo-frame ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  )
}

export default async function Home() {
  const allImages = await collectImagePaths(path.join(process.cwd(), "public", "images"))
  const photos = categorizeImages(allImages)

  const heroPhoto = photos.together[0] ?? photos.all[0] ?? photos.baby[0]
  const heroBabyPhoto =
    photos.baby.find((s) => s.includes("high-chair")) ?? photos.baby[0]
  const babyPhotos = [
    photos.baby.find((s) => s.includes("rocking-chair")),
    photos.baby.find((s) => s.includes("laundry-basket")),
    photos.baby.find((s) => s.includes("newspaper")),
  ].filter(Boolean) as string[]
  const babyExtras = photos.baby.filter(
    (s) => s !== heroBabyPhoto && !babyPhotos.includes(s),
  )
  while (babyPhotos.length < 3 && babyExtras.length) {
    babyPhotos.push(babyExtras.shift()!)
  }
  const allBabyPhotos = [heroBabyPhoto, ...babyPhotos, ...babyExtras].filter(
    (v, i, a) => a.indexOf(v) === i,
  )
  const togetherPhotos = photos.together.slice(0, 4)

  const reasons = [
    {
      title: "Your softness",
      text: "You carry a kind of warmth that makes everything around you feel gentler.",
    },
    {
      title: "Your light",
      text: "You make ordinary moments feel like they deserve to be remembered forever.",
    },
    {
      title: "Your heart",
      text: "The way you love, care, and laugh makes being close to you feel like home.",
    },
  ]

  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 romantic-grid opacity-30" />
      <div className="pointer-events-none romantic-orb romantic-orb-one" />
      <div className="pointer-events-none romantic-orb romantic-orb-two" />
      <div className="pointer-events-none romantic-orb romantic-orb-three" />

      <section className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-5 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-8 lg:px-12">
        <header className="mb-8 flex items-center justify-between sm:mb-14">
          <div className="romantic-pill">
            <Heart className="h-3.5 w-3.5" fill="currentColor" />
            <span>for rawan</span>
          </div>

          <nav className="hidden items-center gap-3 text-sm text-rose-100/75 md:flex">
            <a href="#little-her" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">
              little her
            </a>
            <a href="#our-story" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">
              our story
            </a>
            <a href="#love-note" className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white">
              love note
            </a>
          </nav>

          <a href="#little-her" className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-rose-100/75 md:hidden">
            <ArrowDown className="h-3 w-3" />
            explore
          </a>
        </header>

        <div className="grid flex-1 items-center gap-10 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2.5 text-xs uppercase tracking-[0.35em] text-rose-200/70 sm:mb-5 sm:gap-3 sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              a little world made for you
            </div>

            <h1 className="font-display text-[2.5rem] leading-[0.95] text-white sm:text-6xl lg:text-8xl">
              every version of you
              <span className="block text-rose-200">has been beautiful</span>
            </h1>

            <p className="mt-5 max-w-xl text-[0.94rem] leading-7 text-rose-50/78 sm:mt-6 sm:text-lg sm:leading-8">
              Before there was us, there was a little girl named Rawan growing into someone
              bright, gentle, unforgettable, and now somehow I get to love the woman she became.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <a href="#little-her" className="romantic-button text-sm sm:text-base">
                start the story
              </a>
              <a href="#love-note" className="romantic-button romantic-button-muted text-sm sm:text-base">
                skip to my note
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
              <div className="romantic-card p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">
                  little her
                </p>
                <p className="mt-2 text-sm leading-7 text-rose-50/75 sm:mt-3">
                  A sweet beginning made from baby Rawany before I ever knew her.
                </p>
              </div>
              <div className="romantic-card p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70">
                  us now
                </p>
                <p className="mt-2 text-sm leading-7 text-rose-50/75 sm:mt-3">
                  The part of the story where my favorite memories finally include both of us.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-40 w-40 rounded-full bg-rose-400/20 blur-3xl sm:block" />
            <div className="absolute -right-4 bottom-10 hidden h-48 w-48 rounded-full bg-fuchsia-300/20 blur-3xl sm:block" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[0.78fr_1fr] sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4 sm:pt-16">
                <PhotoCard
                  src={heroBabyPhoto}
                  alt="Baby Rawan"
                  sizes="(min-width: 1024px) 18vw, 42vw"
                  className="aspect-[3/4] sm:aspect-[4/5]"
                />
                <div className="romantic-card flex items-center gap-2 p-3 text-xs text-rose-50/80 sm:gap-3 sm:p-4 sm:text-sm">
                  <Star className="h-3.5 w-3.5 shrink-0 text-rose-200 sm:h-4 sm:w-4" fill="currentColor" />
                  from little moments to forever feelings
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <PhotoCard
                  src={heroPhoto}
                  alt="Us together"
                  priority
                  sizes="(min-width: 1024px) 28vw, 50vw"
                  className="aspect-[3/4] sm:aspect-[5/6]"
                />
                <div className="romantic-card p-3 sm:p-5">
                  <Quote className="h-4 w-4 text-rose-200 sm:h-5 sm:w-5" />
                  <p className="mt-2 text-sm leading-7 text-rose-50/82 sm:mt-3 sm:text-base sm:leading-8">
                    Baby tiger, you are the kind of person who makes love feel soft, safe, and
                    worth writing about.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-rose-200/60 sm:mt-12">
          scroll to continue
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      <section id="little-her" className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <p className="text-xs uppercase tracking-[0.38em] text-rose-200/70 sm:text-sm">baby rawany</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:mt-4 sm:text-5xl">
            the beginning of someone extraordinary
          </h2>
          <p className="mt-4 text-[0.94rem] leading-7 text-rose-50/78 sm:mt-5 sm:text-base sm:leading-8">
            There is something so tender about seeing the earliest version of Rawan.
            These photos feel like tiny windows into the sweetness she carried long before I
            ever knew my baby tiger.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {allBabyPhotos.map((src, index) => (
            <PhotoCard
              key={src}
              src={src}
              alt={`Baby Rawan ${index + 1}`}
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 46vw"
              className={
                index === 0
                  ? "aspect-[3/4] col-span-2 sm:aspect-[4/5] lg:col-span-1 lg:row-span-2 lg:aspect-auto lg:h-full"
                  : "aspect-[3/4] sm:aspect-[4/5]"
              }
            />
          ))}
        </div>
      </section>

      <section id="our-story" className="relative mx-auto w-full max-w-6xl px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-16">
            <p className="text-xs uppercase tracking-[0.38em] text-rose-200/70 sm:text-sm">our story</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:mt-4 sm:text-5xl">
              and then life became even more beautiful
            </h2>
            <p className="mt-4 text-[0.94rem] leading-7 text-rose-50/78 sm:mt-5 sm:text-base sm:leading-8">
              Somewhere between ordinary days and unforgettable ones, Rawan became my favorite
              part of both. Every photo with my baby tiger feels less like a picture and more
              like a place I would gladly live in forever.
            </p>

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {reasons.map((reason) => (
                <div key={reason.title} className="romantic-card p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-200/70 sm:text-sm">
                    {reason.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-rose-50/76 sm:mt-3">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {togetherPhotos.map((src, index) => (
              <PhotoCard
                key={`${src}-${index}`}
                src={src}
                alt={`A memory of us ${index + 1}`}
                sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 46vw"
                className={index === 0 ? "aspect-[3/4] col-span-2 sm:aspect-[16/9]" : "aspect-[3/4] sm:aspect-[4/5]"}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="love-note" className="relative mx-auto w-full max-w-5xl px-5 py-12 sm:px-10 sm:py-16 lg:px-12">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mx-auto mb-4 flex w-fit items-center gap-2.5 text-xs uppercase tracking-[0.35em] text-rose-200/70 sm:gap-3 sm:text-sm">
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" />
            a note for you, rawany
          </div>
          <h2 className="font-display text-3xl text-white sm:text-5xl">
            I wrote you something
          </h2>
        </div>

        <Envelope>
          <div className="space-y-4 text-[0.82rem] leading-6 text-rose-50/82 sm:space-y-5 sm:text-sm sm:leading-7">
            <p className="font-display text-lg text-rose-200 sm:text-xl">
              My baby rawany,
            </p>
            <p>
              Loving you feels like finding softness in a loud world. It feels like
              warmth, patience, comfort, and the kind of happiness that sneaks up on me
              in the simplest moments with you.
            </p>
            <p>
              I love the person you are, the person you have always been, and the person
              you are still becoming. Every version of Rawan deserves to be adored, and I
              hope you always feel how deeply you are.
            </p>
            <p>
              If this page could do one thing, I hope it reminds you that you are
              cherished more than words can neatly explain. And if it could do a second
              thing, baby tiger, I hope it makes you smile the way you make me smile all
              the time.
            </p>
            <p className="font-display text-base text-rose-200 sm:text-lg">
              Forever yours
            </p>
          </div>
        </Envelope>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-5 pb-20 pt-6 text-center sm:px-10 sm:pb-24 sm:pt-8 lg:px-12">
        <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-rose-100/75 backdrop-blur-md sm:mb-6 sm:px-5 sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-rose-200 sm:h-4 sm:w-4" />
          made with so much love
        </div>

        <h2 className="font-display text-3xl text-white sm:text-6xl">
          some people are beautiful in photos.
          <span className="block text-rose-200">you are beautiful in every era, Rawan.</span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-[0.94rem] leading-7 text-rose-50/72 sm:mt-6 sm:text-lg sm:leading-8">
          Thank you for being someone worth celebrating in little details, big feelings, and every
          memory in between. I love you, baby rawany.
        </p>
      </section>
    </main>
  )
}

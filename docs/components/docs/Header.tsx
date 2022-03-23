import { useRouter } from 'next/router'

const TITLE_WITH_TRANSLATIONS: Record<string, string> = {
  'en-US': 'React Hooks for Ethereum',
}

export const Header = () => {
  const { locale, defaultLocale = 'en-US' } = useRouter()
  const resolvedLocale = locale || defaultLocale
  const title = TITLE_WITH_TRANSLATIONS[resolvedLocale]

  return (
    <header className="mb-10">
      <h1 className="text-center font-extrabold md:text-5xl mt-8">wagmi</h1>

      <p className="text-center text-lg mb-6 text-gray-500 md:!text-2xl">
        {title}
      </p>

      <div className="flex gap-4 justify-center">
        <a aria-label="Stars" href="https://github.com/tmm/wagmi">
          <img
            alt=""
            src="https://img.shields.io/github/stars/tmm/wagmi?colorA=292929&colorB=3c82f6"
          />
        </a>
        <a aria-label="Downloads" href="https://www.npmjs.com/package/wagmi">
          <img
            alt=""
            src="https://img.shields.io/npm/dm/wagmi?colorA=292929&colorB=3c82f6"
          />
        </a>
        <a aria-label="Sponsors" href="https://github.com/sponsors/tmm">
          <img
            alt=""
            src="https://img.shields.io/github/sponsors/tmm?colorA=292929&colorB=3c82f6"
          />
        </a>
      </div>
    </header>
  )
}

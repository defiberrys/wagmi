import { useRouter } from 'next/router'

const github = 'https://github.com/tmm/wagmi'

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'React Hooks for Ethereum',
}

const FEEDBACK_LINK_WITH_TRANSLATIONS = {
  'en-US': 'Question? Give us feedback →',
}

export default {
  docsRepositoryBase: `${github}/tree/main/docs/pages`,
  feedbackLabels: 'feedback',
  feedbackLink: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter()
    return FEEDBACK_LINK_WITH_TRANSLATIONS[locale || 'en-US']
  },
  floatTOC: true,
  footerEditLink: `Edit this page on GitHub`,
  footerText: () => (
    <div className="text-current">
      MIT ${new Date().getFullYear()} © awkweb.eth
    </div>
  ),
  github,
  head: ({ title, meta }) => {
    return (
      <>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={meta.description || 'React Hooks for Ethereum.'}
        />
        <meta
          name="og:description"
          content={meta.description || 'React Hooks for Ethereum.'}
        />
        <meta
          name="og:title"
          content={
            title ? title + ' – wagmi' : 'wagmi: React Hooks for Ethereum'
          }
        />
      </>
    )
  },
  i18n: [{ locale: 'en-US', text: 'English' }],
  logo: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useRouter()
    return (
      <>
        <span className="mr-2 font-extrabold">wagmi</span>
        <span className="text-gray-600 font-normal hidden md:inline">
          {TITLE_WITH_TRANSLATIONS[locale || 'en-US']}
        </span>
      </>
    )
  },
  nextLinks: true,
  nextThemes: {
    defaultTheme: 'dark',
  },
  prevLinks: true,
  projectLink: github,
  search: true,
  titleSuffix: ' – wagmi',
  unstable_flexsearch: true,
}

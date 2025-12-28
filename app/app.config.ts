export default defineAppConfig({
  global: {
    meetingLink: 'https://cal.com/ivfomini/15min',
    available: true,
  },
  profile: {
    name: 'Igor Fomin',
    job: 'Fullstack Web Developer',
    email: 'contact@test.com',
    phone: '(+11) 111 11 11',
    picture: 'https://avatars.githubusercontent.com/u/6150406?v=4',
  },
  socials: {
    github: 'https://github.com/ikknd',
    twitter: 'https://twitter.com/ivfomini',
    linkedin: 'https://www.linkedin.com/in/ivfomini',
    // instagram: 'https://www.instagram.com/',
  },
  seo: {
    title: 'My Dev Journey | Igor Fomin',
    description: 'A personal blog where I share my experiences with web development',
    url: 'https://canvas.hrcd.fr', //TODO: change to my site
  },
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'neutral',
    },
    notifications: {
      position: 'top-0 bottom-auto',
    },
    notification: {
      progress: {
        base: 'absolute bottom-0 end-0 start-0 h-0',
        background: 'bg-transparent dark:bg-transparent',
      },
    },
    button: {
      slots: {
        base: 'cursor-pointer',
      },
      defaultVariants: {
        color: 'neutral',
      },
    },
    input: {
      defaultVariants: {
        color: 'neutral',
      },
    },
    textarea: {
      defaultVariants: {
        color: 'neutral',
      },
    },
    icons: {
      loading: 'lucide:loader',
    },
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
})
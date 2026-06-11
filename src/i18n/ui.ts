export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export const defaultLang = 'en' as const;
export type Lang = keyof typeof languages;

export const ui = {
  en: {
    'site.name': 'MakeBusinessShine',
    'site.tagline': 'Tested. Bilingual. Affordable.',

    'nav.home': 'Home',
    'nav.packages': 'Packages',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    'cta.start': 'Start a project',
    'cta.viewPackages': 'See packages',

    'lang.switchTo': '中文',
    'lang.switchAria': 'Switch language to Chinese',

    'footer.tagline': 'This site scores 100/100/100/100 on Lighthouse — yours can too.',
    'footer.contact': 'Contact',
    'footer.github': 'GitHub',
    'footer.rights': '© {year} MakeBusinessShine — Wellington, NZ',
  },
  zh: {
    'site.name': 'MakeBusinessShine',
    'site.tagline': '经过测试。双语交付。价格透明。',

    'nav.home': '首页',
    'nav.packages': '套餐',
    'nav.work': '案例',
    'nav.about': '关于',
    'nav.contact': '联系',

    'cta.start': '开始合作',
    'cta.viewPackages': '查看套餐',

    'lang.switchTo': 'EN',
    'lang.switchAria': '切换到英文',

    'footer.tagline': '本站 Lighthouse 四项满分 — 你的站也能做到。',
    'footer.contact': '联系',
    'footer.github': 'GitHub',
    'footer.rights': '© {year} MakeBusinessShine — Wellington, NZ',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang === 'zh') return 'zh';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function pathWithoutLocale(pathname: string): string {
  if (pathname === '/zh' || pathname === '/zh/') return '/';
  if (pathname.startsWith('/zh/')) return pathname.slice(3);
  return pathname;
}

export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return clean;
  if (clean === '/') return '/zh/';
  return `/zh${clean}`;
}

export function switchLanguageUrl(pathname: string, target: Lang): string {
  return localizedPath(pathWithoutLocale(pathname), target);
}

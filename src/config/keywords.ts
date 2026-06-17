export const SEARCH_QUERIES: Record<'frontend' | 'qa', string[]> = {
  frontend: [
    'frontend react',
    'frontend vue',
    'react developer',
    'vue developer',
    'react разработчик',
    'vue разработчик',
    'фронтенд разработчик',
    'frontend junior',
    'junior frontend',
  ],
  qa: [
    'manual qa',
    'ручное тестирование',
    'qa engineer',
    'тестировщик',
    'junior qa',
    'junior tester',
    'qa manual',
  ],
}

export const REQUIRED_KEYWORDS: string[] = [
  'вакансия', 'ищем', 'нужен', 'требуется', 'hiring', 'открыта позиция',
  'оффер', 'джун', 'junior', 'middle', 'рекрутер', 'recruiter',
]

export const STOP_KEYWORDS: string[] = [
  'ищу работу', 'резюме', 'cv', 'портфолио', 'looking for job', 'open to work', 'ищу проект',
]

export const HH_REGIONS: number[] = [113]

export const MAX_AGE_DAYS: number = 3

export const TG_CHANNELS: string[] = [
  'https://t.me/s/tproger_jobs',
  'https://t.me/s/it_rabota',
  'https://t.me/s/frontend_jobs',
  'https://t.me/s/qa_jobs_ru',
  'https://t.me/s/js_jobs',
  'https://t.me/s/react_jobs_ru',
]

export const TGSTAT_SEARCH_URL: string = 'https://tgstat.ru/posts/search'

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => ({
  messages: {
    en: (await import('../messages/en.json')).default,
    zh: (await import('../messages/zh.json')).default,
  },
  timeZone: 'Asia/Shanghai',
  now: new Date()
})); 
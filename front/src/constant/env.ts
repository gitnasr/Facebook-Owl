export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;
export const ItemUrl =
  'https://chromewebstore.google.com/detail/fgchfmiohmpnocjnggljelbggfjhjhkl';
export const GuideVideo = 'https://youtu.be/9KnB5QccVSg';

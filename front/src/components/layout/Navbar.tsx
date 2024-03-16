import classNames from 'classnames';
import Link from 'next/link';

import NextImage from '@/components/NextImage';

export const Navbar = ({ dark = false }) => {
  return (
    <Link
      href='/'
      className={classNames('mx-auto flex justify-center py-4', {
        'bg-slate-900': dark,
      })}
    >
      <NextImage
        src='/images/logo.png'
        alt='Facebook Owl'
        width={64}
        height={64}
        className='mx-auto cursor-pointer rounded-full'
      />
    </Link>
  );
};

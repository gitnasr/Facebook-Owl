import NextImage from '@/components/NextImage';

export const Footer = () => {
  return (
    <div className='border-t-1  flex w-full flex-col items-center justify-center border bg-transparent pb-2 pt-4'>
      <a href='https://gitnasr.com' target='_blank'>
        <NextImage
          src='/images/gitnasr.png'
          alt='Gitnasr Logo'
          width={32}
          height={32}
          className=' m-auto cursor-pointer rounded-full ring-2 ring-gray-500'
        />
      </a>
    </div>
  );
};

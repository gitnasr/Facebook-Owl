import { Bitcoin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import NextImage from '@/components/NextImage';
import { RiPaypalFill } from 'react-icons/ri';
import Seo from '@/components/Seo';

const Support = () => {
  return (
    <Layout>
      <Seo title='Support' />
      <main className=' flex min-h-screen flex-col bg-yellow-50 text-center'>
        <Navbar />
        <div className='m-auto'>
          <h1 className='text-6xl font-bold text-slate-900'>Thank You</h1>
          <p className='mt-3 text-2xl text-slate-500'>
            We appreciate your interest in supporting our project
          </p>

          <div className='mb-4 flex flex-row justify-center gap-2'>
            <a
              className='mt-8 flex w-fit flex-row rounded-xl bg-white p-4 shadow-md ring-1'
              target='_blank'
              rel='noopener noreferrer'
              href='https://paypal.me/c7nasr'
            >
              <RiPaypalFill className=' h-8 w-8 text-blue-500' />
            </a>

            <a
              target='_blank'
              rel='noopener noreferrer'
              href='/images/BinancePayQR.png'
              className='mt-8 flex w-fit flex-row rounded-xl bg-white p-4 shadow-md ring-1'
            >
              <Bitcoin className=' h-8 w-8 text-amber-600' />
            </a>

            <div className='mt-8 flex w-fit flex-row items-center gap-x-2 rounded-xl bg-white p-4 shadow-md ring-1'>
              <NextImage
                src='/images/ipay.png'
                alt='InstaPay'
                width={32}
                height={32}
              />
              <h4 className='text-violet-600'>m9nasr</h4>
            </div>
          </div>
          <p>
            Or you can reach me out on{' '}
            <a
              href='mailto:gitnasr@proton.me'
              className='underline decoration-indigo-500'
            >
              gitnasr@proton.me
            </a>
          </p>
        </div>
      </main>
    </Layout>
  );
};

export default Support;

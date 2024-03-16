import { Bitcoin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
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

          <div className='flex flex-row gap-2'>
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
              href='https://paypal.me/c7nasr'
              className='mt-8 flex w-fit flex-row rounded-xl bg-white p-4 shadow-md ring-1'
            >
              <Bitcoin className=' h-8 w-8 text-amber-600' />
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Support;

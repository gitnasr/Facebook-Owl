import { RiChromeFill, RiGuideFill } from 'react-icons/ri';

import FaqSection from '@/components/Faq';
import { Features } from '@/components/Features';
import { Footer } from '@/components/layout/Footer';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import Pricing from '@/components/Pricing';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='' />

      <main className='flex min-h-screen flex-col bg-yellow-50'>
        <section className=' flex flex-col p-2 '>
          <Navbar />
          <div className='container mx-auto  text-center md:p-12'>
            <h1 className=' bg-gradient-to-r from-amber-600 to-violet-600 bg-clip-text  text-center text-5xl font-bold text-transparent md:text-8xl'>
              Facebook Owl
            </h1>
            <h4 className=' mx-auto mt-4 flex flex-col px-4 text-center text-gray-500 md:max-w-4xl md:text-xl '>
              Facebook Owl Chrome Extension is a tool that helps you to track
              your Facebook Friends List, Sync & Analyze your Facebook Friends,
              and much more.
            </h4>
          </div>
          <div className='mx-auto mt-4 flex flex-col gap-4 md:mt-0 md:flex-row'>
            <div className='flex  flex-col'>
              <button className='    items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-violet-600 px-4 py-2 font-medium text-black shadow-lg ring-1 hover:bg-gray-100 hover:shadow-sm hover:ring-0 '>
                <div className='m-auto flex flex-row items-center justify-center gap-2'>
                  <RiChromeFill className='inline-block h-6 w-6 text-amber-50 ' />
                  <h4 className=' text-white'>Add it to Chrome, It's Free!</h4>
                </div>
              </button>
              <small className='mt-2 hidden text-center text-xs text-slate-600 sm:inline-block'>
                V1.0.0
              </small>
            </div>
            <button className='h-fit rounded-xl bg-orange-700 px-4  py-2  text-white hover:bg-orange-600'>
              <Link
                href='/how-to-use'
                className='m-auto flex flex-row items-center justify-center gap-2'
              >
                <RiGuideFill className='inline-block h-6 w-6 text-amber-50' />
                <h4 className='text-center'>How To Use?</h4>
              </Link>
            </button>
          </div>
        </section>
        <Pricing />
        <Features />
        <FaqSection />
        <Footer />
      </main>
    </Layout>
  );
}

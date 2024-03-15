import { ChromeIcon } from 'lucide-react';
import Link from 'next/link';

import FaqSection from '@/components/Faq';
import { Features } from '@/components/Features';
import { Footer } from '@/components/layout/Footer';
import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import Pricing from '@/components/Pricing';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='Home' />

      <main className='flex min-h-screen flex-col bg-yellow-50'>
        <section className=' flex flex-col p-2 '>
          <Navbar />
          <div className='container mx-auto p-8 text-center md:p-12'>
            <h1 className=' bg-gradient-to-r from-amber-600 to-violet-600 bg-clip-text  text-center text-6xl font-bold text-transparent md:text-8xl'>
              Facebook Owl
            </h1>
            <h4 className=' mx-auto mt-4 flex max-w-xl flex-col px-4 text-center text-gray-600 '>
              Facebook Owl Chrome Extension is a tool that helps you to track
              your Facebook Friends List, Sync & Analyze your Facebook Friends,
              and much more.
            </h4>
          </div>
          <div className='mx-auto flex flex-col items-start gap-4 md:flex-row '>
            <div className='flex flex-1 flex-col'>
              <button className=' flex w-full flex-1 gap-2 rounded-xl border border-gray-300 bg-gray-200 px-4 py-2 font-medium text-black hover:bg-gray-100 '>
                <ChromeIcon className='inline-block h-6 w-6 text-amber-600 ' />
                <h6>Add it to Chrome, It's Free!</h6>
              </button>
              <small className='hidden text-center text-slate-400 sm:inline-block'>
                V1.0.0
              </small>
            </div>
            <Link
              href='/how-to-use'
              className=' rounded-xl bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-900'
            >
              How To Use?
            </Link>
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

import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import Seo from '@/components/Seo';

const HowToUse = () => {
  return (
    <Layout>
      <Seo templateTitle='How to Use' />
      <main className='flex min-h-screen flex-col bg-yellow-50'>
        <section className=' flex flex-col p-2 '>
          <Navbar />
          <div className='container  p-8 text-center md:p-12'>
            <h3 className='text-black'>
              1. Get Extension from Chrome Web Store
            </h3>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HowToUse;

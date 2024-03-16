import Link from 'next/link';

export default function Pricing() {
  return (
    <div className=' py-4'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl sm:text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            It's Free, But you can support us
          </h2>
          <p className='my-2 font-semibold text-gray-500'>
            Facebook Owl is Running on a Free Servers, and we are not charging
            you. But you can support us by being a contributor.
          </p>
        </div>
        <div className='mx-auto  mt-4 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0'>
          <div className='  rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16'>
            <div className='mx-auto max-w-xs px-8'>
              <p className='text-base font-semibold text-gray-600'>
                Contributor Membership
              </p>
              <p className='mt-6 flex items-baseline justify-center gap-x-2'>
                <span className='text-5xl font-bold tracking-tight text-gray-900'>
                  $5
                </span>
                <span className='text-sm font-semibold leading-6 tracking-wide text-gray-600'>
                  USD
                </span>
              </p>
              <Link
                href='/support'
                className='mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Get access
              </Link>
              <p className='mt-6 text-xs leading-5 text-gray-600'>
                Being a contributor, you will help us to maintain the servers
                and to keep the project alive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

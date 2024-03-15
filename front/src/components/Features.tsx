import { FolderSync, History, Lock, Users } from 'lucide-react';

export const Features = () => {
  return (
    <div className='mx-auto max-w-7xl p-6 lg:px-8'>
      <div className='mx-auto max-w-2xl sm:text-center'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Why We're The Best?
        </h2>
        <p className='my-2 font-semibold text-gray-500'>
          Despite facing competition, we stand out as the premier choice for
          several compelling reasons.
        </p>
      </div>

      <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 '>
        <Feature
          Icon={FolderSync}
          title='AutoSync'
          description='We employ advanced algorithms to automatically sync your friends list and handle the process in the background.'
        />

        <Feature
          Icon={Lock}
          title='Secured'
          description='We do not keep your information. Everything happens on your device. If you share anything, it is kept private with e2e encryption.'
        />

        <Feature
          Icon={Users}
          title='Multi-Account'
          description='We automatically capture any logged-in account and sync your friends list. You can effortlessly switch between accounts and sync them all.'
        />

        <Feature
          Icon={History}
          title='History'
          description='We keep a history of your friends list, so you can track changes and see who unfriended you. We also provide a detailed history of your friends list.'
        />
      </div>
    </div>
  );
};

const Feature = ({ title, description, Icon }) => {
  return (
    <div className='flex max-w-md cursor-pointer flex-col rounded-xl bg-white p-5 shadow-md ring-1 hover:shadow-2xl'>
      <Icon className='inline-block h-6 w-6 text-slate-800 ' />
      <div className='flex flex-col'>
        <h3 className='text-black'>{title}</h3>
        <p className='text-teal-800'>{description}</p>
      </div>
    </div>
  );
};

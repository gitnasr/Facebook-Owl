import { GridLoader } from 'react-spinners';

export const Processing = () => {
  return (
    <div className='m-auto flex flex-col items-center justify-center gap-4 '>
      <GridLoader color='#36d7b7' />
      <h1 className='text-2xl font-bold text-white'>Processing...</h1>
      <p className='max-w-md text-center'>
        We're currently handling your friend list, and it may take some time,
        especially if your friend list is extensive. Please feel free to sit
        back and relax while we work on it.
      </p>
    </div>
  );
};

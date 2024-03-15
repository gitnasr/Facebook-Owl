import { IStatsProps } from '@types';

const Stats = ({ changes, pervious, count }: IStatsProps) => {
  return (
    <div className='my-2 flex flex-row justify-center gap-5'>
      <div className=' h-18 flex w-full flex-row items-center justify-around rounded-md bg-gray-950 text-white shadow-lg'>
        <div className='flex flex-col  p-3 '>
          <h1 className='text-center text-gray-100'>{count}</h1>
          <h6 className='font-bold text-gray-300 '>Total Friends</h6>
        </div>
      </div>
      <div className=' h-18 flex w-full flex-row items-center justify-around rounded-md bg-gray-950 text-white shadow-lg'>
        <div className='flex flex-col  p-3 '>
          <h1 className='text-center text-gray-100'>{changes}</h1>
          <h6 className='font-bold  text-gray-200'>Changes</h6>
        </div>
      </div>
      <div className='h-18 flex w-full flex-row items-center justify-around rounded-md bg-gray-950  shadow-lg'>
        <div className='flex flex-col  p-3 '>
          <h1 className='text-center text-white'>{pervious}</h1>
          <h6 className='font-bold text-gray-300 '>Previous Lists</h6>
        </div>
      </div>
    </div>
  );
};

export default Stats;

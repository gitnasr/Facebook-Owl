import { IAccountProps, IAccountsResponse } from '@types';
import { useRef, useState } from 'react';

import NextImage from '@/components/NextImage';
import { SwitchView } from '@/components/Switch';
import api from '@api';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export const AccountList = ({ owner }: IAccountProps) => {
  const router = useRouter();
  const token = router.query.token as string;
  const [accounts, setAccounts] = useState<IAccountsResponse[]>([]);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [LoadingAccounts, setLoadingAccounts] = useState(false);
  const Switch = async () => {
    try {
      setLoadingAccounts(true);
      if (owner.oId) {
        const data = await api.getAccountsList(token, owner.oId);
        if (data.length === 0) {
          return toast.error('No Other Account Found');
        }
        setAccounts(data);
        modalRef?.current?.showModal();
        setLoadingAccounts(false);
      }
    } catch (error) {
      router.replace('/');
      toast.error('Token Expired, Redirecting to Home Page');
    }
  };

  return (
    <>
      <div className='m-auto mt-8 flex w-fit flex-row items-center justify-between rounded-xl bg-slate-800 p-5 shadow-md md:flex-col '>
        <SwitchView
          refer={modalRef}
          accounts={accounts}
          browserId={owner.browserId || ''}
          update={async (p) => {
            await router.replace(p);
            router.reload();
          }}
        />

        <small className='mb-2 text-center text-xs font-medium uppercase leading-3 '>
          Currently Logged Account
        </small>
        <div className='flex flex-col md:flex-row'>
          <div className=' flex flex-col items-center gap-5 md:flex-row'>
            <div className='h-12 w-12'>
              <NextImage
                width={32}
                height={32}
                className='h-full w-full rounded-full object-cover object-center ring-2 ring-blue-600'
                src={
                  owner.profilePic ||
                  `https://ui-avatars.com/api/?name=${owner.accountName}`
                }
                alt='Profile Picture'
              />
            </div>
            <div className='flex flex-col'>
              <h4 className='text-slate-50'>{owner.accountName}</h4>
              <span
                data-tip={moment(owner.updatedAt).format('lll')}
                className='tooltip tooltip-bottom text-left  text-xs font-medium text-gray-400'
              >
                Last Edit {moment(owner.updatedAt).fromNow()}
              </span>
            </div>
          </div>
          <div className='mx-5 hidden h-12 min-h-[1em] w-px self-stretch bg-slate-600 opacity-20 md:block'></div>
          <div>
            <button
              disabled={LoadingAccounts}
              onClick={() => Switch()}
              className='mt-1 rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:bg-indigo-900'
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

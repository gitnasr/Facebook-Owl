import api from '@api';
import { ISwitchViewProps } from '@types';
import moment from 'moment';
import { Modal } from 'react-daisyui';

import NextImage from '@/components/NextImage';

export const SwitchView = ({
  accounts,
  refer,
  browserId,
  update,
}: ISwitchViewProps) => {
  const Switch = async (ownerId: string) => {
    const data = await api.switchAccount(ownerId, browserId);
    update(data);
    refer.current?.close();
  };
  return (
    <Modal ref={refer} backdrop className='m-auto flex  flex-col'>
      <Modal.Header className='font-bold'>Your Accounts</Modal.Header>
      <Modal.Body className=' my-2 flex flex-col justify-center'>
        {accounts.map((account) => (
          <div
            key={account._id}
            className='flex h-full flex-row items-center justify-between gap-4'
          >
            <div className='flex flex-row items-center gap-4'>
              <div className='h-12 w-12'>
                <NextImage
                  width={32}
                  height={32}
                  className='h-full w-full rounded-full object-cover object-center ring-2 ring-blue-600'
                  src={
                    account.profilePic ||
                    `https://ui-avatars.com/api/?name=${account.accountName}`
                  }
                  alt='Profile Picture'
                />
              </div>
              <div className='flex flex-col'>
                <h4 className='text-slate-50'>{account.accountName}</h4>
                <span
                  data-tip={moment(account.updatedAt).format('lll')}
                  className='tooltip tooltip-bottom text-left  text-xs font-medium text-gray-400'
                >
                  Last Edit {moment(account.updatedAt).fromNow()}
                </span>
              </div>
            </div>
            <button
              onClick={() => Switch(account.oId)}
              className='mt-1 rounded-xl bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-800 disabled:bg-amber-900'
            >
              Switch
            </button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

import api from '@api';
import { IHistoryDropdownProps } from '@types';
import moment from 'moment';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const HistoryDropdown = ({
  update,
  options,
  listId,
}: IHistoryDropdownProps) => {
  const router = useRouter();
  const token = router.query.token as string;
  const fetchHistory = async (id: string) => {
    try {
      const data = await api.getHistoryByListId(token, id);
      update(data);
    } catch (error) {
      toast.error('Token Expired, Redirecting to Home Page');
      router.replace('/');
    }
  };

  return (
    <select
      className='max-w-fit rounded-2xl border-gray-600 bg-gray-900'
      onChange={(event) => fetchHistory(event.target.value)}
      defaultValue={listId}
    >
      {options.map((item) => (
        <option
          className='text-lg text-gray-50 active:text-gray-900'
          key={item.lId}
          value={item.lId}
        >
          Your Friend List @ {moment(item.createdAt).format('lll')} with{' '}
          {item.changes} change(s)
        </option>
      ))}
    </select>
  );
};

import api from '@api';
import { IHistoryProps } from '@types';
import { useState } from 'react';

import { AccountList } from '@/components/Account';
import { HistoryDropdown } from '@/components/HistoryDropdown';
import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import { Processing } from '@/components/Processing';
import Seo from '@/components/Seo';
import Stats from '@/components/Stats';
import Table from '@/components/Table';

const History = (props: IHistoryProps) => {
  const [userHistory, setUserHistory] = useState(props.data);
  console.log('🚀 ~ History ~ userHistory:', userHistory);

  return (
    <Layout>
      <Seo templateTitle='History' />
      <Navbar dark={true} />

      <main className='flex min-h-screen flex-col items-center justify-center bg-gray-900'>
        <section className='container flex flex-col justify-center'>
          {userHistory.isProcessing ? (
            <Processing />
          ) : userHistory.history.list ? (
            <div className='mx-auto w-fit'>
              <Stats
                changes={userHistory.history.changes}
                pervious={userHistory.history.previous}
                count={userHistory.history.list.friends.length}
              />
              {userHistory.history.list.friends.length > 0 && (
                <Table data={userHistory.history.list.friends} />
              )}
              <HistoryDropdown
                listId={userHistory.history.list.lId}
                update={setUserHistory}
                options={userHistory.history.options}
              />
              <AccountList owner={userHistory.owner} />
            </div>
          ) : (
            <div>No Data</div>
          )}
          <small className='mt-4 text-center text-amber-600'>
            Warning! This Link is Classified Don't Share it with your friends,
            it will automatically expire.
          </small>
        </section>
      </main>
    </Layout>
  );
};
export const getServerSideProps = async (context) => {
  try {
    if (!context.query.token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    const token: string = context.query.token;
    const data = await api.getHistory(token);
    if (!data) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
    return {
      props: {
        data: data,
        token: context.query.token,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default History;

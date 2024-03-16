import { AccountList } from '@/components/Account';
import { HistoryDropdown } from '@/components/HistoryDropdown';
import { IHistoryProps } from '@types';
import Layout from '@/components/layout/Layout';
import { Navbar } from '@/components/layout/Navbar';
import { Processing } from '@/components/Processing';
import Seo from '@/components/Seo';
import Stats from '@/components/Stats';
import Table from '@/components/Table';
import api from '@api';
import { useState } from 'react';

const History = (props: IHistoryProps) => {
  const [userHistory, setUserHistory] = useState(props.data);

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
            <div className='mx-auto flex w-fit flex-col text-center'>
              <h1 className='animate-pulse text-white'>No Data Found</h1>
              <p className='max-w-lg'>
                It's look like you're not synced to our servers, Your friend
                list will automatically sync in a while or you can click on the
                sync button in the extension.
              </p>
            </div>
          )}
          <small className='text-warning mt-4 text-center'>
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

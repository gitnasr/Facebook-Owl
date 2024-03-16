import { RiQuestionAnswerFill } from 'react-icons/ri';

import { Faq } from '@/types';

const Faqs: Faq = [
  {
    title: 'What is Facebook Owl? 🦉',
    description:
      'Facebook Owl is a Chrome Extension that automatically syncs and analyzes your friend list, notifying you whenever there are any changes.',
  },
  {
    title: 'How does it work? 🤖',
    description:
      'After installing the extension and logging in to Facebook, Facebook Owl will automatically scan your friend list, sync it, and periodically check for any changes, notifying you accordingly.',
  },
  {
    title: 'Why is my friend list not updating?',
    description:
      'We only upload a new copy of your friends when changes in your friend list are detected (e.g., new friend, removed friend, deactivated account). If none of these changes occur, no updates will take place.',
  },
  {
    title: 'Does Facebook Owl servers store any credentials? 🔐',
    description:
      "Facebook Owl doesn't store or ask for any credentials at all. All operations are performed locally on your machine. Our servers only store a copy of your friend list to be accessible when you need access to your history.",
  },
  {
    title: 'What does the Switch Account button do?',
    description:
      'The Switch Account function allows you to access multiple Facebook accounts with ease. If you have multiple Facebook accounts, you can switch between them to view your friends history specific to each account.',
  },
  {
    title:
      'What happens if I uninstall the extension or change Chrome profile?',
    description:
      'For your privacy, you will not be able to access your history if you uninstall the extension or switch Chrome profiles.',
  },
  {
    title: 'Can Facebook Owl be used on other web browsers?',
    description:
      'Currently, Facebook Owl is only available as a browser extension for Chromium-based browsers. We do not currently support other web browser engines.',
  },
];

const FaqSection = () => {
  return (
    <section className='bg-transparent ring-1 '>
      <div className='mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6'>
        <h2 className='mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900'>
          Frequently asked questions
        </h2>
        <div className='  pt-8 text-left '>
          <div className='grid gap-x-5 md:grid-cols-2'>
            {Faqs.map((f, i) => (
              <SingleFaq title={f.title} description={f.description} key={i} />
            ))}
          </div>

          <div className='m-auto flex flex-col'>
            <h2 className='mb-2 text-center text-2xl font-extrabold tracking-tight text-gray-900'>
              More Question?
            </h2>
            <a
              className='text-center text-indigo-900'
              href='mailto:gitnasr@proton.me'
            >
              gitnasr@proton.me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const SingleFaq = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='mb-8'>
      <h3 className='mb-1 flex items-center text-lg font-bold text-gray-900 '>
        <RiQuestionAnswerFill className='mr-2 h-5 w-5 flex-shrink-0 text-gray-800' />
        {title}
      </h3>
      <p className='font-semibold text-slate-600'>{description}</p>
    </div>
  );
};
export default FaqSection;

import 'regenerator-runtime/runtime';

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import React, { useMemo } from 'react';
import { SortAscIcon, SortDescIcon } from 'lucide-react';
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import NextImage from '@/components/NextImage';
import classNames from 'classnames';

// Define a default UI for filtering
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className='flex w-full items-baseline gap-x-2'>
      <input
        type='text'
        className=' w-full rounded-xl border-gray-600 bg-gray-900 shadow-sm focus:border-indigo-900 focus:ring focus:ring-indigo-900 focus:ring-opacity-50'
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder='Search by name ...'
      />
    </label>
  );
}

export function StatusPill({ value }) {
  const status = value ? value.toLowerCase() : 'No Changes';

  return (
    <span
      className={classNames(
        'leading-wide  rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm',
        status.startsWith('new') ? 'bg-green-100 text-green-800' : null,
        status.startsWith('removed') ? 'bg-red-100 text-red-800' : null,
        status.startsWith('deactivated')
          ? 'bg-yellow-100 text-yellow-800'
          : null
      )}
    >
      {status}
    </span>
  );
}

export function AvatarCell({ value, column, row }) {
  return (
    <div className='flex items-center'>
      <div className='h-10 w-10 flex-shrink-0'>
        <NextImage
          alt={row.original.fullName}
          useSkeleton
          width={40}
          height={40}
          className='h-10 w-10 rounded-full ring-fuchsia-800'
          src={row.original[column.imgAccessor]}
        />
      </div>
      <div className='ml-4'>
        <div className='text-sm font-medium text-gray-200'>{value}</div>
        <div className='text-sm text-gray-500'>
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </div>
  );
}

function Table({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'fullName',
        Cell: AvatarCell,
        imgAccessor: 'profilePicture',
        emailAccessor: 'fId',
      },

      {
        Header: 'Status',
        accessor: 'status',
        Cell: StatusPill,
      },
    ],
    []
  );
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      {/* table */}
      <div className='flex flex-col '>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 '>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 '>
            <div className='overflow-hidden border-b border-gray-800  shadow sm:rounded-lg'>
              <table
                {...getTableProps()}
                className='min-w-full divide-y divide-gray-900  '
              >
                <thead className='bg-gray-800 '>
                  {headerGroups.map((headerGroup, i) => (
                    <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, i) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          key={i}
                          scope='col'
                          className='group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className='flex items-center justify-between'>
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortAscIcon className='h-4 w-4 text-gray-400' />
                                ) : (
                                  <SortDescIcon className='h-4 w-4 text-gray-400' />
                                )
                              ) : (
                                <SortAscIcon className='h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100' />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className='divide-y divide-gray-900 bg-slate-950 '
                >
                  {page.map((row, i) => {
                    // new
                    prepareRow(row);
                    return (
                      <tr key={i} {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td
                              key={i}
                              {...cell.getCellProps()}
                              className='whitespace-nowrap px-6 py-4  '
                              role='cell'
                            >
                              {cell.column.Cell.name === 'defaultRenderer' ? (
                                <div className='text-sm text-white'>
                                  {cell.render('Cell')}
                                </div>
                              ) : (
                                <a
                                  className='text-indigo-600 hover:text-indigo-900'
                                  href={`https://facebook.com/${row.original.accountId}`}
                                  target='_blank'
                                >
                                  {cell.render('Cell')}
                                </a>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className='flex flex-row justify-between py-3'>
        <div className='flex  '>
          <span className='text-sm text-gray-400 '>
            Page{' '}
            <span className='font-medium text-gray-50'>
              {state.pageIndex + 1}
            </span>{' '}
            of{' '}
            <span className='font-medium text-gray-50'>
              {pageOptions.length}
            </span>
          </span>
        </div>
        <div>
          <nav
            className=' flex flex-row  rounded-md shadow-sm'
            aria-label='Pagination'
          >
            <button
              className='rounded-l-md'
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <span className='sr-only'>First</span>
              <ChevronDoubleLeftIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              <span className='sr-only'>Previous</span>
              <ChevronLeftIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              <span className='sr-only'>Next</span>
              <ChevronRightIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </button>
            <button
              className='rounded-r-md'
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className='sr-only'>Last</span>
              <ChevronDoubleRightIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </button>
          </nav>
        </div>
      </div>
      <div className='my-2 sm:flex sm:gap-x-2'>
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className='mt-2 sm:mt-0' key={column.id}>
                {column.render('Filter', 'Search by name')}
              </div>
            ) : null
          )
        )}
      </div>
    </>
  );
}

export default Table;

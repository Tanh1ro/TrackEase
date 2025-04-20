import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const TransactionHistory = ({ transactions = [] }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm">
      {/* Sidebar */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 w-20 flex-shrink-0 border-r border-gray-200 flex-col hidden sm:flex">
        <div className="h-16 text-blue-500 flex items-center justify-center">
          <svg className="w-9" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33">
            <path fill="currentColor" fillRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-4">
          <IconButton className="h-10 w-12 dark:text-gray-500 rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </IconButton>
          <IconButton className="h-10 w-12 dark:bg-gray-700 dark:text-white rounded-md flex items-center justify-center bg-blue-100 text-blue-500">
            <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </IconButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10">
          <div className="flex h-full text-gray-600 dark:text-gray-400">
            <a href="#" className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Company</a>
            <a href="#" className="cursor-pointer h-full border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white inline-flex mr-8 items-center">Users</a>
            <a href="#" className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Expense Centres</a>
            <a href="#" className="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center">Currency Exchange</a>
          </div>
          <div className="ml-auto flex items-center space-x-7">
            <Button variant="contained" className="h-8 px-3 rounded-md shadow text-white bg-blue-500">Deposit</Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex overflow-x-hidden">
          {/* Left Sidebar */}
          <div className="xl:w-72 w-48 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto lg:block hidden p-5">
            <div className="text-xs text-gray-400 tracking-wider">USERS</div>
            <div className="relative mt-2">
              <input type="text" className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm" placeholder="Search" />
              <SearchIcon className="absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2" />
            </div>
            {/* User list would go here */}
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
            {/* Header */}
            <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
              <div className="flex w-full items-center">
                <div className="flex items-center text-3xl text-gray-900 dark:text-white">
                  <img src="https://assets.codepen.io/344846/internal/avatars/users/default.png" className="w-12 mr-4 rounded-full" alt="profile" />
                  Mert Cukuren
                </div>
                <div className="ml-auto sm:flex hidden items-center justify-end">
                  <div className="text-right">
                    <div className="text-xs text-gray-400 dark:text-gray-400">Account balance:</div>
                    <div className="text-gray-900 text-lg dark:text-white">$2,794.00</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 sm:mt-7 mt-4">
                <a href="#" className="px-3 border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white pb-1.5">Activities</a>
                <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5">Transfer</a>
                <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Budgets</a>
                <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Notifications</a>
                <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Cards</a>
              </div>
            </div>

            {/* Filters */}
            <div className="sm:p-7 p-4">
              <div className="flex w-full items-center mb-7">
                <Button
                  startIcon={<CalendarMonthIcon />}
                  endIcon={<NavigateNextIcon />}
                  className="inline-flex mr-3 items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0"
                >
                  Last 30 days
                </Button>
                <Button
                  startIcon={<FilterListIcon />}
                  endIcon={<NavigateNextIcon />}
                  className="inline-flex items-center h-8 pl-2.5 pr-2 rounded-md shadow text-gray-700 dark:text-gray-400 dark:border-gray-800 border border-gray-200 leading-none py-0"
                >
                  Filter by
                </Button>
              </div>

              {/* Transactions Table */}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Where</TableCell>
                    <TableCell className="hidden md:table-cell">Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === 'income' ? (
                            <svg viewBox="0 0 24 24" className="w-4 mr-5 text-green-500" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-4 mr-5 text-gray-400" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                              <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                          )}
                          {transaction.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <img src={transaction.icon} className="w-7 h-7 mr-2.5 rounded-lg border border-gray-200 dark:border-gray-800" alt="icon" />
                          {transaction.where}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{transaction.description}</TableCell>
                      <TableCell className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                        {transaction.type === 'income' ? '+' : '-'} ${transaction.amount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="sm:flex hidden flex-col">
                            {transaction.date}
                            <div className="text-gray-400 text-xs">{transaction.time}</div>
                          </div>
                          <IconButton className="w-8 h-8 inline-flex items-center justify-center text-gray-400 ml-auto">
                            <MoreVertIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex w-full mt-5 space-x-2 justify-end">
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
                  <NavigateBeforeIcon />
                </Button>
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">1</Button>
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-white leading-none">2</Button>
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">3</Button>
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-500 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">4</Button>
                <Button className="inline-flex items-center h-8 w-8 justify-center text-gray-400 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none">
                  <NavigateNextIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory; 
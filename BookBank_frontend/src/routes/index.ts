import { lazy } from 'react';

// Books
const AllBooks = lazy(() => import('../pages/Books/AllBooks'));
const AddBook = lazy(() => import('../pages/Books/AddBook'));
const EditBook = lazy(() => import('../pages/Books/EditBook'));

// Users
const AllUsers = lazy(() => import('../pages/Users/AllUsers'));
const AddUser = lazy(() => import('../pages/Users/AddUser'));
const ViewUser = lazy(() => import('../pages/Users/ViewUser'));

// Profile
const Profile = lazy(() => import('../pages/Profile'));

const coreRoutes = [
  {
    path: '/books/all',
    title: 'All Books',
    component: AllBooks,
  },
  {
    path: '/books/add',
    title: 'Add Books',
    component: AddBook,
  },
  {
    path: '/books/:isbn',
    title: 'Edit Book',
    component: EditBook,
  },
  {
    path: '/users/all',
    title: 'All Users',
    component: AllUsers,
  },
  {
    path: '/users/add',
    title: 'Add Users',
    component: AddUser,
  },
  {
    path: '/users/:userId',
    title: 'Edit User',
    component: ViewUser,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
];

export const routes = [...coreRoutes];

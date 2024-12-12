import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fireToast } from '../../hooks';
import { Breadcrumb, Table } from '../../components';

import { BookProps, FireToastEnum } from '../../types';
import { constants } from '../../constants';//@constants

type ViewUserProps = {
  readonly userID: number;
  readonly email: string;
  readonly username: string;
  readonly books: BookProps[];
};

export default function ViewUser() {
  const { userId } = useParams();

  const [currentUser, setCurrentUser] = useState<ViewUserProps>({
    userID: 0,
    email: '',
    username: '',
    books: [],
  });

  const fetchUser = async (id: number) => {
    try {
      const res = await fetch(`${constants.USERS}/${id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.message === 'string'
            ? response.message
            : 'Something went wrong',
        );

      setCurrentUser({
        userID: response.user.userID,
        email: response.user.email,
        username: response.user.username,
        books: response.books,
      });
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser(parseInt(userId));
    }

    return () => {};
  }, [userId]);

  return (
    <>
      <Breadcrumb pageName="Edit Level" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            User Information
          </h3>
        </div>
        <div className="p-7">
          <form action="#">
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="email"
              >
                Username <span className="text-meta-1">*</span>
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                defaultValue={currentUser?.username}
              />
            </div>

            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="email"
              >
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="email"
                id="email"
                placeholder="Enter email"
                defaultValue={currentUser?.email}
              />
            </div>

            <Table data={currentUser.books}>
              <div className="bg-white px-5 pt-6 pb-2.5 dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                          Title
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Author
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Subject
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Class
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Edition
                        </th>
                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUser.books.map((book) => {
                        return (
                          <tr key={book.ISBN}>
                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                              <h5 className="font-medium text-black dark:text-white">
                                {book.title}
                              </h5>
                              <p className="font-thin text-black dark:text-white">
                                {book.ISBN}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {book.author}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {book.subject}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {book.class}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {book.edition}
                              </p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                              <p className="text-black dark:text-white">
                                {book.remarks}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Table>
          </form>
        </div>
      </div>
    </>
  );
}

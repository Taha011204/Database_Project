import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BookWithUserProps } from '../../types';

import { fireToast } from '../../hooks';
import { Breadcrumb, Table } from '../../components';

import { FireToastEnum } from '../../types/enums';
import { constants } from '../../constants';

export default function AllBooks() {
  const [books, setBooks] = useState<BookWithUserProps[] | []>([]);

  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();

  const handleEditClick = (isbn: string) => {
    navigate(`/books/${isbn}`);
  };

  const handleSearchChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setSearchText(target.value);
  };

  const fetchBooks = async () => {
    try {
      let url = null;
      if (searchText.length > 0) {
        url = `${constants.BOOKS}/filter/?q=${searchText}`;
      } else {
        url = constants.BOOKS;
      }

      const res = await fetch(url, {
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

      let booksArr: BookWithUserProps[] = [];

      response.map((item: any) => {
        booksArr.push({
          ISBN: item.ISBN,
          title: item.title,
          author: item.author,
          subject: item.subject,
          class: item.class,
          edition: item.edition,
          remarks: item.remarks,
          userID: item.userID,
          email: item.email,
          username: item.username,
        });
      });

      setBooks(booksArr);
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    }
  };

  useEffect(() => {
    fetchBooks();

    return () => {};
  }, [searchText]);

  return (
    <>
      <Breadcrumb pageName="Books" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-end align-bottom">
          <Link
            to="/books/add"
            className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="fill-current w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
            </span>
            Add new
          </Link>
          <div className="ml-4">
            <input
              type="text"
              placeholder="Search books..."
              className="h-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Table data={books}>
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Owner
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => {
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
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <h5 className="font-medium text-black dark:text-white">
                            {book.username}
                          </h5>
                          <p className="font-thin text-black dark:text-white">
                            {book.email}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                            <button
                              className="hover:text-primary"
                              onClick={() => handleEditClick(book.ISBN)}
                            >
                              <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                  fill=""
                                />
                                <path
                                  d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                  fill=""
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Table>
      </div>
    </>
  );
}

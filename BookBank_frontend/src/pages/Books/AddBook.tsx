import { useState, useContext } from 'react';

import { AuthContext } from '../../context';
import { UserContextProps } from '../../types';

import { fireToast } from '../../hooks';
import { Breadcrumb } from '../../components';

import { FireToastEnum } from '../../types';
import { constants } from '../../constants';

type CreateBookProps = {
  ISBN: string;
  title: string;
  author: string;
  subject: string;
  class: string;
  edition: string;
  remarks: string;
  condition: number;
  stock: number;
};

export default function AddBook() {
  const { user, setLoading } = useContext(AuthContext) as UserContextProps;

  const [book, setBook] = useState<CreateBookProps>({
    ISBN: '',
    title: '',
    author: '',
    subject: '',
    class: '',
    edition: '',
    remarks: '',
    condition: 5,
    stock: 1,
  });

  const handleSubmit = async (e: React.MouseEvent) => {
    try {
      e.preventDefault();

      if (
        !book.ISBN ||
        !book.title ||
        !book.subject ||
        !book.class ||
        !book.edition ||
        !book.remarks ||
        !book.condition ||
        !book.stock
      ) {
        throw new Error('Please fill all input fields');
      }

      if (book.condition < 0) {
        throw new Error('Condition must be positive');
      }

      if (book.condition > 10) {
        throw new Error('Condition must less than or equal to 10');
      }

      if (book.stock < 0) {
        throw new Error('Stock must be positive');
      }

      if (book.ISBN.length !== 15) {
        throw new Error('ISBN should be 15 digits long');
      }

      setLoading(true);

      const res = await fetch(`${constants.BOOKS}/${user.userID}/add-book`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ISBN: book.ISBN,
          title: book.title,
          author: book.author,
          subject: book.subject,
          class: book.class,
          edition: book.edition,
          remarks: book.remarks,
          condition: book.condition,
          stock: book.condition,
        }),
      });

      const response = await res.json();

      if (res.status !== 200)
        throw new Error(
          typeof response?.message === 'string'
            ? response.message
            : 'Something went wrong',
        );

      fireToast('Success', 'Book added successfully', FireToastEnum.SUCCESS);
    } catch (err: any) {
      fireToast(
        'There seems to be a problem',
        err.message,
        FireToastEnum.DANGER,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Add Book" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Add a new book to Book Bank
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  ISBN <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ISBN"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onChange={(e) => {
                    setBook((prev) => ({
                      ...prev,
                      ISBN: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Title <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  onChange={(e) => {
                    setBook((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Author <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter author"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    author: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Subject <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter subject"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Class <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter class"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    class: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Edition <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter edition"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    edition: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Remarks <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter remarks"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Condition <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={10}
                defaultValue={5}
                placeholder="Enter condition"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    condition: parseInt(e.target.value),
                  }));
                }}
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Stock <span className="text-meta-1">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={10}
                defaultValue={1}
                placeholder="Enter stock"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                onChange={(e) => {
                  setBook((prev) => ({
                    ...prev,
                    stock: parseInt(e.target.value),
                  }));
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

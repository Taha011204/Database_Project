import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context';

import { fireToast } from '../hooks';
import { Breadcrumb } from '../components';

import { FireToastEnum, UserContextProps } from '../types';
import { constants } from '../constants';

import CoverDefault from '../images/cover/cover.png';
import UserDefault from '../images/user/user.png';

type CountProps = {
  booksCount: number;
  cartItemsCount: number;
};

const Profile = () => {
  const { user } = useContext(AuthContext) as UserContextProps;
  const [count, setCount] = useState<CountProps>({
    booksCount: 0,
    cartItemsCount: 0,
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${constants.PROFILE}/${user.userID}`, {
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

      console.log(response);
      setCount({
        booksCount: response.books.length,
        cartItemsCount: response.cart.length,
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
    if (user.userID) {
      fetchProfile();
    }

    return () => {};
  }, []);

  return (
    <>
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverDefault}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative w-full h-full">
              <img
                src={UserDefault}
                alt="profile"
                className="w-full h-full rounded-full overflow-hidden object-fill object-center"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user.username}
            </h3>
            <p className="font-medium">{user.email}</p>
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-125 grid-cols-2 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {count.booksCount}
                </span>
                <span className="text-sm">Books(s)</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {count.cartItemsCount}
                </span>
                <span className="text-sm">Cart Items</span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About Me
              </h4>
              <p className="mt-4.5">A user of BookBank</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

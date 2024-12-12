import { useState, useEffect } from 'react';

import { FireToastEnum } from '../../types';

import { fireToast } from '../../hooks';
import { CardOne } from '../../components';

import { constants } from '../../constants';

interface DashboardOverviewProps {
  count1: string;
  count2: string;
}

const Overview = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverviewProps>({
    count1: 'Fetching',
    count2: 'Fetching',
  });

  const fetchStats = async () => {
    try {
      const res = await fetch(constants.STATS, {
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

      setDashboardData({
        count1: response.users,
        count2: response.books,
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
    fetchStats();

    return () => {};
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne title="Total Users" description={dashboardData.count1} />
        <CardOne title="Total Books" description={dashboardData.count2} />
      </div>
    </>
  );
};

export default Overview;

import { ReactNode } from 'react';
import React from 'react';

type TableProps = {
  data: Array<{}>;
  children: ReactNode;
};

export function Table({ data, children }: TableProps) {
  const renderNoResults = () => {
    return (
      <div className="mt-6 flex items-center justify-between rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm text-black dark:text-gray">
            There are no records to show, you can add them.
          </p>
        </div>
      </div>
    );
  };

  const renderResults = (children: ReactNode) => {
    return <>{children}</>;
  };

  return data.length === 0 ? renderNoResults() : renderResults(children);
}

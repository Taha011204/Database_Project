import { Breadcrumb } from '../../components';

export default function AddUser() {
  return (
    <>
      <Breadcrumb pageName="Add Level" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <p className="text-black dark:text-white">
            Contact your admin to add a new user
          </p>
        </div>
      </div>
    </>
  );
}

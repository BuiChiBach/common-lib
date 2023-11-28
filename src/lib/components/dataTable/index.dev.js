import React, { useState, useEffect } from 'react';
import testData from './testdata';
import DataTable from './index';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1
  },
  {
    field: 'username',
    headerName: 'Username',
    flex: 1
  },
  {
    field: 'role',
    headerName: 'Role',
    flex: 1
  },
  {
    field: 'fullname',
    headerName: 'Full Name',
    flex: 1
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1
  },
];

const TableTest = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData(testData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <DataTable
        total={data?.length}
        data={data}
        columns={columns}
        getDataTableList={() => {}}
      />
    </div>
  );
};

export default TableTest;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@mui/material';
import { North, South, SwapVert, DoNotDisturb } from '@mui/icons-material';

import './styles.scss';

const DataTable = (props) => {
  const {
    total,
    data,
    isLoading,
    columns,
    rowId,
    getDataTableList,
    checkboxSelection,
    onRowSelectionModelChange,
    onRowSelectable,
    selectedItems,
    initialQuery: {
      sorting,
      page: pageQuery,
      limit,
      searchInput: searchInputQuery,
      filter: filterQuery
    },
  } = props;
  const storageKeys = {
    pageSize: 10
  };
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(sorting?.sortModel[0] ?? null);
  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(storageKeys.pageSize);
  const [search, setSearch] = useState('');

  // set initial query for table
  useEffect(() => {
    pageQuery && setPage(pageQuery);
    limit && setPageSize(limit);
    if (searchInputQuery) {
      setSearch(searchInputQuery);
    }
    filterQuery && Object.values(filterQuery)?.length && setFilter(filterQuery);
  }, []);

  /**
   * Handle set query data to get list
   * @param {number} pageNumber
   * @param {object} sortQuery
   * @param {number} newPageSize
   * @param {object} newFilter
   * @param {string} newSearch
   */
  const getQuery = ({
    pageNumber = page,
    sortQuery = sort,
    newPageSize = pageSize,
    newFilter = filter,
    newSearch = search
  }) => {
    const query = {
      page: pageNumber, // you can add + 1 if page number in BE start with 1
      limit: newPageSize,
      searchInput: newSearch.trim(),
      filter: newFilter
    };

    // check condition whether user has already set sort func
    if (sortQuery?.field) {
      query.sortColumn = sortQuery.field;
      query.sortOrder = sortQuery.sort.toUpperCase();
    }
    getDataTableList(query);
  };

  /**
   * Handle change page number
   * @param {number} pageNumber
   */
  const handleChangePageNumber = (pageNumber) => {
    getQuery({ pageNumber });
    setPage(pageNumber);
  };

  /**
   * Handle change sort query
   * @param {object} sortQuery
   */
  const handleSortPageList = (sortQuery) => {
    const newSortQuery = sortQuery ?? {};
    // reset pageNumber to 0 when sort a column
    getQuery({ sortQuery: newSortQuery, pageNumber: 0 });
    setSort(newSortQuery);
    setPage(0);
  };

  /**
   * Handle change page size
   * @param {object} event
   */
  const handleChangePageSize = (event) => {
    const newPageSize = event.target.value;

    // get total page of table
    const totalPage =
      total % newPageSize === 0 ? total / newPageSize : Math.ceil(total / newPageSize);
    // when change pageSize
    // sometimes current number page will be greater than total page
    // then reset current number page to total page - 1
    if (page + 1 > totalPage) {
      getQuery({ newPageSize, pageNumber: totalPage - 1 });
      setPage(totalPage - 1);
    } else {
      getQuery({ newPageSize });
    }
    setPageSize(newPageSize);
  };

  return (
    <WrapDataTableStyles container>
      <Grid item sx={{ minHeight: 600, width: '100%' }}>
        <DataTableStyles
          isRowSelectable={onRowSelectable}
          autoHeight
          disableColumnMenu
          loading={isLoading || !data}
          getRowId={(row) => (rowId ? row[`${rowId}`] : row.id)}
          rows={(data && data) || []}
          columns={columns}
          hideFooterSelectedRowCount
          checkboxSelection={checkboxSelection}
          onRowSelectionModelChange={onRowSelectionModelChange}
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
          pagination
          rowCount={(total && total) || 0}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          rowSelectionModel={selectedItems}
          sortingOrder={['asc', 'desc']}
          onSortModelChange={(newSortModel) => handleSortPageList(...newSortModel)}
          slots={{
            columnSortedDescendingIcon: South,
            columnSortedAscendingIcon: North,
            columnUnsortedIcon: ({ sortingOrder, ...rest }) => (
              <SwapVert sortingorder={sortingOrder} {...rest} />
            ),
            noRowsOverlay: () => null,
            noResultsOverlay: () => null
          }}
          slotProps={{
            pagination: {
              page,
              rowsPerPage: pageSize,
              rowsPerPageOptions: [10, 25, 50],
              onPageChange: handleChangePageNumber,
              onRowsPerPageChange: handleChangePageSize
            }
          }}
          initialState={{
            sorting,
            pagination: {
              paginationModel: {
                page: pageQuery ?? 0,
                pageSize: limit ?? storageKeys.pageSize
              }
            }
          }}
        />
        {data && data.length === 0 && (
          <Box className="MuiBox-wrapNoResult">
            <DoNotDisturb />
            <Typography className="MuiTypography-noResultFound">
              {'Not Found'}
            </Typography>
            <Typography className="MuiTypography-plsTryAnotherKeyword">
              {'Try again'}
            </Typography>
          </Box>
        )}
      </Grid>
    </WrapDataTableStyles>
  );
};

DataTable.propTypes = {
  total: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  isLoading: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape({})),
  getDataTableList: PropTypes.func,
  optionsSearch: PropTypes.arrayOf(PropTypes.string),
  rowId: PropTypes.string,
  checkboxSelection: PropTypes.bool,
  onRowSelectionModelChange: PropTypes.func,
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  resetRowSelected: PropTypes.func,
  initialQuery: PropTypes.shape({
    sorting: PropTypes.shape({
      sortModel: PropTypes.arrayOf(PropTypes.shape({}))
    }),
    page: PropTypes.number,
    limit: PropTypes.number,
    searchInput: PropTypes.string,
    filter: PropTypes.shape({})
  }),
  clearSelectedTooltip: PropTypes.string,
  custonToolbarActions: PropTypes.any,
  customActions: PropTypes.node,
  disableCustonToolbarActions: PropTypes.bool,
  onRowSelectable: PropTypes.func
};

DataTable.defaultProps = {
  total: 0,
  data: [],
  isLoading: false,
  columns: [],
  getDataTableList: () => {},
  initialQuery: {},
  checkboxSelection: false,
  custonToolbarActions: null,
  disableCustonToolbarActions: false
};

export default DataTable;

// PaginationExample.js
import React from 'react';
import ReactPaginate from 'react-paginate';

const PaginationExample = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"mx-2"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={onPageChange}
            containerClassName={"flex justify-center items-center mt-4 text-[13px]"}
            pageClassName={"mx-1"}
            pageLinkClassName={"px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"}
            previousClassName={"mx-1"}
            previousLinkClassName={"px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"}
            nextClassName={"mx-1"}
            nextLinkClassName={"px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"}
            breakLinkClassName={"px-3 py-1 border rounded-md"}
            activeClassName={"bg-blue-500 text-white"}
        />
    );
};

export default PaginationExample;

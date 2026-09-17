const Pagination = ({
    page,
    totalPages,
    setPage
}) => {
    return (
        <div className="flex justify-center items-center gap-4 mt-6">

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border px-4 py-2 rounded disabled:opacity-40"
            >
                Previous
            </button>

            <span>
                Page {page} of {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border px-4 py-2 rounded disabled:opacity-40"
            >
                Next
            </button>

        </div>
    );
};

export default Pagination;
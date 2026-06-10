import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const DataTablePagination = ({ table }) => {
    return (
        <Pagination>
            <PaginationContent>
                <Button
                    onClick={() => table.previousPage()}
                    className="bg-white border-gray-300 border cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed mr-3"
                    disabled={!table.getCanPreviousPage()}
                >
                    <ArrowLeft />
                </Button>

                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => {
                    return (
                        <div key={Math.random()}>
                            {page === 1 ||
                            page === table.getPageCount() ||
                            (page >= table.getState().pagination.pageIndex &&
                                page < table.getState().pagination.pageIndex + 3) ? (
                                <PaginationItem key={page} className="cursor-pointer ">
                                    <PaginationLink
                                        onClick={() => table.setPageIndex(page - 1)}
                                        isActive={page === table.getState().pagination.pageIndex + 1}
                                        className={`${
                                            page === table.getState().pagination.pageIndex + 1 &&
                                            'bg-blue-200 border-none hover:bg-blue-300'
                                        }`}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ) : (
                                <>
                                    {page === 2 && table.getPageCount() > 3 && <PaginationEllipsis key={page} />}
                                    {page === table.getPageCount() - 1 && table.getPageCount() > 3 && (
                                        <PaginationEllipsis key={page} />
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}

                <Button
                    onClick={() => table.nextPage()}
                    className="bg-white border-gray-300 border cursor-pointer text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ml-3"
                    disabled={!table.getCanNextPage()}
                >
                    <ArrowRight />
                </Button>
            </PaginationContent>
        </Pagination>
    );
};

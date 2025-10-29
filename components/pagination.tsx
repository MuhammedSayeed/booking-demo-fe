"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    onPrevious?: () => void
    onNext?: () => void
    hasPrevious: boolean
    hasNext: boolean
    isLoading?: boolean
    currentPage?: number
    totalCount?: number
    pageSize?: number
}

export function Pagination({
    onPrevious,
    onNext,
    hasPrevious,
    hasNext,
    isLoading = false,
    currentPage = 1,
    totalCount = 0,
    pageSize = 10,
}: PaginationProps) {
    const totalPages = Math.ceil(totalCount / pageSize)
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalCount)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
                {totalCount > 0 ? (
                    <>
                        Showing <span className="font-semibold">{startItem}</span> to{" "}
                        <span className="font-semibold">{endItem}</span> of <span className="font-semibold">{totalCount}</span>{" "}
                        results
                    </>
                ) : (
                    "No results"
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPrevious}
                    disabled={!hasPrevious || isLoading}
                    className="gap-2 bg-transparent"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center gap-2 px-3 py-1 text-sm">
                    <span>
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages || 1}</span>
                    </span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNext || isLoading}
                    className="gap-2 bg-transparent"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

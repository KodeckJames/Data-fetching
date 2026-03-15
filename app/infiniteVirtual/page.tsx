'use client'
import React, { useRef, useEffect } from 'react'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'

interface cryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
}

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
  },
})

const fetchAPIData = async ({ pageParam = 1 }): Promise<cryptoData[]> => {
  const { data } = await api.get<cryptoData[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20, 
      page: pageParam,
      sparkline: false,
    },
  })
  return data
}

export default function InfiniteVirtual() {
  const parentRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchAPIData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined
    },
  })

  // Flatten the multi-page data into one single array for the virtualizer
  const allRows = data ? data.pages.flatMap((page) => page) : []

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Height of each row in px
    overscan: 5, // Pre-renders 5 items below the fold for smoothness
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  // Auto-fetch logic: When the last item in the virtual list is visible, fetch more
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    virtualItems,
  ])

  if (isPending) return <div className="p-10 text-center">Loading initial data...</div>
  if (isError) return <div className="p-10 text-red-500">Error: {error.message}</div>

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-4 text-center">
        Virtualized Infinite Crypto Feed
      </h1>

      {/* The Scroll Container */}
      <div
        ref={parentRef}
        className="h-150 w-full overflow-auto border border-gray-300 rounded-xl bg-white"
      >
        {/* The "Inner" Large Container */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1
            const coin = allRows[virtualRow.index]

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex items-center justify-between px-6 border-b transition-colors hover:bg-gray-50"
              >
                {isLoaderRow ? (
                  <div className="w-full text-center text-gray-400 italic">
                    {hasNextPage ? 'Loading more assets...' : 'All assets loaded'}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{coin.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                    </div>
                    <span className="font-mono font-medium text-green-600">
                      {coin.current_price.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-2 text-center">
        Rendering {virtualItems.length} of {allRows.length} total items
      </p>
    </div>
  )
}
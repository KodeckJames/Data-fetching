'use client'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'

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

// 1. Updated fetch function to accept pageParam
const fetchAPIData = async ({ pageParam = 1 }): Promise<cryptoData[]> => {
  const { data } = await api.get<cryptoData[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10, // Fetch 10 at a time
      page: pageParam, // The current page number
      sparkline: false,
    },
  })
  return data
}

export default function InfiniteQueries() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,      // Function to trigger next load
    hasNextPage,       // Boolean if more data is available
    isFetchingNextPage // Loading state for the next page
  } = useInfiniteQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchAPIData,
    // 2. REQUIRED in V5: Initial starting value
    initialPageParam: 1,
    // 3. Logic to calculate the next page number
    getNextPageParam: (lastPage, allPages) => {
      // If the last fetch returned items, increment the page count
      // Otherwise return undefined to stop pagination
      return lastPage.length > 0 ? allPages.length + 1 : undefined
    },
  })

  if (isPending) return <div className="text-center py-10">Loading...</div>
  if (isError) return <div className="text-center text-red-500 py-10">{(error as Error)?.message}</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-blue-700 text-center py-4 text-lg font-semibold">
        TanStack Query v5 Infinite Scroll: Crypto Markets
      </h1>

      <div className="space-y-4">
        {/* 4. Map through data.pages, then map through the items in each page */}
        {data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.map((coin: cryptoData) => (
              <div
                key={coin.id}
                className="flex justify-between items-center p-3 border-b hover:bg-gray-50"
              >
                <div className="flex gap-2">
                  <span className="font-bold">{coin.name}</span>
                  <span className="text-gray-500 uppercase">{coin.symbol}</span>
                </div>
                <p className="font-mono">
                  {coin.current_price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 5. The "Load More" trigger */}
      <div className="flex justify-center mt-8 pb-10">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className={`px-6 py-2 rounded-lg font-medium text-white 
            ${!hasNextPage ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
            disabled:opacity-50 transition-colors`}
        >
          {isFetchingNextPage 
            ? 'Loading more...' 
            : hasNextPage 
            ? 'Load More Cryptos' 
            : 'Nothing more to load'}
        </button>
      </div>
    </div>
  )
}
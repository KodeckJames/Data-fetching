'use client'
import { useToast } from '@/components/ui/toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect } from 'react'
interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
}

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: { 'Content-Type': 'application/json' },
})

const fetchCryptoData = async (): Promise<CryptoData[]> => {
  const { data } = await api.get<CryptoData[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids: 'bitcoin',
      names: 'Bitcoin',
      symbols: 'btc',
      category: 'layer-1',
      price_change: '1h',
    },
  })
  return data
}

export default function TanStackPage() {
  const { toast } = useToast()
  const onSuccess = useCallback(() => {
    toast({
      title: 'Fetch Successful',
      description: 'Crypto data fetched Successfully',
      variant: 'success',
    })
  }, [toast])
  const onError = useCallback(() => {
    toast({
      title: 'Error Fetching Crypto Data',
      description: 'Crypto data fetching Failed',
      variant: 'destructive',
    })
  }, [toast])

  const { data, isPending, isError, error, refetch, isFetching, isSuccess } =
    useQuery({
      queryKey: ['cryptoData'],
      queryFn: fetchCryptoData,
      gcTime: 5000,
      staleTime: 0,
      // refetchInterval: 1000,
      // refetchIntervalInBackground: true
      enabled: false,
    })

  useEffect(() => {
    if (isError && error) {
      onError()
    }
  }, [isError, error, onError])

  useEffect(() => {
    if (isSuccess && data) {
      onSuccess()
    }
  }, [onSuccess, data, isSuccess])

  return (
    <div className=" ">
      <div className=" flex justify-center py-4">
        <button
          className=" visible bg-blue-500 px-4 py-2 cursor-pointer rounded-xl text-white"
          title="Enable Data"
          onClick={() => refetch()}
        >
          Enable Data
        </button>
      </div>
      {isPending || (isFetching && <div>Data Pending...</div>)}
      {isError && <div>{(error as Error)?.message || 'An error occurred'}</div>}
      {data?.map((crypto: CryptoData) => {
        return (
          <div key={crypto.id} className=" gap-10 justify-center  flex flex-1 ">
            <p>
              {crypto.name} - {crypto.symbol} -
              {crypto.current_price.toLocaleString('en-KE', {
                style: 'currency',
                currency: 'KES',
              })}
            </p>
          </div>
        )
      })}
    </div>
  )
}

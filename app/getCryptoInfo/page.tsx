'use client'
import { useToast } from '@/components/ui/toast'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect } from 'react'
import Link from 'next/link'

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
      category: 'layer-1',
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
      enabled: false,
    })

  useEffect(() => {
    if (isError && error) onError()
  }, [isError, error, onError])

  useEffect(() => {
    if (isSuccess && data) onSuccess()
  }, [onSuccess, data, isSuccess])

  return (
    <div>
      <div className="flex justify-center py-4">
        <button
          className="bg-blue-500 px-4 py-2 rounded-xl text-white"
          onClick={() => refetch()}
        >
          Enable Data
        </button>
      </div>

      {(isPending || isFetching) && <div>Data Pending...</div>}
      {isError && <div>{(error as Error)?.message}</div>}

      {data?.map((crypto: CryptoData) => (
        <div key={crypto.id} className="flex justify-center gap-10">

          {/* LINK TO DETAILS PAGE */}
          <Link href={`/IndvInfo/${crypto.id}`}>
            <p className="cursor-pointer text-blue-600">
              {crypto.name}
            </p>
          </Link>

        </div>
      ))}
    </div>
  )
}
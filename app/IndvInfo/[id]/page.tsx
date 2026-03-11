'use client'

import { use } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
}

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
})

const fetchCryptoById = async (id: string): Promise<CryptoData> => {
  const { data } = await api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids: id,
    },
  })

  return data[0]
}

export default function CryptoDetails({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params)
  const queryClient = useQueryClient()

  const { data, isPending } = useQuery({
    queryKey: ['crypto', id],

    queryFn: () => fetchCryptoById(id),

    // read from cached list first
    initialData: () => {
      const cryptos = queryClient.getQueryData<CryptoData[]>(['cryptoData'])

      return cryptos?.find((c) => c.id === id)
    },
  })

  if (isPending) return <div>Loading...</div>

  return (
    <div className="flex flex-col items-center gap-4 mt-10">

      <h1 className="text-2xl font-bold">{data?.name}</h1>

      <p>Symbol: {data?.symbol}</p>

      <p>
        Price:
        {data?.current_price?.toLocaleString('en-KE', {
          style: 'currency',
          currency: 'KES',
        })}
      </p>

    </div>
  )
}
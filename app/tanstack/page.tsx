'use client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

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
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
  })
  if (isPending) return <div>Data Pending...</div>
  if (isError) return <div>{error.message}</div>
  return (
    <div>
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

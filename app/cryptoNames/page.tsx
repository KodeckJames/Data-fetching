'use client';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface CryptoNameInterface {
  name: string
}

const api = () => {
  return axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const fetchCrptoNames = async (): Promise<CryptoNameInterface[]> => {
  const { data } = await api().get<CryptoNameInterface[]>('/coins/markets', {
    params: {
      vs_currency: 'usd',
      ids: 'bitcoin',
      names: 'Bitcoin',
      symbols: 'btc',
      category: 'layer-1',
      price_change_percentage: '1h',
    },
  })
  return data
}

export default function CryptoNamesOnlyPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['cryptoNames'],
    queryFn: fetchCrptoNames,
    select: (data) => {
      const cryptoNames = data.map((cryptoName) => cryptoName.name)
      return cryptoNames
    },
  })
  return (
      <div>
          <p className=' text-blue-500 text-center py-4'>This Page is a demonstration of the select configuration data transformation feature of useQuery </p>
      {data?.map((cryptoName) => {
        return (
          <div key={cryptoName} className=" flex justify-center">
            {cryptoName}
          </div>
        )
      })}
      {isPending && <div>Loading...</div>}
      {isError && <div>{(error as Error)?.message || 'Yellow'}</div>}
    </div>
  )
}

'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL:
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&names=Bitcoin&symbols=btc&category=layer-1&price_change_percentage=1h',
  headers: {
    'Content-Type': 'application/json',
  },
})

export type Crypto = {
  current_price: number
  id: string
  name: string
  symbol: string
  high_24h: number
  low_24h: number
}

export default function Page() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null)
  const url =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&names=Bitcoin&symbols=btc&category=layer-1&price_change_percentage=1h'
  useEffect(() => {
    axios.get(url).then((response) => {
      setCryptos(response.data)
    })
  }, [])
  return (
    <div className=" min-h-dvh flex flex-col justify-center  items-center">
      {cryptos
        ? cryptos.map((crypto) => {
            return <p key={1}>{crypto.name + ' - ' + crypto.symbol+ ' - $' + crypto.current_price}</p>
          })
        : null}
    </div>
  )
}

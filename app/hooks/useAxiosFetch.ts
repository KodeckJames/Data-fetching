import { useState, useEffect } from 'react'
import axios from 'axios'

const useAxiosFetch = <T = unknown>(dataUrl: string) => {
  const [data, setData] = useState<T[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const source = axios.CancelToken.source()

    const fetchData = async (url: string) => {
      setIsLoading(true)
      try {
        const response = await axios.get(url, {
          cancelToken: source.token,
        })
        if (isMounted) {
          setData(response.data)
          setFetchError(null)
        }
      } catch (error) {
        if (isMounted) {
          setFetchError(
            error instanceof Error ? error.message : 'An error occurred'
          )
          setData([])
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setIsLoading(false), 2000)
        }
      }
    }
    fetchData(dataUrl)

    return () => {
      isMounted = false
      source.cancel()
    }
  }, [dataUrl])

  return { data, fetchError, isLoading }
}

export default useAxiosFetch

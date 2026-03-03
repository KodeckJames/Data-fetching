'use client'
import { baseAPI } from '@/app/api/post'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface fetchItems {
  id: number
  title: string
  datetime: string
  body: string
}

export default function Posts() {
  const [posts, setPosts] = useState<fetchItems[]>([])

  useEffect(() => {
    const FetchPosts = async () => {
      try {
        const response = await baseAPI.get('/posts')
        setPosts(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data)
          console.log(error.response?.status)
          console.log(error.response?.headers)
        } else {
          if (error instanceof Error) {
            console.log(`Error: ${error.message}`)
          }
        }
      }
    }
    FetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await baseAPI.delete(`/posts/${id}`)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data)
        console.log(error.response?.status)
        console.log(error.response?.headers)
      } else {
        if (error instanceof Error) {
          console.log(`Error: ${error.message}`)
        }
      }
    }
  }

  return (
    <div className=" min-h-dvh px-2">
      <h1 className=" text-4xl font-bold text-center py-2 underline decoration-green-500 decoration-wavy ">
        POSTS
      </h1>
      {posts.length === 0 ? (
        <div className=" flex min-h-dvh justify-center items-center">
          Loading...
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className=" flex flex-col text-center justify-center items-center gap-2"
          >
            <h1 className=" font-bold text-2xl">{post.title}</h1>
            <p className=" font-light italic text-lg">{post.datetime}</p>
            <p className=" font-semibold text-xl text-green-500">{post.body}</p>
            <button
              onClick={() => handleDelete(post.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete Post
            </button>
            <hr className="w-full border-t-2 border-white my-4" />
          </div>
        ))
      )}
    </div>
  )
}

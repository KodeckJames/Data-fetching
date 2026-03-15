'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface PostsData {
  id?: string // Optional because the server usually generates this
  title: string
  datetime: string
  body: string
}

// 1. FETCH Logic (GET)
const fetchData = async (): Promise<PostsData[]> => {
  const { data } = await axios.get<PostsData[]>('http://localhost:3500/posts')
  return data
}

// 2. POST Logic (CREATE)
const addPost = async (newPost: PostsData): Promise<PostsData> => {
  const { data } = await axios.post<PostsData>('http://localhost:3500/posts', newPost)
  return data
}

export default function UploadPosts() {
  const queryClient = useQueryClient()

  // GET Query
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['postData'],
    queryFn: fetchData,
  })

  // POST Mutation
  const {mutate, isPending: mutatePend, isError: mutateError} = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      // This "invalidates" the cache, forcing useQuery to refetch the new list
      queryClient.invalidateQueries({ queryKey: ['postData'] })
    },
  })

  const handleUpload = () => {
    mutate({
      title: 'New Post via Mutation',
      datetime: new Date().toLocaleString(),
      body: 'This was added using Axios and useMutation!',
    })
  }

  return (
    <div className='flex flex-col gap-8 p-4'>
      {/* Action Button */}
      <div className="border-b pb-4">
        <button 
          onClick={handleUpload}
          disabled={mutatePend}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {mutatePend ? 'Uploading...' : 'Add Sample Post'}
        </button>
        {mutateError && <p className="text-red-500">Upload failed!</p>}
      </div>

      {/* List Display */}
      <div className='flex flex-col gap-4'>
        {data?.map((post: PostsData) => (
          <div key={post.id} className="flex flex-col justify-center items-center border p-2">
            <h1 className="font-extrabold text-xl text-orange-500">{post.title}</h1>
            <p className="font-semibold italic text-gray-500">{post.datetime}</p>
            <p className="text-lg font-bold text-purple-700">{post.body}</p>
          </div>
        ))}
        {isPending && <div>Loading posts...</div>}
        {isError && <div>{(error as Error)?.message}</div>}
      </div>
    </div>
  )
}
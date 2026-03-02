'use client'
import React, { useState } from 'react'
import { baseAPI } from '@/app/api/post'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface NewPost {
  title: string
  datetime: string
  body: string
}

export default function PostItems() {
  const router = useRouter()
  const [formData, setFormData] = useState<NewPost>({
    title: '',
    datetime: '',
    body: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Create datetime in ISO format if not provided
      const postData = {
        ...formData,
        datetime: formData.datetime || new Date().toISOString(),
      }

      await baseAPI.post('/posts', postData)

      setSuccessMessage('Post created successfully!')
      setFormData({ title: '', datetime: '', body: '' })

      // Optionally redirect to posts page after 2 seconds
      setTimeout(() => {
        router.push('/posts')
      }, 2000)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(`Error: ${error.response?.data || error.message}`)
        console.log(error.response?.data)
        console.log(error.response?.status)
        console.log(error.response?.headers)
      } else {
        if (error instanceof Error) {
          setErrorMessage(`Error: ${error.message}`)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create New Post</h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label
              htmlFor="datetime"
              className="block text-sm font-medium mb-2"
            >
              Date & Time (optional - defaults to now)
            </label>
            <input
              type="datetime-local"
              id="datetime"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium mb-2">
              Body *
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter post content"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/posts')}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

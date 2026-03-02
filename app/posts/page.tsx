"use client";
import { baseAPI } from "@/app/api/post";
import { useEffect } from "react";

export default function Posts() {

    useEffect(() => {
        const FetchPosts = async () => {
            try {
                const response = await baseAPI.get("/posts")
            } catch (err) {
                // Not in the 200 response range
            }
        }
    }, [])

  return (
    <div>page</div>
  )
}

"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import FeedPostModal from './FeedPostModal'

export default function CreatePostButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>post</Button>
      <FeedPostModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
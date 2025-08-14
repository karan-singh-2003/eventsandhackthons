import React from 'react'
import { CircleAlert } from 'lucide-react'

interface PermissionErrorProps {
  message: string
}

const PermissionError = ({ message }: PermissionErrorProps) => {
  return (
    <div className="text-yellow-800 font-medium flex gap-x-3 items-center bg-yellow-50 p-3 text-sm">
      <CircleAlert />
      <div>
        <h1>Permission Denied</h1>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default PermissionError

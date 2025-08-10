'use client'

import React from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
  ResponsiveMenu,
  ResponsiveMenuItem,
} from '@/components/ui/responsive-menu'
import { RoleResponse } from './types'

interface RoleActionsProps {
  Roles: RoleResponse[]
  onDelete: (role: RoleResponse) => void
}

export function RoleActions({ Roles, onDelete }: RoleActionsProps) {
  const isOwner = Roles[0].id === 'owner'

  return (
    <ResponsiveMenu
      align="start"
      trigger={
        <button className=" rounded-none transition-colors cursor-pointer ">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      }
    >
      {/* Conditionally show Delete button - hide for Owner role */}
      {!isOwner && (
        <ResponsiveMenuItem
          onClick={() => onDelete(Roles[0])}
          variant="destructive"
        >
          <div className="flex items-center space-x-2.5">
            {/* Delete Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              className="lg:size-4 size-5 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <span className="text-red-600 font-normal mt-0.5">Delete</span>
          </div>
        </ResponsiveMenuItem>
      )}

      {/* Show message for Owner role */}
      {isOwner && (
        <div className="px-3 mt-1 py-2.5 text-sm text-gray-500 bg-gray-50 rounded-none">
          Owner role cannot be deleted
        </div>
      )}
      <hr className="border-t border-gray-100 my-1.5" />

      {/* Role Info Section */}
      <div className={`px-3   ${isOwner ? 'mt-3' : ''}`}>
        <div className="text-[12px] mb-2 text-gray-700 space-y-0.5 mt-2.5">
          <div className="">
            Last edited by{' '}
            {Roles[0].updatedBy?.name || Roles[0].createdBy?.name || 'Unknown'}
          </div>
          <div className="flex gap-2 text-[12px] text-gray-500">
            <p>
              {Roles[0].updatedAt
                ? new Date(Roles[0].updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : Roles[0].createdAt
                ? new Date(Roles[0].createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown date'}
            </p>
            <p>
              {Roles[0].updatedAt
                ? new Date(Roles[0].updatedAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                : Roles[0].createdAt
                ? new Date(Roles[0].createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                : 'Unknown time'}
            </p>
          </div>
        </div>
      </div>
    </ResponsiveMenu>
  )
}

'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Copy } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import BadgeInput from '@/components/Onboarding/InviteMembers/EmailBadgeInput'
import { Button } from '@/components/ui/button'

import axios from 'axios'

import { useWorkspaceSlug, useWorkspaceData } from '@/context/WorkspaceContext'
import { RoleResponse } from '../Roles/types'

const InviteMembers = () => {
  const [inviteLink, setInviteLink] = useState('')
  const [approvalRequired, setApprovalRequired] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null)

  const [copyClicked, setCopyClicked] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const workspaceSlug = useWorkspaceSlug()
  const workspace = useWorkspaceData()

  // Debug workspace context
  console.log('🎯 [InviteMembers] Workspace context:', {
    workspaceSlug,
    workspace,
  })

  const workspaceslug = workspaceSlug || workspace?.slug || ''

  // const workspaceslug = workspace?.slug || searchParams.get('slug') || ''
  const fetchInviteLink = useCallback(
    async (approval: boolean) => {
      if (!workspaceslug) {
        console.error(
          '❌ [InviteMembers] Cannot fetch invite link: No workspace slug'
        )
        setErrorMessage('Workspace not found. Please try again.')
        return
      }

      try {
        console.log(
          '🔗 [InviteMembers] Fetching invite link for workspace:',
          workspaceslug
        )
        const res = await axios.post('/api/invite/create', {
          workspaceSlug: workspaceslug,
          approvalRequired: approval,
        })
        console.log('✅ [InviteMembers] Invite link response:', res.data)

        if (
          res.status === 200 &&
          typeof res.data === 'object' &&
          res.data !== null &&
          'inviteLink' in res.data
        ) {
          setInviteLink((res.data as { inviteLink: string }).inviteLink)
          setErrorMessage('') // Clear any previous errors
        } else {
          console.error('❌ [InviteMembers] Invalid response:', res.data)
          setErrorMessage(
            'Unable to generate invite link. Please refresh the page and try again.'
          )
        }
      } catch (error) {
        console.error('❌ [InviteMembers] Failed to create invite link:', error)
        setErrorMessage(
          'Failed to create invite link. Please check your connection and try again.'
        )
      }
    },
    [workspaceslug]
  )

  useEffect(() => {
    if (workspaceslug) {
      fetchInviteLink(approvalRequired)
    }
  }, [approvalRequired, workspaceslug, fetchInviteLink])

  const handleToggle = () => {
    setApprovalRequired((prev) => !prev)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  console.log('🎯 [InviteMembers] Current workspace slug:', workspaceslug)
  const handleSendInviteButtonClick = async () => {
    if (!emails.length) {
      setErrorMessage(
        'Please add at least one email address to send invitations.'
      )
      return
    }
    if (!selectedRole) {
      setErrorMessage('Please select a role to assign to the invited members.')
      return
    }
    if (!workspaceslug) {
      setErrorMessage(
        'Workspace information is missing. Please refresh the page and try again.'
      )
      return
    }

    try {
      console.log('📧 [InviteMembers] Sending invites:', {
        emails,
        selectedRole: selectedRole.name,
        workspaceslug,
      })
      const res = await axios.post('/api/invite/send', {
        emails,
        role: selectedRole, // Assuming selectedRole is an object with a name property
        workspaceSlug: workspaceslug,
      })

      if (res.status === 200) {
        console.log('✅ [InviteMembers] Invites sent successfully:', res.data)
        setEmails([]) // Clear emails after sending
        setSelectedRole(null) // Clear selected role after sending
        setSuccessMessage(
          `Successfully sent ${emails.length} invitation${
            emails.length !== 1 ? 's' : ''
          }! Members will receive an email with instructions to join.`
        )
        setErrorMessage('') // Clear any errors
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        console.error('❌ [InviteMembers] Invite error:', res.data)
        setErrorMessage(
          'Failed to send invitations. Please check your internet connection and try again.'
        )
      }
    } catch (error) {
      console.error('❌ [InviteMembers] Failed to send invites:', error)
      setErrorMessage(
        'Unable to send invitations at this time. Please try again later or contact support if the issue persists.'
      )
    }
  }

  const handleSelectRole = (role: RoleResponse | null) => {
    setSelectedRole(role)
  }
  console.log('Selected role index.ts:', selectedRole)

  // Show warning if no workspace context
  if (!workspaceslug) {
    console.warn('⚠️ [InviteMembers] No workspace slug available')
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-none">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg">⚠️</h1>
            <div>
              <h3 className="font-semibold">Workspace Not Found</h3>
              <p>Please create a workspace to invite members.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-7 ">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium">
            ✅ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
            ❌ {errorMessage}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Share Invite Link
          </h2>
          <p className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">
            Generate a shareable link to invite new members to your workspace.
            Members joining through this link will be assigned the default
            VIEWER role and the link will automatically expire after 7 days for
            security.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-none space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Workspace Invite Link
            </label>
            <div
              className="flex items-center gap-x-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-none transition-colors"
              onClick={handleCopy}
            >
              <Copy size={12} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {copyClicked ? 'Copied!' : 'Copy Link'}
              </span>
            </div>
          </div>

          <Input
            placeholder="Generating invite link..."
            value={inviteLink}
            readOnly
            className="text-gray-900 dark:text-white bg-white dark:bg-gray-900 
            border border-gray-300 dark:border-gray-600 rounded-none px-4 h-12
            font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
            placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-none p-4">
          <div className="flex items-center justify-between gap-x-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Require Manual Approval
              </h3>
              <p className="text-[14px] text-gray-600 dark:text-gray-300">
                When enabled, you&apos;ll need to manually review and approve
                each member before they can access the workspace
              </p>
            </div>
            <Switch
              id="invite-toggle"
              checked={approvalRequired}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 "></div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Send Direct Invitations
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Send personalized invitation emails to specific people. You can
              add multiple email addresses and assign them a specific role in
              your workspace.
            </p>
          </div>

          <BadgeInput
            emails={emails}
            setEmail={setEmails}
            handleSelectRole={handleSelectRole}
            selectedRole={selectedRole}
          />

          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-none 
            transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSendInviteButtonClick()}
            disabled={!emails.length || !selectedRole}
          >
            Send {emails.length > 0 ? `${emails.length} ` : ''}Invitation
            {emails.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InviteMembers

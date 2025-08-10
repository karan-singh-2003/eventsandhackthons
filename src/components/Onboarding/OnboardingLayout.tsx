import React from 'react'
import PageLoader from '@/components/global/PageLoader'

interface OnboardingLayoutProps {
  title: string
  subtitle: string
  workspaceName?: string | null
  isLoading: boolean
  children: React.ReactNode
  loadingTitle?: string
}

/**
 * Reusable layout component for onboarding pages
 * Handles loading states and consistent styling
 */
const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  subtitle,
  workspaceName,
  isLoading,
  children,
  loadingTitle = 'Loading workspace...',
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <PageLoader title={loadingTitle} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="lg:text-2xl text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 lg:text-[15px] text-[14px]">
          {subtitle}
          {workspaceName ? ` "${workspaceName}"` : ''}
        </p>
      </div>
      {children}
    </div>
  )
}

export default OnboardingLayout

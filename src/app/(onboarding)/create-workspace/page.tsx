'use client'

import React, { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useCreateWorkspace from '@/hooks/useCreateWorkspace'
import FormElement from '@/components/Global/FormElements'
import Spinner from '@/components/Global/Spinner'
import { X } from 'lucide-react'

const CreateWorkspacePage = () => {
  const {
    register,
    onFormSubmit,
    errors,
    setValue,
    watch,
    isPending,
    serverError,
  } = useCreateWorkspace()

  const workspaceName = watch('workspacename') || ''

  const generatedSlug = workspaceName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]/g, '') // Remove special characters

  useEffect(() => {
    setValue('workspaceslug', generatedSlug)
  }, [generatedSlug, setValue])

  return (
    <div className="mt-4">
      <h1 className="font-bold text-[15px] mb-3 text-[#333333]">
        Workspace setup
      </h1>
      <h2 className="text-[#333333] font-semibold text-[20px]">
        Let’s set up your workspace
      </h2>
      <p className="font-medium text-[14px] text-[#727272]">
        Pick a name that’s short and easy to recognize. You can always change
        this later.
      </p>

      {serverError && (
        <div className="bg-[#ffcfcf] text-[#701111] font-medium text-[14px] my-4 py-3 px-4 rounded-none flex items-center gap-2">
          <X size={16} />
          <div className="flex items-center">
            {/* 👈 make this flex too */}
            {typeof serverError === 'string'
              ? serverError
              : JSON.stringify(serverError)}
          </div>
        </div>
      )}

      <form className="mt-4" onSubmit={onFormSubmit}>
        {/* Workspace Name */}
        <div>
          <Label
            htmlFor="workspacename"
            className="block font-medium mb-2 mt-1 text-[13px] lg:text-[15px]"
          >
            Workspace Name <span className="text-red-500">*</span>
          </Label>
          <FormElement
            type="text"
            inputType="input"
            placeholder="Enter your workspace name"
            register={register}
            errors={errors}
            name="workspacename"
          />
        </div>

        {/* Workspace Slug */}
        <div className="mt-3">
          <Label
            htmlFor="workspaceslug"
            className="block font-medium mb-2 mt-2 text-[13px] lg:text-[15px]"
          >
            Workspace Slug <span className="text-red-500">*</span>
          </Label>
          <FormElement
            type="text"
            inputType="input"
            register={register}
            errors={errors}
            name="workspaceslug"
            placeholder="Generated workspace slug"
            readonly
          />
          <p className="text-sm text-gray-500 mt-2">
            Your workspace URL will be:{' '}
            <span className="font-medium text-black">
              gndec.events.com/{generatedSlug || 'your-workspace-slug'}
            </span>
          </p>
        </div>

        <Button
          type="submit"
          className="rounded-none my-4 text-[13px] bg-[#246EFF] w-full px-4"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : 'Create Workspace'}
        </Button>
      </form>
    </div>
  )
}

export default CreateWorkspacePage

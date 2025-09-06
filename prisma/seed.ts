import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Step 1: Define categories
  const categories = [
    { name: 'WORKSPACE' },
    { name: 'EVENT' },
    { name: 'TASK' },
  ]

  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.permissionCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    })
    categoryMap[cat.name] = created.id
  }

  // Step 2: Define permissions
  const permissions = [
    // Workspace
    {
      name: 'RENAME_WORKSPACE',
      label: 'Rename workspace name or slug',
      category: 'WORKSPACE',
    },

    {
      name: 'SEND_INVITE_LINK',
      label: 'Invite members to the workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'APPROVE_JOIN_REQUEST',
      label: 'Approve/reject join requests',
      category: 'WORKSPACE',
    },
    {
      name: 'REMOVE_MEMBER',
      label: 'Remove members from workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'DELETE_WORKSPACE',
      label: 'Delete the workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'MANAGE_ROLES',
      label: 'Manage roles and permissions',
      category: 'WORKSPACE',
    },
    {
      name: 'VIEW_WORKSPACE',
      label: 'View workspace details',
      category: 'WORKSPACE',
    },
    {
      name: 'VIEW_MEMBERS',
      label: 'View members of the workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'CHANGE_WORKSPACE_NAME_AND_SLUG',
      label: 'Change workspace name and slug',
      category: 'WORKSPACE',
    },
    {
      name: 'ADD_ROLES',
      label: 'Add new roles to the workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'EDIT_ROLES',
      label: 'Edit existing roles in the workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'CREATE_WOORKPSACE',
      label: 'Create new workspace',
      category: 'WORKSPACE',
    },
    {
      name: 'Dummy',
      label: 'View roles and their permissions',
      category: 'WORKSPACE',
    },

    // Event
    { name: 'CREATE_EVENT', label: 'Create new events', category: 'EVENT' },
    { name: 'DELETE_EVENT', label: 'Delete events', category: 'EVENT' },
    { name: 'EDIT_EVENT', label: 'Edit event details', category: 'EVENT' },

    // Task
    // { name: 'CREATE_TASK', label: 'Create tasks', category: 'TASK' },
    // { name: 'EDIT_TASK', label: 'Edit tasks', category: 'TASK' },
    // { name: 'DELETE_TASK', label: 'Delete tasks', category: 'TASK' },
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: {
        name: permission.name,
        label: permission.label,
        categoryId: categoryMap[permission.category],
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

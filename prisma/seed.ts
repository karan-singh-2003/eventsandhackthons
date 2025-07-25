import { PrismaClient } from '@prisma/client'

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
      name: 'INVITE_MEMBER',
      label: 'Invite new members',
      category: 'WORKSPACE',
    },
    {
      name: 'SEND_INVITE_LINK',
      label: 'Send invite link',
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

    // Event
    { name: 'CREATE_EVENT', label: 'Create new events', category: 'EVENT' },
    { name: 'DELETE_EVENT', label: 'Delete events', category: 'EVENT' },
    { name: 'EDIT_EVENT', label: 'Edit event details', category: 'EVENT' },

    // Task
    { name: 'CREATE_TASK', label: 'Create tasks', category: 'TASK' },
    { name: 'EDIT_TASK', label: 'Edit tasks', category: 'TASK' },
    { name: 'DELETE_TASK', label: 'Delete tasks', category: 'TASK' },
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

  console.log('✅ Seeded permissions and categories')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

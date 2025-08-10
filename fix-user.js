// Script to fix user data mismatch
import { PrismaClient } from './src/generated/prisma/index.js'

const prisma = new PrismaClient()

const userFromAuth = {
  id: '1a8f60c5-99e1-404f-bfb4-93e5ffb83134',
  universityId: '2203842',
  name: 'Jaskaran Singh',
  email: 'official.jaskaran13@gmail.com',
  isAdmin: true,
}

async function main() {
  try {
    console.log('Checking if user exists...')

    const existingUser = await prisma.user.findUnique({
      where: { id: userFromAuth.id },
    })

    if (existingUser) {
      console.log('User exists:', existingUser)
      return
    }

    console.log('User not found. Checking if university exists...')

    // Check if university exists
    let university = await prisma.university.findFirst({
      where: {
        OR: [
          { code: 'JU' }, // Assuming JU for Jaskaran
          { domain: 'gmail.com' },
        ],
      },
    })

    if (!university) {
      console.log('Creating university...')
      university = await prisma.university.create({
        data: {
          name: 'Jaskaran University',
          code: 'JU',
          domain: 'gmail.com',
        },
      })
    }

    console.log('Creating user...')
    const newUser = await prisma.user.create({
      data: {
        id: userFromAuth.id,
        name: userFromAuth.name,
        email: userFromAuth.email,
        password: 'password123', // You may want to set a proper password
        universityId: userFromAuth.universityId,
        isAdmin: userFromAuth.isAdmin,
        university: {
          connect: {
            id: university.id,
          },
        },
      },
    })

    console.log('User created successfully:', newUser)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

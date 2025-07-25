"use client"

import { useState } from "react"
import { Search, Mail, Copy, Trash2, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Member {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  status: "Active" | "Pending"
  avatar?: string
}

const members: Member[] = [
  {
    id: "1",
    name: "",
    email: "jr141687@gmail.com",
    role: "Admin",
    status: "Pending",
  },
  {
    id: "2",
    name: "Himanshu Singh",
    email: "hr141687@gmail.com",
    role: "Owner",
    status: "Active",
  },
]

export default function MemberRoles() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const handleCopyInvitationUrl = (email: string) => {
    // Mock invitation URL
    const invitationUrl = `https://example.com/invite?email=${encodeURIComponent(email)}`
    navigator.clipboard.writeText(invitationUrl)
  }

  const handleDeleteMember = (id: string) => {
    // Handle delete logic here
    console.log("Delete member:", id)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
      {/* Header with search and invite button */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Enter text to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 lg:w-[322px]"
          />
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">Invite users</Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {member.status === "Pending" ? (
                        <AvatarFallback className="bg-muted">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-slate-800 text-white">
                          {getInitials(member.name, member.email)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="font-medium">{member.name || member.email}</div>
                      {member.name && <div className="text-sm text-muted-foreground">{member.email}</div>}
                      {member.status === "Pending" && (
                        <div className="text-sm text-muted-foreground">Sending invitation</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={member.role === "Owner" ? "default" : "secondary"}
                    className={
                      member.role === "Owner"
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.status === "Active" && (
                        <DropdownMenuItem onClick={() => handleCopyInvitationUrl(member.email)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy invitation URL
                        </DropdownMenuItem>
                      )}
                      {member.role !== "Owner" && (
                        <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="border rounded-lg p-6 space-y-4 bg-card">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  {member.status === "Pending" ? (
                    <AvatarFallback className="bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-slate-800 text-white">
                      {getInitials(member.name, member.email)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="font-medium truncate">{member.name || member.email}</div>
                  {member.name && <div className="text-sm text-muted-foreground truncate">{member.email}</div>}
                  {member.status === "Pending" && (
                    <div className="text-sm text-muted-foreground">Sending invitation</div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {member.status === "Active" && (
                    <DropdownMenuItem onClick={() => handleCopyInvitationUrl(member.email)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy invitation URL
                    </DropdownMenuItem>
                  )}
                  {member.role !== "Owner" && (
                    <DropdownMenuItem onClick={() => handleDeleteMember(member.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center justify-between">
              <Badge
                variant={member.role === "Owner" ? "default" : "secondary"}
                className={
                  member.role === "Owner"
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }
              >
                {member.role}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No members found matching your search.</div>
      )}
    </div>
  )
}

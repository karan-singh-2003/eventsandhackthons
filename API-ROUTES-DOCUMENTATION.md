# API Routes for Server Actions

This document describes the API routes created for all server actions from the actions folder.

## 1. Roles API (`/api/roles`)

### GET `/api/roles`

- **Get workspace roles**: `?workspaceSlug=xxx&action=getWorkspaceRoles`
- **Get all roles**: `?workspaceSlug=xxx&action=getAll` (default)

### POST `/api/roles`

Create a new role

```json
{
  "name": "Manager",
  "workspaceSlug": "my-workspace",
  "permissions": ["permission-id-1", "permission-id-2"]
}
```

### PUT `/api/roles`

Update an existing role

```json
{
  "id": "role-id",
  "name": "Updated Manager",
  "permissions": ["permission-id-1", "permission-id-3"],
  "userId": "user-id-for-audit"
}
```

### DELETE `/api/roles`

Delete a role: `?roleId=xxx`

## 2. Workspace API (`/api/workspace`)

### GET `/api/workspace`

- **Get invite workspace**: `?action=getInviteWorkspace&token=xxx`
- **Find join requests**: `?action=findAllJoinRequests&workspaceId=xxx`
- **Get workspace members**: `?action=getWorkspaceMembers&workspaceSlug=xxx`

### PUT `/api/workspace`

Update operations

```json
{
  "action": "updateMemberRole",
  "memberId": "member-id",
  "roleId": "role-id",
  "workspaceSlug": "workspace-slug"
}
```

```json
{
  "action": "approveJoinRequest",
  "requestId": "request-id",
  "workspaceSlug": "workspace-slug"
}
```

### DELETE `/api/workspace`

Delete operations

- **Remove member**: `?action=removeMember&memberId=xxx&workspaceSlug=xxx`
- **Cancel invitation**: `?action=cancelInvitation&inviteId=xxx&workspaceSlug=xxx`
- **Reject join request**: `?action=rejectJoinRequest&requestId=xxx&workspaceSlug=xxx`

## 3. Permissions API (`/api/permissions`)

### GET `/api/permissions`

- **Get all permissions**: `?action=getAll`
- **Get permissions by category**: `?action=getByCategory`
- **Default (backward compatibility)**: No action parameter returns grouped permissions

## 4. Notifications API (`/api/notifications`)

### POST `/api/notifications`

Create a notification

```json
{
  "userId": "user-id",
  "message": "Welcome to the workspace!",
  "workspaceId": "workspace-id" // optional
}
```

## 5. Email API (`/api/email`)

### POST `/api/email`

Send emails

```json
{
  "action": "sendEmail",
  "to": "user@example.com",
  "subject": "Welcome",
  "text": "Welcome message"
}
```

```json
{
  "action": "sendInviteEmail",
  "to": "user@example.com",
  "inviteLink": "https://app.com/invite/token",
  "workspaceName": "My Workspace"
}
```

## Usage Examples

### Frontend Hook Example

```typescript
// Instead of using server action directly
import { getAllRoles } from '@/actions/roles'

// Use API route
const fetchRoles = async (workspaceSlug: string) => {
  const response = await fetch(
    `/api/roles?workspaceSlug=${workspaceSlug}&action=getAll`
  )
  return response.json()
}
```

### React Query Example

```typescript
const { data: roles } = useQuery({
  queryKey: ['roles', workspaceSlug],
  queryFn: () =>
    fetch(`/api/roles?workspaceSlug=${workspaceSlug}`).then((res) =>
      res.json()
    ),
})
```

## Error Handling

All APIs return consistent error responses:

```json
{
  "error": "Error message",
  "status": 400|404|500
}
```

## Success Responses

Most APIs return data in this format:

```json
{
  "status": 200,
  "data": {
    /* response data */
  }
}
```

## Notes

- All server actions continue to work as before
- These APIs provide HTTP endpoints for the same functionality
- Use these APIs when you need RESTful endpoints instead of server actions
- Authentication is handled by the underlying server actions

// Static data objects for event management dashboard
// These can be easily replaced with API calls in the future

export interface KPIData {
  label: string
  value: string | number
  change: number
  icon: string
}

export interface EventData {
  id: string
  name: string
  date: string
  participants: number
  status: 'Upcoming' | 'Ongoing' | 'Completed'
  society: string
  category: 'Tech' | 'Cultural' | 'Sports' | 'Academic'
}

export interface ChartData {
  name: any
  value: any
}

export interface RegistrationTrendData {
  month: string
  registrations: number
}

// KPI Stats Data
export const kpiData: KPIData[] = [
  {
    label: 'Total Events',
    value: '24',
    change: 12,
    icon: '📊',
  },
  {
    label: 'Active/Upcoming',
    value: '8',
    change: 5,
    icon: '🎯',
  },
  {
    label: 'Total Participants',
    value: '1,284',
    change: 23,
    icon: '👥',
  },
  {
    label: 'Pending Approvals',
    value: '3',
    change: -2,
    icon: '⏳',
  },
]

// Participants per Event
export const participantsPerEvent: ChartData[] = [
  { name: 'Tech Summit', value: 245 },
  { name: 'Annual Sports', value: 189 },
  { name: 'Cultural Fest', value: 342 },
  { name: 'Coding Sprint', value: 156 },
  { name: 'Art Exhibition', value: 98 },
  { name: 'Hackathon', value: 287 },
]

// Event Categories Distribution
export const eventCategories: ChartData[] = [
  { name: 'SOLO', value: 35 },
  { name: 'TEAM', value: 28 }
]

// Registration Trend (Monthly)
export const registrationTrend: RegistrationTrendData[] = [
  { month: 'Jan', registrations: 120 },
  { month: 'Feb', registrations: 145 },
  { month: 'Mar', registrations: 198 },
  { month: 'Apr', registrations: 210 },
  { month: 'May', registrations: 287 },
  { month: 'Jun', registrations: 342 },
  { month: 'Jul', registrations: 315 },
  { month: 'Aug', registrations: 398 },
  { month: 'Sep', registrations: 412 },
  { month: 'Oct', registrations: 456 },
  { month: 'Nov', registrations: 489 },
  { month: 'Dec', registrations: 512 },
]

// Latest Events
export const latestEvents: EventData[] = [
  {
    id: '1',
    name: 'Annual Tech Summit 2024',
    date: '2024-12-15',
    participants: 245,
    status: 'Upcoming',
    society: 'Tech Club',
    category: 'Tech',
  },
  {
    id: '2',
    name: 'Inter-College Hackathon',
    date: '2024-12-08',
    participants: 287,
    status: 'Upcoming',
    society: 'Dev Community',
    category: 'Tech',
  },
  {
    id: '3',
    name: 'Cultural Fest 2024',
    date: '2024-11-30',
    participants: 342,
    status: 'Ongoing',
    society: 'Cultural Society',
    category: 'Cultural',
  },
  {
    id: '4',
    name: 'Annual Sports Meet',
    date: '2024-11-20',
    participants: 189,
    status: 'Completed',
    society: 'Sports Club',
    category: 'Sports',
  },
  {
    id: '5',
    name: 'Coding Sprint Challenge',
    date: '2024-11-15',
    participants: 156,
    status: 'Completed',
    society: 'Dev Community',
    category: 'Tech',
  },
  {
    id: '6',
    name: 'Art & Design Exhibition',
    date: '2024-11-25',
    participants: 98,
    status: 'Upcoming',
    society: 'Art Society',
    category: 'Cultural',
  },
]

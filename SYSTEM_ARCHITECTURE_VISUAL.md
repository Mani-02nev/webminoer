# 🎨 Admin Panel System Architecture - Visual Guide

## 📊 Database Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PERSONS TABLE                                │
│                    (Central Person Registry)                         │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ id | email (unique) | name | whatsapp | created_at         │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────────┬──────────────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┬──────────┐
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
┌───────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────┐
│PARTICIPANTS│ │ATTENDANCE│ │CERTIFICATES│ │COMMUNITY     │ │WEBINARS  │
│(Registr.)  │ │          │ │            │ │MEMBERS       │ │          │
└─────┬─────┘ └────┬─────┘ └──────┬─────┘ └──────────────┘ └────┬─────┘
      │            │               │                              │
      │            │               │                              │
      └────────────┴───────────────┴──────────────────────────────┘
                            webinar_id
```

---

## 🔄 Data Flow Diagram

### **Registration Flow**
```
User Registers
     │
     ▼
┌─────────────────────┐
│ 1. Get/Create Person│ ← Check if email exists
│    in persons table │   If not, create new
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Create Participant│ ← Link person_id + webinar_id
│    in participants  │   Store registration details
└─────────────────────┘
```

### **Attendance Flow**
```
Admin Marks Attendance
     │
     ▼
┌─────────────────────┐
│ 1. Find Participant │ ← Get participant record
│    by ID            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Create Attendance│ ← Link person_id + webinar_id
│    in attendance    │   Link participant_id
└─────────────────────┘
```

### **Certificate Flow**
```
Admin Issues Certificate
     │
     ▼
┌─────────────────────┐
│ 1. Find Attendance  │ ← Get attendance record
│    by ID            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Generate Cert ID │ ← Create unique ID
│    XXXX-XXXX-XXXX   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. Create Certificate│ ← Link person_id + webinar_id
│    in certificates  │   Link attendance_id
└─────────────────────┘
```

---

## 🎯 Admin Panel Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN LOGIN                             │
│                  (Username + Password)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Webinars:5│ │Persons:  │ │Registr.: │ │Certif.:  │      │
│  │          │ │1,234     │ │2,456     │ │1,850     │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬────────────────┐
        │                │                │                │
        ▼                ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  WEBINARS    │ │   RECORDS    │ │   PERSONS    │ │   SETTINGS   │
│              │ │              │ │              │ │              │
│ • List All   │ │ • Registr.   │ │ • View All   │ │ • Templates  │
│ • Create New │ │ • Attendance │ │ • Search     │ │ • Security   │
│ • Edit       │ │ • Certif.    │ │ • Profile    │ │ • Logs       │
│ • Delete     │ │ • Community  │ │ • Export     │ │ • Backup     │
│ • Lock/Unlock│ │ • Export     │ │              │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────────────┘
       │                │                │
       ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│              WEBINAR DETAIL VIEW                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  │
│  │Registrations│ │Attendances │ │Certificates│ │Overview  │  │
│  │    (150)   │ │    (120)   │ │    (115)   │ │          │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘  │
│                                                               │
│  [Mark Attended] [Send Certificate] [Export] [Email All]     │
└───────────────────────────────────────────────────────────────┘
```

---

## 👤 Person-Centric View

```
┌─────────────────────────────────────────────────────────────┐
│                   PERSON PROFILE                             │
│  👤 John Doe                                                 │
│  📧 john@example.com                                         │
│  📱 +91 98765 43210                                          │
├─────────────────────────────────────────────────────────────┤
│  STATISTICS                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │Registered│ │Attended  │ │Certif.   │ │Community │      │
│  │    3     │ │    2     │ │    2     │ │   Yes    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  ACTIVITY HISTORY                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ React Roadmap Webinar (Feb 15, 2026)                │   │
│  │ ✓ Registered  ✓ Attended  ✓ Certificate Issued     │   │
│  │ Cert ID: ABCD-1234-EFGH                             │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Node.js Basics Webinar (Feb 20, 2026)               │   │
│  │ ✓ Registered  ✗ Not Attended                        │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Next.js Master Class (Feb 25, 2026)                 │   │
│  │ ✓ Registered  ✓ Attended  ✓ Certificate Issued     │   │
│  │ Cert ID: WXYZ-5678-IJKL                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

Layer 1: Authentication
┌─────────────────────────────────────────────────────────────┐
│  Admin Login → Username + Password                          │
│  Password stored as bcrypt hash                              │
│  Session stored in localStorage with expiry                  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
Layer 2: Authorization
┌─────────────────────────────────────────────────────────────┐
│  Role-based access control                                   │
│  • super_admin: Full access                                  │
│  • admin: Limited access                                     │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
Layer 3: Activity Logging
┌─────────────────────────────────────────────────────────────┐
│  Every action logged to admin_activity_logs                  │
│  • Who: admin_id                                             │
│  • What: action (create/update/delete)                       │
│  • When: timestamp                                           │
│  • Where: IP address                                         │
│  • Details: JSON data                                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
Layer 4: Row Level Security (RLS)
┌─────────────────────────────────────────────────────────────┐
│  Supabase RLS policies on all tables                        │
│  • Public: Read-only access                                  │
│  • Admin: Full CRUD access                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Webinar Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                  WEBINAR LIFECYCLE                           │
└─────────────────────────────────────────────────────────────┘

1. CREATE WEBINAR
   ┌────────────────────────────────────────┐
   │ Admin creates webinar                   │
   │ • Name, Date, Type                      │
   │ • Description                           │
   │ • Max participants                      │
   │ registration_open = true                │
   └────────────────────────────────────────┘
                  │
                  ▼
2. REGISTRATION PHASE
   ┌────────────────────────────────────────┐
   │ Users register                          │
   │ • Person created/found                  │
   │ • Participant record created            │
   │ • Email confirmation sent               │
   └────────────────────────────────────────┘
                  │
                  ▼
3. WEBINAR DAY
   ┌────────────────────────────────────────┐
   │ Admin marks attendance                  │
   │ • Select participants                   │
   │ • Mark as attended                      │
   │ • Attendance record created             │
   └────────────────────────────────────────┘
                  │
                  ▼
4. POST-WEBINAR
   ┌────────────────────────────────────────┐
   │ Admin issues certificates               │
   │ • Select attendees                      │
   │ • Generate certificate ID               │
   │ • Send via email                        │
   │ • Certificate record created            │
   └────────────────────────────────────────┘
                  │
                  ▼
5. CLOSE WEBINAR
   ┌────────────────────────────────────────┐
   │ Admin closes registration               │
   │ registration_open = false               │
   │ Webinar archived                        │
   └────────────────────────────────────────┘
```

---

## 🎨 UI Component Hierarchy

```
AdminPanelPage
├── AdminLogin (if not authenticated)
└── AdminDashboard (if authenticated)
    ├── Header
    │   ├── Logo
    │   ├── Navigation
    │   └── UserMenu (Logout)
    │
    ├── Sidebar
    │   ├── Dashboard Link
    │   ├── Webinars Link
    │   ├── Records Link
    │   ├── Persons Link
    │   └── Settings Link
    │
    └── MainContent
        ├── DashboardView
        │   ├── StatsCards (6 cards)
        │   ├── RecentActivity
        │   └── QuickActions
        │
        ├── WebinarsView
        │   ├── WebinarsList
        │   │   └── WebinarCard
        │   │       ├── WebinarInfo
        │   │       ├── Stats
        │   │       └── Actions
        │   │           ├── View Details
        │   │           ├── Edit
        │   │           ├── Delete
        │   │           └── Lock/Unlock
        │   │
        │   └── WebinarDetailView
        │       ├── Tabs
        │       │   ├── Registrations
        │       │   ├── Attendances
        │       │   ├── Certificates
        │       │   └── Overview
        │       │
        │       └── TabContent
        │           ├── DataTable
        │           └── Actions
        │
        ├── RecordsView
        │   ├── Tabs
        │   │   ├── All Registrations
        │   │   ├── All Attendances
        │   │   ├── All Certificates
        │   │   └── Community Members
        │   │
        │   └── RecordsTable
        │       ├── Filters
        │       ├── Search
        │       └── Export
        │
        ├── PersonsView
        │   ├── PersonsList
        │   └── PersonProfile
        │       ├── PersonInfo
        │       ├── Statistics
        │       └── ActivityHistory
        │
        └── SettingsView
            ├── CertificateTemplates
            ├── AdminUsers
            ├── ActivityLogs
            └── SystemSettings
```

---

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   REACT STATE FLOW                           │
└─────────────────────────────────────────────────────────────┘

Component Mount
     │
     ▼
┌─────────────────────┐
│ useEffect Hook      │
│ Fetch Data          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase Query      │
│ .from('table')      │
│ .select('*')        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Update State        │
│ setState(data)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Re-render Component │
│ Display Data        │
└─────────────────────┘

User Action (e.g., Mark Attendance)
     │
     ▼
┌─────────────────────┐
│ Event Handler       │
│ handleMarkAttendance│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase Insert     │
│ .from('attendance') │
│ .insert(data)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Log Activity        │
│ logAdminActivity()  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Refresh Data        │
│ fetchData()         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Show Success        │
│ Toast Notification  │
└─────────────────────┘
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 768px)
┌─────────────────┐
│   Header        │
├─────────────────┤
│   Hamburger     │
│   Menu          │
├─────────────────┤
│                 │
│   Main Content  │
│   (Full Width)  │
│                 │
└─────────────────┘

Tablet (768px - 1024px)
┌─────────────────────────────┐
│   Header                    │
├──────┬──────────────────────┤
│      │                      │
│ Side │   Main Content       │
│ bar  │   (Wider)            │
│      │                      │
└──────┴──────────────────────┘

Desktop (> 1024px)
┌───────────────────────────────────┐
│   Header                          │
├────────┬──────────────────────────┤
│        │                          │
│ Side   │   Main Content           │
│ bar    │   (Full Features)        │
│        │   (Multi-column)         │
│        │                          │
└────────┴──────────────────────────┘
```

---

**This visual guide helps you understand the complete system architecture!**

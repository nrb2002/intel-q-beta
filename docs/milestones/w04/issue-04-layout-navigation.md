# Intel-Q Design Theme & Branding

## Overview

Intel-Q is a modern, professional queue management system designed for banks, hospitals, pharmacies, consulates, and other service-oriented organizations. The visual design should communicate **trust, efficiency, reliability, and simplicity**, ensuring that both customers and staff can interact with the application confidently in high-volume service environments.

The design system emphasizes consistency, accessibility, and responsive layouts while following modern web application design practices.

---

# Brand Identity

## Application Name

**Intel-Q**

## Tagline

> *Intelligent Queue Management for Modern Service Organizations.*

## Brand Values

- Trustworthy
- Efficient
- Professional
- Reliable
- Accessible
- Modern

---

# Color Palette

The color palette uses shades of blue to inspire confidence and trust, supported by neutral gray tones and semantic colors for queue status and notifications.

| Purpose | Color | Hex Code |
|----------|---------|----------|
| Primary | Blue | `#2563EB` |
| Primary Hover | Dark Blue | `#1D4ED8` |
| Secondary | Slate Gray | `#475569` |
| Background | Light Gray | `#F8FAFC` |
| Surface/Card | White | `#FFFFFF` |
| Border | Gray | `#E2E8F0` |
| Primary Text | Dark Slate | `#1E293B` |
| Secondary Text | Gray | `#64748B` |
| Success | Green | `#16A34A` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#DC2626` |
| Information | Sky Blue | `#0EA5E9` |

---

# Queue Status Colors

| Queue Status | Color |
|--------------|-------|
| Waiting | Amber |
| In Service | Blue |
| Completed | Green |
| Cancelled | Red |

These colors should be applied consistently throughout dashboards, queue lists, badges, and notifications.

---

# Typography

Intel-Q will use **Geist Sans**, the default font provided by modern Next.js applications. It offers excellent readability, clean aesthetics, and consistent rendering across platforms.

## Type Scale

| Element | Size | Weight |
|----------|------|--------|
| Heading 1 | 36px | Bold |
| Heading 2 | 30px | Bold |
| Heading 3 | 24px | Semibold |
| Heading 4 | 20px | Semibold |
| Body | 16px | Regular |
| Small Text | 14px | Regular |
| Caption | 12px | Medium |

---

# Layout Patterns

## Public Pages

The landing, login, and registration pages will use a centered layout with a simple navigation bar and footer.

Typical pages:

- Home
- Login
- Register

---

## Dashboard Pages

Authenticated users will use a dashboard layout containing:

- Header
- Sidebar navigation
- Main content area
- Footer

This layout provides quick access to queue management features while maintaining consistency across customer, staff, and administrator interfaces.

---

# Spacing System

Intel-Q will follow Tailwind CSS's default spacing scale.

| Size | Usage |
|------|-------|
| 4px (`1`) | Small spacing |
| 8px (`2`) | Between related items |
| 16px (`4`) | Standard padding and margins |
| 24px (`6`) | Section spacing |
| 32px (`8`) | Large content separation |
| 48px (`12`) | Page spacing |

Consistent spacing improves readability and creates a cohesive interface.

---

# Border Radius

| Component | Style |
|------------|-------|
| Buttons | `rounded-md` |
| Inputs | `rounded-md` |
| Cards | `rounded-lg` |
| Dialogs | `rounded-xl` |
| Badges | `rounded-full` |

---

# Shadows

Subtle shadows will provide visual depth without distracting users.

| Component | Tailwind Class |
|------------|----------------|
| Cards | `shadow-sm` |
| Dropdowns | `shadow-md` |
| Dialogs | `shadow-lg` |

---

# Icons

The application will use **Lucide React** icons for consistency and lightweight performance.

Common icons include:

- Home
- Users
- Building
- Clock
- Bell
- Search
- Settings
- Log Out

---

# UI Component Library

Intel-Q will use:

- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React**

## Core Reusable Components

- Header
- Sidebar
- Footer
- Navigation Bar
- Button
- Input
- Card
- Badge
- Modal
- Dialog
- Toast Notification
- Loading Spinner
- Queue Ticket Card
- Queue List
- Status Badge
- Empty State
- Error Message

These components should be reusable across multiple pages to promote consistency and maintainability.

---

# Responsive Design

The application must function well on desktop, tablet, and mobile devices.

## Breakpoints

| Device | Width |
|----------|-------|
| Mobile | Less than 640px |
| Tablet | 640px – 1023px |
| Desktop | 1024px and above |

Responsive behavior includes:

- Collapsible sidebar on mobile devices.
- Single-column forms on smaller screens.
- Responsive cards replacing wide tables where appropriate.
- Flexible layouts using CSS Grid and Flexbox.

---

# Accessibility

Intel-Q will follow accessibility best practices to ensure usability for all users.

The application should:

- Meet WCAG 2.1 AA color contrast recommendations.
- Support keyboard navigation.
- Include visible focus states.
- Use semantic HTML elements.
- Provide descriptive labels for forms and controls.
- Display meaningful validation and error messages.

---

# Design Principles

The Intel-Q design system follows these guiding principles:

1. **Consistency** – Reuse components and maintain a unified visual language.
2. **Simplicity** – Keep interfaces intuitive and uncluttered.
3. **Accessibility** – Design for users of varying abilities.
4. **Responsiveness** – Deliver an excellent experience across all devices.
5. **Efficiency** – Minimize the number of actions required to complete common tasks.
6. **Scalability** – Create reusable components that support future feature growth.

---

# Design Inspiration

Intel-Q draws inspiration from modern SaaS dashboards such as Stripe Dashboard, Vercel Dashboard, and Linear. These interfaces demonstrate clean layouts, subtle visual hierarchy, generous spacing, and restrained use of color, making them well suited for enterprise applications where clarity and efficiency are essential.

---

# Future Branding Opportunities

Future versions of Intel-Q may include:

- Organization-specific branding (logos and colors)
- Dark mode
- Custom themes for different industries
- Multi-language support with localized typography
- White-label deployment for enterprise customers

These enhancements are outside the MVP scope but align with the long-term vision of the platform.


# Implementation Guide – Layout

## Step 1

Create

```
components/layout/
```

---

## Step 2

Build

- Header
- Sidebar
- Footer

---

## Step 3

Create Dashboard Layout

```
app/dashboard/layout.tsx
```

---

## Step 4

Add navigation links

- Dashboard
- Queue
- Branches
- Profile

---

## Step 5

Make Sidebar responsive.

---

## Step 6

Test mobile layout.

---

## Definition of Done

Shared layout used across dashboard pages.
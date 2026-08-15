# Intel-Q Deployment Guide

**Project:** Intel-Q – Intelligent Queue Management System  
**Framework:** Next.js (App Router)  
**Language:** TypeScript  
**Database:** PostgreSQL  
**ORM:** Prisma  
**Authentication:** Auth.js v5  
**Styling:** Tailwind CSS + shadcn/ui  
**Version Control:** GitHub  
**Hosting:** Vercel

---

# Overview

This guide explains how to deploy Intel-Q from the team's GitHub repository to a production hosting environment.

The recommended deployment platform for Intel-Q is Vercel because it provides native support for Next.js applications and integrates directly with GitHub repositories.

The production application requires three primary services:

1. A GitHub repository for source code and version control.
2. A PostgreSQL database for persistent application data.
3. Vercel for hosting and deployment.

Authentication is handled using Auth.js v5, with sensitive configuration values stored as environment variables.

---

# Deployment Architecture

The production deployment follows this general architecture:

```text
                         ┌─────────────────────┐
                         │       Users         │
                         │ Customers / Staff   │
                         │ Administrators      │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │       Vercel        │
                         │    Next.js App      │
                         │    App Router       │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   Auth.js    │  │   Route      │  │   Server     │
          │     v5       │  │   Handlers   │  │   Components │
          └──────────────┘  └──────┬───────┘  └──────┬───────┘
                                   │                 │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │    Prisma ORM   │
                                   └────────┬────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │    PostgreSQL   │
                                   │    Database     │
                                   └─────────────────┘
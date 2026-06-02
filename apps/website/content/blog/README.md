# Blog Content Model

This folder stores blog planning assets and MDX content for the public website.

## Recommended Structure

- `schema.ts`: shared TypeScript types for post metadata
- `editorial-plan.md`: outlines and positioning for the first publishing batch
- `*.mdx`: article files with frontmatter and body content

## Frontmatter Fields

Use this frontmatter shape for every article:

```mdx
---
title: How to Test a Web App Before Launch Without a Full QA Team
slug: how-to-test-a-web-app-before-launch-without-a-full-qa-team
description: A practical pre-launch QA guide for founders and small product teams.
excerpt: Learn how to catch bugs before launch with a lean manual QA process.
date: 2026-06-02
updatedAt: 2026-06-02
author: CrowdTest
category: guides
featured: true
draft: false
readingTime: 8 min read
keywords:
  - pre-launch qa
  - web app testing
  - startup qa checklist
ogImage: /assets/blog/pre-launch-qa-guide.png
ctaLabel: Try CrowdTest
ctaHref: https://app.crowdtest.dev
---
```

## Editorial Rules

- Write for founders, product managers, and small engineering teams.
- Prefer practical steps, examples, and checklists over generic background.
- Keep a single CTA per article and place it near the end.
- Link related posts inside the body once those articles exist.
- Keep product mentions specific and relevant to the article topic.

## Suggested Routing

- `/blog`
- `/blog/[slug]`
- `/blog/category/[category]` once there are at least 3 posts per category

## Launch Batch Focus

- Guides: pre-launch QA, bug reporting, launch readiness
- Playbooks: onboarding, checkout, auth flows
- Comparisons: manual vs automated testing, crowdtesting vs in-house QA
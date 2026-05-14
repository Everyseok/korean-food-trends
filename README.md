<p align="center">
  <img src="docs/assets/readme/korean-food-trends-banner.png" alt="Korean Food Trends Banner" width="100%" />
</p>

<!-- Add the README hero image at docs/assets/readme/korean-food-trends-banner.png -->

> **현재 개발 중입니다.**
>
> Korean Food Trends는 지금 MVP 단계의 서비스입니다. 앞으로는 음식 트렌드와 관련 맛집을 지도에서 한눈에 분류해 볼 수 있는 기능, 지역별 트렌드 탐색, 더 정교한 제출 검수 흐름을 확장할 예정입니다. 현재 버전은 2020년 이후 한국 음식 유행을 타임라인으로 보고, NAVER Map 링크로 관련 맛집을 공유하는 핵심 흐름에 집중합니다.

**사이트 링크:** [korean-food-trends.junseok3055.workers.dev](https://korean-food-trends.junseok3055.workers.dev/)

<h1 align="center">Korean Food Trends</h1>

<p align="center">
  <strong>한국의 빠르게 바뀌는 음식 유행을 기록하고, 관련 맛집을 함께 공유하는 푸드 트렌드 타임라인.</strong>
</p>

<p align="center">
  2020년부터 현재까지 한국에서 유행한 음식들을 연도별 타임라인으로 정리하고, 각 트렌드와 연결된 맛집·판매점 정보를 NAVER Map 링크로 공유할 수 있는 웹사이트입니다.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.9-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" />
  <img src="https://img.shields.io/badge/Database-Cloudflare%20D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare D1" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4.15-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Status-MVP-204B57?style=for-the-badge" alt="MVP" />
</p>

---

## Introduction

한국의 음식 유행은 매우 빠르게 바뀝니다.

탕후루, 약과, 소금빵, 마라탕, 크룽지, 두바이초콜릿처럼 특정 음식이 갑자기 SNS와 오프라인 매장을 통해 폭발적으로 퍼지고, 몇 달 뒤에는 또 다른 트렌드로 이동합니다. 문제는 이런 흐름이 너무 빠르기 때문에, 시간이 지나면 "언제 무엇이 유행했는지", "지금도 인기 있는지", "어디에서 먹을 수 있는지"가 쉽게 흩어진다는 점입니다.

**Korean Food Trends**는 이 문제를 해결하기 위한 웹사이트입니다.

이 서비스는 한국의 음식 유행을 연도별 타임라인으로 추적하고, 각 트렌드에 연결된 맛집·판매점 정보를 함께 모읍니다. 사용자는 특정 푸드 트렌드가 언제 등장했는지 확인하고, 해당 음식을 실제로 판매하는 장소를 NAVER Map 링크로 공유할 수 있습니다.

즉, 이 프로젝트는 단순한 맛집 리스트가 아니라 **빠르게 변하는 한국 음식 유행을 기록하는 트렌드 아카이브이자, 사용자 참여형 맛집 공유 플랫폼**입니다.

---

## What is Korean Food Trends?

**Korean Food Trends** is a timeline-based web application for tracking fast-changing Korean food trends and sharing real places where those foods can be found.

The website organizes food trends from 2020 onward into a horizontal year-based timeline. Each trend can include a description, status, image, start year/month, and related store submissions.

Users can submit NAVER Map URLs for stores connected to each trend, making the service useful not only as a trend archive but also as a lightweight discovery tool for places to try viral foods.

## Core Use Cases

| User Need | How the Site Helps |
|---|---|
| "요즘 뭐가 유행했지?" | 연도별 타임라인으로 음식 유행 흐름을 확인할 수 있습니다. |
| "이 음식이 언제 유행했지?" | 각 트렌드의 시작 연도와 월을 기준으로 정리합니다. |
| "이 유행 아직 살아있나?" | `active`, `cooling`, `archived` 상태로 트렌드 흐름을 구분합니다. |
| "어디서 먹을 수 있지?" | 각 트렌드에 연결된 NAVER Map 맛집 링크를 확인할 수 있습니다. |
| "내가 아는 맛집도 추가하고 싶다" | 사용자가 NAVER Map URL을 제출할 수 있습니다. |
| "관리자가 트렌드를 정리하고 싶다" | 관리자 패널에서 트렌드 추가, 수정, 공개·숨김 처리가 가능합니다. |

## Core Features

| Feature | Description |
|---|---|
| **Food Trend Timeline** | 2020년부터 현재까지의 한국 음식 유행을 연도별 가로 타임라인으로 시각화합니다. |
| **Trend Cards** | 각 음식 트렌드를 카드 형태로 표시하고 설명, 이미지, 상태, 시작 시점을 제공합니다. |
| **Trend Status** | `active`, `cooling`, `archived` 상태로 유행의 현재 흐름을 구분합니다. |
| **Store Sharing** | 사용자가 각 트렌드에 관련된 NAVER Map 맛집 링크를 제출할 수 있습니다. |
| **Store List** | 트렌드별로 연결된 판매점·맛집 목록을 확인할 수 있습니다. |
| **Optimistic UI** | 제출 직후 UI에 반영되는 빠른 사용자 경험을 제공합니다. |
| **Rate Limiting** | IP/fingerprint 기반 일일 제출 횟수 제한으로 스팸 제출을 줄입니다. |
| **Admin Panel** | 관리자가 음식 트렌드를 추가, 수정, 공개·숨김 처리할 수 있습니다. |
| **Cloudflare Deployment** | Cloudflare Workers와 D1을 기준으로 배포할 수 있도록 구성되어 있습니다. |

## How It Works

```text
Food trend data
    ↓
Year / month timeline ordering
    ↓
Trend card rendering
    ↓
User opens related store list
    ↓
User submits NAVER Map URL
    ↓
Server Action validation
    ↓
Rate-limit check
    ↓
StoreSubmission saved
    ↓
Timeline revalidation
```

Korean Food Trends is not an automatic crawler-first service. The MVP is based on curated food trend data and user-submitted NAVER Map links.

현재 제출 흐름은 공식 NAVER API가 아니라 NAVER Map URL 검증과 저장을 중심으로 동작합니다. 제출된 매장 링크는 공식 검증 데이터가 아니라 사용자 제공 링크로 다룹니다.

## Product Direction

장기적으로는 한국 음식 문화의 빠른 변화를 가볍게 기록하고 찾아볼 수 있는 공개 아카이브를 목표로 합니다.

확장 가능한 방향:

- 트렌드 인기도 추적
- 사용자 제출 매장 검수
- 지역별 음식 트렌드 지도
- 소셜 미디어 신호 수집
- NAVER Map 메타데이터 보강
- LLM-assisted moderation
- 관리자 큐레이션 리포트

현재 버전의 핵심 루프:

```text
트렌드 확인 → 관련 맛집 확인 → NAVER Map 링크 공유 → 타임라인에 축적
```

## Tech Stack

| Area | Stack |
|---|---|
| Framework | Next.js 15.3.9 |
| Language | TypeScript 5.6.3 |
| UI | React 19.1.0, Tailwind CSS 3.4.15 |
| Data Layer | Prisma 5.22 |
| Local Database | SQLite |
| Production Database | Cloudflare D1 |
| Validation | Zod |
| Server Mutations | Server Actions |
| Deployment | Cloudflare Workers |
| Cloudflare Adapter | OpenNext for Cloudflare |
| CLI | Wrangler |

## Data Model

| Model | Purpose |
|---|---|
| `FoodTrend` | 음식 트렌드의 이름, 설명, 이미지, 시작 연도·월, 상태, 공개 여부를 저장합니다. |
| `StoreSubmission` | 특정 음식 트렌드에 연결된 NAVER Map 맛집 링크와 제출 정보를 저장합니다. |
| `DailySubmissionQuota` | 사용자 fingerprint와 날짜 기준으로 일일 제출 횟수를 제한합니다. |

Status values:

```text
FoodTrend.status:
active | cooling | archived

StoreSubmission.moderationStatus:
published | pending_enrichment | pending_llm_check | flagged
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_SECRET="admin-dev-secret"
```

### 3. Initialize database

```bash
npm run setup
```

This command runs:

```bash
prisma generate
prisma db push
npx tsx prisma/seed.ts
```

### 4. Start development server

```bash
npm run dev
```

Open:

[http://localhost:3000](http://localhost:3000)

## Admin Panel

Admin page:

[http://localhost:3000/admin/trends](http://localhost:3000/admin/trends)

Local default secret:

```text
admin-dev-secret
```

For production, replace `ADMIN_SECRET` with a strong secret through environment variables.

Admin features:

- Add food trends
- Edit trend information
- Toggle visibility
- Manage trend ordering
- Check store submission counts

## Build

```bash
npm run build
npm start
```

Type check:

```bash
npm run typecheck
```

## Cloudflare Workers Deployment

### 1. Login to Cloudflare

```bash
npx wrangler login
```

### 2. Create D1 database

```bash
npx wrangler d1 create korean-food-trends-db
```

Copy the returned `database_id` into `wrangler.jsonc`.

### 3. Generate migration SQL

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql
```

### 4. Apply migration to remote D1

```bash
npx wrangler d1 execute korean-food-trends-db --remote --file=migration.sql
```

### 5. Build and deploy

```bash
npm run cf:build
npm run cf:deploy
```

Preview:

```bash
npm run cf:preview
```

## Project Structure

```text
app/
├── page.tsx
├── admin/
│   ├── login/
│   └── trends/
└── api/

components/
├── FoodTrendTimeline.tsx
├── FoodTrendCard.tsx
├── AddStoreModal.tsx
├── StoreList.tsx
├── StoreListItem.tsx
└── admin/

actions/
├── submit-store.ts
└── admin-trends.ts

lib/
├── prisma.ts
├── naver-parser.ts
├── naver-enrichment.ts
├── rate-limit.ts
├── cloudflare-env.ts
└── utils.ts

prisma/
├── schema.prisma
└── seed.ts
```

## Future Work

- Store submission moderation
- Stronger NAVER Map metadata enrichment
- Official API integration if available
- Regional food trend mapping
- User accounts
- Trend popularity scoring
- LLM-assisted submission verification
- Public production hardening

## Design Principles

**Trend-first, not restaurant-first**

The site starts from food trends and connects stores afterward.

**Fast cultural memory**

Korean food trends move quickly, so the timeline preserves what appeared, peaked, and faded.

**Low-friction sharing**

Users submit NAVER Map URLs instead of filling long forms.

**Admin-curated quality**

Trend data is managed through an admin interface to keep the archive coherent.

**Cloudflare-native deployment**

The app is structured for Cloudflare Workers and D1 deployment.

## Policy Intent

Store links are user-submitted references.

The current MVP does not claim official NAVER partnership, official restaurant verification, or official ranking data. Submitted stores should be treated as community-provided links unless future moderation and verification systems are added.

## Useful Commands

```bash
npm run dev
npm run setup
npm run build
npm run typecheck
npm run cf:build
npm run cf:preview
npm run cf:deploy
```

## Author

**Jun Seok Kim**

Independent Researcher & AI Builder

- GitHub: [@Everyseok](https://github.com/Everyseok)
- Homepage: [junseokkim-research.vercel.app](https://junseokkim-research.vercel.app)

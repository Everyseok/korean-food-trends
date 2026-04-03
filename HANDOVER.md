# 한국 푸드 트렌드 — 인수인계서

> 미래의 Claude에게: 이 문서는 이 프로젝트의 모든 맥락을 담은 인수인계서다.
> 코드 수정 전에 반드시 처음부터 끝까지 읽어라.

---

## 1. 프로젝트 개요

| 항목 | 값 |
|------|-----|
| 프로젝트명 | korean-food-trends |
| 서비스명 | 대유행은 어디까지 갈까? |
| 목적 | 2020년 이후 한국 음식 트렌드를 편집자 큐레이션 + 사용자 제보로 정리 |
| 로컬 경로 | `/Users/junseokism/korean-food-trends` |
| 프로덕션 URL | https://korean-food-trends.junseok3055.workers.dev |
| GitHub | https://github.com/Everyseok/korean-food-trends |
| 현재 버전 | v0.3.0 (package.json) |
| 최신 커밋 | `cf876d3` |

---

## 2. 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프레임워크 | Next.js 15.3.9 (App Router) |
| 런타임 | Cloudflare Workers (via @opennextjs/cloudflare v1.18.0) |
| 데이터베이스 | Cloudflare D1 (SQLite, 프로덕션) / SQLite 파일 (로컬 개발) |
| ORM | Prisma 5.22.0 + `@prisma/adapter-d1` (driverAdapters preview) |
| 스타일링 | Tailwind CSS 3.4 |
| UI 아이콘 | lucide-react |
| 유효성 검사 | zod |
| 배포 도구 | wrangler 4.79.0 / opennextjs-cloudflare |
| 언어 | TypeScript 5.6 |

---

## 3. 인프라 / 클라우드 상세

### Cloudflare Workers
- Worker 이름: `korean-food-trends`
- `wrangler.jsonc`에 설정 전부 기술됨
- 배포 시 **`npm run deploy`** 사용 (내부: `opennextjs-cloudflare build && deploy`)
- **`wrangler deploy`는 절대 쓰지 말 것** — opennextjs-cloudflare의 번들 방식이 다름

### Cloudflare D1
- DB 이름: `korean-food-trends-db`
- DB ID: `ed2d3fd9-4bb8-4c04-bef9-785e60cd5828`
- 원격 쿼리: `npx wrangler d1 execute korean-food-trends-db --remote --command="SQL"`
- 스키마 적용: `npx wrangler d1 execute korean-food-trends-db --remote --file=./prisma/migrations/...`

### 환경 변수
- **로컬**: `.env` 파일 (`DATABASE_URL`, `ADMIN_SECRET`)
- **프로덕션**: Cloudflare Dashboard → Workers → Settings → Variables
  - `ADMIN_SECRET` — 관리자 로그인 비밀번호 (실제 값은 `.env`에 있음, git에 없음)
  - `NODE_ENV=production` — `wrangler.jsonc`의 `vars`에 설정됨

### open-next 설정
```typescript
// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig({});
```
이게 전부다. 수동 설정 넣지 말 것.

---

## 4. 디렉토리 구조 & 파일별 역할

```
korean-food-trends/
├── app/
│   ├── layout.tsx                  # 전역 레이아웃 (메타데이터, body 스타일)
│   ├── globals.css                 # Tailwind + 커스텀 CSS (타이포, 스크롤바, 모달)
│   ├── page.tsx                    # 홈페이지 서버 컴포넌트 — D1에서 트렌드 조회
│   ├── admin/
│   │   ├── login/page.tsx          # 관리자 로그인 페이지 (클라이언트)
│   │   └── trends/page.tsx         # 관리자 트렌드 관리 (서버 컴포넌트, 쿠키 인증)
│   └── api/
│       └── admin/auth/route.ts     # POST /api/admin/auth — 로그인 쿠키 발급
│
├── actions/
│   ├── submit-store.ts             # 공개 사용자의 네이버 링크 제보 서버 액션
│   └── admin-trends.ts             # 관리자 트렌드 CRUD 서버 액션 (쿠키 인증)
│
├── components/
│   ├── FoodTrendTimeline.tsx       # 메인 타임라인 컨테이너 (상태 관리 허브)
│   ├── FoodTrendCard.tsx           # 개별 트렌드 카드 (이미지, 이름, 설명, 토글)
│   ├── StoreList.tsx               # 트렌드별 제보 링크 목록 컨테이너
│   ├── StoreListItem.tsx           # 개별 제보 링크 아이템 (접기/펼치기)
│   ├── AddStoreModal.tsx           # 네이버 링크 제보 모달
│   ├── SubmissionToast.tsx         # 제보 성공/실패 토스트
│   ├── FoodTrendDetailModal.tsx    # (현재 미사용) 상세 모달 잔재 — 삭제 가능
│   ├── EmptyState.tsx              # (현재 미사용) 빈 상태 컴포넌트 잔재 — 삭제 가능
│   └── admin/
│       └── AdminTrendsClient.tsx   # 관리자 UI 클라이언트 컴포넌트
│
├── lib/
│   ├── prisma.ts                   # getPrisma() — Workers/로컬 환경 분기
│   ├── naver-parser.ts             # 네이버 URL 유효성 검사 + 정리
│   ├── naver-enrichment.ts         # (현재 미사용) 네이버 og:image 추출 — 삭제 가능
│   ├── rate-limit.ts               # IP 기반 일일 제보 횟수 제한 (5회/일)
│   ├── cloudflare-env.ts           # (내용 미확인, 사용 여부 확인 필요)
│   └── utils.ts                    # cn() 유틸리티 (clsx + tailwind-merge)
│
├── types/
│   └── index.ts                    # FoodTrendData, StoreSubmissionData, ToastState 등
│
├── prisma/
│   ├── schema.prisma               # DB 스키마 (FoodTrend, StoreSubmission, DailySubmissionQuota)
│   ├── seed.ts                     # 로컬 개발용 시드 데이터
│   └── dev.db                      # 로컬 SQLite DB (git 제외 권장)
│
├── wrangler.jsonc                  # Cloudflare Workers 설정 (D1 바인딩 포함)
├── open-next.config.ts             # OpenNext Cloudflare 설정 (최소화 유지)
├── next.config.mjs                 # Next.js 설정 (standalone, serverExternalPackages)
├── tailwind.config.ts              # Tailwind 설정
├── tsconfig.json                   # TypeScript 설정 (open-next.config.ts 제외됨)
├── .env                            # 로컬 환경변수 (git 제외)
├── .env.example                    # 환경변수 예시
└── package.json                    # 스크립트 및 의존성
```

---

## 5. 데이터베이스 스키마

### FoodTrend
```prisma
model FoodTrend {
  id              String   @id @default(cuid())
  slug            String   @unique          // URL 슬러그 (소문자+하이픈만)
  name            String                    // 표시 이름 (예: "마라탕")
  description     String                    // 설명 (카드에 2줄 truncate 표시)
  inventorName    String   @default("")     // 발명자/기원 (선택)
  imageUrl        String                    // 트렌드 대표 이미지 URL (관리자 직접 입력)
  trendStartYear  Int      @default(2020)   // 유행 시작 연도
  trendStartMonth Int      @default(1)      // 유행 시작 월
  status          String   @default("active") // "active" | "cooling" | "archived"
  sortOrder       Int      @default(0)      // 같은 연월 내 정렬 순서
  visible         Boolean  @default(true)   // false면 홈페이지에 미표시
  stores          StoreSubmission[]
}
```

### StoreSubmission
```prisma
model StoreSubmission {
  id                   String   @id @default(cuid())
  foodTrendId          String
  sourceUrl            String                        // 네이버 지도 URL (유일성 보장)
  sourcePlatform       String   @default("naver_map")
  storeName            String                        // 현재는 항상 "" (관리자가 수동 검증)
  address              String?                       // 현재는 항상 null
  businessHours        String?                       // 현재는 항상 null
  thumbnailUrl         String?                       // 현재는 항상 null
  metadataJson         String?                       // 현재는 항상 null
  moderationStatus     String   @default("published") // 현재는 모두 "published"
  submitterFingerprint String                        // IP 기반 rate limit용
  @@unique([foodTrendId, sourceUrl])
}
```

### DailySubmissionQuota
```prisma
model DailySubmissionQuota {
  fingerprint String
  dateKey     String  // KST 기준 YYYY-MM-DD
  count       Int     @default(0)
  @@unique([fingerprint, dateKey])
}
```

**주의**: `schema.prisma`의 주석에 `pending_enrichment`, `pending_llm_check`, `flagged` 등이 남아있지만 **현재 코드에서는 전혀 사용하지 않는다.** `moderationStatus`는 항상 `"published"`로만 저장된다.

---

## 6. 핵심 아키텍처 결정 사항

### getPrisma() 패턴
```typescript
// lib/prisma.ts
export const getPrisma = cache((): PrismaClient => {
  try {
    const { env } = getCloudflareContext() as any;
    if (env?.DB) {
      return new PrismaClient({ adapter: new PrismaD1(env.DB as any) });
    }
  } catch {
    // Workers 컨텍스트 아님 → 로컬 SQLite 폴백
  }
  return _getLocalPrisma();
});
```
- `cache()`는 React의 요청 단위 메모이제이션 (같은 요청에서 여러 번 호출해도 1회만 생성)
- `getCloudflareContext()`는 동기 호출 — `await` 쓰면 안 됨
- 로컬에서는 `DATABASE_URL=file:./dev.db` 필요

### 관리자 인증 구조
```
로그인 흐름:
  POST /api/admin/auth (route.ts)
    → secret 검증
    → 쿠키 설정: admin_token = ADMIN_SECRET 값 (httpOnly: true, secure: prod)

페이지 렌더링 인증:
  app/admin/trends/page.tsx (서버 컴포넌트)
    → cookies()로 admin_token 읽음 → 일치하면 렌더링

서버 액션 인증:
  actions/admin-trends.ts의 verifyAdmin()
    → cookies()로 admin_token 읽음 → 일치하면 허용
```

**핵심 교훈**: `admin_token` 쿠키는 `httpOnly: true`라서 **브라우저 JS에서 읽을 수 없다.**
클라이언트 컴포넌트에서 `document.cookie`로 토큰을 읽어 서버 액션에 전달하는 패턴은
절대 작동하지 않는다. 인증은 반드시 서버 액션 내부에서 `cookies()`로 직접 처리해야 한다.

### 제보 흐름
```
사용자 → AddStoreModal (URL 입력)
  → FoodTrendTimeline.handleSubmit()
    → useOptimistic으로 즉시 UI에 낙관적 추가
    → submitStore() 서버 액션 호출
      → URL 유효성 검사 (isNaverMapUrl)
      → Rate limit 확인 (IP당 5회/일, KST 기준)
      → D1에 즉시 published 상태로 저장
      → revalidatePath('/') 호출
  → 토스트 표시
```

---

## 7. 스크립트 명세

| 스크립트 | 내용 |
|---------|------|
| `npm run dev` | 로컬 Next.js 개발 서버 (localhost:3000) |
| `npm run build` | Next.js 프로덕션 빌드 |
| `npm run cf:build` | Cloudflare Workers 번들 빌드 (.open-next/ 생성) |
| `npm run deploy` | cf:build + Cloudflare 배포 (프로덕션 업데이트 시 항상 이걸 쓸 것) |
| `npm run cf:dev` | Workers 환경 에뮬레이션 로컬 개발 서버 |
| `npm run cf:preview` | 로컬에서 Workers 번들 프리뷰 |
| `npm run db:generate` | Prisma 클라이언트 코드 생성 |
| `npm run db:push` | 로컬 SQLite에 스키마 반영 |
| `npm run db:seed` | 로컬 DB에 시드 데이터 삽입 |
| `npm run setup` | db:generate + db:push + db:seed 한 번에 |
| `npm run typecheck` | TypeScript 타입 검사 |

---

## 8. 배포 절차 (정확한 순서)

```bash
# 1. Next.js 빌드 확인 (타입 에러 체크)
npm run build

# 2. Cloudflare 배포 (build + deploy 포함)
npm run deploy

# 3. GitHub 푸시
git push origin main

# D1 직접 쿼리 (데이터 수정 필요 시)
npx wrangler d1 execute korean-food-trends-db --remote --command="SELECT * FROM FoodTrend"
```

`npm run cf:build` 후 따로 `npx opennextjs-cloudflare deploy`를 써도 되지만,
`npm run deploy`가 둘 다 포함하므로 보통은 이걸 쓰면 된다.

---

## 9. 로컬 개발 환경 설정

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 편집: DATABASE_URL, ADMIN_SECRET 설정

# 3. DB 초기화 + 시드
npm run setup

# 4. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

Workers 에뮬레이션이 필요한 경우 (D1 바인딩 테스트):
```bash
npm run cf:dev
# → 포트 확인 (보통 8787)
```

---

## 10. 현재 기능 상태

### 공개 홈페이지 (`/`)
- 수평 타임라인 — 오래된 것 왼쪽, 최신 것 오른쪽
- **초기 로드 시 오른쪽(최신)으로 자동 스크롤**
- 각 트렌드 노드: 클릭하면 인라인으로 아래 펼쳐짐 (설명 전체 표시, 도트 채워짐)
- 카드 hover 시 "추가" 버튼 등장
- 각 트렌드 아래 "링크 등록 · N" 헤더 + 제보된 네이버 링크 목록
- 링크 등록은 네이버 지도 URL만 허용 (map.naver.com, naver.me 등)
- 제보 즉시 게시 (승인 과정 없음)
- **제보자 IP당 5회/일 제한 (KST 기준)**

### 관리자 페이지 (`/admin/trends`)
- 로그인: `/admin/login` → `ADMIN_SECRET`으로 인증
- 트렌드 목록: 섬네일, 이름, 연월, 상태, 링크 수 표시
- 트렌드 편집: 이름, slug, 설명, 이미지 URL (미리보기 포함), 연월, 상태, 정렬, 공개여부
- 트렌드 추가: 동일 폼으로 새 트렌드 생성
- 공개/숨김 토글: Eye 아이콘 클릭
- **링크 목록 보기**: 각 트렌드의 제보된 네이버 URL 목록 + 날짜 표시 (수동 검증용)

### 없는 기능 (의도적으로 미구현)
- 네이버 지도에서 상호명/주소 자동 추출 (NAVER 차단으로 포기, `naver-enrichment.ts` 잔재)
- 제보 승인/거절 워크플로 (바로 게시가 현재 정책)
- 이미지 파일 업로드 (관리자가 URL 직접 입력)
- LLM 자동 검증

---

## 11. 알려진 잔재 / 정리 필요 항목

| 파일 | 상태 | 비고 |
|------|------|------|
| `components/FoodTrendDetailModal.tsx` | **미사용** | 상세 팝업 모달 삭제 시 제거 가능 |
| `components/EmptyState.tsx` | **미사용** | StoreList 내부에 인라인 처리됨 |
| `lib/naver-enrichment.ts` | **미사용** | `submit-store.ts`에서 import 제거됨. 삭제 가능 |
| `lib/cloudflare-env.ts` | **확인 필요** | 어디서도 import 안 되는 것 같음 |
| `prisma/schema.prisma` 주석 | **낡은 정보** | `pending_enrichment` 등 현재 미사용 상태 주석 잔재 |

---

## 12. 자주 발생했던 버그와 해결법

### 버그 1: `인증 실패` (관리자 저장 불가)
**원인**: `admin_token` 쿠키가 `httpOnly: true`라 `document.cookie`로 읽히지 않음.
**해결**: 서버 액션 내부에서 `cookies()` (next/headers)로 직접 읽기.
**커밋**: `cf876d3`

### 버그 2: `Application error: server-side exception`
**원인**: `lib/prisma.ts`에서 `await import('@opennextjs/cloudflare')` 동적 임포트 + silent catch → SQLite 폴백 실패 (프로덕션에 dev.db 없음).
**해결**: 정적 임포트 + 동기 `getCloudflareContext()` + React `cache()`.
**커밋**: `cd04d52`

### 버그 3: Cloudflare 배포 실패 (`proxyExternalRequest missing`)
**원인**: `open-next.config.ts`에 v1.18.0 필수 필드 누락한 수동 설정.
**해결**: `defineCloudflareConfig({})` 단순 래퍼 사용.
**커밋**: `76237e5`

### 버그 4: `상호명 확인 중` 항목이 반투명하게 보임
**원인**: `StoreListItem.tsx`의 `isPending` 체크가 `storeName === '상호명 확인 중'`을 포함.
**해결**: `isPending` 체크에서 해당 조건 제거. D1에서 SQL UPDATE로 기존 데이터 수정.

---

## 13. UI 디자인 시스템

### 색상 팔레트 (Apple-like)
| 색상 | 용도 |
|------|------|
| `#1D1D1F` | 주 텍스트, 버튼 |
| `#6E6E73` | 보조 텍스트 |
| `#8E8E93` | 설명 텍스트, 플레이스홀더 |
| `#AEAEB2` | 비활성 텍스트, 아이콘 |
| `#C7C7CC` | 구분선, 희미한 텍스트 |
| `#D1D1D6` | 스크롤바, 구분점 |
| `#E5E5EA` | 테두리, 배경 구분 |
| `#F2F2F7` | 모달 내부 배경 |
| `#F5F5F7` | 전체 페이지 배경 |
| `#0071E3` | 액션 버튼 (파란색) |
| `#30D158` | active 상태 (초록) |
| `#FF9F0A` | cooling 상태 (주황) |

### 타이포그래피 (globals.css)
```css
.timeline-eyebrow {
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.2em; color: #AEAEB2; text-transform: uppercase;
}
.timeline-hero-title {
  font-size: clamp(1.5rem, 3.8vw, 2.4rem);
  font-weight: 600; color: #1D1D1F; letter-spacing: -0.02em;
}
```

### 타임라인 레이아웃 수치
- Rail: `position: absolute; top: 34px; height: 1px; background: #E8E8ED`
- 도트: `top: 30.5px; width: 7px; height: 7px` (center = 34px = rail y)
- Stem: `top: 37.5px; height: 20px; width: 1px`
- 카드 시작: `paddingTop: 58px`
- 연도 배지 marginTop: `25px`
- 카드 너비: `228px`, marginRight: `18px`
- 연도 배지 marginLeft (첫 번째 제외): `36px`
- 전체 좌우 패딩: `72px`

---

## 14. 타입 정의 요약

```typescript
// types/index.ts
interface FoodTrendData {
  id, slug, name, description, inventorName,
  imageUrl,           // 관리자가 직접 설정한 URL
  trendStartYear, trendStartMonth,
  status: 'active' | 'cooling' | 'archived',
  sortOrder, visible,
  stores: StoreSubmissionData[]
}

interface StoreSubmissionData {
  id, foodTrendId, sourceUrl, sourcePlatform,
  storeName,          // 현재는 항상 ""
  address,            // 현재는 항상 null
  businessHours,      // 현재는 항상 null
  thumbnailUrl,       // 현재는 항상 null
  moderationStatus,   // 현재는 항상 "published"
  createdAt
}
```

---

## 15. next.config.mjs 핵심 설정

```javascript
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  images: {
    remotePatterns: [/* 네이버 이미지 도메인들 */]
  }
};
```

- `output: "standalone"` — Cloudflare Workers 필수
- `serverExternalPackages` — Prisma 번들링 제외 (Workers 호환)
- `initOpenNextCloudflareForDev()` — 로컬 `next dev` 시 D1 에뮬레이션

---

## 16. 컴포넌트 상태 흐름

```
FoodTrendTimeline (상태 허브)
  ├── optimisticTrends      ← useOptimistic (제보 즉시 반영)
  ├── expandedTrendId       ← 어떤 카드가 펼쳐져 있는지
  ├── addingForTrend        ← 어떤 트렌드에 링크 추가 중인지
  ├── toast                 ← 성공/실패 토스트 메시지
  │
  ├── FoodTrendCard (per trend)
  │     props: trend, isExpanded, onToggle, onAddStore
  │
  ├── StoreList (per trend)
  │     props: stores, onAddStore
  │     └── StoreListItem (per store)
  │
  ├── AddStoreModal (conditional)
  │     onSubmit → handleSubmit() → submitStore() 서버 액션
  │
  └── SubmissionToast (conditional)
```

---

## 17. 현재 D1 데이터 현황

시드된 트렌드 13개:
- 탕후루 (2022.10), 소금빵 (2022.08), 마라탕 (2021.03), 흑당 버블티 (2020.06)
- 오마카세 (2021.09), 약과 (2022.05), 두바이 초콜릿 (2024.02)
- 그 외 다수

시드된 샘플 스토어 6개 포함 (마라천국 신촌점, 하오마라탕 건대점 등)

실제 사용자 제보: 1건 이상 (storeName: "" 상태)

---

## 18. 향후 개선 가능 사항 (미래의 Claude에게)

1. **스토어 이름 입력 허용** — 제보 시 상호명도 입력받도록 AddStoreModal 확장
2. **관리자 스토어 편집/삭제** — 어드민에서 제보된 링크 삭제 기능
3. **이미지 업로드** — Cloudflare R2 연동으로 URL 입력 대신 파일 업로드
4. **트렌드 정렬 드래그앤드롭** — 관리자 페이지에서 순서 직접 조정
5. **SEO 개선** — 트렌드별 `/trend/[slug]` 페이지 추가
6. **잔재 파일 정리** — `FoodTrendDetailModal.tsx`, `EmptyState.tsx`, `naver-enrichment.ts` 삭제

---

## 19. 긴급 복구 명령어

```bash
# 특정 트렌드 확인
npx wrangler d1 execute korean-food-trends-db --remote \
  --command="SELECT id, name, visible FROM FoodTrend ORDER BY trendStartYear, trendStartMonth"

# 제보 현황 확인
npx wrangler d1 execute korean-food-trends-db --remote \
  --command="SELECT foodTrendId, storeName, moderationStatus, createdAt FROM StoreSubmission ORDER BY createdAt DESC LIMIT 20"

# 특정 트렌드 이미지 URL 긴급 수정
npx wrangler d1 execute korean-food-trends-db --remote \
  --command="UPDATE FoodTrend SET imageUrl='https://...' WHERE slug='tang-hoo-roo'"

# 제보 삭제
npx wrangler d1 execute korean-food-trends-db --remote \
  --command="DELETE FROM StoreSubmission WHERE id='xxx'"

# Rate limit 초기화 (테스트용)
npx wrangler d1 execute korean-food-trends-db --remote \
  --command="DELETE FROM DailySubmissionQuota WHERE dateKey='2026-04-03'"
```

---

*마지막 업데이트: 2026-04-03 | 최신 커밋: cf876d3*

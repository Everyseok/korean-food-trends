# 한국 푸드 트렌드

한국의 음식 트렌드와 판매점을 한눈에 볼 수 있는 미니멀 웹사이트. 2020년부터 현재까지의 트렌드를 연도별 타임라인으로 시각화.

## 기술 스택

- **Next.js 14** App Router + Server Components
- **TypeScript** (strict)
- **Tailwind CSS** + Apple-inspired design tokens
- **Prisma** + SQLite (로컬) / Cloudflare D1 (프로덕션)
- **Zod** validation
- **Server Actions** for store submissions
- **NAVER Map URL enrichment** (best-effort HTML scraping)
- IP 기반 일일 제출 횟수 제한 (5회/일)
- **@opennextjs/cloudflare** + **wrangler** for Cloudflare Workers deployment

---

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성 (`.env.example` 참고):

```env
DATABASE_URL="file:./dev.db"
ADMIN_SECRET="admin-dev-secret"
```

### 3. 데이터베이스 초기화 + 시드

```bash
npm run setup
# 위 명령은 아래 3개를 순서대로 실행합니다:
# prisma generate
# prisma db push
# npx tsx prisma/seed.ts
```

또는 개별로:

```bash
npx prisma generate       # Prisma 클라이언트 생성
npx prisma db push        # 스키마 → SQLite 동기화
npx tsx prisma/seed.ts    # 13개 트렌드 + 샘플 판매점 삽입
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 관리자 패널

관리자 페이지: [http://localhost:3000/admin/trends](http://localhost:3000/admin/trends)

- 기본 비밀번호: `admin-dev-secret` (`.env`의 `ADMIN_SECRET` 값)
- 트렌드 추가 / 수정 / 공개·숨김 전환
- 판매점 카운트 확인

> 프로덕션 배포 전 반드시 `ADMIN_SECRET`을 강한 값으로 교체하세요.

---

## 빌드

```bash
npm run build
npm start
```

---

## Cloudflare Workers 배포

### 사전 준비

1. [Cloudflare 계정 생성](https://dash.cloudflare.com/sign-up)
2. `wrangler` 로그인:
   ```bash
   npx wrangler login
   ```

### D1 데이터베이스 생성

```bash
npx wrangler d1 create korean-food-trends-db
```

출력된 `database_id`를 복사해 `wrangler.jsonc`의 `"database_id"` 필드에 붙여넣기:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "korean-food-trends-db",
    "database_id": "여기에-실제-ID-입력"
  }
]
```

### D1에 스키마 적용

```bash
# 로컬 Prisma 스키마를 SQL로 내보내기
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql

# D1에 적용 (원격)
npx wrangler d1 execute korean-food-trends-db --remote --file=migration.sql

# 시드 데이터 삽입 (D1 원격) — seed SQL 별도 작성 필요
# 또는 로컬 wrangler dev로 SQLite 방식 사용
```

### `wrangler.jsonc` 환경 변수 설정

```jsonc
"vars": {
  "ADMIN_SECRET": "강한-비밀번호로-교체"
}
```

> 또는 Cloudflare Dashboard > Workers > Settings > Environment Variables 에서 설정 (권장)

### Cloudflare용 빌드 + 배포

```bash
# Cloudflare Workers 전용 빌드
npm run cf:build

# 로컬 프리뷰 (wrangler dev)
npm run cf:preview

# 실제 배포
npm run cf:deploy
```

---

## 커스텀 도메인 연결

1. Cloudflare Dashboard에서 도메인 추가
2. Workers > 배포된 Worker 선택 > Triggers > Custom Domains
3. 도메인 입력 후 저장 (DNS 자동 구성됨)

---

## Git 설정 및 푸시

```bash
cd /Users/junseokism/korean-food-trends

# 원격 저장소 추가 (GitHub 예시)
git remote add origin https://github.com/YOUR_USERNAME/korean-food-trends.git

# 첫 커밋 + 푸시
git add -A
git commit -m "feat: v0.2.0 — year timeline, admin panel, NAVER enrichment, Cloudflare deploy"
git push -u origin main
```

---

## 롤백

### 이전 배포로 롤백 (Cloudflare)

```bash
# 배포 히스토리 조회
npx wrangler deployments list

# 특정 배포로 롤백
npx wrangler rollback <deployment-id>
```

### 데이터베이스 롤백

D1은 자동 백업을 제공하지 않으므로, 중요 마이그레이션 전에 수동으로 export를 권장:

```bash
npx wrangler d1 export korean-food-trends-db --remote --output=backup.sql
```

---

## 폴더 구조

```
├── app/
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── globals.css                   # 글로벌 스타일
│   ├── page.tsx                      # 홈 (RSC — DB 조회, 연도별 정렬)
│   ├── admin/
│   │   ├── login/page.tsx            # 관리자 로그인
│   │   └── trends/page.tsx           # 트렌드 관리 (쿠키 인증)
│   └── api/admin/auth/route.ts       # 로그인 API (쿠키 발급)
├── components/
│   ├── FoodTrendTimeline.tsx         # 연도별 타임라인 (Client)
│   ├── FoodTrendCard.tsx             # 트렌드 카드 (status badge, month badge)
│   ├── FoodTrendDetailModal.tsx      # 트렌드 상세 모달
│   ├── AddStoreModal.tsx             # 판매점 등록 팝업
│   ├── StoreList.tsx                 # 판매점 목록
│   ├── StoreListItem.tsx             # 판매점 항목 (thumbnail, 확장)
│   ├── SubmissionToast.tsx           # 성공/오류 알림
│   ├── EmptyState.tsx                # 빈 상태
│   └── admin/
│       └── AdminTrendsClient.tsx     # 관리자 UI (Client)
├── actions/
│   ├── submit-store.ts               # 판매점 등록 Server Action
│   └── admin-trends.ts              # 관리자 트렌드 CRUD Server Actions
├── lib/
│   ├── prisma.ts                     # Prisma 클라이언트 싱글톤
│   ├── naver-parser.ts               # 네이버 지도 URL 검증 + 정제
│   ├── naver-enrichment.ts           # 메타데이터 보강 (og:title, og:image 등)
│   ├── rate-limit.ts                 # 일일 제출 횟수 제한
│   ├── cloudflare-env.ts             # Cloudflare Workers 타입 정의
│   └── utils.ts                      # cn() 유틸
├── prisma/
│   ├── schema.prisma                 # DB 스키마
│   └── seed.ts                       # 시드 (13개 트렌드 + 샘플 판매점)
├── types/
│   └── index.ts                      # 공유 타입
├── open-next.config.ts               # @opennextjs/cloudflare 설정
├── wrangler.jsonc                    # Cloudflare Workers 설정
└── next.config.mjs                   # Next.js 설정
```

---

## 데이터 모델

| 모델 | 주요 필드 |
|---|---|
| `FoodTrend` | slug, name, description, inventorName, imageUrl, trendStartYear, trendStartMonth, status (active/cooling/archived), sortOrder, visible |
| `StoreSubmission` | foodTrendId, sourceUrl, storeName, address, businessHours, thumbnailUrl, moderationStatus (published/pending_enrichment/pending_llm_check/flagged), submitterFingerprint |
| `DailySubmissionQuota` | fingerprint, dateKey (YYYY-MM-DD KST), count |

---

## 핵심 UX

- **연도별 가로 스크롤 타임라인**: 연도 헤더 + 그 해의 트렌드가 가로 스크롤 행으로 구성
- **상태 배지**: 인기중(emerald) / 소강(amber) / 종료(gray)
- **판매점 목록 확장**: 클릭/hover 시 썸네일·주소·영업시간 확장, 네이버 지도 링크
- **낙관적 UI**: 등록 즉시 목록에 표시 (`useOptimistic`)
- **NAVER 메타데이터 보강**: URL 제출 시 og:title, og:image, og:description, JSON-LD를 best-effort로 추출

---

## 향후 개발 계획

### NAVER 공식 API 연동
`lib/naver-enrichment.ts`를 NAVER Search API / Place API로 교체하면 더 안정적인 메타데이터 수집 가능.

### LLM 자동 심사
```typescript
// prisma/schema.prisma — metadataJson에 아래 필드 추가 예정:
// verificationConfidence: number  // 0–1, LLM 판단 신뢰도
// verificationNote: string        // LLM 판단 근거
// llmCheckedAt: string            // ISO timestamp
```

### 인증 개선
NextAuth 기반 소셜 로그인으로 fingerprint → userId 전환 가능.

---

## 환경 변수

| 변수 | 설명 | 기본값 |
|---|---|---|
| `DATABASE_URL` | SQLite 파일 경로 | `file:./dev.db` |
| `ADMIN_SECRET` | 관리자 비밀번호 | `admin-dev-secret` |

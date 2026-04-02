import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trends = [
  {
    slug: 'dalgona-coffee',
    name: '달고나커피',
    description: '집카페 열풍과 함께 퍼진 수제 거품 커피 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FFF3E0/B45309?text=달고나커피',
    trendStartYear: 2020,
    trendStartMonth: 3,
    status: 'archived',
    sortOrder: 1,
    visible: true,
  },
  {
    slug: 'croffle',
    name: '크로플',
    description: '크루아상 생지를 와플처럼 눌러 구워낸 디저트 빵 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FEF3C7/92400E?text=크로플',
    trendStartYear: 2020,
    trendStartMonth: 10,
    status: 'archived',
    sortOrder: 2,
    visible: true,
  },
  {
    slug: 'bagel',
    name: '베이글',
    description: '프리미엄 베이글 전문점과 오픈런 문화를 이끈 베이커리 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/F0EEE8/555555?text=베이글',
    trendStartYear: 2021,
    trendStartMonth: 9,
    status: 'archived',
    sortOrder: 3,
    visible: true,
  },
  {
    slug: 'salt-bread',
    name: '소금빵',
    description: '짭짤한 버터 풍미와 바삭한 식감으로 대중화된 베이커리 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FFF8E8/A67C52?text=소금빵',
    trendStartYear: 2022,
    trendStartMonth: 7,
    status: 'cooling',
    sortOrder: 4,
    visible: true,
  },
  {
    slug: 'yogurt-ice-cream',
    name: '요거트아이스크림',
    description: '과일과 토핑 커스터마이징으로 확산된 요거트 아이스크림 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/D6E8FF/2B6CB0?text=요거트아이스크림',
    trendStartYear: 2022,
    trendStartMonth: 6,
    status: 'active',
    sortOrder: 5,
    visible: true,
  },
  {
    slug: 'tanghulu',
    name: '탕후루',
    description: '과일에 설탕 코팅을 입힌 강한 비주얼 중심의 디저트 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FFE8D6/C46A3A?text=탕후루',
    trendStartYear: 2023,
    trendStartMonth: 1,
    status: 'archived',
    sortOrder: 6,
    visible: true,
  },
  {
    slug: 'malatang',
    name: '마라탕',
    description: '얼얼한 향신료 풍미와 커스터마이징 조합으로 지속된 매운맛 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FFE4E4/C41E3A?text=마라탕',
    trendStartYear: 2023,
    trendStartMonth: 1,
    status: 'cooling',
    sortOrder: 7,
    visible: true,
  },
  {
    slug: 'crookie',
    name: '크루키',
    description: '크루아상과 쿠키를 결합한 상반기 디저트 빵 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FEF9C3/78350F?text=크루키',
    trendStartYear: 2024,
    trendStartMonth: 4,
    status: 'archived',
    sortOrder: 8,
    visible: true,
  },
  {
    slug: 'dubai-chocolate',
    name: '두바이초콜릿',
    description: '피스타치오 스프레드와 카다이프 식감으로 확산된 디저트 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/E8D5F0/7B2FBE?text=두바이초콜릿',
    trendStartYear: 2024,
    trendStartMonth: 5,
    status: 'archived',
    sortOrder: 9,
    visible: true,
  },
  {
    slug: 'acai-bowl',
    name: '아사이볼',
    description: '보랏빛 비주얼과 과일 토핑으로 확산된 헬시 디저트 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/EDE7F6/5B21B6?text=아사이볼',
    trendStartYear: 2025,
    trendStartMonth: 5,
    status: 'active',
    sortOrder: 10,
    visible: true,
  },
  {
    slug: 'duzzonku',
    name: '두쫀쿠',
    description: '두바이 초콜릿 계열 재료감을 변형한 쫀득한 쿠키형 디저트 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/D1FAE5/065F46?text=두쫀쿠',
    trendStartYear: 2026,
    trendStartMonth: 1,
    status: 'archived',
    sortOrder: 11,
    visible: true,
  },
  {
    slug: 'bomdong-bibimbap',
    name: '봄동비빔밥',
    description: '제철 봄동을 전면에 내세운 초단기 시즌형 메뉴 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/D1FAE5/166534?text=봄동비빔밥',
    trendStartYear: 2026,
    trendStartMonth: 2,
    status: 'archived',
    sortOrder: 12,
    visible: true,
  },
  {
    slug: 'shanghai-butter-rice-cake',
    name: '상하이버터떡',
    description: '상하이식 버터 떡 디저트를 변형한 겉바속쫀 계열의 초단기 트렌드.',
    inventorName: '',
    imageUrl: 'https://placehold.co/400x300/FEF3C7/B45309?text=상하이버터떡',
    trendStartYear: 2026,
    trendStartMonth: 3,
    status: 'active',
    sortOrder: 13,
    visible: true,
  },
];

async function main() {
  console.log('시드 데이터 삽입 시작...');

  // Reset all food trends
  await prisma.storeSubmission.deleteMany({});
  await prisma.foodTrend.deleteMany({});

  for (const trend of trends) {
    await prisma.foodTrend.create({ data: trend });
  }

  // Sample stores for demo
  const tanghulu = await prisma.foodTrend.findUnique({ where: { slug: 'tanghulu' } });
  const saltBread = await prisma.foodTrend.findUnique({ where: { slug: 'salt-bread' } });
  const malatang = await prisma.foodTrend.findUnique({ where: { slug: 'malatang' } });
  const acai = await prisma.foodTrend.findUnique({ where: { slug: 'acai-bowl' } });

  const sampleStores = [
    ...(tanghulu ? [
      { foodTrendId: tanghulu.id, sourceUrl: 'https://map.naver.com/v5/entry/place/1234567890', storeName: '탕후루왕 홍대점', address: '서울 마포구 홍익로 20', businessHours: '11:00 - 22:00', metadataJson: JSON.stringify({ enrichmentStatus: 'complete', placeId: '1234567890' }) },
      { foodTrendId: tanghulu.id, sourceUrl: 'https://map.naver.com/v5/entry/place/0987654321', storeName: '달콤탕후루 강남점', address: '서울 강남구 테헤란로 152', businessHours: '10:00 - 22:00', metadataJson: JSON.stringify({ enrichmentStatus: 'complete', placeId: '0987654321' }) },
    ] : []),
    ...(saltBread ? [
      { foodTrendId: saltBread.id, sourceUrl: 'https://map.naver.com/v5/entry/place/1111111111', storeName: '소금빵연구소 성수점', address: '서울 성동구 성수이로 77', businessHours: '09:00 - 20:00', metadataJson: JSON.stringify({ enrichmentStatus: 'complete' }) },
    ] : []),
    ...(malatang ? [
      { foodTrendId: malatang.id, sourceUrl: 'https://map.naver.com/v5/entry/place/2222222222', storeName: '마라천국 신촌점', address: '서울 서대문구 신촌로 83', businessHours: '11:00 - 23:30', metadataJson: JSON.stringify({ enrichmentStatus: 'complete' }) },
      { foodTrendId: malatang.id, sourceUrl: 'https://map.naver.com/v5/entry/place/3333333333', storeName: '하오마라탕 건대점', address: '서울 광진구 능동로 197', businessHours: '11:00 - 23:00', metadataJson: JSON.stringify({ enrichmentStatus: 'complete' }) },
    ] : []),
    ...(acai ? [
      { foodTrendId: acai.id, sourceUrl: 'https://map.naver.com/v5/entry/place/4444444444', storeName: '아사이웍스 연남점', address: '서울 마포구 연남동 227-12', businessHours: '10:00 - 21:00', metadataJson: JSON.stringify({ enrichmentStatus: 'complete' }) },
    ] : []),
  ];

  for (const store of sampleStores) {
    await prisma.storeSubmission.create({
      data: {
        ...store,
        sourcePlatform: 'naver_map',
        moderationStatus: 'published',
        submitterFingerprint: 'seed',
        thumbnailUrl: null,
      },
    });
  }

  console.log(`✓ 푸드 트렌드 ${trends.length}개 삽입 완료`);
  console.log('✓ 샘플 판매점 데이터 삽입 완료');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

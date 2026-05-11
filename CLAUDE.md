# Dog Diary 프로젝트

## 프로젝트 개요
강아지 퐁이(말티푸, 2026-01-30생)의 일지 및 공유 웹앱.
커플(나 + 여자친구)이 함께 사용하는 강아지 케어 기록 서비스.
Vercel 배포 완료: https://dog-diary-iota.vercel.app

## 기술 스택
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Supabase (DB + Auth + Realtime)
- OpenWeatherMap API (날씨)
- Kakao Map API (산책 경로 추천)
- react-calendar (달력 UI)
- recharts (몸무게 트렌드 차트)
- web-push (푸시 알림, VAPID)

## 구현 완료된 기능

### 인증 / 커플 공유
- Supabase Auth 이메일 로그인 (app/login)
- 초대코드로 커플 연결 (couples 테이블, InviteCode 컴포넌트)
- couple_id 기반으로 모든 데이터 공유
- 커플 연결 전 setup 페이지 (app/setup)

### 메인 화면 (app/page.tsx)
- TodayCard: 오늘 일지 요약 카드, 미작성 시 "일지 쓰기 →", 작성 시 "수정하기 →"
- WeatherCard: OpenWeatherMap 날씨 + 산책 추천 문구
- DiaryCalendar: react-calendar, 기록 있는 날 amber dot, 특별한 날 컬러 dot + 범례
- KakaoMap: 주변 산책 경로 추천
- UpcomingEvents: 다가오는 특별한 날 D-day 카운트다운
- WeightChart: recharts 몸무게 트렌드 라인차트 (자체 fetch, 새로고침 버튼)
- PushSubscribe: 웹 푸시 알림 구독 상태 표시
- InviteCode: 초대코드 표시 / 입력

### 일지 (app/diary/[date]/page.tsx)
- WalkTimer: 출발/도착 버튼 산책 타이머, 완료된 산책 기록 목록, 진행 중엔 amber 배경
- DiaryForm: 몸무게(소수점 2자리), 급여량(3회/4회 선택, 아침/점심/저녁/자기전), 배변활동(시간 포함), 메모, 저장 시 파트너에게 푸시 알림
- SpecialEvents: 특별한 날 기록 (병원/미용/예방접종/구충/목욕/기타), 타입별 이모지

### 프로필 (app/profile/page.tsx)
- DogProfile: 퐁이 나이(일수/주수/개월수), 현재 몸무게, 일지 작성 수, 품종 입력, 중성화 여부 토글
- 생년월일 하드코딩: 2026-01-30

### PWA
- manifest.ts: standalone, theme_color #fbbf24, background_color #fffbeb
- 아이콘: /pong.jpeg (EXIF orientation 1로 픽셀 회전 완료)
- 푸시 알림: service worker (public/sw.js), VAPID 키 환경변수
- 스플래시 스크린: apple-touch-startup-image (iPhone SE~15 Pro Max 전 기종), SplashScreen 컴포넌트 (세션 첫 진입 시 페이드아웃)
- loading.tsx: 페이지 이동 시 Suspense 로딩 화면

## Supabase 테이블 구조

| 테이블 | 주요 컬럼 |
|--------|----------|
| profiles | id(=auth uid), couple_id |
| couples | id, invite_code |
| diary | id, couple_id, date, weight(numeric 5,2), meal_count, meal_morning/lunch/dinner/night, memo |
| poops | id, couple_id, date, recorded_at |
| walks | id, couple_id, date, start_time, end_time |
| special_events | id, couple_id, date, type, memo |
| dog_profiles | id, couple_id, breed, neutered |
| push_subscriptions | id, user_id, couple_id, subscription(json) |

- diary: upsert 시 `onConflict: 'couple_id,date'` 필수
- dog_profiles: upsert 시 `onConflict: 'couple_id'` 필수
- Realtime: diary, special_events 테이블 활성화됨 (`ALTER PUBLICATION supabase_realtime ADD TABLE ...`)

## 환경변수 (Vercel에 등록)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_OPENWEATHER_API_KEY
NEXT_PUBLIC_KAKAO_MAP_KEY
VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
```
- VAPID_SUBJECT: `mailto:forever296@naver.com` (코드 내 하드코딩)
- VERCEL_URL: Vercel 자동 주입

## 주요 파일 구조
```
app/
  layout.tsx         # 헤더(ProfileButton, LogoutButton), SplashScreen, apple-touch-startup-image 메타태그
  page.tsx           # 메인 화면
  loading.tsx        # 전역 로딩 화면
  manifest.ts        # PWA 매니페스트
  icon.tsx           # /icon 라우트 (nodejs, force-dynamic, readFileSync)
  apple-icon.tsx     # /apple-icon 라우트
  splash-screen/     # /splash-screen?w=&h= - apple-touch-startup-image 동적 생성
  diary/[date]/      # 일지 상세 페이지
  profile/           # 프로필 페이지
  login/             # 로그인
  setup/             # 커플 연결
  api/push/send/     # 파트너에게 푸시 발송
  api/push/subscribe/ # 푸시 구독 저장

components/
  DiaryCalendar.tsx  # 달력 (Realtime 구독, 마운트 시 fresh fetch)
  DiaryForm.tsx      # 일지 작성 폼
  WalkTimer.tsx      # 산책 타이머
  SpecialEvents.tsx  # 특별한 날 기록
  TodayCard.tsx      # 오늘 요약 카드
  WeightChart.tsx    # 몸무게 차트
  DogProfile.tsx     # 퐁이 프로필
  UpcomingEvents.tsx # 다가오는 일정 D-day
  SplashScreen.tsx   # PWA 시작 스플래시
  BackButton.tsx     # 뒤로가기 (로딩 스피너 포함)
  ProfileButton.tsx  # 헤더 프로필 버튼 (로딩 스피너 포함)
  Toast.tsx          # 성공/오류 토스트

lib/
  supabase.ts        # 클라이언트용 Supabase
  supabase-server.ts # 서버 컴포넌트용 Supabase (SSR 쿠키)

public/
  pong.jpeg          # 퐁이 사진 (EXIF orientation=1, 픽셀 정방향)
  sw.js              # 서비스 워커 (푸시 알림 처리)
```

## next.config.ts 주의사항
```ts
outputFileTracingIncludes: {
  '/icon': ['./public/pong.jpeg'],
  '/apple-icon': ['./public/pong.jpeg'],
  '/splash-screen': ['./public/pong.jpeg'],
}
```
Vercel Lambda에서 public/ 파일 접근 불가 문제 → 위 설정 필수

## 향후 할 일 (미구현)
- [ ] 사진 업로드 (Supabase Storage)
- [ ] 산책 경로 지도에 그리기 (GPS 트래킹)
- [ ] 통계/리포트 페이지 (월별 요약)
- [ ] 예방접종 일정 알림 자동화

## 참고 사항
- 모든 UI 한국어, 모바일 최적화 (max-w-lg)
- 색상 테마: amber (amber-400 주조색, amber-50 배경)
- 퐁이 생년월일: 2026년 1월 30일 (DogProfile.tsx에 하드코딩)
- pong.jpeg EXIF 이슈: 과거에 sips/Python으로 픽셀 회전 완료, 다시 건드리지 말 것

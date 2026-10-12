# 감정 일기

오늘의 감정과 마음을 Supabase에 기록하고, 감정별로 돌아볼 수 있는 한국어 감정 일기 앱입니다. 작성한 기록은 현재 Supabase 프로젝트의 `diaries` 테이블에 저장됩니다.

## 기능

- 다섯 가지 감정(기쁨, 평온, 슬픔, 화남, 불안)과 짧은 일기 작성
- 최신순 기록 목록, 감정 필터, 기록 삭제
- 로딩, 저장 중, 오류, 빈 목록 상태 안내
- Tailwind CSS 기반의 반응형 화면

## 실행 방법

1. 의존성을 설치합니다.

   ```bash
   npm install
   ```

2. 프로젝트 루트의 `.env.example`을 `.env.local`로 복사하고 Supabase 프로젝트 설정을 입력합니다.

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   `.env.local`은 Git에 커밋하지 마세요. 환경변수를 바꾼 뒤에는 개발 서버를 다시 시작합니다.

3. 개발 서버를 실행합니다.

   ```bash
   npm run dev
   ```

프로덕션 빌드와 정적 검사:

```bash
npm run build
npm run lint
```

## 데이터와 접근 권한

앱은 이미 생성된 `diaries` 테이블의 `id`, `content`, `emotion`, `created_at` 컬럼을 사용하며 테이블을 생성하거나 변경하지 않습니다. `id`와 `created_at`은 데이터베이스가 생성합니다.

로그인 기능이나 사용자별 소유권은 없습니다. 따라서 RLS 정책과 테이블 권한이 허용하는 경우 이 앱의 모든 이용자가 같은 일기를 읽고, 추가하고, 삭제할 수 있습니다. 민감한 개인 정보를 기록하지 마세요. 브라우저에 전달되는 publishable key 자체는 비밀이 아니며, 실제 데이터 접근 통제는 Supabase의 RLS 정책과 권한으로 설정해야 합니다. 설정이 누락되어 요청이 거부되면 앱에 오류가 표시됩니다.

# 마음기록 — 감정 일기

하루의 감정과 짧은 기록을 남기고 돌아보는 한국어 감정 일기 앱입니다. 일기는 브라우저 로컬 저장소가 아닌 Supabase에 저장되므로, 같은 Supabase 프로젝트를 사용하는 기기에서는 같은 기록을 볼 수 있습니다.

## 주요 기능

- 기쁨, 평온, 슬픔, 화남, 불안 중 오늘의 감정을 고르고 일기 작성
- 최신순 기록 목록과 감정별 필터
- 기록 삭제
- 불러오는 중, 저장 중, 요청 오류, 기록이 없을 때의 화면 표시
- 감정과 내용이 모두 입력되어야 저장할 수 있도록 검증
- 휴대전화와 데스크톱 화면을 고려한 Tailwind CSS 반응형 UI

## 기술 구성

- Vite와 React
- Tailwind CSS 4의 Vite 플러그인
- `@supabase/supabase-js`
- Supabase `diaries` 테이블

Supabase 클라이언트는 [`src/lib/supabase.js`](./src/lib/supabase.js)에서 한 번 생성합니다. 화면은 데이터베이스를 직접 호출하지 않고, 조회·추가·삭제 함수가 모여 있는 [`src/api/diaries.js`](./src/api/diaries.js)를 사용합니다. 화면과 상태 처리는 [`src/App.jsx`](./src/App.jsx)에 있습니다.

## 데이터 구조

앱은 이미 만들어진 Supabase `public.diaries` 테이블을 사용합니다. 앱이 테이블이나 컬럼을 생성·변경하지 않습니다.

| 컬럼 | 형식 | 설명 |
| --- | --- | --- |
| `id` | `bigint` | 데이터베이스가 자동 생성하는 일기 ID |
| `content` | `text` | 일기 내용 |
| `emotion` | `text` | `joy`, `calm`, `sad`, `angry`, `anxious` 중 하나 |
| `created_at` | `timestamptz` | 데이터베이스가 자동 생성하는 작성 시각 |

## 로컬에서 실행하기

필요한 도구: Node.js와 npm.

1. 의존성을 설치합니다.

   ```bash
   npm install
   ```

2. 프로젝트 루트의 `.env.example`을 `.env.local`로 복사하고 Supabase 프로젝트의 URL과 **publishable key**를 설정합니다.

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   `.env.local`은 Git에 커밋하지 마세요. 값이 없거나 잘못되면 앱이 Supabase에 연결할 수 없습니다. 환경변수를 수정한 뒤에는 개발 서버를 다시 시작하세요.

3. 개발 서버를 시작합니다.

   ```bash
   npm run dev
   ```

4. 터미널에 표시된 로컬 주소를 브라우저에서 엽니다.

프로덕션 빌드와 로컬 빌드 미리보기:

```bash
npm run build
npm run preview
```

정적 코드 검사:

```bash
npm run lint
```

## 배포

Vite 정적 사이트를 지원하는 호스팅 서비스에 저장소를 연결하고 빌드 명령을 `npm run build`, 출력 폴더를 `dist`로 지정합니다. 호스팅 서비스의 환경변수 설정에도 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_PUBLISHABLE_KEY`를 등록한 뒤 배포하세요. 환경변수 변경 후에는 다시 빌드·배포해야 합니다.

## 데이터 공개 범위와 보안

현재 앱에는 로그인이나 사용자별 일기 소유권이 없습니다. 따라서 같은 Supabase 프로젝트를 사용하는 이용자는 RLS 정책과 테이블 권한이 허용하는 범위에서 같은 일기를 읽고, 추가하고, 삭제할 수 있습니다. 개인적이거나 민감한 내용은 기록하지 마세요.

`VITE_` 환경변수는 브라우저 앱에 포함되므로 publishable key는 비밀 키가 아닙니다. 보안 경계는 Supabase의 RLS 정책과 테이블 권한입니다. `service_role` 또는 secret key를 앱에 넣지 마세요. Supabase 접근 정책이 요청을 허용하지 않으면 앱에서 오류를 표시합니다.

테이블과 정책을 처음 설정하는 실습 절차는 [`guide.md`](./guide.md)를 참고하세요.

# Vercel 배포 가이드 (GitHub 연동)

이 문서는 React/Vite 프로젝트를 GitHub 저장소와 연동하여 Vercel에 자동 배포하는 방법을 안내합니다.

## 사전 준비사항

1. GitHub 계정
2. Vercel 계정 (https://vercel.com 에서 가입)
3. Git이 설치되어 있어야 함

## 1단계: GitHub 저장소 생성 및 코드 푸시

### 1.1 GitHub 저장소 생성

1. GitHub에 로그인 후 https://github.com/new 에서 새 저장소 생성
2. 저장소 이름 입력 (예: `repoWeb`)
3. Public 또는 Private 선택
4. **README, .gitignore, license는 추가하지 않음** (이미 프로젝트에 있음)
5. "Create repository" 클릭

### 1.2 로컬 저장소 초기화 및 푸시

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
# Git 저장소 초기화 (이미 초기화되어 있다면 생략)
git init

# 모든 파일 스테이징
git add .

# 첫 커밋 생성
git commit -m "Initial commit: React/Vite project setup"

# GitHub 저장소를 원격 저장소로 추가 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# main 브랜치로 푸시
git branch -M main
git push -u origin main
```

## 2단계: Vercel에서 프로젝트 import

### 2.1 Vercel 대시보드 접속

1. https://vercel.com 에 로그인
2. 대시보드에서 "Add New..." → "Project" 클릭

### 2.2 GitHub 저장소 연동

1. "Import Git Repository" 섹션에서 GitHub 계정 연결 (처음이라면 GitHub 인증 필요)
2. 생성한 저장소를 검색하여 선택
3. "Import" 클릭

### 2.3 프로젝트 설정

Vercel이 자동으로 Vite 프로젝트를 감지합니다. 다음 설정을 확인하세요:

- **Framework Preset**: Vite (자동 감지됨)
- **Root Directory**: `app` (프로젝트가 app 폴더 안에 있으므로)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `dist` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

**중요**: Root Directory를 `app`으로 설정해야 합니다!

### 2.4 환경 변수 설정 (선택사항)

Supabase를 사용하는 경우 환경 변수를 추가해야 합니다:

1. "Environment Variables" 섹션으로 이동
2. 필요한 환경 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - 기타 필요한 환경 변수
3. 각 환경 변수에 대해 적용할 환경 선택 (Production, Preview, Development)

### 2.5 배포 시작

1. 모든 설정 확인 후 "Deploy" 클릭
2. 배포가 시작되며 빌드 로그를 실시간으로 확인할 수 있습니다
3. 배포 완료 후 배포 URL이 제공됩니다

## 3단계: 자동 배포 확인

### 3.1 자동 배포 동작

다음 상황에서 자동으로 배포가 트리거됩니다:

- **Production 배포**: `main` 브랜치에 푸시할 때마다
- **Preview 배포**: 다른 브랜치에 푸시하거나 Pull Request 생성 시

### 3.2 배포 상태 확인

1. Vercel 대시보드에서 프로젝트 선택
2. "Deployments" 탭에서 모든 배포 내역 확인
3. 각 배포의 상태, 빌드 로그, 배포 URL 확인 가능

## 4단계: 커스텀 도메인 설정 (선택사항)

### 4.1 도메인 추가

1. Vercel 프로젝트 설정에서 "Domains" 섹션으로 이동
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 제공업체에서 DNS 레코드 추가

## 문제 해결

### 빌드 실패 시

1. **빌드 로그 확인**: Vercel 대시보드의 배포 상세 페이지에서 빌드 로그 확인
2. **로컬 빌드 테스트**: 
   ```bash
   cd app
   npm install
   npm run build
   ```
3. **환경 변수 확인**: 필요한 환경 변수가 모두 설정되었는지 확인

### 라우팅 문제

React Router를 사용하는 경우 `vercel.json` 파일의 rewrites 설정이 올바른지 확인하세요. 모든 경로가 `index.html`로 리다이렉트되어야 합니다.

### Root Directory 설정

프로젝트가 `app` 폴더 안에 있는 경우, Vercel 설정에서 Root Directory를 `app`으로 설정해야 합니다.

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [React Router 배포 가이드](https://reactrouter.com/en/main/start/overview#deploying)


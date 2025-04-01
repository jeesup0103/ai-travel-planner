# AI Travel Planner

LangChain과 Google Maps API를 활용한 대화형 여행지 추천 시스템 개발

## 프로젝트 소개
이 프로젝트는 사용자의 자연어 입력을 기반으로 여행지를 추천하고, Google Maps를 통해 시각적으로 표시하는 대화형 여행 계획 시스템입니다.

## 주요 기능
- 자연어 기반 대화형 인터페이스
- Google Maps를 통한 시각적 여행지 표시
- 개인 맞춤형 여행지 추천
- 실시간 위치 기반 추천

## 기술 스택
- Frontend: React
- Backend:
  - User Service: Spring Boot (Java)
  - AI Service: FastAPI (Python)
- Database: PostgreSQL
- AI: LangChain, OpenAI API
- Maps: Google Maps API
- Authentication: Google OAuth2

## 프로젝트 구조
```
ai-travel-planner/
├── frontend/           # React 프론트엔드
├── backend/           # Spring Boot 백엔드 (사용자 관리)
│   ├── src/
│   └── pom.xml
├── ai-service/        # FastAPI 백엔드 (AI 추천)
│   ├── app/
│   └── requirements.txt
├── docs/             # 프로젝트 문서
└── README.md         # 프로젝트 설명
```

## 시작하기
1. 저장소 클론
```bash
git clone https://github.com/jeesup0103/ai-travel-planner.git
```

2. 환경 설정
- Frontend: Node.js 18+ 필요
- Backend: Java 17+, Maven 필요
- AI Service: Python 3.9+ 필요
- Database: PostgreSQL 필요

3. API 키 설정
- Google Maps API 키
- OpenAI API 키
- Google OAuth2 클라이언트 ID

## 개발 가이드
자세한 개발 가이드는 `docs/` 디렉토리를 참조하세요.

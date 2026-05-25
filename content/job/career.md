+++
title = "김철규 게임 클라이언트 경력기술서"
layout = "pdf"
url = "/job/career/"
pdfFile = "KimCheolGyu_GameClient_CareerDescription.pdf"
+++

{{% pdf-page number="1 / 5" %}}
<div class="eyebrow">Career Description</div>

# 김철규
<p class="subtitle">Unity 클라이언트 개발자</p>

<div class="meta-row">
  <span class="pill">Action Game</span>
  <span class="pill">Roguelike Game</span>
  <span class="pill">Metaverse</span>
  <span class="pill">XR</span>
  <span class="pill">Media Art</span>
</div>

<div class="section grid one">
  <div class="card blue">
    <h3>RFist</h3>
    <ul class="tight">
      <li>Photon Fusion2 기반 멀티플레이 액션 게임 클라이언트 개발</li>
      <li>입력 권한, NetworkInput, 캐릭터 상태 동기화 흐름 구현</li>
      <li>캐릭터 입력, 이동, 대시, 가드, 공격 실행 구조 개발</li>
      <li>스킬/어빌리티, 피격 판정, 애니메이션/VFX 연동</li>
    </ul>
  </div>
  <div class="card green">
    <h3>Slime Rush</h3>
    <ul class="tight">
      <li>Steam 로그라이크 액션 게임 전투/업적 시스템 개발</li>
      <li>타겟팅, 데미지 계산, 치명타/속성 보너스 계산 구조 설계</li>
      <li>업적 조건, 진행도, 보상 수령 상태 관리</li>
      <li>로컬/클라우드 저장소와 UI/도메인 로직 분리</li>
    </ul>
  </div>
  <div class="card amber">
    <h3>Rfice</h3>
    <ul class="tight">
      <li>메타버스 플랫폼 Unity 클라이언트 기능 개발</li>
      <li>하우징/공간 편집, Raycast 기반 오브젝트 선택/배치/편집</li>
      <li>파일 공유 뷰어, 옵션 관리, 모바일 컨트롤러, 보조 카메라 개발</li>
      <li>WebGL, iOS, Android 환경 빌드 및 플랫폼 이슈 대응</li>
    </ul>
  </div>
  <div class="card blue">
    <h3>XR</h3>
    <ul class="tight">
      <li>AR/VR/WebGL 기반 인터랙티브 콘텐츠 개발</li>
      <li>마커 기반 AR 어플리케이션 다수 개발 및 유지보수</li>
      <li>AOS/iOS 모바일 빌드, 배포, 플랫폼 이슈 대응</li>
      <li>Firebase 기반 에셋 번들/스토리지 연동 및 콘텐츠 업데이트</li>
    </ul>
  </div>
</div>
<br>
<div class="section">
  <h2>경력 개요</h2>
  <table class="table">
    <tr><th>총 경력</th><td>Unity 클라이언트 개발 8년</td></tr>
    <tr><th>최근 직무</th><td>(주)알서포트 연구개발본부 XR개발팀 / Unity 클라이언트 개발자</td></tr>
    <tr><th>주요 프로젝트 분야</th><td>멀티플레이 액션 게임, 로그라이크 액션 게임, 3D 메타버스 플랫폼, AR/VR/WebGL 콘텐츠</td></tr>
    <tr><th>역할</th><td>시스템 설계, 런타임 기능 구현, 플랫폼 대응, 코드 리뷰 기반 구조 개선, 소규모 팀 리딩</td></tr>
  </table>
</div>


{{% /pdf-page %}}

{{% pdf-page number="2 / 5" %}}
<div class="eyebrow">Project 01</div>

## RFist - 멀티플레이 액션 게임 시스템

<table class="table">
  <tr><th>기간</th><td>2025.01 - 2025.12</td></tr>
  <tr><th>프로젝트</th><td>3인칭 멀티플레이 대전 격투 액션 게임</td></tr>
  <tr><th>역할</th><td>게임 시스템 설계 및 개발(플레이어 캐릭터 중심)</td></tr>
  <tr><th>기술</th><td>Physics, Photon Fusion2, Input System, Addressables, DOTween, Timeline </td></tr>
</table>

<div class="section grid two">
  <div class="card blue">
    <h3>담당 영역</h3>
    <ul>
      <li>캐릭터 네트워크 동기화 설계 및 개발</li>
      <li>캐릭터 컨트롤/입력 처리 설계 및 개발</li>
      <li>캐릭터 스킬/어빌리티 시스템 설계 및 개발</li>
      <li>캐릭터 피격 및 상태 시스템 설계 및 개발</li>
      <li>캐릭터 애니메이션/전투 연출 설계 및 개발</li>
      <li>이펙트 시스템 설계 및 개발</li>
    </ul>
  </div>
  <div class="card green">
    <h3>구현 중점</h3>
    <ul>
      <li>입력 권한이 있는 클라이언트만 입력 생성</li>
      <li>입력 데이터와 액션 실행 계층 분리</li>
      <li>네트워크 지연값을 전투 판정 계층까지 전달</li>
      <li>스킬 정의와 실행 로직을 분리해 확장성 확보</li>
      <li>히트 판정 요청/결과/반응을 분리해 테스트 가능성 확보</li>
    </ul>
  </div>
</div>

<div class="section card">
    <h3>구현 성과</h3>
    <ul>
      <li>멀티플레이 액션 게임에서 입력 수집부터 실제 캐릭터 동작까지 이어지는 런타임 파이프라인을 구성</li>
      <li>스킬 실행, 피격 처리, 연출(애니메이션/이펙트 등)의 책임 분리 및 주요 행동 흐름을 이벤트 기반으로 연결해 기능 추가 및 수정 시 영향 범위 최소화</li>
      <li>네트워크, 입력, 전투, 캐릭터 연출 계층을 분리해 멀티플레이 액션 게임 클라이언트의 주요 런타임 흐름을 구현</li>
    </ul>
    <h4>동작 영상 링크</h4>
    <h4>코드 샘플 링크</h4>
</div>
{{% /pdf-page %}}

{{% pdf-page number="3 / 5" %}}
<div class="eyebrow">Project 02</div>

## Slime Rush - 전투/업적 시스템

<table class="table">
  <tr><th>기간</th><td>2024.01 - 2024.11</td></tr>
  <tr><th>프로젝트</th><td>Steam 출시 대상 로그라이크 액션 핵앤슬래시 게임</td></tr>
  <tr><th>역할</th><td>전투 시스템 및 업적 시스템 설계/개발</td></tr>
  <tr><th>기술</th><td>Zenject, Localization, Scriptable Object</td></tr>
</table>

<div class="section grid two">
  <div class="card blue">
    <h3>전투 시스템</h3>
    <ul>
      <li>플레이어 캐릭터 동작과 적 동작 흐름 구현</li>
      <li>단일/다중/랜덤/위치 기반 타겟팅 처리</li>
      <li>캐릭터 스탯과 스킬 데이터를 기반으로 데미지 정보 생성</li>
      <li>치명타, 속성 보너스, 스킬 보너스 등 부가 효과 계산</li>
      <li>타겟 탐색과 데미지 계산 책임 분리</li>
    </ul>
  </div>
  <div class="card green">
    <h3>업적 시스템</h3>
    <ul>
      <li>업적 정의, 진행도 저장, 보상 수령 상태 분리</li>
      <li>로컬 저장소와 클라우드 저장소를 교체 가능한 구조 제작</li>
      <li>업적 달성 조건 판단 로직을 분리해 신규 업적 추가 시 기존 처리 흐름 수정 최소화</li>
      <li>UI와 도메인 로직을 분리해 테스트 가능성 확보</li>
    </ul>

  </div>
</div>

<div class="section card">
  <h3>구현 성과</h3>
  <ul>
      <li>전투 시스템에서 플레이어/적 행동, 타겟 탐색, 데미지 계산 책임을 나눠 스킬 추가 시 수정 범위 최소화</li>
  <li>업적 시스템에서 달성 조건, 진행도 갱신, 보상 수령 흐름을 분리해 신규 업적 추가 시 기존 처리 흐름 수정 최소화</li>
  <li>로컬/클라우드 저장소를 교체 가능한 구조로 분리해 저장 방식 변경에 따른 도메인 로직 영향 최소화</li>
  </ul>
    <h4>동작 영상 링크</h4>
    <h4>코드 샘플 링크</h4>
</div>
{{% /pdf-page %}}

{{% pdf-page number="4 / 5" %}}
<div class="eyebrow">Project 03</div>

## Rfice - 메타버스 플랫폼 클라이언트 기능

<table class="table">
  <tr><th>기간</th><td>2022.10 - 2025.12</td></tr>
  <tr><th>프로젝트</th><td>3D 메타버스 플랫폼</td></tr>
  <tr><th>역할</th><td>하우징/공간 편집, 런타임 상호작용, 클라이언트 기능 설계 및 개발</td></tr>
  <tr><th>기술</th><td>Photon Fusion2, Addressables, Input System, Zenject, DOTween</td></tr>
</table>

<div class="section grid two">
  <div class="card blue">
    <h3>담당 기능</h3>
    <ul>
      <li>하우징/공간 편집 시스템 설계 및 개발</li>
      <li>실시간 파일 공유 뷰어 기능 설계 및 개발</li>
      <li>오브젝트 UUID / 식별자 관리 유틸리티 설계 및 개발</li>
      <li>어플리케이션 옵션 관리 설계 및 개발</li>
      <li>모바일 컨트롤러 시스템 설계 및 개발</li>
      <li>보조 카메라 유틸리티 설계 및 개발</li>
      <li>iOS 환경 빌드 및 네이티브 연동 이슈 대응</li>
      <li>서비스 안정화, 테스트, 결함 수정</li>
    </ul>
  </div>
  <div class="card green">
    <h3>설계 포인트</h3>
        <ul>
          <li>하우징 시스템 
            <br>입력, 탐색, 배치 검증, 적용/취소 흐름분리 작성으로 수정 범위 최소화.
          <br>오브젝트를 인터페이스로 추상화해 이동, 회전, 색상, 인터렉션 등 편집 기능 확장을 쉽게 구성</li>
          <li>코드 리뷰 기반으로 기능별 책임, 데이터 흐름, 의존 관계를 점검하며 클라이언트 기능 구조를 지속적으로 개선</li>
          <li>플랫폼 이슈 대응 과정에서 네이티브 담당자와 협업해 플랫폼별 비즈니스 로직을 작성하고, Unity-네이티브 간 통신 프로토콜을 협의 및 구현</li>
        </ul>
  </div>
</div>

<div class="section card">
  <h3>구현 성과</h3>
<ul>
    <li>하우징/공간 편집 기능에서 입력 처리, Raycast 탐색, 배치 검증, 상태 전환, 적용/취소 흐름을 구현</li>
    <li>편집 가능한 오브젝트를 인터페이스로 추상화해 이동, 회전, 색상, 인터렉션 등 오브젝트별 편집 기능 확장 대응</li>
    <li>하우징/공간 편집 기능 구조는 게임의 샌드박스 모드, 인게임 레벨 에디터 등을 레퍼런스로 유사한 로직으로 구현</li>
    <li>파일 공유 뷰어, 옵션 관리, 모바일 컨트롤러, 보조 카메라 등 클라이언트 기능을 개발해 플랫폼 내 사용자 조작 기능을 확장</li>
    <li>코드 리뷰 기반으로 기능별 책임, 데이터 흐름, 의존 관계를 점검하며 클라이언트 기능 구조를 지속적으로 개선</li>
    <li>플랫폼별 네이티브 담당자와 협업해 플랫폼별 비즈니스 로직 작성 및 Unity-네이티브 간 통신 프로토콜을 협의 및 구현</li>
</ul>
    <h4>동작 영상 링크</h4>
    <h4>코드 샘플 링크</h4>
</div>
{{% /pdf-page %}}

{{% pdf-page number="5 / 5" %}}
<div class="eyebrow">Older Experience & Strength</div>

## 이전 경력 - 더그림컴퍼니

<div class="section">
  <h2>(주)더그림컴퍼니 - AR/VR/WebGL 콘텐츠 개발</h2>
  <table class="table">
    <tr><th>기간</th><td>2017.03 - 2022.09</td></tr>
    <tr><th>역할</th><td>Unity 개발자 및 리드</td></tr>
    <tr><th>주요 프로젝트</th><td>마커 기반 AR 어플리케이션 개발
        <br> NH VR 가상영업점
        <br>국립과학관 WebGL 체험존 콘텐츠
        <br>더 인사이드 VR
        <br>모바일 AR 프로젝트</td></tr>
    <tr><th>담당 범위</th><td>Unity 클라이언트 개발
        <br>AR/VR/WebGL 콘텐츠 제작
        <br>AOS/iOS 빌드 및 배포
        <br>Firebase 기반 에셋 번들/스토리지 연동
        <br>소규모 개발팀 리딩</td></tr>
  </table>
</div>

<div class="section grid two">
  <div class="card blue">
    <h3>AR / Mobile</h3>
    <ul>
      <li>Maxst, EasyAR, Vuforia, ARFoundation 기반 마커 인식 AR 어플리케이션 개발</li>
      <li>AR 인터랙션, 미니게임, WebM 비디오 포맷, 3D 오브젝트 콘텐츠 재생 기능 구현</li>
      <li>Firebase Firestore/Storage 기반 에셋 번들 활용 시스템 기획 및 제작</li>
      <li>AOS/iOS 빌드, 배포, 모바일 네이티브 플러그인 연동 경험</li>
    </ul>
  </div>
  <div class="card green">
    <h3>VR / XR</h3>
    <ul>
      <li>NH VR 가상영업점: Oculus Quest2 기반 VR 클라이언트 개발</li>
      <li>더 인사이드 VR: Oculus Quest2/VivePro 기반 MBTI VR 콘텐츠 개발</li>
      <li>XR Interaction Toolkit, OculusXR, SteamVR, DOTween, Visual Effect Graph 활용</li>
    </ul>
  </div>
</div>

<div class="section grid two">
  <div class="card amber">
    <h3>WebGL 게임 콘텐츠</h3>
    <ul>
      <li>전국 6개 국립과학관 특별전시용 웹 기반 게임 체험 콘텐츠 제작</li>
      <li>아동 대상 10~20분 내외 참여형 게임 콘텐츠 기획 및 구현</li>
      <li>액션, 퍼즐, 리듬 장르의 WebGL 미니게임 콘텐츠 다수 제작</li>
      <li>WebGL 환경에서 콘텐츠 제작, REST API 연동, DB연동</li>
    </ul>
  </div>
  <div class="card">
    <h3>운영 / 리딩</h3>
    <ul>
      <li>AR/VR/WebGL 프로젝트의 콘텐츠 업데이트, 에셋 관리, 빌드/배포 대응</li>
      <li>프로젝트별 일정 관리와 소규모 개발팀 리딩</li>
      <li>디자인/콘텐츠 요구사항을 Unity 런타임 기능으로 구현 및 협업</li>
      <li>멀티 플랫폼 빌드, 인터랙션, 콘텐츠 운영 경험</li>
    </ul>
  </div>
</div>

{{% /pdf-page %}}

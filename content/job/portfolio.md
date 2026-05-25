+++
title = "김철규 게임 클라이언트 포트폴리오"
layout = "pdf"
url = "/job/portfolio/"
pdfFile = "KimCheolGyu_GameClient_Portfolio.pdf"
+++

{{% pdf-page number="1 / 5" %}}
<div class="eyebrow">Game Client Portfolio</div>

# 김철규
<p class="subtitle">Unity / C# 게임 클라이언트 개발 포트폴리오</p>

<p class="lead">
해당 포트폴리오 문서는 세부 코드 샘플 문서에서 다룬 핵심 구조를 프로젝트별로 요약한 포트폴리오입니다.
이 문서에서는 문제 정의, 설계 선택, 흐름 중심으로 정리했습니다.
</p>

<div class="section grid one">
  <div class="card">
    <h3>공개 범위</h3>
    <ul>
      <li>실제 프로젝트 흐름과 클래스 역할은 유지</li>
      <li>회사 내부 데이터, 세부 구현사항, 리소스 로딩, 서버 저장, 네이티브 연동 세부 구현은 제외</li>
      <li>구조, 책임 분리, 실행 흐름 중심으로 축약</li>
    </ul>
  </div>
</div>

<div class="section">
  <table class="table">
    <tr><th>이력서</th><td><a href="https://cosmicgiantkoala.github.io/job/resume/">링크</a></td></tr>
    <tr><th>경력기술서</th><td><a href="https://cosmicgiantkoala.github.io/job/career/">링크</a></td></tr>
    <tr><th>RFist 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/rfist_1/">링크</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/rfist_network.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/rfist_control.mp4">제작영상2</a>
</td></tr>
    <tr><th>Slime Rush 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/slimerush_1/">링크</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_target.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_magic.mp4">제작영상2</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_monster.mp4">제작영상3</a>
</td></tr>
    <tr><th>Rfice 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/rfice_1/">링크</a>
<br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_1.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_2.mp4">제작영상2</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_3.mp4">제작영상3</a>
</td></tr>
  </table>
</div>
{{% /pdf-page %}}

{{% pdf-page number="2 / 5" %}}
<div class="eyebrow">Core Case 01</div>

## RFist - 네트워크 입력 동기화 코드 샘플
<p class="subtitle">로컬 입력 캐시에서 네트워크 입력 수집, 캐릭터 액션 실행까지</p>

<div class="section grid two">
  <div class="card blue">
    <h3>제작 중점</h3>
    <ul>
      <li>Input System callback 입력을 Fusion tick 입력 수집 시점에 안정적으로 전달해야 함</li>
      <li>공격, 대시, 가드, 포커스 같은 입력은 프레임성 입력과 유지 입력을 구분해야 함</li>
      <li>네트워크 입력이 실제 캐릭터 이동/전투 실행 계층과 명확히 연결되어야 함</li>
    </ul>
  </div>
  <div class="card green">
    <h3>설계 기준</h3>
    <ul>
        <li><strong>CharacterInputData</strong>: 네트워크 전송용 입력 데이터</li>
        <li><strong>CharacterKeyInput / ICharacterInput</strong>: Input System callback을 게임 입력 인터페이스로 변환</li>
        <li><strong>BaseCharacterInput</strong>: 로컬 입력 소스 수집</li>
        <li><strong>NetworkCharacterInput</strong>: 권한 검증 및 입력셋</li>
        <li><strong>NetworkCharacterController</strong>: 권한 검증 및 네트워크 전송</li>
        <li><strong>CharacterController</strong>: 실제 캐릭터 이동/전투 동작</li>
    </ul>
  </div>
</div>

<br>
<pre class="mermaid">
classDiagram
direction LR
class CharacterInputData
class CharacterActions
class CharacterKeyInput
class ICharacterInput
class BaseCharacterInput
class NetworkCharacterInput
class NetworkCharacterController
class CharacterController
CharacterInputData ..|> INetworkInput : implement
CharacterActions --> CharacterKeyInput : callbacks
ICharacterInput ..|> CharacterKeyInput : implement
BaseCharacterInput --> ICharacterInput : collect
NetworkCharacterInput ..> CharacterInputData : create
NetworkCharacterInput --> BaseCharacterInput : get
NetworkCharacterController ..> CharacterInputData : receive(fusion tickinput)
NetworkCharacterController --> CharacterController : execute
</pre>

<div class="section card amber">
  <h3>핵심 흐름</h3>
    <ol>
<li>입력 이벤트가 발생한 순간 바로 캐릭터를 움직이지 않고, 로컬 입력 구현체(CharacterKeyInput)가 입력 상태를 캐싱</li>
<li>Fusion 입력 수집 시점(NetworkCharacterInput)에는 캐시된 값을 읽어 네트워크 인풋 구조체(CharacterInputData)로 구성</li>
<li>수신 측(NetworkCharacterController)에서는 네트워크 인풋 구조체를 캐릭터 이동/전투 실행 계층(CharacterController)으로 명령을 전달</li>
</ol>
</div>

<div class="section">
  <table class="table">
    <tr><th>Rfice 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/rfice_1/">링크</a>
<br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_1.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_2.mp4">제작영상2</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_3.mp4">제작영상3</a>
</td></tr>
  </table>
</div>
{{% /pdf-page %}}

{{% pdf-page number="3 / 5" %}}
<div class="eyebrow">Core Case 02</div>

## Slime Rush - 마법 생성 및 자동 타겟팅
<p class="subtitle">스킬 인스턴스 생성부터 타겟 검색까지</p>

<div class="section grid two">
  <div class="card blue">
    <h3>제작 중점</h3>
    <ul>
      <li>플레이어가 획득한 마법을 런타임 인스턴스로 생성하거나 갱신해야 함</li>
      <li>마법별 타겟 타입, 타겟 수, 범위가 달라 자동 캐스팅 루틴이 복잡해질 수 있음</li>
      <li>구체적인 비즈니스 로직보다 타겟을 찾는 구조가 명확해야 신규 마법 추가 비용을 줄일 수 있음</li>
    </ul>
  </div>
  <div class="card green">
    <h3>설계 기준</h3>
    <ul>
      <li><strong>MagicBookLibrary</strong>: 마법 할당 이벤트 수신과 생성/업데이트</li>
      <li><strong>MagicBookCreator</strong>: MagicBook 생성 및 초기화</li>
      <li><strong>MagicBook</strong>: 쿨타임, 타겟팅 옵션, 자동 검색 루틴 관리</li>
      <li><strong>TargetSystem</strong>: 타겟 타입에 맞는 타겟/위치 검색 진입점</li>
      <li><strong>TargetScanner</strong>: 거리, 랜덤, 개수 제한 기반 후보 탐색</li>
    </ul>
  </div>
</div>
<br>

<pre class="mermaid">
classDiagram
direction LR
class MagicBookLibrary
class MagicBookCreator
class MagicBook
class MagicInfo
class TargetingOption
class TargetSystem
class TargetScanner
class ITarget
MagicBookLibrary --> MagicBook : update existing
MagicBookLibrary --> MagicBookCreator : create new
MagicBookCreator --> MagicBook : instantiate
MagicBook --> MagicInfo : owns
MagicInfo --> TargetingOption : build option
MagicBook --> TargetSystem : request search
TargetSystem --> TargetScanner : scan
TargetScanner --> ITarget : return candidates
</pre>

<div class="section card amber">
  <h3>핵심 흐름</h3>
<ol>
<li>마법이 할당되면 마법 관리자(MagicBookLibrary) 기존 마법 인스턴스(MagicBook)를 갱신하거나 새 인스턴스를 생성</li>
<li>마법 인스턴스는 마법 데이터(MagicInfo)에서 타겟팅 옵션(TargetingOption)을 만들고, 쿨타임 루틴 안에서 타겟 시스템(TargetSystem)에 타겟 검색을 요청</li>
<li>실제 후보 탐색과 거리 검증은 타겟스캐너(TargetScanner) 쪽으로 분리해 자동 캐스팅 흐름과 검색 구조를 구분</li>
</ol>
</div>

<div class="section">
  <table class="table">
    <tr><th>Slime Rush 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/slimerush_1/">링크</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_target.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_magic.mp4">제작영상2</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/battlesystem_monster.mp4">제작영상3</a>
</td></tr>
  </table>
</div>
{{% /pdf-page %}}

{{% pdf-page number="4 / 5" %}}
<div class="eyebrow">Core Case 03</div>

## Rfice - 런타임 하우징 에디터
<p class="subtitle">입력 디스패치부터 오브젝트 선택, 편집 모드 전환, 상태 적용까지</p>

<div class="section grid two">
  <div class="card blue">
    <h3>제작 중점</h3>
    <ul>
      <li>런타임 3D 공간에서 UI 클릭과 월드 오브젝트 클릭이 충돌하지 않아야 함</li>
      <li>선택, 이동, 회전 편집이 같은 입력을 사용하지만 각기 다른 실행 흐름을 가져야 함</li>
      <li>오브젝트마다 이동/회전/색상 편집 가능 여부가 달라 기능별 계약이 필요함</li>
    </ul>
  </div>
  <div class="card green">
    <h3>설계 기준</h3>
    <ul>
      <li><strong>HousingSystemInputController</strong>: InputAction 이벤트 수신</li>
      <li><strong>HousingSystemEditingInputDispatcher</strong>: 편집 입력 이벤트 발행</li>
      <li><strong>HousingSystemState</strong>: 편집상태에 맞는 입력 구독</li>
      <li><strong>HousingSystemPropEditingManager</strong>: 선택 대상과 편집 모드 관리</li>
      <li><strong>HousingSystemPropEditor</strong>: 선택/이동/회전 편집기의 공통 동작 정의</li>
    </ul>
  </div>
</div>

<br>

<pre class="mermaid">
classDiagram
direction LR
class HousingSystemInputController
class HousingSystemEditingInputDispatcher
class HousingSystemState
class HousingSystemPropEditingManager
class HousingSystemPropEditor
class HousingSystemPropSelector
class HousingSystemPropMover
class HousingSystemPropRotator
class HousingSystemObjectEditUI
class MyRoomEditorInputUtils
class IHousingSystemEditableObject
class IMoveableProp
class IRotatableProp
class IColorEditableProp
HousingSystemInputController --> HousingSystemEditingInputDispatcher : dispatch input
HousingSystemState --> HousingSystemEditingInputDispatcher : subscribe
HousingSystemPropEditingManager --|> HousingSystemState
HousingSystemPropEditingManager --> HousingSystemPropEditor : active editor
HousingSystemPropEditor <|-- HousingSystemPropSelector
HousingSystemPropEditor <|-- HousingSystemPropMover
HousingSystemPropEditor <|-- HousingSystemPropRotator
HousingSystemPropSelector --> MyRoomEditorInputUtils : raycast
HousingSystemPropMover --> MyRoomEditorInputUtils : raycast
HousingSystemPropRotator --> MyRoomEditorInputUtils : pointer delta
HousingSystemPropSelector --> IHousingSystemEditableObject : select
IHousingSystemEditableObject --> IMoveableProp : optional
IHousingSystemEditableObject --> IRotatableProp : optional
IHousingSystemEditableObject --> IColorEditableProp : optional
HousingSystemPropEditingManager --> HousingSystemObjectEditUI : show menu
HousingSystemObjectEditUI --> HousingSystemPropEditingManager : edit mode events
</pre>

<div class="section card amber">
  <h3>핵심 흐름</h3>
<ol>
<li>입력은 핸들링(HousingSystemEditingInputDispatcher)을 통해 현재 편집 상태(HousingSystemState)로 전달</li>
<li>편집매니저(HousingSystemPropEditingManager)가 선택된 오브젝트(IHousingSystemEditableObject)와 편집 모드(HousingSystemPropEditor)를 관리</li>
<li>각각의 편집기(HousingSystemPropSelector, HousingSystemPropMover, HousingSystemPropSelector)가 기능을 담당하며, 이동/회전 완료 이벤트를 편집매니저가 구독해 배치 정보를 갱신</li>
</ol>
</div>

<div class="section">
  <table class="table">
    <tr><th>Rfice 코드 샘플</th><td><a href="https://cosmicgiantkoala.github.io/job/rfice_1/">링크</a>
<br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_1.mp4">제작영상1</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_2.mp4">제작영상2</a>
        <br><a href="https://cosmicgiantkoala.github.io/videos/myroomeditor_3.mp4">제작영상3</a>
</td></tr>
  </table>
</div>
{{% /pdf-page %}}

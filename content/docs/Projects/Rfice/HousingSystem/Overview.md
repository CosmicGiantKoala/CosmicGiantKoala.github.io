+++
title = "MyRoomEditor 시스템 소개"
description = "WebGL 런타임 3D 개인 공간 편집 및 공유 시스템(하우징 시스템)"
icon = "home_and_garden"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 401
+++


## 1. 기능 개요

- **MyRoomEditor**는 Unity 기반의 3D 개인 룸 커스터마이징 시스템으로, 사용자가 가상 공간에 가구와 장식 요소들을 자유롭게 배치하고 편집할 수 있는 통합 편집 환경을 제공합니다.
- **제작기간**: 2024.11 ~ 2025.03(WebGL support)
- **시스템 개발 인원** : 7인(유니티 클라이언트 2인, 3D 디자인 3인, 백엔드 1인, UX/UI 1인)

### 개발 배경 및 요구사항
- 사용자가 개인 공간을 3D 환경에서 직관적으로 커스터마이징 다른 사용자들과 공유하는 소셜/크리에이티브 공간 제공.
- 다양한 가구와 장식 요소들을 실시간으로 배치하고 편집하는 기능.
- 가구의 위치(`Vector3`), 회전(`Quaternion`) 및 커스텀데이터(`Material`, `URL`)을 JSON 데이터로 직렬화하여 서버와 통신 가능한 형태로 파싱.
- 편집 화면에서 '꾸미기 종료' UI 조작시 서버에 편집데이터를 저장하고, 사용자의 룸에 유저가 진입시 서버에서 데이터를 받아 오브젝트를 동적으로 생성/배치 하는 방식으로 제작.  
- MVP 패턴과 의존성 주입을 활용한 확장 가능한 아키텍처 구축.
- EA의 심즈4 건축시스템을 참고하여 동작 플로우 제작.
- 사용자로부터 이미지 URL 또는 파일을 받아 런타임에서 텍스처를 로드하고, 해당 텍스처를 액자 오브젝트의 Material에 적용하여 동적으로 커스터마이징.

### 주요 기능

{{< alert context="info" text="🐨: 직접구현 기능, 🧑‍💻: 클라이언트 팀원 제작 기능"/ >}}

{{< table "table-striped">}}
| 기능 | 설명 |
|-----|-----|
|**🐨 3D 공간 배치**| UI조작 및 마우스 좌측 클릭을 통해 가구를 원하는 위치에 배치 및 편집 기능. |
|**🐨 3D 공간 카메라 조작**| 키보드 WASD를 통한 카메라 이동, 마우스 우측 클릭을 통해 카메라 회전, 마우스 휠을 통한 확대/축소 기능. |
|**🐨 오브젝트 선택**| `Raycast`를 통해 선택 가능한 오브젝트 필터링 및 마우스 좌클릭으로 선택. |
|**🐨 편집 UI**| 선택한 오브젝트의 데이터를 통해 사용 가능한 편집 기능을 UI로 표시. |
|**🐨 오브젝트 편집**| 오브젝트가 선택 될 시 상단 중앙에 편집UI를 표시하고 편집UI를 조작해 선택된 오브젝트 이동 및 회전, 삭제.|
|**🐨 오브젝트 컨텐츠 편집**| 특정 오브젝트 선택시 편집UI에 컬러 변경, 이미지 업로드 UI를 표시하고 UI를 통해 `Material` 및 `Texture` 변경.|
|**🐨 조작 기즈모**| 배치된 오브젝트를 이동 및 회전시 기능에 맞는 기즈모 표시 기능.|
|**🐨 배치 검증**| 오브젝트의 성격과 공간 제약을 고려한 배치 검증 기능.|
|**🐨 상태 표현**| `Material` 색상 변화를 이용해 배치 검증 상태 및 선택된 오브젝트 표현 기능.|
|**🐨 실행 취소**| 편집중인 오브젝트를 ESC 키를 통해 편집 이전 상태로 복원 기능.|
|🧑‍💻 데이터 저장| 유저 커스터마이징 결과의 동적 로드 가능하게 서버에 저장하고 룸에 진입시 해당 데이터를 로드.|
|🧑‍💻 동적 오브젝트 생성| 룸에 진입시 유저의 커스터마이징 데이터를 통해 오브젝트 동적 생성 및 배치.|
|🧑‍💻 아이템 데이터 파싱| csv로 작성된 아이템 데이터를 유니티 ScriptableObject 데이터로 파싱.|
|🧑‍💻 카탈로그 UI| 유저가 커스터마이징 가능한 아이템들을 카탈로그 UI를 통해 표시.|
{{< /table >}}<br>

### 커스터마이징 데모 영상
{{<video src="videos/MyRoomEditor.mp4" width="70%" class="responsive-video">}}
<br><br>

## 2. 사용된 기술 요소

{{< alert context="info" text="직접구현한 요소 및 협업 요소 기술, 🤝:협업요소"/ >}}

### 핵심 기술 요소 및 API 활용
{{< table "table-striped">}}
| 요소 | 설명 |
|-----|-----|
|**C#**| 전체 핵심 로직 및 유니티 컴포넌트 구현. |
|**Input System**|Action 기반 입력 통합 및 디바이스 독립적 처리.|
|**Physics.Raycast**|편집 씬에서 마우스 좌표와 오브젝트간 상호작용 및 선택 로직 구현.|
|**UGUI / EventSystem**|동적 UI 구성 및 오브젝트 편집 인터페이스 구현.|
|[**Zenject**](https://github.com/modesttree/Zenject)|객체 간 의존성 주입을 자동화하여 높은 응집도와 낮은 결합도의 코드베이스 구축.|
{{< /table >}}<br>

### 설계 활용 패턴
{{< table "table-striped">}}
| 요소 | 설명 |
|-----|-----|
|**🤝 Clean Architecture**| Presentation, Domain, Data 계층을 명확히 분리하여 비지니스 로직과 서버 로직(데이터 로직)을 완벽하게 분리하여 유지보수 및 확장성을 극대화 할 수 있게 아키텍쳐 구성.(협업 시스템 아키텍처) |
|**MVP (Model-View-Presenter)**|편집 UI(View)와 편집 로직(Presenter)의 책임을 분리하여 UI변경에 유연하게 대응.|
|**전략 패턴 (Strategy Pattern)**|오브젝트 배치/선택/편집 등 다양한 편집 모드별 처리 로직을 분리하여 새로운 편집 전략 추가에 유연하게 대응.|
|**옵저버 패턴 (Observer Pattern)**|오브젝트 상태 및 사용자 조작에 따른 변화를 관련 모듈에 실시간으로 전달하는 이벤트 시스템 구현.|
{{< /table >}}<br>

## 3. 주요 클래스별 역할 및 관계

{{< alert context="info" text="직접구현한 요소만 기술"/ >}}

### 상태관리 클래스
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**MyRoomEditorState**<br> *<<abstract>>*| ️💡 MyRoomEditor의 상태를 관리하는 abstract 클래스.<br> 💡 `InputDispatcher`와 상태 핸들을 통해 입력 이벤트를 처리. 상태 변화 시 입력 활성화/비활성화 담당.<br> 💡 다양한 편집 상태를 관리하고, 상태 변화 로직을 처리. |
|**MyRoomEditorPlacementManager**<br>-->MyRoomEditorState| ️💡 오브젝트 생성 및 배치 상태를 관리하는 implement 클래스.<br> 💡 `Raycast` 를 이용해 사용자의 입력에 따라 오브젝트 배치 위치를 검증.<br> 💡 `InputDispatcher` 를 통해 받는 이벤트와 배치 검증을 통해 오브젝트를 월드에 배치.<br> 💡 배치상태에서 이동 및 회전 처리.|
|**MyRoomEditorPropEditingManager**<br>-->MyRoomEditorState| ️💡 오브젝트 편집 상태를 관리하는 implement 클래스.<br> 💡 오브젝트 선택, 이동, 회전, 색상 변경, 삭제 등의 기능을 수행.<br> 💡 서브 클래스`(MyRoomPropEditor)`와 UI이벤트를 통해 편집 동작을 처리.<br> 💡 실행취소를 포함한 상태 스택 관리.|
{{< /table >}}<br>

### 오브젝트 선택/편집기
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**MyRoomPropEditor**<br> *<<abstract>>*| ️💡 각각의 편집 기능에서 사용 할 공통 메서드와 멤버를 정의하는 abstract 클래스.<br> 💡 `MyRoomEditorPropEditingManager` 를 통해 받은 입력 및 UI 동작에 대한 처리를 implement 클래스의 override로 호출. |
|**MyRoomPropSelector**<br>-->MyRoomPropEditor| ️💡 오브젝트의 선택을 담당하는 implement 클래스.<br> 💡 `Raycast`를 이용해 편집 가능한 오브젝트를 선택하고, 결과 이벤트를 발생. |
|**MyRoomPropMover**<br>-->MyRoomPropEditor| ️💡 오브젝트의 이동을 담당하는 implement 클래스.<br> 💡`Raycast`를 통해 마우스 포인터 위치에 배치 영역 검증을 수행하고 오브젝트 이동 이벤트를 발생. |
|**MyRoomPropRotator**<br>-->MyRoomPropEditor| ️💡 오브젝트의 회전을 담당하는 implement 클래스.<br> 💡`InputUtils`를 통해 초기 마우스 상태를 캐싱하고 마우스의 이동범위만큼 오브젝트를 좌/우로 회전. |
|**MyRoomEditorInteractionManager**| ️💡 오브젝트의 특수 인터렉션을 담당하는 클래스.<br> 💡`MyRoomEditorPropEditingManager` 를 통해 특정 인터렉션 호출을 처리. |
{{< /table >}}<br>

### 사용자 입력 및 입력 유틸리티
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**MyRoomEditorInputController**| ️💡 `InputAction` 를 통해 발생하는 입력 이벤트를 각각의 `Dispatcher`로 전달. <br> 💡 시스템 활성화 상태 기반 `InputAction` 토글 |
|**MyRoomEditorCameraInputDispatcher**| ️💡 카메라 조작 이벤트를 처리하는 클래스. WASD 이동, 마우스 회전, 줌 등 카메라 컨트롤 이벤트 관리. |
|**MyRoomEditorEditingInputDispatcher**| ️💡 편집 관련 입력 이벤트를 처리하는 클래스. 포인터 이벤트, 삭제, 취소 등 편집 명령 처리. |
|**MyRoomEditorInputUtils**| ️💡 입력 유틸리티 클래스. UI 검증, `Raycast` 실행, 포인터 델타 계단 등 입력 관련 헬퍼 함수 제공. |
{{< /table >}}<br>

### 오브젝트 동작 및 정의 Component
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**SpawnablePropBase**<br>*<<abstract>>*| ️💡 모든 배치 가능한 오브젝트의 abstract 클래스. <br> 💡 공용 Property 데이터 설정, 상태 정보 관리, 부모-자식 오브젝트 관계 구성, 상태 표현 등 공통 로직 처리. |
|**SpawnableFloorAndCeilProp**<br>-->SpawnablePropBase<br>-->IColorEditableProp<br>-->IMoveableProp<br>-->IRotatableProp| ️💡 바닥과 천장에 배치되는 일반적인 오브젝트 클래스. |
|**SpawnableWallProp**<br>-->SpawnablePropBase<br>-->IColorEditableProp<br>-->IMoveableProp| ️💡 벽에 배치되는 일반적인 오브젝트 클래스. |
|**SpawnablePhotoFrameProp**<br>-->SpawnablePropBase<br>-->IPhotoFrameProp<br>-->IMoveableProp| ️💡 특수한 인터렉션을 포함한 오브젝트 클래스.<br> 💡 텍스처 업로드 및 이미지 적용 기능 포함. |
|**SpawnableScreenProp**<br>-->SpawnablePropBase<br>-->IScreenProp<br>-->IMoveableProp| ️💡 특수한 인터렉션을 포함한 오브젝트 클래스.<br> 💡 개인공간에서 실시간 파일 공유 기능 모듈(`NetworkedScreen`)을 사용 할 수 있게 세팅.  |
|**PropEditingState**| ️💡 오브젝트 편집 상태에 따라 오브젝트의 `Material` 효과를 표현하는 클래스. |
{{< /table >}}<br>

### 오브젝트 동작 및 정의 Interface 
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**IMyRoomEditorEditableObject**<br>*<<interface>>*| ️💡 편집 가능한 오브젝트 정의 및 기능 정의 |
|**IColorEditableProp** <br> *<<interface>>* <br> -->IMyRoomEditorEditableObject | ️💡 색상 편집 가능한 오브젝트 정의. 컬러 리스트 제공 및 색상 적용 기능 정의. |
|**IMoveableProp** <br> *<<interface>>* <br> -->IMyRoomEditorEditableObject | ️💡 이동 가능한 오브젝트 정의. 배치 영역 검증 및 위치 변경 기능 정의. |
|**IRotateableProp** <br> *<<interface>>* <br> -->IMyRoomEditorEditableObject | ️💡회전 가능한 오브젝트 정의. 자유 회전 및 스냅 회전 기능 정의. |
{{< /table >}}
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**IInteractableProp** <br> *<<interface>>* | ️💡 특수한 인터렉션 가능한 오브젝트 정의 및 사용자 인터렉션 기능 정의. |
|**IPhotoFrameProp** <br> *<<interface>>* <br> -->IInteractableProp | ️💡 사진 프레임 정의 및 이미지 설정 기능 정의. |
|**IScreenProp** <br> *<<interface>>* <br> -->IInteractableProp | ️💡 실시간 파일 공유 모듈 정의. |
{{< /table >}}<br>

### 오브젝트 배치 구역 정의 Component 및 Interface
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**IPlaceableArea**<br>*<<interface>>*| ️💡 배치 영역 정의 및 배치 영역 기능 정의. |
|**PlacementAreaProp** <br> -->IPlaceableArea <br> -->IColorEditableProp | ️💡 바닥, 천장, 벽면과 같은 배치 영역을 정의하는 클래스. <br> 💡 오브젝트가 배치 될 수 있는 공간의 범위와 규칙 지정. |
|**PlacementAreaInProp** <br> -->IPlaceableArea | ️💡 책상, 탁자, 데크 등 오브젝트 위에 배치되는 영역을 관리하는 클래스.<br> 💡 부모 오브젝트 내 자식 오브젝트 처리. |
{{< /table >}}<br>


### 오브젝트 편집UI Component
{{< table "table-striped">}}
| 클래스 | 역할 |
|-----|-----|
|**MyRoomEditorObjectEditUI**| ️💡 오브젝트 편집 메뉴를 표시하고 조작하는 UI클래스. <br> 💡 선택된 오브젝트의 이름 및 사용 가능한 편집 기능 표시.  <br> 💡 편집 기능(이동, 회전, 삭제, 색변경, 인터렉션) 등을 제어하는 버튼과 메뉴 관리. |
|**MyRoomEditorColorSelectUI**| ️💡 색상 선택 UI를 처리하는 클래스. <br> 💡 사용할 수 있는 색상 옵션을 표시하고 선택 이벤트 처리. |
|**MyRoomEditorColorEditItem**| ️💡 선택 가능한 색상 항목을 나타내는 UI 컴포넌트. <br> 💡 개별 색상을 표시하고 선택 상태를 관리. |
{{< /table >}}<br>

## 4. 주요 특징 및 최적화

### 기능의 특징
- **실시간 배치 검증**: 물리 엔진을 활용한 실시간 충돌 감지 및 배치 가능성 검증
- **무한 스크롤 UI**: 대량의 가구 아이템을 메모리 효율적으로 관리하는 무한 스크롤
- **모듈식 아키텍처**: 각 기능별 독립적 모듈로 구성하여 확장성 및 유지보수성 향상
- **다양한 편집 모드**: 이동, 회전, 크기 조절, 색상 변경 등 다양한 편집 기능
- **상태 관리**: 작업 이력을 통한 실행 취소/다시 실행 기능
- **플랫폼 호환성**: 모바일 터치와 데스크톱 마우스 입력 동시 지원

### 메모리 관리
- 오브젝트 풀링을 통한 메모리 사용 최적화
- 사용하지 않는 UI 요소의 자동 해제
- 텍스처와 메쉬 데이터의 적절한 로딩/언로딩 타이밍 관리
- 가비지 컬렉션 최적화를 위한 객체 재사용

### 실시간 성능 모니터링
- 프레임 레이트 모니터링 및 성능 최적화
- 메모리 사용량 실시간 추적
- 배치 연산의 비동기 처리
- 레이캐스트 최적화를 통한 CPU 부하 감소

## 5. 활용 사례

### 개인 룸 커스터마이징 시나리오
1. **기본 룸 생성**: 빈 룸에서 시작하여 기본 가구 배치
2. **가구 배치**: 카테고리별로 가구를 선택하고 원하는 위치에 배치
3. **세부 조정**: 선택한 가구의 위치, 회전, 크기 조절
4. **색상 커스터마이징**: 가구별 색상 변경으로 개인 취향 반영
5. **액세서리 추가**: 사진 프레임, 장식품 등으로 공간 완성
6. **저장 및 공유**: 완성된 룸을 저장하고 다른 사용자와 공유

### 주요 사용처
- 개인 공간 커스터마이징 서비스
- 인테리어 시뮬레이션 플랫폼
- 가구 쇼핑몰의 가상 체험 서비스
- 교육용 공간 디자인 도구
- 게임 내 하우징 시스템
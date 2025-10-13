+++
title = "하우징시스템"
# description = "Rfice 개요"
icon = "home_and_garden"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 302
+++

### MyRoomEditor 시스템 분석 및 구조 정리
📋 전체적인 구조 및 아키텍처
MyRoomEditor는 Unity 기반의 3D 룸 편집 시스템으로, MVP(Model-View-Presenter) 패턴과 의존성 주입(DI) 패턴을 활용하여 구현되었습니다.
주요 디렉토리 구조```
MyRoomEditor/
├── Presentation/Presenters/MyRoomEditor/     # MVP 패턴의 Presenter 계층
├── Scenes/Components/MyRoomEditor/           # 컴포넌트 및 UI 요소들
├── Scenes/MyRoomEditor/                      # 메인 씬 관리 및 기능 구현
└── Data/DataSource/MyRoomEditor/            # 데이터 소스 계층
```

🏗️ 핵심 아키텍처 패턴
1. MVP (Model-View-Presenter) 패턴
Presenter: 비즈니스 로직 처리 및 View와 Model 간 중재
View: UI 표시 및 사용자 입력 처리
Model: 데이터 관리 (DataSource를 통해 구현)
2. 의존성 주입 (Zenject 사용)
각 컴포넌트 간의 느슨한 결합 구현
테스트 용이성 및 확장성 향상
🔧 주요 컴포넌트 분석
1. 프레젠터 레이어 (Presenters)
MyRoomEditorPresenter.cs
전체 MyRoomEditor 시스템의 메인 프레젠터
UI와 비즈니스 로직 간의 중재 역할
상태 관리 및 이벤트 처리
MyRoomEditorPlacementPresenter.cs
오브젝트 배치 기능 담당
3D 공간에서의 prop 배치 로직 관리
PropScrollItemPresenter.cs / PropScrollPanelPresenter.cs
UI 스크롤 뷰에서의 아이템 표시 관리
무한 스크롤 기능 지원
CategoryItemPresenter.cs / CategoryItemHandlerPresenter.cs
카테고리별 아이템 관리
사용자가 선택한 카테고리에 따른 아이템 필터링
2. 씬 관리자 (Scene Managers)
MyRoomEditorSceneManager.cs
에디터 씬의 전체적인 생명주기 관리
씬 초기화, 정리, 상태 전환 처리
MyRoomEditorInteractionManager.cs
사용자 상호작용 관리 (마우스, 키보드 입력)
오브젝트 선택, 이동, 회전 등의 인터랙션
MyRoomEditorPlacementManager.cs
오브젝트 배치 시스템 관리
배치 가능한 영역 검증 및 스냅 기능
3. Prop 관리 시스템
SpawnablePropBase.cs
모든 배치 가능한 오브젝트의 베이스 클래스
공통 인터페이스 및 기본 기능 제공
특화된 Prop 클래스들:
SpawnableWallProp.cs: 벽면 배치 오브젝트
SpawnableFloorAndCeilProp.cs: 바닥/천장 배치 오브젝트
SpawnablePhotoFrameProp.cs: 사진 프레임 오브젝트
SpawnableScreenProp.cs: 스크린 오브젝트
4. 입력 시스템
MyRoomEditorInput.inputactions
Unity Input System을 활용한 입력 맵핑 정의
MyRoomEditorInputController.cs
입력 이벤트를 게임 로직으로 변환
마우스, 키보드, 터치 입력 통합 관리
5. UI 컴포넌트들
편집 도구 UI:
EditorDefaultBar.cs: 기본 편집 도구 바
MyRoomEditorObjectEditUI.cs: 오브젝트 편집 UI
MyRoomEditorColorSelectUI.cs: 색상 선택 UI
스크롤 및 카테고리 UI:
PropScrollPanel.cs: prop 선택 스크롤 패널
CategoryItem.cs: 카테고리 아이템
ThemeChangeView.cs: 테마 변경 뷰
🎯 주요 기능 및 플로우
1. 에디터 시작 플로우``` 
Scene Load → MyRoomEditorSceneManager 초기화 
→ UI 컴포넌트 로딩 → 입력 시스템 활성화 
→ 카메라 설정 → 편집 모드 활성화
```

2. 오브젝트 배치 플로우```
   카테고리 선택 → Prop 목록 로딩 → 사용자 선택
   → 배치 위치 검증 → SpawnableProp 생성
   → PlacementManager를 통한 배치 → 상태 저장
```

3. 오브젝트 편집 플로우``` 
오브젝트 선택 → PropEditor 활성화 
→ 편집 모드 진입 (이동/회전/색상 변경) 
→ 실시간 미리보기 → 변경사항 적용
```

💡 핵심 기술적 특징
1. 무한 스크롤 시스템``` csharp
   public class InfiniteScroll : MonoBehaviour
```

대량의 prop 아이템을 효율적으로 표시
메모리 최적화를 위한 오브젝트 풀링 활용
2. 실시간 배치 검증``` csharp
public interface IPlaceableArea
```

배치 가능한 영역을 실시간으로 검증
충돌 감지 및 스냅 기능 제공
3. 다양한 편집 인터페이스``` csharp
   public interface IMovableProp, IRotatableProp, IColorEditableProp
```

오브젝트 타입별 특화된 편집 기능
확장 가능한 인터페이스 설계
4. 상태 관리 시스템``` csharp
public class MyRoomEditorState, PropEditingState
```

편집 상태의 체계적 관리
Undo/Redo 기능 지원 가능한 구조
🎨 UI/UX 특징
시각적 피드백
실시간 배치 미리보기
선택된 오브젝트 하이라이트
배치 가능 영역 시각화
직관적 조작
드래그 앤 드롭 인터페이스
컨텍스트 메뉴를 통한 빠른 편집
터치 및 마우스 입력 동시 지원
📊 포트폴리오 어필 포인트
1. 확장 가능한 아키텍처
   인터페이스 기반 설계로 새로운 Prop 타입 추가 용이
   MVP 패턴을 통한 관심사 분리
2. 성능 최적화
   오브젝트 풀링을 통한 메모리 관리
   무한 스크롤로 UI 성능 최적화
   LOD 시스템 적용 가능한 구조
3. 사용자 경험 중심
   실시간 피드백 제공
   직관적인 3D 편집 인터페이스
   다양한 입력 방식 지원
4. 코드 품질
   의존성 주입을 통한 테스트 용이성
   단일 책임 원칙 준수
   인터페이스 분리 원칙 적용
   이 MyRoomEditor 시스템은 복잡한 3D 편집 기능을 체계적이고 확장 가능한 아키텍처로 구현한 우수한 사례로, Unity 개발 역량과 소프트웨어 설계 능력을 잘 보여주는 프로젝트입니다.
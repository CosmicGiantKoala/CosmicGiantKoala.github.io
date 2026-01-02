+++
title = "MyRoomEditorState"
description = "MyRoomEditor의 상태를 관리하는 abstract 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 402
+++

## 개요

`MyRoomEditorState`는 MyRoomEditor 시스템의 상태 관리를 담당하는 추상 클래스. 다양한 배치/편집 상태를 전환 및 관리하며, 입력 이벤트를 처리하고 상태 변화에 따라 입력을 활성화/비활성화.

## 주요 역할

- **상태 관리**: `MyRoomEditorStateEnum`에 따라 상태를 전환하고 관리.
- **입력 처리**: [`MyRoomEditorEdittingInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditoreditinginputdispatcher/)를 통해 편집 관련 입력 이벤트를 처리.
- **상태별 로직**: 서브클래스에서 구현되는 추상 메서드를 통해 상태별 동작을 정의.
- **의존성 주입**: Zenject를 사용한 객체 간 의존성 주입.

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 상태 변경을 처리하는 핸들러. Zenject를 통해 주입되며, 상태 전환 이벤트를 관리.
/// 이 클래스가 특정 상태로 전환될 때 필요한 로직을 수행.
/// </summary>
[Inject]
protected MyRoomEditorStateHandle MyRoomEditorStateHandle;

/// <summary>
/// 편집 입력 디스패처. 마우스 및 키보드 입력 이벤트를 처리.
/// 상태가 활성화될 때 입력 이벤트를 구독하고, 비활성화될 때 해제.
/// </summary>
[Inject]
protected MyRoomEditorEdittingInputDispatcher EditorInputDispatcher;

/// <summary>
/// 오브젝트 배치 정보 프리젠터.
/// 서브클래스에서 오브젝트 생성/삭제/수정 동작을 제어할 때 호출하여 오브젝트 데이터 업데이트.
/// </summary>
[SerializeField]
protected MyRoomEditorPlacementPresenter placementPresenter;

```

### 추상 메서드
```csharp
/// <summary>
/// 마우스 왼쪽 버튼이 눌렸을 때 호출되는 메서드.
/// 서브클래스에서 해당 상태의 클릭 동작을 구현 (예: 오브젝트 선택, 배치 등).
/// </summary>
protected abstract void OnPointerDown();

/// <summary>
/// 마우스 왼쪽 버튼이 떼어졌을 때 호출되는 메서드.
/// 서브클래스에서 드래그 종료나 클릭 완료 동작을 구현.
/// </summary>
protected abstract void OnPointerUp();

/// <summary>
/// 취소 입력 (예: ESC 키)이 발생했을 때 호출되는 메서드.
/// 현재 작업을 취소하거나 이전 상태로 돌아가는 로직을 구현.
/// </summary>
protected abstract void OnCancel();

/// <summary>
/// 마우스 오른쪽 버튼이 클릭되었을 때 호출되는 메서드.
/// 컨텍스트 메뉴 표시나 특수 동작을 수행.
/// </summary>
protected abstract void OnRightClick();

/// <summary>
/// 이 상태가 활성화될 때 호출되는 메서드.
/// 상태별 초기화 로직을 수행 (예: UI 표시, 입력 설정 등).
/// </summary>
protected abstract void Enable();

/// <summary>
/// 이 상태가 비활성화될 때 호출되는 메서드.
/// 상태별 정리 로직을 수행 (예: UI 숨김, 리소스 해제 등).
/// </summary>
protected abstract void Disable();
```

## 코드 스니펫

### 상태 변경 로직
```csharp
/// <summary>
/// 서브클래스에서 상태 변경을 요청할 때 호출되는 protected 메서드.
/// 상태 머신을 통해 전역 상태를 변경하며, 모든 상태 클래스의 OnChangedState가 호출됨.
/// 예를 들어, 배치 완료 후 편집 모드로 전환할 때 사용.
/// </summary>
/// <param name="state">전환할 목표 상태 (MyRoomEditorStateEnum 값)</param>
protected void ChangeState(MyRoomEditorStateEnum state)
{
    MyRoomEditorStateHandle.ChangeState(state);
}

/// <summary>
/// 상태 변경 이벤트가 발생할 때 호출되는 private 메서드.
/// 현재 상태가 이 클래스의 targetState와 일치하는지 확인하여
/// 입력 이벤트 구독/해제와 함께 Enable/Disable 메서드를 호출.
/// 상태 머신 패턴의 핵심 로직으로, 상태별 동작을 자동으로 관리.
/// </summary>
/// <param name="state">새로 변경된 전역 상태</param>
private void OnChangedState(MyRoomEditorStateEnum state)
{
    // 현재 상태가 이 클래스의 대상 상태와 일치하면 활성화
    if (state == targetState)
    {
        InputEnable(); // 입력 이벤트 구독
        Enable(); // 서브클래스별 활성화 로직 실행
    }
    // 일치하지 않으면 비활성화
    else
    {
        InputDisable(); // 입력이벤트 해제
        Disable(); // 서브클래스별 비활성화 로직 실행
    }
}
```

## 상속 구조

`MyRoomEditorState`는 다음과 같은 서브클래스를 가집니다:
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/housingsystem/myroomeditorplacementmanager/): 오브젝트 생성 및 배치 상태 관리
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/): 오브젝트 편집 상태 관리

## 의존성

- `MyRoomEditorStateHandle`: 상태 변경 이벤트 관리
- [`MyRoomEditorEdittingInputDispatcher`](/docs/projects/rfice/housingsystem/myroomeditoreditinginputdispatcher/): 편집 입력 이벤트 처리
- `MyRoomEditorPlacementPresenter`: 배치 관련 프리젠터

## 사용 예시

서브클래스 구현 예시:
```csharp
public class MyRoomEditorPlacementManager : MyRoomEditorState
{
    protected override void Enable()
    {
        // 배치 모드 활성화 로직
    }

    protected override void Disable()
    {
        // 배치 모드 비활성화 로직
    }

    // ... 다른 추상 메서드 구현
}

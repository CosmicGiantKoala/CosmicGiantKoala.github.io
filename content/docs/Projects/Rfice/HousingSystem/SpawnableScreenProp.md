+++
title = "SpawnableScreenProp"
description = "특수한 인터렉션을 포함한 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 417
+++
## 개요

`SpawnableScreenProp`는 스크린 오브젝트 클래스. [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)를 상속받아 벽에 배치되는 스크린의 특수 기능을 구현하며, 개인공간에서 실시간 파일 공유 기능 모듈(NetworkedScreen)을 사용할 수 있게 설정.

## 주요 역할

- **스크린 인터페이스 제공**: 실시간 파일 공유를 위한 화면 제공
- **NetworkedScreen 연동**: 네트워크를 통한 파일 공유 모듈 연결
- **벽 배치 특화**: 벽면 배치에 최적화된 위치 및 기즈모
- **화면 트랜스폼 제공**: ScreenHandlerTr을 통한 화면 위치 제공

## 구현 인터페이스

- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/): 상호작용 기능
- [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/): 스크린 특수 기능

## 주요 컴포넌트

### 필드
```csharp
/// <summary>
/// 스크린 표면 트랜스폼: 파일 공유 UI 표시 위치
/// </summary>
[SerializeField]
private Transform screenPropTr;
public Transform ScreenHandlerTr => screenPropTr;

/// <summary>
/// 편집 상태 컴포넌트: 하이라이트 상태 관리
/// </summary>
private PropEditingState _propEditingState;
```

### 주요 메서드
```csharp
/// <summary>
/// 오브젝트 삭제 메서드.
/// 이벤트 구독 해제 후 게임 오브젝트를 파괴.
/// </summary>
public void Delete()

/// <summary>
/// 하이라이트 상태를 설정하는 추상 메서드 구현.
/// PropEditingState의 초기 설정을 수행.
/// </summary>
protected override void SetupPropHighlight()

/// <summary>
/// 포커스 상태로 변경하는 메서드.
/// 유효한 상태의 하이라이트를 표시.
/// </summary>
public void Focused()

/// <summary>
/// 포커스 해제 상태로 변경하는 메서드.
/// 기본 하이라이트 상태로 복원.
/// </summary>
public void Unfocused()

/// <summary>
/// 선택 상태로 변경하는 메서드.
/// 선택된 상태의 하이라이트를 표시.
/// </summary>
public void Selected()

/// <summary>
/// 선택 해제 상태로 변경하는 메서드.
/// 기본 하이라이트 상태로 복원.
/// </summary>
public void Deselected()

/// <summary>
/// 배치 가능 영역인지 검증하고 배치하는 메서드.
/// 히트 포인트로 이동 후 배치 타입 검증 및 부모 관계 설정.
/// </summary>
/// <param name="hitPosition">배치할 히트 포인트 위치</param>
/// <param name="area">배치 영역 인터페이스</param>
/// <returns>배치 가능한 경우 true</returns>
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)

/// <summary>
/// 오브젝트를 지정된 위치로 이동하는 메서드.
/// </summary>
/// <param name="position">이동할 목표 위치</param>
public void Move(Vector3 position)

/// <summary>
/// 기즈모의 위치와 회전을 계산하여 반환하는 메서드.
/// 배치 타입에 따라 오브젝트 위쪽(Floor) 또는 아래쪽(Ceiling)에 기즈모 배치.
/// </summary>
/// <returns>기즈모 위치와 회전 튜플</returns>
public (Vector3, Quaternion) GetGizmoPositionAndRotation()
```

## 사용 예시

### NetworkedScreen 연동
```csharp
var screenProp = GetComponent<SpawnableScreenProp>();
var screenTransform = screenProp.ScreenHandlerTr;
// NetworkedScreen 모듈을 screenTransform에 연결
```

## 의존성

- [`NetworkedScreen`](/docs/projects/rfice/incomplete/fileshare/): 실시간 파일 공유 모듈
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/): 하이라이트 상태 관리
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/): 부모 클래스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 구현된 인터페이스
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
`SpawnableScreenProp`는 MyRoomEditor에서 스크린을 나타내는 스폰 가능한 오브젝트입니다. 이 클래스는 스크린 핸들러를 제공하며, IMoveableProp과 IScreenProp 인터페이스를 구현합니다.

## 역할
- 스크린 오브젝트(NetworkedScreen)의 이동 기능 제공
- 오브젝트 하이라이트 및 선택 상태 관리
- 기즈모 위치 및 회전 계산
- 벽에 배치 할 수 있는 오브젝트

## 구현 인터페이스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/): 상호작용 기능
- [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/): 스크린 특수 기능

## 선언
```csharp
public class SpawnableScreenProp : SpawnablePropBase, IMoveableProp, IScreenProp
```

## 멤버
### 속성
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

### 메서드
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

## 기능 설명
### 편집 기능
- 이동 변경 지원
- 하이라이트 상태 표시

### 편집 가능성 검증
- **이동 가능**: 이동 인터페이스 지원

### 배치 프로세스
1. **위치 이동**: 히트 포인트로 즉시 이동
2. **타입 검증**: 배치 영역 타입과 PlacementType 일치 확인
3. **부모 설정**: 배치 영역이 다른 오브젝트 위면 부모 관계 설정
    - 오브젝트 슬롯 영역에 배치 시 부모 설정
    - 룸 레벨 배치 시 부모 해제
4. **시각 피드백**: 유효/무효에 따라 하이라이트 변경

### 하이라이트 상태
- **Focused**: 녹색 (Valid)
- **Unfocused**: 기본 (Default)
- **Selected**: 파란색 (Selected)
- **Deselected**: 기본 (Default)

### 기즈모 위치
- 벽 구조물의 회전값에 맞춰 적합한 위치 반환
- 기즈모는 수평 방향으로 표시

### 기즈모 위치 계산
```csharp
public (Vector3,Quaternion) GetGizmoPositionAndRotation()
{
    var bounds = _collider.bounds;
    var fixedRotation = transform.rotation.eulerAngles.y - 90;
    var gizmoRotation = new Vector3(0, fixedRotation, 90);
    var offsetDirection = fixedRotation switch
    {
        RightDirectionKey => (Vector3.right * bounds.size.x) + (Vector3.right *0.5f),
        BackDirectionKey => (Vector3.back * bounds.size.z) + (Vector3.back *0.5f),
        ForwardDirectionKey => (Vector3.forward * bounds.size.z) + (Vector3.forward *0.5f),
        LeftDirectionKey => (Vector3.left * bounds.size.x) + (Vector3.left *0.5f),
        _ => Vector3.zero
    };
    Vector3 offset = bounds.center + offsetDirection;
    return (offset, Quaternion.Euler(gizmoRotation));
}
```

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)를 상속받음.
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/), [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/) 인터페이스를 구현.
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/) 컴포넌트를 사용.

## 관련 클래스
- [`NetworkedScreen`](/docs/projects/rfice/incomplete/fileshare/): 실시간 파일 공유 모듈
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/): 하이라이트 상태 관리
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/): 부모 클래스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 구현된 인터페이스
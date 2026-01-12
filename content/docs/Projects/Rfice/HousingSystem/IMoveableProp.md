+++
title = "IMoveableProp"
description = "이동 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 421
+++
## 개요

`IMoveableProp` 인터페이스는 MyRoom 에디터에서 이동 가능한 프로퍼티를 정의합니다. 이 인터페이스를 구현하는 클래스는 위치 이동 및 배치 가능 영역 검사를 수행할 수 있습니다.

## 역할

- MyRoomEditor에서 오브젝트의 이동 기능 제공
- 배치 가능 영역 내에서의 위치 검증


## 멤버
### 속성
```csharp
/// <summary>
/// 이동 가능한 프로퍼티의 기본 컴포넌트 참조.
/// </summary>
SpawnablePropBase PropBaseComponent { get; }
```

### 메서드
```csharp
/// <summary>
/// 프로퍼티의 현재 위치를 반환합니다.
/// </summary>
/// <returns>현재 위치 Vector3</returns>
Vector3 GetPosition()

/// <summary>
/// 프로퍼티를 지정된 위치로 이동합니다.
/// </summary>
/// <param name="pos">이동할 목표 위치</param>
void Move(Vector3 pos)

/// <summary>
/// 지정된 위치가 배치 가능 영역 내에 있는지 검사합니다.
/// </summary>
/// <param name="targetPos">검사할 목표 위치</param>
/// <param name="placeableArea">배치 가능 영역 인터페이스</param>
/// <returns>배치 가능한 경우 true</returns>
bool IsPlaceableArea(Vector3 targetPos, IPlaceableArea placeableArea)
```

## 기능 설명

### 위치 관리
- `GetPosition()`으로 현재 위치 조회
- `Move()`로 새로운 위치로 이동

### 배치 영역 검사
- `IsPlaceableArea()`로 목표 위치의 유효성 검증
- 배치 가능 영역 인터페이스와 연동하여 안전한 이동 보장

### 프로퍼티 참조
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase) 속성으로 기본 프로퍼티 컴포넌트 접근

## 의존성/상속 관계

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject)를 상속받음.
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase), [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/) 클래스에 의존.

## 상속 관계 및 구현체

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)를 확장
- 이동이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/), [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/), [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/), [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/))

## 사용 예시

### 이동 가능 여부 확인
```csharp
if (editableObject.IsMovableProp(out IMoveableProp movableProp))
{
    Vector3 currentPos = movableProp.GetPosition();
    // 이동 UI 표시
}
```

### 위치 이동
```csharp
movableProp.Move(targetPosition);
```

### 배치 영역 검사
```csharp
if (movableProp.IsPlaceableArea(newPosition, placeableArea))
{
    movableProp.Move(newPosition);
}
```

## 관련 클래스

- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/)
- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/)
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea)
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPlacementManager)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/) 

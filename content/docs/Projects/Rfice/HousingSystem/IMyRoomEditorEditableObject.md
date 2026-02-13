+++
title = "IMyRoomEditorEditableObject"
description = "편집 가능한 오브젝트 정의 및 기능 정의 인터페이스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 419
+++

## 개요

`IMyRoomEditorEditableObject` 인터페이스는 MyRoomEditor에서 편집 가능한 객체의 기본 동작을 정의합니다.

## 역할

- MyRoomEditor에서 편집 가능한 객체의 표준 인터페이스 제공
- 객체의 선택/해제, 포커스 상태 관리
- 다양한 편집 기능(색상, 이동, 회전 등)의 지원 여부 검사

## 선언
```csharp
public interface IMyRoomEditorEditableObject : IEquatable<IMyRoomEditorEditableObject>
```

## 멤버
### 속성
```csharp
/// <summary>
/// 로컬라이징용 객체의 이름 키.
/// </summary>
string PropNameKey { get; }
```

### 메서드
```csharp
/// <summary>
/// 객체를 삭제합니다.
/// </summary>
void Delete()

/// <summary>
/// 색상 편집이 가능한지 검사하고 인터페이스를 반환합니다.
/// </summary>
/// <param name="prop">색상 편집 인터페이스 출력</param>
/// <returns>색상 편집 가능한 경우 true</returns>
bool IsEditableColor(out IColorEditableProp prop)

/// <summary>
/// 이동이 가능한지 검사하고 인터페이스를 반환합니다.
/// </summary>
/// <param name="prop">이동 인터페이스 출력</param>
/// <returns>이동 가능한 경우 true</returns>
bool IsMovableProp(out IMoveableProp prop)

/// <summary>
/// 회전이 가능한지 검사하고 인터페이스를 반환합니다.
/// </summary>
/// <param name="prop">회전 인터페이스 출력</param>
/// <returns>회전 가능한 경우 true</returns>
bool IsRotatableProp(out IRotatableProp prop)

/// <summary>
/// 포토프레임 프로퍼티인지 검사하고 인터페이스를 반환합니다.
/// </summary>
/// <param name="prop">포토프레임 인터페이스 출력</param>
/// <returns>포토프레임인 경우 true</returns>
bool IsPhotoFrameProp(out IPhotoFrameProp prop)

/// <summary>
/// 배치 영역인지 검사하고 인터페이스를 반환합니다.
/// </summary>
/// <param name="area">배치 영역 인터페이스 출력</param>
/// <returns>배치 영역인 경우 true</returns>
bool IsPlacementArea(out IPlaceableArea area)

/// <summary>
/// 객체가 포커스되었을 때 호출됩니다.
/// </summary>
void Focused()

/// <summary>
/// 객체의 포커스가 해제되었을 때 호출됩니다.
/// </summary>
void Unfocused()

/// <summary>
/// 객체가 선택되었을 때 호출됩니다.
/// </summary>
void Selected()

/// <summary>
/// 객체의 선택이 해제되었을 때 호출됩니다.
/// </summary>
void Deselected()

/// <summary>
/// 기즈모의 위치와 회전을 반환합니다.
/// </summary>
/// <returns>위치와 회전의 튜플</returns>
(Vector3, Quaternion) GetGizmoPositionAndRotation()

/// <summary>
/// 배치된 오브젝트 정보를 반환합니다.
/// </summary>
/// <returns>MyRoomPlaceProp 정보</returns>
MyRoomPlaceProp GetPlacePropInfo()

/// <summary>
/// 배치된 오브젝트 ID를 반환합니다.
/// </summary>
/// <returns>오브젝트 ID 문자열</returns>
string GetPlacePropId()
```

## 기능 설명
### 오브젝트 관리
- `Delete()`로 오브젝트 삭제
- `PropNameKey`로 로컬라이징된 이름 제공

### 편집 기능 검사
- 각 편집 기능(색상, 이동, 회전 등)에 대한 지원 여부 검사
- 지원되는 경우 해당 인터페이스 반환
- `IsEditableColor(out IColorEditableProp prop)`: 색상 편집 가능 여부 및 인터페이스 반환
- `IsMovableProp(out IMoveableProp prop)`: 이동 가능 여부 및 인터페이스 반환
- `IsRotatableProp(out IRotatableProp prop)`: 회전 가능 여부 및 인터페이스 반환
- `IsPhotoFrameProp(out IPhotoFrameProp prop)`: 사진 프레임 여부 및 인터페이스 반환
- `IsPlacementArea(out IPlaceableArea area)`: 배치 영역 여부 및 인터페이스 반환

### 상태 관리
- `Focused()`/`Unfocused()`: 포커스 상태 전환
- `Selected()`/`Deselected()`: 선택 상태 전환

### 기즈모 및 배치 정보
- `GetGizmoPositionAndRotation()`: 편집 기즈모 위치/회전 반환
- `GetPlacePropInfo()`/`GetPlacePropId()`: 배치 정보 제공

## 의존성/상속 관계

- `IEquatable<IMyRoomEditorEditableObject>`를 구현.
- **확장 인터페이스들**:
  - [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/): 색상 변경 기능
  - [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
  - [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/): 회전 기능
  - [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 사진 프레임 기능
  - [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 영역 기능


## 사용 예시

#### 인터페이스 검증 및 사용
```csharp
if (editableObject.IsMovableProp(out IMoveableProp movableProp))
{
    // 이동 가능한 오브젝트 처리
    Vector3 position = movableProp.GetPosition();
    // ...
}

if (editableObject.IsEditableColor(out IColorEditableProp colorProp))
{
    // 색상 편집 가능한 오브젝트 처리
    var colors = colorProp.GetColorList();
    // ...
}
```

#### 상태 변경
```csharp
// 오브젝트 선택
editableObject.Focused();
editableObject.Selected();

// 오브젝트 선택 해제
editableObject.Unfocused();
editableObject.Deselected();
```

## 관련 클래스 및 인터페이스

- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)
- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/)
- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/)
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/)
- [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/)
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/)
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/)
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/)
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/)
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorInteractionManager)
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPlacementManager)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`MyRoomEditorPropSelector`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropSelector)

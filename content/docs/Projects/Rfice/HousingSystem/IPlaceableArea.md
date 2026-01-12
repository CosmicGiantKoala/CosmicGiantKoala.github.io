+++
title = "IPlaceableArea"
description = "배치 영역 정의 및 배치 영역 기능"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 426
+++
## 개요

`IPlaceableArea` 인터페이스는 MyRoomEditor에서 오브젝트를 배치할 수 있는 영역을 정의합니다. 이 인터페이스를 구현하는 클래스는 배치 타입, 회전, 오브젝트 위의 배치영역 검사 기능을 제공합니다.

## 역할

- 배치 가능한 영역의 타입 정보 제공
- 배치 시 적용될 회전 값 정의
- 오브젝트 위의 배치영역 검사

## 멤버
### 메서드
```csharp
/// <summary>
/// 배치 영역의 타입을 반환합니다.
/// </summary>
/// <returns>배치 타입 enum 값</returns>
PlacementType GetPlacementType()

/// <summary>
/// 배치 시 적용될 회전 값을 반환합니다.
/// </summary>
/// <returns>배치 회전 Quaternion</returns>
Quaternion GetPlacementRotation()

/// <summary>
/// 배치 영역 내에 기존 프로퍼티가 있는지 검사합니다.
/// </summary>
/// <param name="baseProp">영역 내 프로퍼티 출력</param>
/// <returns>프로퍼티가 존재하면 true</returns>
bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
```

## 기능 설명

### 배치 타입 관리
- `GetPlacementType()`으로 영역의 배치 타입 반환
- 벽, 바닥, 천장 등 배치 가능한 표면 타입 구분

### 회전 적용
- `GetPlacementRotation()`으로 배치 시 회전 값 제공
- 표면 방향에 맞는 적절한 회전 적용

### 영역 검사
- `IsPlacementAreaInProp()`으로 오브젝트 위의 배치영역인지 검사
- 중복 배치 및 충돌 검사에 사용

## 의존성/상속 관계
- `PlacementType`, [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/) 클래스에 의존.
- [`PlacementAreaProp`](/docs/projects/rfice/housingsystem/placementareaprop/), [`PlacementAreaInProp`](/docs/projects/rfice/housingsystem/placementareainprop/): 배치 가능한 공간을 정의하는 오브젝트에서 구현

## 사용 예시
### 배치가능영역 검증 및 타입 확인
```csharp
if (raycastHit.transform.TryGetComponent(out IPlaceableArea placeableArea)
{
    var type = placeableArea.GetPlacementType();
}
```

### 오브젝트 위의 배치영역 확인
```csharp
if (editableObject.IsPlacementArea(out IPlaceableArea placeableArea))
{
    if (placeableArea.IsPlacementAreaInProp(out SpawnablePropBase prop))
    {
        // 오브젝트 위 배치 영역 처리
        Debug.Log("배치 영역 타입: " + type + ", 부모 오브젝트: " + prop.Id);
    }
}
```

## 관련 클래스

- [`PlacementAreaProp`](/docs/projects/rfice/housingsystem/placementareaprop/)
- [`PlacementAreaInProp`](/docs/projects/rfice/housingsystem/placementareainprop/)
- [`MyRoomEditorPlacementManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPlacementManager)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`IMoveableProp`](/docs/projects/rfice/HousingSystem/IMoveableProp)

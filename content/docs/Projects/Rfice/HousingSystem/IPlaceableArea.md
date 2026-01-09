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

`IPlaceableArea`는 배치 영역을 정의하는 인터페이스. 오브젝트가 배치될 수 있는 공간의 범위와 규칙을 지정.

## 인터페이스 멤버

```csharp
/// <summary>
/// 배치 영역 타입 반환 (바닥, 벽 등)
/// </summary>
public PlacementType GetPlacementType();

/// <summary>
/// 배치 시 적용될 회전 값 반환
/// </summary>
public Quaternion GetPlacementRotation();

/// <summary>
/// 오브젝트 위에 중복 배치 영역인지 확인
/// </summary>
public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp);
```

## 주요 기능 설명

- **GetPlacementType**: 배치 영역 타입 반환 (바닥, 벽 등)
- **GetPlacementRotation**: 배치 시 적용될 회전 값 반환
- **IsPlacementAreaInProp**: 오브젝트 위 배치 영역인지 확인

## 구현체

- [`PlacementAreaProp`](/docs/projects/rfice/housingsystem/placementareaprop/), [`PlacementAreaInProp`](/docs/projects/rfice/housingsystem/placementareainprop/): 배치 가능한 공간을 정의하는 컴포넌트들


## 사용 예시

```csharp
if (editableObject.IsPlacementArea(out IPlaceableArea placeableArea))
{
    PlacementType type = placeableArea.GetPlacementType();
    Quaternion rotation = placeableArea.GetPlacementRotation();
    
    if (placeableArea.IsPlacementAreaInProp(out SpawnablePropBase prop))
    {
        // 오브젝트 위 배치 영역 처리
        Debug.Log("배치 영역 타입: " + type + ", 부모 오브젝트: " + prop.Id);
    }
}
```

+++
title = "PlacementAreaProp"
description = "바닥, 천장, 벽면과 같은 배치 영역을 정의하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 427
+++
## 개요
`PlacementAreaProp`는 MyRoomEditor에서 룸 레벨의 배치 가능 영역을 정의하는 클래스입니다. 벽, 바닥, 천장 등의 룸 구조물을 나타내며, [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스를 구현합니다. 오브젝트 배치의 기반이 되는 영역입니다.

## 역할
- 룸 레벨 배치 영역 정의 (벽, 바닥, 천장)
- 배치 타입 및 회전 정보 제공
- 프로퍼티 배치 정보 저장/로드
- 편집 가능 인터페이스 구현 (제한적)

## 멤버
### 속성
```csharp
/// <summary>
/// 배치 영역 타입 (바닥, 벽, 천장 등)
/// </summary>
[SerializeField]
private PlacementType placementAreaType;

/// <summary>
/// 배치 시 적용될 회전 값
/// </summary>
[SerializeField]
private Quaternion propRotation;
```

### 메서드
```csharp
/// <summary>
/// 배치 영역 타입을 반환.
/// </summary>
public PlacementType GetPlacementType()

/// <summary>
/// 배치 시 적용될 회전 값을 반환.
/// </summary>
public Quaternion GetPlacementRotation()

/// <summary>
/// 해당 컴포넌트가 `PlacementAreaInProp`(오브젝트 중복배치 영역)인지 확인하고 부모 오브젝트 반환
/// </summary>
public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
```

## 기능 설명
### 룸 구조물 표현
- 벽, 바닥, 천장 등의 룸 레벨 배치 영역 정의
- 배치 타입과 회전에 따라 다른 오브젝트 배치 가능

## 의존성/상속 관계

- `MonoBehaviour`를 상속받음.
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스 구현.
- `Collider` 컴포넌트 필요 (RequireComponent).
- [`PlacementType`](/docs/projects/rfice/HousingSystem/PlacementType) 열거형 사용.

## 사용 예시
### 오브젝트 영역 검증 단계에서 회전 값 및 타입/슬롯영역인지 확인
```csharp
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
{
    Move(hitPosition);
    transform.rotation = area.GetPlacementRotation();
    
    if (area.GetPlacementType() != PlacementType)
    {
        _propEditingState.Invalid();
        return false;
    }
    if (area.IsPlacementAreaInProp(out var parent))
    {
        SetPropParent(parent);
    }
    else
    {
        ClearPropParent();
    }

    _propEditingState.Valid();
    return true;
}
```

## 관련 클래스
- [`PlacementType`](/docs/projects/rfice/housingsystem/placementtype/): 배치 타입 열거형
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 영역 인터페이스

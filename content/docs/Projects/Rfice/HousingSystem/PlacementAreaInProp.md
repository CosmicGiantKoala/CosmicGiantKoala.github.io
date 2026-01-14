+++
title = "PlacementAreaInProp"
description = "책상, 탁자 등 오브젝트 위에 배치되는 영역을 관리하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 428
+++
## 개요
`PlacementAreaInProp`는 오브젝트에 추가 배치 가능한 슬롯 영역(책상 위 등)을 정의하는 클래스입니다. [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스를 구현하여 슬롯 위치에 다른 오브젝트를 배치할 수 있도록 합니다. 배치 타입에 따라 적절한 레이어로 설정됩니다.

## 역할
- 오브젝트에 추가 배치 슬롯 영역 정의
- 배치 타입에 따른 레이어 설정
- 부모 프로퍼티 참조 관리
- 배치 가능 여부 및 위치 정보 제공

## 멤버
### 속성
```csharp
/// <summary>
/// 배치 영역 타입 (Floor, Wall, Ceiling 등)
/// </summary>
[SerializeField]
private PlacementType _placementType;

/// <summary>
/// 이 배치 영역이 속한 오브젝트
/// </summary>
private SpawnablePropBase _baseParent;
```

### 메서드
```csharp
/// <summary>
/// 슬롯을 가진 오브젝트와 배치 영역을 연결하고 레이어를 설정.
/// </summary>
public void SetPlacementAreaInProp(SpawnablePropBase parent)

/// <summary>
/// 배치 영역 타입을 반환.
/// </summary>
public PlacementType GetPlacementType()

/// <summary>
/// 배치 시 적용될 회전 값을 반환.
/// </summary>
public Quaternion GetPlacementRotation()

/// <summary>
/// 해당 배치 가능 영역이 `PlacementAreaInProp`(오브젝트 중복배치 영역)인지 확인하고 오브젝트 반환
/// </summary>
public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
```

## 기능 설명
### 배치 정보 제공
- 배치 타입 정보 제공
- 배치 회전 정보 제공 (transform.rotation)
- 해당 영역을 소유한 슬롯 오브젝트 반환.

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea) 인터페이스 구현.
- [`PlacementType`](/docs/projects/rfice/HousingSystem/PlacementType) 열거형 사용.
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)에 의존.
- - `Collider` 컴포넌트 필요 (RequireComponent).

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
- [`PlacementAreaProp`](/docs/projects/rfice/HousingSystem/PlacementAreaProp)
- [`IPlaceableArea`](/docs/projects/rfice/HousingSystem/IPlaceableArea)
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)
- [`PlacementType`](/docs/projects/rfice/HousingSystem/PlacementType)

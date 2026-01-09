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

`PlacementAreaInProp`는 책상, 탁자 등 오브젝트 위에 배치되는 영역을 관리하는 클래스.

## 주요 역할

- **부모 오브젝트 연동**: 배치 영역을 특정 오브젝트와 연결
- **레이어 설정**: 배치 타입에 따라 적절한 레이어 설정
- **부모 관계 추적**: 배치 영역이 속한 부모 오브젝트 정보 제공

## 주요 멤버

### 필드
```csharp
/// <summary>
/// 배치 영역 타입 (Floor, Wall, Ceiling 등)
/// </summary>
[SerializeField]
private PlacementType _placementType;

/// <summary>
/// 이 배치 영역이 속한 부모 오브젝트
/// </summary>
private SpawnablePropBase _baseParent;
```

### 주요 메서드
```csharp
/// <summary>
/// 부모 오브젝트와 배치 영역을 연결하고 레이어를 설정.
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
/// 해당 컴포넌트가 `PlacementAreaInProp`(오브젝트 중복배치 영역)인지 확인하고 부모 오브젝트 반환
/// </summary>
public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
```

## 구현 인터페이스

- `IPlaceableArea`: 배치 영역 인터페이스

## 사용 예시

```csharp
// 부모 오브젝트와 배치 영역 연결
placementAreaInProp.SetPlacementAreaInProp(parentObject);

// 배치 영역이 오브젝트 위에 있는지 확인
if (placementAreaInProp.IsPlacementAreaInProp(out var parent))
{
    Debug.Log($"배치 영역은 {parent.PropNameKey} 위에 있습니다.");
}
```

## 관련 클래스

- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/): 부모 오브젝트로 사용되는 배치 가능한 오브젝트
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 구현하는 인터페이스

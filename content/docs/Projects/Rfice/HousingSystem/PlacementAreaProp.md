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

`PlacementAreaProp`는 바닥, 천장, 벽면과 같은 배치 영역을 정의하는 클래스. 오브젝트가 배치될 수 있는 공간의 범위와 규칙을 지정.

## 주요 역할

- **배치 영역 정의**: 배치 타입과 회전 값 제공
- **편집 인터페이스**: 색상 편집 인터페이스 구현 (빈 구현)
- **배치 정보 관리**: 배치된 오브젝트 정보 저장/관리

## 주요 멤버

### 필드
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

### 주요 메서드
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

## 구현 인터페이스

- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 영역 인터페이스

## 사용 예시

```csharp
// 배치 영역 타입 확인
var placementType = placementArea.GetPlacementType();
var rotation = placementArea.GetPlacementRotation();

// 오브젝트 위 배치 영역인지 확인
if (placementArea.IsPlacementAreaInProp(out var parentProp))
{
    Debug.Log($"배치 영역은 {parentProp.PropNameKey} 위에 있습니다.");
}
```

## 관련 클래스

- [`PlacementType`](/docs/projects/rfice/housingsystem/placementtype/): 배치 타입 열거형
- [`IPlaceableArea`](/docs/projects/rfice/housingsystem/iplaceablearea/): 배치 영역 인터페이스
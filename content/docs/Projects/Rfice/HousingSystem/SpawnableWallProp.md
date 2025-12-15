+++
title = "SpawnableWallProp"
description = "벽에 배치되는 일반적인 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 415
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`SpawnableWallProp`는 벽에 배치되는 일반적인 오브젝트 클래스입니다. `SpawnablePropBase`를 상속받아 벽(Wall)에 배치 가능한 오브젝트의 구현을 제공합니다.

## 주요 역할

- **벽 배치 특화**: 벽면에 부착되는 오브젝트의 이동 및 배치
- **방향 기반 기즈모**: 벽 방향에 따른 기즈모 위치 및 회전 계산
- **색상 편집 지원**: Material 변경을 통한 색상 변경
- **이동 제한**: 벽 오브젝트는 회전 불가 (벽면에 고정)

## 구현 인터페이스

- `IColorEditableProp`: 색상 편집 기능
- `IMoveableProp`: 이동 기능
- `IMyRoomEditorEditableObject`: 편집 가능한 오브젝트

## 방향 상수

```csharp
private const float RightDirectionKey = 0f;
private const float BackDirectionKey = 90f;
private const float ForwardDirectionKey = -90f;
private const float LeftDirectionKey = 180f;
```

벽 방향을 90도 단위로 구분하여 기즈모 위치를 계산합니다.

## 주요 메서드

### 배치 검증
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
    // ... 부모 관계 설정
    _propEditingState.Valid();
    return true;
}
```

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

## 특징

### 회전 제한
벽 오브젝트는 `IsRotatableProp`이 `false`를 반환하여 회전 기능을 비활성화합니다. 벽면에 부착된 상태를 유지해야 하기 때문입니다.

### 방향별 기즈모
- **Right (0°)**: 오브젝트 오른쪽에 기즈모 표시
- **Back (90°)**: 오브젝트 뒤쪽에 기즈모 표시
- **Forward (-90°)**: 오브젝트 앞쪽에 기즈모 표시
- **Left (180°)**: 오브젝트 왼쪽에 기즈모 표시

### 배치 시 자동 회전
배치 시 `area.GetPlacementRotation()`을 사용하여 벽면에 맞게 자동으로 회전합니다.

## 의존성

- **PropEditingState**: 하이라이트 관리
- **MyRoomMaterialChangeHelper**: 색상 변경
- **Collider**: 기즈모 계산용

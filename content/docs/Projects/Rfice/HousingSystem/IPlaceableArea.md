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
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`IPlaceableArea`는 배치 영역을 정의하는 인터페이스입니다. 오브젝트가 배치될 수 있는 공간의 범위와 규칙을 지정합니다.

## 인터페이스 멤버

```csharp
PlacementType GetPlacementType();
Quaternion GetPlacementRotation();
bool IsPlacementAreaInProp(out SpawnablePropBase baseProp);
```

## 코드 스니펫

```csharp
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using UnityEngine;

public interface IPlaceableArea
{
    public PlacementType GetPlacementType();
    public Quaternion GetPlacementRotation();
    public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp);
}
```

- **GetPlacementType**: 배치 영역 타입 반환 (바닥, 벽 등)
- **GetPlacementRotation**: 배치 시 적용될 회전 값 반환
- **IsPlacementAreaInProp**: 오브젝트 위 배치 영역인지 확인

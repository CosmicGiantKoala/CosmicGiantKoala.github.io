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
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`PlacementAreaProp`는 바닥, 천장, 벽면과 같은 배치 영역을 정의하는 클래스입니다. 오브젝트가 배치될 수 있는 공간의 범위와 규칙을 지정합니다.

## 주요 역할

- **배치 영역 정의**: 배치 타입과 회전 값 제공
- **편집 인터페이스**: 색상 편집 인터페이스 구현 (빈 구현)
- **배치 정보 관리**: 배치된 오브젝트 정보 저장/관리

## 주요 멤버

### 필드
```csharp
[SerializeField]
private PlacementType placementAreaType;

[SerializeField]
private Quaternion propRotation;

private MyRoomPlaceProp _placePropInfo;
```

### 주요 메서드
```csharp
public PlacementType GetPlacementType()
public Quaternion GetPlacementRotation()
public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
```

## 코드 스니펫

### 주요 구현
```csharp
public PlacementType GetPlacementType() => placementAreaType;
public Quaternion GetPlacementRotation() => propRotation;

public bool IsPlacementAreaInProp(out SpawnablePropBase baseProp)
{
    baseProp = null;
    return false;
}
```

배치 영역 타입에 따라 Floor, Ceiling, Wall 등으로 설정되며, 배치 시 적용될 회전 값을 제공합니다.

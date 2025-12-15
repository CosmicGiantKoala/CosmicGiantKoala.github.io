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

`PlacementAreaInProp`는 책상, 탁자 등 오브젝트 위에 배치되는 영역을 관리하는 클래스입니다. 부모 오브젝트 내 자식 오브젝트 처리를 담당합니다.

## 주요 역할

- **부모 오브젝트 연동**: 배치 영역을 특정 오브젝트와 연결
- **레이어 설정**: 배치 타입에 따라 적절한 레이어 설정
- **부모 관계 추적**: 배치 영역이 속한 부모 오브젝트 정보 제공

## 코드 스니펫

```csharp
public void SetPlacementAreaInProp(SpawnablePropBase parent)
{
    _baseParent = parent;
    gameObject.layer = _placementType switch
    {
        PlacementType.Floor or PlacementType.Ceiling => LayerMask.NameToLayer("Ground"),
        PlacementType.Wall => LayerMask.NameToLayer("Wall"),
    };
}

public bool IsPlacementAreaInProp(out SpawnablePropBase parentProp)
{
    parentProp = _baseParent;
    return true;
}
```

부모 오브젝트 위에 배치되는 영역을 관리하며, 배치 타입에 따라 Ground 또는 Wall 레이어로 설정됩니다.

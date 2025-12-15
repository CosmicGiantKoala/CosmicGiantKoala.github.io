+++
title = "IMoveableProp"
description = "이동 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 421
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`IMoveableProp`는 이동 가능한 오브젝트를 정의하는 인터페이스입니다. 배치 영역 검증 및 위치 변경 기능을 정의합니다.

## 인터페이스 멤버

### 속성
```csharp
SpawnablePropBase PropBaseComponent { get; }
```

### 메서드
```csharp
Vector3 GetPosition();
void Move(Vector3 pos);
bool IsPlaceableArea(Vector3 targetPos, IPlaceableArea placeableArea);
```

## 코드 스니펫

```csharp
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public interface IMoveableProp : IMyRoomEditorEditableObject
    {
        public SpawnablePropBase PropBaseComponent { get; }
        public Vector3 GetPosition();
        public void Move(Vector3 pos);
        public bool IsPlaceableArea(Vector3 targetPos, IPlaceableArea placeableArea);
    }
}
```

## 주요 기능 설명

- **PropBaseComponent**: 이동 가능한 오브젝트의 기본 컴포넌트
- **GetPosition**: 현재 위치 반환
- **Move**: 지정된 위치로 이동
- **IsPlaceableArea**: 대상 위치가 배치 가능한 영역인지 검증

## 상속 관계

- `IMyRoomEditorEditableObject`를 확장
- 이동이 가능한 오브젝트들에서 구현

## 사용 예시

```csharp
if (editableObject.IsMovableProp(out IMoveableProp movableProp))
{
    Vector3 currentPos = movableProp.GetPosition();
    Vector3 newPos = currentPos + Vector3.forward;
    
    if (movableProp.IsPlaceableArea(newPos, placeableArea))
    {
        movableProp.Move(newPos);
    }
}

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

`IMoveableProp`는 이동 가능한 오브젝트를 정의하는 인터페이스. 배치 영역 검증 및 위치 변경 기능을 정의.

## 인터페이스 멤버

### 속성
```csharp
/// <summary>
/// 이동 가능한 오브젝트의 기본 컴포넌트
/// </summary>
SpawnablePropBase PropBaseComponent { get; }
```

### 메서드
```csharp
/// <summary>
/// 현재 위치 반환
/// </summary>
Vector3 GetPosition();

/// <summary>
/// 지정된 위치로 이동
/// </summary>
void Move(Vector3 pos);

/// <summary>
/// 대상 위치가 배치 가능한 영역인지 검증
/// </summary>
bool IsPlaceableArea(Vector3 targetPos, IPlaceableArea placeableArea);
```

## 주요 기능 설명

- **PropBaseComponent**: 이동 가능한 오브젝트의 기본 컴포넌트 반환
- **GetPosition**: 현재 위치 반환
- **Move**: 지정된 위치로 이동
- **IsPlaceableArea**: 대상 위치가 배치 가능한 영역인지 검증


## 상속 관계 및 구현체

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)를 확장
- 이동이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/), [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/), [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/), [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/))

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

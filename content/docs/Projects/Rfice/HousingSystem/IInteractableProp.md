+++
title = "IInteractableProp"
description = "특수한 인터렉션 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 423
+++
## 개요

`IInteractableProp` 인터페이스는 MyRoom 에디터에서 사용자와 상호작용할 수 있는 프로퍼티를 정의합니다. 이 인터페이스를 구현하는 클래스는 Interact 메서드를 통해 특정 동작을 수행할 수 있습니다.

## 역할

- MyRoomEditor에서 사용자 상호작용을 처리
- 상호작용 이벤트에 대한 응답 로직 제공

## 선언
```csharp
public interface IInteractableProp
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 프로퍼티와의 상호작용을 처리하는 메서드.
/// 구현 클래스에서 특정 상호작용 로직을 정의.
/// </summary>
void Interact()
```

## 기능 설명
### 상호작용 처리
- `Interact()` 메서드를 통해 특정 인터렉션 오브젝트의 동작을 실행
- 구현 클래스에서 상호작용의 구체적인 동작을 정의

## 의존성/상속 관계

- 특수 인터렉션이 존재하는 오브젝트들에서 구현([`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/), [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/))
- **확장 인터페이스들**:
    - [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 사진 프레임 기능
    - [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/): 공유 오브젝트 기능

## 사용 예시

#### [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)에서 상호작용 가능 여부 확인 용도로 사용
```csharp
// SpawnablePropBase.cs 에서 상호작용 처리
if (TryGetComponent(out IInteractableProp interactableProp))
{
    interactableProp.Interact();
}
```

## 관련 클래스

- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorInteractionManager)
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/)
- [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/)
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/)
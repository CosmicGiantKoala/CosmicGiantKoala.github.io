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

`IInteractableProp`는 특수한 인터렉션이 가능한 오브젝트를 정의하는 인터페이스.

## 인터페이스 멤버

### 메서드
```csharp
/// <summary>
/// 특수 인터랙션 실행
/// </summary>
void Interact();
```

## 주요 기능 설명

- **Interact**: 특수 인터랙션 실행

## 상속 관계 및 구현체

- 이동이 가능한 오브젝트들에서 구현([`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/), [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/))
- **확장 인터페이스들**:
    - [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 사진 프레임 기능
    - [`IScreenProp`](/docs/projects/rfice/housingsystem/iscreenprop/): 공유 오브젝트 기능

## 사용 예시

```csharp
if (TryGetComponent(out IInteractableProp interactableProp))
{
    interactableProp.Interact();
}
```
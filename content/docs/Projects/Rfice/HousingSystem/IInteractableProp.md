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

`IInteractableProp`는 특수한 인터렉션이 가능한 오브젝트를 정의하는 인터페이스입니다.

## 인터페이스 멤버

```csharp
void Interact();
```

## 코드 스니펫

```csharp
namespace Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor
{
    public interface IInteractableProp
    {
        public void Interact();
    }
}
```

- **Interact**: 특수 인터랙션 실행

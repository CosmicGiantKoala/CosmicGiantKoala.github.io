+++
title = "IScreenProp"
description = "실시간 파일 공유 모듈 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 425
+++

## 개요

`IScreenProp`는 실시간 파일 공유 모듈을 정의하는 인터페이스입니다.

## 인터페이스 멤버

(메서드 없음 - 마커 인터페이스)

## 코드 스니펫

```csharp
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor
{
    public interface IScreenProp : IInteractableProp
    {
    }
}
```

실시간 파일 공유 기능이 있는 스크린 오브젝트를 위한 마커 인터페이스입니다.

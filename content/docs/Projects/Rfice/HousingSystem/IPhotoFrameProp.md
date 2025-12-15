+++
title = "IPhotoFrameProp"
description = "사진 프레임 정의 및 이미지 설정 기능"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 424
+++

## 개요

`IPhotoFrameProp`는 사진 프레임 오브젝트를 정의하는 인터페이스입니다. 이미지 설정 기능과 콜백 관리를 정의합니다.

## 인터페이스 멤버

```csharp
void OnCompleteUpload(string imagePath);
void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback);
```

## 코드 스니펫

```csharp
using System;
using Dev.Scripts.Rsup.Domain.Entities.MyRoom;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor
{
    public interface IPhotoFrameProp : IInteractableProp
    {
        public void OnCompleteUpload(string imagePath);
        public void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback);
    }
}
```

- **OnCompleteUpload**: 이미지 업로드 완료 시 호출
- **ReserveCompletedApplyImageCallback**: 이미지 적용 완료 콜백 예약

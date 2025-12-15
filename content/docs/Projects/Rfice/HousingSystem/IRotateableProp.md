+++
title = "IRotatableProp"
description = "회전 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 422
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`IRotatableProp`는 회전 가능한 오브젝트를 정의하는 인터페이스입니다. 자유 회전 및 스냅 회전 기능을 정의합니다.

## 인터페이스 멤버

```csharp
Quaternion GetRotation();
void SetRotation(Quaternion rotation);
void RotationBySnapValue(float snapStepValue);
```

## 코드 스니펫

```csharp
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public interface IRotatableProp : IMyRoomEditorEditableObject
    {
        public Quaternion GetRotation();
        public void SetRotation(Quaternion rotation);
        public void RotationBySnapValue(float snapStepValue);
    }
}
```

- **GetRotation**: 현재 회전 값 반환
- **SetRotation**: 회전 값 설정
- **RotationBySnapValue**: 지정된 단계 값만큼 회전

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

`IRotatableProp`는 회전 가능한 오브젝트를 정의하는 인터페이스. 자유 회전 및 스냅 회전 기능을 정의.

## 인터페이스 멤버

### 메서드
```csharp
/// <summary>
/// 현재 회전 값 반환
/// </summary>
Quaternion GetRotation();

/// <summary>
/// 회전 값 설정
/// </summary>
void SetRotation(Quaternion rotation);

/// <summary>
/// 지정된 단계 값만큼 회전
/// </summary>
void RotationBySnapValue(float snapStepValue);
```


## 주요 기능 설명

- **GetRotation**: 현재 회전 값 반환
- **SetRotation**: 회전 값 설정
- **RotationBySnapValue**: 지정된 단계 값만큼 회전

## 상속 관계 및 구현체

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)를 확장
- 이동이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/))

## 사용 예시

```csharp
if (editableObject.IsRotatableProp(out IRotatableProp rotatableProp))
{
    Quaternion currentRotation = rotatableProp.GetRotation();
    Quaternion newRotation = Quaternion.Euler(0, 45, 0);
    rotatableProp.SetRotation(newRotation);
    
    // 또는 스냅 회전
    rotatableProp.RotationBySnapValue(15f);
}
```
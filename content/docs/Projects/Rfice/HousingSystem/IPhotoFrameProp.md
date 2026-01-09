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

`IPhotoFrameProp`는 사진 프레임 오브젝트를 정의하는 인터페이스. 이미지 설정 기능과 콜백 관리를 정의.

## 인터페이스 멤버

```csharp
/// <summary>
/// 이미지 업로드 완료 시 호출
/// </summary>
public void OnCompleteUpload(string imagePath);

/// <summary>
/// 이미지 적용 완료 콜백 예약
/// </summary>
public void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback);
```

## 주요 기능 설명

- **OnCompleteUpload**: 이미지 업로드 완료 시 호출
- **ReserveCompletedApplyImageCallback**: 이미지 적용 완료 콜백 예약

## 상속 관계 및 구현체

- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)를 확장
- 이미지 업로드 기능을 포함한 오브젝트에서 구현([`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)

## 사용 예시

```csharp
if (editableObject.IsPhotoFrameProp(out IPhotoFrameProp photoFrameProp))
{
    // 이미지 업로드 완료 콜백 설정
    photoFrameProp.ReserveCompletedApplyImageCallback((prop) =>
    {
        Debug.Log("이미지 적용 완료: " + prop.id);
    });
    
    // 업로드 완료 시 호출
    photoFrameProp.OnCompleteUpload("path/to/uploaded/image.png");
}
```
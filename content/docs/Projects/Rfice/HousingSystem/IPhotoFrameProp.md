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

`IPhotoFrameProp` 인터페이스는 MyRoomEditor에서 사진 프레임 프로퍼티의 기능을 정의합니다. 이 인터페이스를 구현하는 클래스는 사진 업로드 및 적용 기능을 제공합니다.

## 역할

- 사진 프레임 객체의 사진 업로드 처리
- 업로드 완료 후 이미지 적용 콜백 관리
- 사용자 상호작용을 통한 사진 변경 기능 제공


## 멤버
### 메서드
```csharp
/// <summary>
/// 사진 업로드가 완료되었을 때 호출되는 메서드.
/// 업로드된 이미지 경로를 받아서 처리.
/// </summary>
/// <param name="imagePath">업로드된 이미지의 파일 경로</param>
void OnCompleteUpload(string imagePath)

/// <summary>
/// 이미지 적용 완료 콜백을 예약하는 메서드.
/// 사진 적용이 완료되었을 때 호출될 콜백 함수를 등록.
/// </summary>
/// <param name="callback">적용 완료 시 호출될 콜백 함수</param>
void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback)
```

## 기능 설명

### 사진 업로드
- `OnCompleteUpload()`로 업로드 완료된 이미지 처리
- 파일 경로를 받아 텍스처로 변환하여 프레임에 적용

### 콜백 관리
- `ReserveCompletedApplyImageCallback()`로 적용 완료 시 호출될 콜백 등록
- 사진 적용 후 배치 정보 업데이트 및 동기화에 사용

## 의존성/상속 관계

- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)를 확장
- 이미지 업로드 기능을 포함한 오브젝트에서 구현([`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)

## 사용 예시

```csharp
private void OnUploadPhoto()
{
    if (_editingObject.IsPhotoFrameProp(out var photoFrameProp))
    {
        _interactionManager.UploadImage(photoFrameProp.OnCompleteUpload);
        photoFrameProp.ReserveCompletedApplyImageCallback(UpdatePlacePropInfo);
    }
    else
    {
        Debug.Log($"{_editingObject.PropNameKey} is not interactable");
    }
}
```

## 관련 클래스

- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorInteractionManager)
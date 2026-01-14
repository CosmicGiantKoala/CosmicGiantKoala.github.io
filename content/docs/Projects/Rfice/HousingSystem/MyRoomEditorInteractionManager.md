+++
title = "MyRoomEditorInteractionManager"
description = "오브젝트의 특수 인터렉션을 담당하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 409
+++
## 개요

`MyRoomEditorInteractionManager`는 MyRoomEditor씬에서 오브젝트의 특수 인터렉션을 담당하는 클래스입니다. `MyRoomEditorPropEditingManager`를 통해 특정 인터렉션 호출을 처리하며, 외부 API 및 네트워크 연동을 담당합니다. 콜백 기반 비동기 처리를 지원합니다.

## 역할
- 이미지 파일 업로드 요청 및 응답 처리
- 플랫폼별 상호작용 로직 분기(API호출 관련)
- 업로드 완료 콜백 관리
- MyRoomEditor와 도메인 계층 간 상호작용 중재

## 멤버
### 속성
```csharp
/// <summary>
/// 파일 업로드와 같은 인터랙션을 처리하는 도메인 레이어 인터페이스
/// 인터랙터 패턴을 사용하여 비즈니스 로직과 프레젠테이션을 분리
/// </summary>
[Inject]
private IMyRoomInteractionInteractor _interactor;

/// <summary>
// 이미지 업로드 완료 콜백을 저장하는 필드
// Action<string> 델리게이트 타입으로, 업로드된 파일 경로를 매개변수로 받음
// 콜백을 저장하여 비동기 작업 완료 시 호출하기 위해 사용
/// </summary>
private Action<string> _onCompleteUploadImageCallback;
```

### 메서드
```csharp
/// <summary>
/// 이미지 업로드 요청을 처리하는 public 메서드.
/// </summary>
/// <param name="imageUploadedCallback">업로드 완료 시 호출될 콜백 함수, null 가능</param>
public void UploadImage(Action<string> imageUploadedCallback)

/// <summary>
/// 파일 업로드 완료 시 호출되는 private 콜백 메서드.
/// 인터랙터의 RequestFileUpload에서 호출되며, 콜백을 실행하고 참조를 해제.
/// </summary>
/// <param name="path">업로드된 파일의 서버 경로 또는 URL</param>
private void OnCompleteUploadImage(string path)
```

## 코드 스니펫

### 이미지 업로드 프로세스
```csharp
public void UploadImage(Action<string> imageUploadedCallback)
{
    #if !UNITY_EDITOR
    _onCompleteUploadImageCallback = imageUploadedCallback; // 비동기 작업에서 콜백을 유지하기 위해 필드에 할당
    _interactor.RequestFileUpload(OnCompleteUploadImage); // 인터랙터를 통해 파일 업로드 요청 시작, OnCompleteUploadImage 메서드를 콜백으로 전달하여 업로드 완료 시 호출  
    #else
    ... 
    #endif
}

private void OnCompleteUploadImage(string path)
{
    _onCompleteUploadImageCallback?.Invoke(path);
    _onCompleteUploadImageCallback = null;
}
```


## 기능 설명
### 이미지 업로드 요청
- `UploadImage()`: 플랫폼에 따라 다른 업로드 로직을 수행. 런타임에서는 인터랙터를 통해 실제 파일 업로드를 요청하고, 에디터에서는 테스트용 더미 URL을 반환.

### 콜백 관리
- 업로드 완료 시 등록된 콜백을 호출하고, 메모리 누수를 방지하기 위해 콜백을 null로 초기화.

### 플랫폼 분기
- 컴파일 시점 조건부 컴파일을 사용하여 에디터 환경과 런타임 환경에서 다른 동작을 수행.

### 인터랙터 패턴
- 도메인 레이어의 인터랙터를 통해 파일 업로드 요청
- 클린 아키텍처 원칙 준수: 프레젠테이션과 도메인 분리

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- Zenject를 사용하여 `IMyRoomInteractionInteractor`를 의존성 주입받음.
- `IMyRoomInteractionInteractor` 인터페이스에 의존.

## 사용 예시

### [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)에서 사진 업로드 호출시
```csharp
// MyRoomEditorPropEditingManager에서 호출
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
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/) 
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/HousingSystem/SpawnablePhotoFrameProp)

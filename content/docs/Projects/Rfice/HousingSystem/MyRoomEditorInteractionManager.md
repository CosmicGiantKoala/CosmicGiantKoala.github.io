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

`MyRoomEditorInteractionManager`는 오브젝트의 특수 인터렉션을 담당하는 클래스. `MyRoomEditorPropEditingManager`를 통해 특정 인터렉션 호출을 처리하며, 외부 API 및 네트워크 연동을 담당.

## 주요 역할

- **이미지 업로드**: 사진 프레임 오브젝트를 위한 이미지 업로드 처리
- **콜백 관리**: 업로드 완료 후 콜백 처리
- **인터랙터 연동**: 도메인 레이어의 인터랙터를 통한 비즈니스 로직 처리

## 주요 멤버

### 필드
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

### 주요 메서드
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

## 주요 기능 설명

### 콜백 관리
- 업로드 요청 시 콜백을 필드에 저장하여 비동기 작업 유지
- 업로드 완료 시 저장된 콜백 실행
- 콜백 실행 후 참조를 null로 설정하여 메모리 관리

### 인터랙터 패턴
- 도메인 레이어의 인터랙터를 통해 파일 업로드 요청
- 클린 아키텍처 원칙 준수: 프레젠테이션과 도메인 분리

## 사용 예시

### 사진 프레임 이미지 업로드
```csharp
// MyRoomEditorPropEditingManager에서 호출
interactionManager.UploadImage(photoFrameProp.OnCompleteUpload);
```

## 관련 클래스
- `IMyRoomInteractionInteractor`: 파일 업로드 인터랙터 인터페이스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/): 사용자
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 호출 인터페이스 

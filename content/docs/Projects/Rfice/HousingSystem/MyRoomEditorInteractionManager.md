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

`MyRoomEditorInteractionManager`는 오브젝트의 특수 인터렉션을 담당하는 클래스입니다. `MyRoomEditorPropEditingManager`를 통해 특정 인터렉션 호출을 처리하며, 외부 API 및 네트워크 연동을 담당합니다.

## 주요 역할

- **이미지 업로드**: 사진 프레임 오브젝트를 위한 이미지 업로드 처리
- **플랫폼별 처리**: 에디터와 런타임 환경에 따른 다른 동작
- **콜백 관리**: 업로드 완료 후 콜백 처리
- **인터랙터 연동**: 도메인 레이어의 인터랙터를 통한 비즈니스 로직 처리

## 주요 멤버

### 필드
```csharp
[Inject]
private IMyRoomInteractionInteractor _interactor;

private Action<string> _onCompleteUploadImageCallback;
```

### 주요 메서드
```csharp
public void UploadImage(Action<string> imageUploadedCallback)
private void OnCompleteUploadImage(string path)
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using Dev.Scripts.Rsup.Domain.UseCase.Interactor.MyRoom;
using Dev.Scripts.Rsup.Presentation.Presenters.MyRoomEditor;
using Dev.Scripts.Rsup.Scenes.Components.Common.Tools;
using UnityEngine;
using Zenject;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorInteractionManager : MonoBehaviour
    {
        [Inject]
        private IMyRoomInteractionInteractor _interactor;
        
        private Action<string> _onCompleteUploadImageCallback;
        public void UploadImage(Action<string> imageUploadedCallback)
        {
            #if !UNITY_EDITOR
            _onCompleteUploadImageCallback = imageUploadedCallback;
            _interactor.RequestFileUpload(OnCompleteUploadImage);
            #else
            var testPath = "https://picsum.photos/200";
            imageUploadedCallback?.Invoke(testPath);
            #endif
        }

        private void OnCompleteUploadImage(string path)
        {
            _onCompleteUploadImageCallback?.Invoke(path);
            _onCompleteUploadImageCallback = null;
        }
    }
}
```

### 이미지 업로드 메서드
```csharp
public void UploadImage(Action<string> imageUploadedCallback)
{
    #if !UNITY_EDITOR
    _onCompleteUploadImageCallback = imageUploadedCallback;
    _interactor.RequestFileUpload(OnCompleteUploadImage);
    #else
    var testPath = "https://picsum.photos/200";
    imageUploadedCallback?.Invoke(testPath);
    #endif
}
```

### 업로드 완료 콜백
```csharp
private void OnCompleteUploadImage(string path)
{
    _onCompleteUploadImageCallback?.Invoke(path);
    _onCompleteUploadImageCallback = null;
}
```

## 주요 기능 설명

### 플랫폼별 처리
- **런타임**: 실제 파일 업로드 인터랙터 호출
- **에디터**: 테스트용 더미 URL 반환 (https://picsum.photos/200)

### 콜백 관리
- 업로드 요청 시 콜백 저장
- 업로드 완료 시 콜백 실행
- 콜백 실행 후 참조 해제

### 인터랙터 패턴
- 도메인 레이어의 인터랙터를 통해 파일 업로드 요청
- 클린 아키텍처 원칙 준수

## 사용 예시

### 사진 프레임 이미지 업로드
```csharp
// MyRoomEditorPropEditingManager에서 호출
_interactionManager.UploadImage(photoFrameProp.OnCompleteUpload);
```

## 의존성

- `IMyRoomInteractionInteractor`: 파일 업로드 인터랙터 인터페이스

## 관련 클래스

- **사용자**: `MyRoomEditorPropEditingManager`
- **호출 인터페이스**: `IPhotoFrameProp`
- **도메인 인터랙터**: `IMyRoomInteractionInteractor`

+++
title = "SpawnablePhotoFrameProp"
description = "특수한 인터렉션을 포함한 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 416
+++
#### **(본 문서는 AI로 작성된 프로토타입 문서입니다.)**
## 개요

`SpawnablePhotoFrame` (SpawnablePhotoFrameProp)는 사진 프레임 오브젝트 클래스입니다. `SpawnablePropBase`를 상속받아 벽에 배치되는 사진 프레임의 특수 기능을 구현합니다.

## 주요 역할

- **이미지 로딩 및 표시**: URL로부터 텍스처를 로드하여 프레임에 표시
- **동적 이미지 변경**: 편집 시 이미지 업로드 및 교체
- **벽 배치 특화**: 벽면 배치에 최적화된 기즈모 및 이동
- **데이터 지속성**: 이미지 URL을 배치 데이터에 저장

## 구현 인터페이스

- `IMoveableProp`: 이동 기능
- `IPhotoFrameProp`: 사진 프레임 특수 기능
- `IInteractableProp`: 상호작용 기능 (상속)

## 주요 컴포넌트

### 필드
```csharp
[Inject]
private MyRoomEditorInteractionManager _interactionManager;

private event Action<MyRoomPlaceProp> OnCompleteAppliedImageCallback;
private Collider _collider;
private PropImageRenderer _propImageRenderer;
private TextureLoaderFromURL _textureLoader;
private string _imgPath;
private PropEditingState _propEditingState;
```

### 특수 컴포넌트
- **PropImageRenderer**: 이미지 표시를 담당
- **TextureLoaderFromURL**: URL로부터 텍스처 로드

## 이미지 처리 기능

### 업로드 완료 처리
```csharp
public void OnCompleteUpload(string imgPath)
{
    _imgPath = imgPath;
    _textureLoader.GetTexture(imgPath, ApplyImage);
}
```

### 이미지 적용
```csharp
private void ApplyImage(Texture2D img)
{
    _propImageRenderer.AddImage(img);
    MyRoomPlacePropData.imageUrl = _imgPath;
    OnCompleteAppliedImageCallback?.Invoke(GetPlacePropInfo());
}
```

### 콜백 예약
```csharp
public void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback)
{
    OnCompleteAppliedImageCallback = callback;
}
```

## 초기화 및 로드

### Interact 메서드
```csharp
public void Interact()
{
    if (string.IsNullOrEmpty(MyRoomPlacePropData.imageUrl)) return;
    Debug.Log($"[SpawnablePhotoFrame] {GetPlacePropId()} Load Image => {MyRoomPlacePropData.imageUrl}");
    _imgPath = MyRoomPlacePropData.imageUrl;
    _textureLoader.GetTexture(_imgPath, ApplyImage);
}
```

룸 진입 시 저장된 이미지 URL로부터 자동으로 이미지를 로드합니다.

## 특징

### 편집 가능성
- **색상 편집**: 불가능 (이미지로 대체)
- **이동**: 가능 (벽면 이동)
- **회전**: 불가능 (벽면 고정)
- **사진 프레임**: 가능 (특수 인터랙션)

### 벽 배치
SpawnableWallProp과 유사하게 벽면에 배치되며, 방향에 따른 기즈모 계산을 수행합니다.

## 의존성

- **MyRoomEditorInteractionManager**: 이미지 업로드 처리
- **PropImageRenderer**: 이미지 렌더링
- **TextureLoaderFromURL**: 텍스처 로드
- **PropEditingState**: 하이라이트 관리

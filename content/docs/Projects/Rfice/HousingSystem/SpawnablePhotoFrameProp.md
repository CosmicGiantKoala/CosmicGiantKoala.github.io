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
## 개요

`SpawnablePhotoFrameProp`는 사진 프레임 오브젝트 클래스. [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)를 상속받아 벽에 배치되는 사진 프레임의 특수 기능을 구현.

## 주요 역할

- **이미지 로딩 및 표시**: URL로부터 텍스처를 로드하여 프레임에 표시
- **동적 이미지 변경**: 편집 시 이미지 업로드 및 교체
- **벽 배치 특화**: 벽면 배치에 최적화된 기즈모 및 이동
- **데이터 지속성**: 이미지 URL을 배치 데이터에 저장

## 구현 인터페이스

- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 사진 프레임 특수 기능
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/): 상호작용 기능

## 주요 컴포넌트

### 필드
```csharp
/// <summary>
/// Zenject를 통한 의존성 주입: 인터랙션 매니저
/// 이미지 업로드 처리를 담당하는 매니저
/// </summary>
[Inject]
private MyRoomEditorInteractionManager _interactionManager;

/// <summary>
/// 이미지 적용이 완료되었을 때 호출되는 이벤트
/// </summary>
private event Action<MyRoomPlaceProp> OnCompleteAppliedImageCallback;

/// <summary>
/// 이미지 렌더러 컴포넌트: 프레임에 이미지 표시 담당
/// </summary>
private PropImageRenderer _propImageRenderer;

/// <summary>
/// 텍스처 로더 컴포넌트: URL로부터 텍스처 로드 담당(프로젝트 유틸리티 클래스)
/// </summary>
private TextureLoaderFromURL _textureLoader;

/// <summary>
/// 현재 이미지 경로: 로드된 이미지의 URL
/// </summary>
private string _imgPath;

/// <summary>
/// 편집 상태 컴포넌트: 하이라이트 상태 관리
/// </summary>
private PropEditingState _propEditingState;
```

### 주요 메서드
```csharp
/// <summary>
/// 오브젝트 삭제 메서드.
/// 이벤트 구독 해제 후 게임 오브젝트를 파괴.
/// </summary>
public void Delete()

/// <summary>
/// 하이라이트 상태를 설정하는 추상 메서드 구현.
/// PropEditingState의 초기 설정을 수행.
/// </summary>
protected override void SetupPropHighlight()

/// <summary>
/// 포커스 상태로 변경하는 메서드.
/// 유효한 상태의 하이라이트를 표시.
/// </summary>
public void Focused()

/// <summary>
/// 포커스 해제 상태로 변경하는 메서드.
/// 기본 하이라이트 상태로 복원.
/// </summary>
public void Unfocused()

/// <summary>
/// 선택 상태로 변경하는 메서드.
/// 선택된 상태의 하이라이트를 표시.
/// </summary>
public void Selected()

/// <summary>
/// 선택 해제 상태로 변경하는 메서드.
/// 기본 하이라이트 상태로 복원.
/// </summary>
public void Deselected()

/// <summary>
/// 배치 가능 영역인지 검증하고 배치하는 메서드.
/// 히트 포인트로 이동 후 배치 타입 검증 및 부모 관계 설정.
/// </summary>
/// <param name="hitPosition">배치할 히트 포인트 위치</param>
/// <param name="area">배치 영역 인터페이스</param>
/// <returns>배치 가능한 경우 true</returns>
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)

/// <summary>
/// 오브젝트를 지정된 위치로 이동하는 메서드.
/// </summary>
/// <param name="position">이동할 목표 위치</param>
public void Move(Vector3 position)

/// <summary>
/// 기즈모의 위치와 회전을 계산하여 반환하는 메서드.
/// 배치 타입에 따라 오브젝트 위쪽(Floor) 또는 아래쪽(Ceiling)에 기즈모 배치.
/// </summary>
/// <returns>기즈모 위치와 회전 튜플</returns>
public (Vector3, Quaternion) GetGizmoPositionAndRotation()

/// <summary>
/// 이미지 업로드 완료 이벤트 핸들러.
/// 업로드된 이미지 경로를 받아 텍스처 로드 시작.
/// </summary>
/// <param name="imgPath">업로드된 이미지의 경로/URL</param>
public void OnCompleteUpload(string imgPath)

/// <summary>
/// 로드된 텍스처를 프레임에 적용하는 프라이빗 메서드.
/// 이미지 렌더러에 이미지를 추가하고 배치 데이터에 URL 저장.
/// </summary>
/// <param name="img">적용할 텍스처</param>
private void ApplyImage(Texture2D img)

/// <summary>
/// 이미지 적용 완료 콜백을 예약하는 메서드.
/// 이미지 적용이 완료되었을 때 호출할 콜백을 설정.
/// </summary>
/// <param name="callback">이미지 적용 완료 시 호출할 콜백</param>
public void ReserveCompletedApplyImageCallback(Action<MyRoomPlaceProp> callback)

/// <summary>
/// IInteractableProp 인터페이스의 Interact 메서드 구현.
/// 룸 진입 시 저장된 이미지 URL로부터 이미지를 로드.
/// </summary>
public void Interact()
```

## 코드 스니펫

### 이미지 업로드 완료 처리
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

### 초기화 및 로드
```csharp
public void Interact()
{
    if (string.IsNullOrEmpty(MyRoomPlacePropData.imageUrl)) return;
    Debug.Log($"[SpawnablePhotoFrame] {GetPlacePropId()} Load Image => {MyRoomPlacePropData.imageUrl}");
    _imgPath = MyRoomPlacePropData.imageUrl;
    _textureLoader.GetTexture(_imgPath, ApplyImage);
}
```


## 주요 기능 설명

### 이미지 처리 워크플로우
1. **업로드 요청**: [`MyRoomEditorInteractionManager`](/docs/projects/rfice/housingsystem/myroomeditorinteractionmanager/)를 통해 이미지 업로드
2. **완료 콜백**: `OnCompleteUpload`에서 이미지 경로 수신
3. **텍스처 로드**: `TextureLoaderFromURL`로 URL로부터 텍스처 로드
4. **이미지 적용**: `ApplyImage`에서 프레임에 이미지 표시
5. **데이터 저장**: 배치 데이터에 이미지 URL 저장

### 벽 배치 특화
- 배치 시 `area.GetPlacementRotation()`으로 벽면 방향 자동 설정
- 기즈모는 벽 방향에 따라 오브젝트 측면에 배치
- 회전은 불가능하여 벽면 고정 유지

### 인터랙션 초기화
- `Interact()` 메서드로 룸 진입 시 자동 이미지 로드
- 저장된 URL로부터 텍스처를 로드하여 프레임에 적용

## 관련 클래스

- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/housingsystem/myroomeditorinteractionmanager/): 이미지 업로드 처리
- `PropImageRenderer`: 이미지 렌더링
- `TextureLoaderFromURL`: 텍스처 로드
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/): 하이라이트 상태 관리
- `MyRoomMaterialChangeHelper`: Material 변경 처리
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/): 부모 클래스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/), [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/): 구현된 인터페이스

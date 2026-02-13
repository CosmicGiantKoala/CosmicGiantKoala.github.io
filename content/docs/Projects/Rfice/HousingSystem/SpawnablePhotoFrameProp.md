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
`SpawnablePhotoFrameProp`는 MyRoomEditor에서 사진 프레임을 나타내는 스폰 가능한 오브젝트입니다. 이 클래스는 사용자가 사진을 업로드하고 표시할 수 있는 기능을 제공하며, IMoveableProp과 IPhotoFrameProp 인터페이스를 구현합니다.

## 역할
- 사진 프레임 오브젝트의 이동 및 편집 기능 제공
- 이미지 업로드 명령 및 콜백 받은 URL을 오브젝트 텍스처 적용 처리
- 오브젝트 하이라이트 및 선택 상태 관리
- 기즈모 위치 및 회전 계산
- 이미지 URL 데이터 관리
- 벽에 배치 할 수 있는 오브젝트

## 구현 인터페이스
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트
- [`IPhotoFrameProp`](/docs/projects/rfice/housingsystem/iphotoframeprop/): 사진 프레임 특수 기능
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/): 상호작용 기능

## 선언
```csharp
public class SpawnablePhotoFrame : SpawnablePropBase, IMoveableProp, IPhotoFrameProp
```

## 멤버
### 이벤트
- `OnCompleteAppliedImageCallback`: 이미지 적용 완료 시 호출되는 이벤트

### 속성
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

### 메서드
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

## 기능 설명
### 이미지 관리
1. **업로드 요청**: [`MyRoomEditorInteractionManager`](/docs/projects/rfice/housingsystem/myroomeditorinteractionmanager/)를 통해 이미지 업로드
2. **완료 콜백**: `OnCompleteUpload(string imgPath)`에서 이미지 경로 수신
3. **텍스처 로드**: `TextureLoaderFromURL`(외부 유틸리티 클래스)로 URL로부터 텍스처 로드
4. **이미지 적용**: `ApplyImage(Texture2D img)`에서 프레임에 이미지 표시
5. **데이터 저장**: 배치 데이터에 이미지 URL 저장

### 편집 기능
- 이동, 이미지 텍스쳐 변경 지원
- 하이라이트 상태 표시

### 편집 가능성 검증
- **이미지 변경 가능**: 이미지 변경 인터페이스 지원
- **이동 가능**: 이동 인터페이스 지원

### 배치 프로세스
1. **위치 이동**: 히트 포인트로 즉시 이동
2. **타입 검증**: 배치 영역 타입과 PlacementType 일치 확인
3. **부모 설정**: 배치 영역이 다른 오브젝트 위면 부모 관계 설정
    - 오브젝트 슬롯 영역에 배치 시 부모 설정
    - 룸 레벨 배치 시 부모 해제
4. **시각 피드백**: 유효/무효에 따라 하이라이트 변경

### 하이라이트 상태
- **Focused**: 녹색 (Valid)
- **Unfocused**: 기본 (Default)
- **Selected**: 파란색 (Selected)
- **Deselected**: 기본 (Default)

### 기즈모 위치
- 벽 구조물의 회전값에 맞춰 적합한 위치 반환
- 기즈모는 수평 방향으로 표시 

### 기즈모 위치 계산
```csharp
public (Vector3,Quaternion) GetGizmoPositionAndRotation()
{
    var bounds = _collider.bounds;
    var fixedRotation = transform.rotation.eulerAngles.y - 90;
    var gizmoRotation = new Vector3(0, fixedRotation, 90);
    var offsetDirection = fixedRotation switch
    {
        RightDirectionKey => (Vector3.right * bounds.size.x) + (Vector3.right *0.5f),
        BackDirectionKey => (Vector3.back * bounds.size.z) + (Vector3.back *0.5f),
        ForwardDirectionKey => (Vector3.forward * bounds.size.z) + (Vector3.forward *0.5f),
        LeftDirectionKey => (Vector3.left * bounds.size.x) + (Vector3.left *0.5f),
        _ => Vector3.zero
    };
    Vector3 offset = bounds.center + offsetDirection;
    return (offset, Quaternion.Euler(gizmoRotation));
}
```

### 인터랙션 초기화
- `Interact()` 메서드로 룸 진입 시 자동 이미지 로드
- 저장된 URL로부터 텍스처를 로드하여 프레임에 적용

### 벽 배치 특화
- 배치 시 `area.GetPlacementRotation()`으로 벽면 방향 자동 설정
- 기즈모는 벽 방향에 따라 오브젝트 측면에 배치
- 회전은 불가능하여 벽면 고정 유지

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)를 상속받음.
- `IMoveableProp`, `IPhotoFrameProp` 인터페이스를 구현.
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorInteractionManager)에 의존.
- `PropImageRenderer`, `TextureLoaderFromURL`, [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/) 컴포넌트를 사용.

## 관련 클래스
- [`MyRoomEditorInteractionManager`](/docs/projects/rfice/housingsystem/myroomeditorinteractionmanager/)
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/)
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/)
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)
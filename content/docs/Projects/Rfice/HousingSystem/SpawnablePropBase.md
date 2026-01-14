+++
title = "SpawnablePropBase"
description = "모든 배치 가능한 오브젝트의 abstract 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 414
+++
## 개요
`SpawnablePropBase`는 MyRoomEditor에서 제어 가능한 모든 오브젝트의 abstract 클래스입니다. 오브젝트의 기본 정보, 부모-자식 관계, 배치 정보 관리 및 공통 로직을 담당합니다.

## 역할
- 프로퍼티 기본 정보 관리 (ID, 타입, 카테고리 등)
- 부모-자식 관련 프로세스
- 오브젝트 배치 정보 저장/로드
- 오브젝트 슬롯 영역 관리

## 멤버

### 속성
```csharp
/// <summary>
/// 배치 타입: Floor, Ceiling, Wall 등 오브젝트가 배치될 수 있는 표면 타입
/// </summary>
public PlacementType PlacementType { get; private set; }

/// <summary>
/// 메인 카테고리: 오브젝트의 주요 분류
/// </summary>
public MyRoomPropMainCategory GetMainCategory { get; private set; }

/// <summary>
/// 특성: 오브젝트의 추가 기능
/// </summary>
public Feature PropFeature { get; private set; }

/// <summary>
/// 이름 키: 로컬라이징을 위한 오브젝트 이름 식별자
/// </summary>
public string PropNameKey { get; private set; }

/// <summary>
/// 고유 ID: 오브젝트 식별자
/// </summary>
public string Id { get; private set; }

/// <summary>
/// 오브젝트 기본 정보: ID, 타입, 카테고리, 색상 리스트 등
/// </summary>
protected MyRoomProp MyRoomPropData { get; private set; }

/// <summary>
/// 배치 정보: 위치, 회전, 색상, 부모 관계 등
/// </summary>
protected MyRoomPlaceProp MyRoomPlacePropData { get; private set; }

/// <summary>
/// 현재 색상: 적용된 색상 정보 (null 가능)
/// </summary>
protected MyRoomPropColor CurrentColor { get; set; }

/// <summary>
/// 부모 오브젝트: 이 오브젝트가 부착된 부모 SpawnablePropBase (null 가능)
/// </summary>
public SpawnablePropBase ParentProp { get; private set; }

/// <summary>
/// 자식 오브젝트 리스트: 이 오브젝트 위에 배치된 자식 오브젝트들
/// </summary>
private List<SpawnablePropBase> _childrenProps = new();
```

### 추상 메서드
```csharp
/// <summary>
/// 편집 가능한 오브젝트 인터페이스를 반환하는 추상 메서드
/// 서브클래스에서 구체적인 구현체를 반환
/// </summary>
public abstract IMyRoomEditorEditableObject GetEditableObject();

/// <summary>
/// 하이라이트 설정을 위한 추상 메서드
/// 서브클래스에서 PropEditingState 등의 시각적 피드백을 설정
/// </summary>
protected abstract void SetupPropHighlight();
```

### 메서드
```csharp
/// <summary>
/// 오브젝트 기본 정보를 설정하는 메서드.
/// MyRoomProp 데이터로부터 ID, 타입, 카테고리 등의 속성을 초기화.
/// </summary>
/// <param name="propInfo">설정할 오브젝트 기본 정보</param>
public void SetPropInfo(MyRoomProp propInfo)

/// <summary>
/// 배치 정보를 설정하는 메서드.
/// 위치, 회전, 색상 등의 배치 데이터를 적용하고, 관련 컴포넌트를 초기화.
/// </summary>
/// <param name="placePropInfo">설정할 배치 정보</param>
public void SetPlacePropInfo(MyRoomPlaceProp placePropInfo)

/// <summary>
/// 현재 배치 정보를 조회하는 메서드.
/// Transform으로부터 최신 위치/회전을 가져와 배치 정보를 업데이트하여 반환.
/// </summary>
/// <returns>업데이트된 배치 정보</returns>
public MyRoomPlaceProp GetPlacePropInfo()

/// <summary>
/// 자식 오브젝트를 추가하는 메서드.
/// 이미 추가된 오브젝트는 중복 추가하지 않음.
/// </summary>
/// <param name="childProp">추가할 자식 오브젝트</param>
public void AddChildProp(SpawnablePropBase childProp)

/// <summary>
/// 자식 오브젝트를 제거하는 메서드.
/// </summary>
/// <param name="childProp">제거할 자식 오브젝트</param>
public void RemoveChildProp(SpawnablePropBase childProp)
```

## 코드 스니펫
### 배치된 오브젝트 초기화
```csharp
public void SetPlacePropInfo(MyRoomPlaceProp placePropInfo)
{
    MyRoomPlacePropData = placePropInfo;

    // 색상 변형을 지원하는 경우 현재 색상 설정
    if (MyRoomPropData.CheckColorVariation())
    {
        if (string.IsNullOrEmpty(placePropInfo.colorKey))
        {
            CurrentColor = null;
        }
        else
        {
            // 색상 키에 해당하는 색상 정보를 찾아 설정
            CurrentColor = MyRoomPropData.colorList.FirstOrDefault(key => key.materialKey == placePropInfo.colorKey);
        }
    }

    // 하이라이트 설정 (서브클래스 구현)
    SetupPropHighlight();

    // 추가 배치 영역 설정
    SetupAdditivePlaceArea();

    // 인터랙터블 컴포넌트가 있으면 초기화 실행
    if (TryGetComponent(out IInteractableProp interactableProp))
    {
        interactableProp.Interact();
    }
}

private void SetupAdditivePlaceArea()
{
    var placementAreaInProps = GetComponentsInChildren<PlacementAreaInProp>();
    if (placementAreaInProps == null) return;

    foreach (var areaInProp in placementAreaInProps)
    {
        areaInProp.SetPlacementAreaInProp(this);
    }
}
```

### 자식 오브젝트 추가/제거
```csharp
public void AddChildProp(SpawnablePropBase childProp)
{
    // 이미 자식으로 등록된 경우 중복 추가 방지
    if (_childrenProps.Any(x => x.MyRoomPlacePropData.id == childProp.MyRoomPlacePropData.id))
    {
        Debug.Log($"Already Set Child Prop : {childProp.GetPlacePropId()}");
        return;
    }

    // 자식 리스트에 추가
    _childrenProps.Add(childProp);

    // Transform 부모 설정
    childProp.transform.parent = transform;

    // 배치 데이터에 부모 ID 설정
    childProp.MyRoomPlacePropData.parentPropId = MyRoomPlacePropData.id;

    // 자식의 부모 참조 설정
    childProp.ParentProp = this;

    Debug.Log($"[SpawnablePropBase] Prop: {GetPlacePropId()} Add Child Prop : {childProp.GetPlacePropId()}");
}

public void RemoveChildProp(SpawnablePropBase childProp)
{
    // 존재하지 않는 자식은 무시
    if (_childrenProps.All(x => x.MyRoomPlacePropData.id != childProp.MyRoomPlacePropData.id)) return;

    _childrenProps.Remove(childProp);
    Debug.Log($"[SpawnablePropBase] Prop: {GetPlacePropId()} Remove Child Prop : {childProp.GetPlacePropId()}");
}
```

## 기능 설명
### 프로퍼티 정보 관리
- `MyRoomProp` 데이터로부터 기본 정보 설정
- 배치 타입, 카테고리, 기능 등 저장

### 계층 구조 관리
- 부모-자식 관계를 통한 오브젝트 계층 관리
- 트랜스폼 부모 설정 및 해제
- [`PlacementAreaInProp`](/docs/projects/rfice/HousingSystem/PlacementAreaInProp) 초기화 및 동작 지원

### 배치 데이터 처리
- 절대/상대 좌표 변환
- 색상 및 회전 정보 저장

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- `MyRoomProp`, `MyRoomPlaceProp` 사용(데이터베이스 클래스/구조체).
- [`PlacementAreaInProp`](/docs/projects/rfice/HousingSystem/PlacementAreaInProp)에 의존.
- **서브클래스**
  - [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/): 바닥/천장 배치 오브젝트
  - [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/): 벽 배치 오브젝트
  - [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/): 사진 프레임 오브젝트
  - [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/): 스크린 오브젝트

## 관련 클래스
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)
- [`IInteractableProp`](/docs/projects/rfice/housingsystem/iinteractableprop/)
- [`PlacementAreaInProp`](/docs/projects/rfice/HousingSystem/PlacementAreaInProp)
- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/)
- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/)
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/)

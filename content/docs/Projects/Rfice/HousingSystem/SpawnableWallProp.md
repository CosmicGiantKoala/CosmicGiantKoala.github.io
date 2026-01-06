+++
title = "SpawnableWallProp"
description = "벽에 배치되는 일반적인 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 415
+++
## 개요

`SpawnableWallProp`는 벽에 배치되는 일반적인 오브젝트 클래스. [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)를 상속받아 벽(Wall)에 배치 가능한 오브젝트의 구현.

## 주요 역할

- **벽 배치 특화**: 벽면에 부착되는 오브젝트의 이동 및 배치
- **방향 기반 기즈모**: 벽 방향에 따른 기즈모 위치 및 회전 계산
- **색상 편집 지원**: Material 변경을 통한 색상 변경
- **이동 제한**: 벽 오브젝트는 회전 불가 (벽면에 고정)

## 구현 인터페이스

- [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/): 색상 편집 기능
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트

## 주요 멤버
### 필드
```csharp
/// <summary>
/// 편집 상태 컴포넌트: 하이라이트 상태 관리
/// </summary>
private PropEditingState _propEditingState;

/// <summary>
/// Material 변경 헬퍼: 색상 변경 처리
/// </summary>
private MyRoomMaterialChangeHelper _materialChangeHelper;
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
/// 사용 가능한 색상 리스트를 반환하는 메서드.
/// </summary>
/// <returns>색상 리스트 (없으면 빈 리스트)</returns>
public List<MyRoomPropColor> GetColorList()

 /// <summary>
/// 색상을 변경하는 메서드.
/// Material을 복제하여 적용하고 선택 상태로 하이라이트 변경.
/// </summary>
/// <param name="mat">적용할 Material</param>
/// <param name="colorIndex">색상 인덱스</param>
public void SetColor(Material mat, int colorIndex)

/// <summary>
/// 기즈모의 위치와 회전을 계산하여 반환하는 메서드.
/// 배치 타입에 따라 오브젝트 위쪽(Floor) 또는 아래쪽(Ceiling)에 기즈모 배치.
/// </summary>
/// <returns>기즈모 위치와 회전 튜플</returns>
public (Vector3, Quaternion) GetGizmoPositionAndRotation()
```

## 코드 스니펫

### 배치 검증
```csharp
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
{
    // 히트 포인트로 즉시 이동
    Move(hitPosition);

    // 배치 영역의 회전을 적용 (벽면 방향 맞춤)
    transform.rotation = area.GetPlacementRotation();

    // 배치 타입 검증
    if (area.GetPlacementType() != PlacementType)
    {
        _propEditingState.Invalid();
        return false;
    }

    // 부모 관계 설정 (배치 영역이 다른 오브젝트 위인 경우)
    if (area.IsPlacementAreaInProp(out var parent))
    {
        SetPropParent(parent);
    }
    else
    {
        ClearPropParent();
    }

    // 유효한 배치 상태 표시
    _propEditingState.Valid();
    return true;
}

public void Move(Vector3 position)
{
    transform.position = position;
}
```


### 색상 변경 가능 검증
```csharp
public bool IsEditableColor(out IColorEditableProp prop)
{
    if (MyRoomPropData.CheckColorVariation()
        && MyRoomPropData.colorList.Count > 0
        && _materialChangeHelper != null)
    {
        prop = this;
        return true;
    }
    else
    {
        prop = null;
        return false;
    }
}
```

### 색상 변경
```csharp
public void SetColor(Material mat, int colorIndex)
{
    var cloneMat = new Material(mat);
    _materialChangeHelper.ChangeMaterial(cloneMat);
    _propEditingState.Selected();
    CurrentColor = GetColorList()[colorIndex];
}
```

### 기즈모 위치 계산
```csharp
public (Vector3, Quaternion) GetGizmoPositionAndRotation()
{
    var bounds = _collider.bounds;
    var fixedRotation = transform.rotation.eulerAngles.y - 90;
    var gizmoRotation = new Vector3(0, fixedRotation, 90);

    // 벽 방향에 따른 오프셋 방향 계산
    var offsetDirection = fixedRotation switch
    {
        RightDirectionKey => (Vector3.right * bounds.size.x) + (Vector3.right * 0.5f),    // 오른쪽
        BackDirectionKey => (Vector3.back * bounds.size.z) + (Vector3.back * 0.5f),     // 뒤쪽
        ForwardDirectionKey => (Vector3.forward * bounds.size.z) + (Vector3.forward * 0.5f), // 앞쪽
        LeftDirectionKey => (Vector3.left * bounds.size.x) + (Vector3.left * 0.5f),     // 왼쪽
        _ => Vector3.zero
    };

    Vector3 offset = bounds.center + offsetDirection;
    return (offset, Quaternion.Euler(gizmoRotation));
}
```

## 특징

### 회전 제한
벽 오브젝트는 `IsRotatableProp`이 `false`를 반환하여 회전 기능을 비활성화.

### 배치 시 자동 회전
배치 시 `area.GetPlacementRotation()`을 사용하여 벽면에 맞게 자동으로 회전.

## 관련 클래스
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/): 하이라이트 상태 관리
- `MyRoomMaterialChangeHelper`: Material 변경 처리
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/): 부모 클래스
- [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/), [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 구현된 인터페이스
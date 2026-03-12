+++
title = "SpawnableFloorAndCeilProp"
description = "바닥과 천장에 배치되는 일반적인 오브젝트 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 415
+++
## 개요
`SpawnableFloorAndCeilProp`는 MyRoomEditor에서 바닥과 천장에 배치되는 오브젝트를 위한 클래스입니다. [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)를 상속받아 오브젝트 기본 기능과 이동, 회전, 색상 편집 등의 동작을 구체적으로 구현합니다.

## 역할
- 바닥/천장 오브젝트의 기본 기능 제공
- 이동, 회전, 색상 변경 인터페이스 구현
- 하이라이트 상태 관리
- 배치 검증 및 부모 관계 설정
- 오브젝트 기즈모 위치 반환

## 구현 인터페이스에 따른 편집 기능 표시
![image](/images/ceilprop.png)

## 구현 인터페이스
- [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/): 색상 편집 기능
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/): 이동 기능
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/): 회전 기능
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/): 편집 가능한 오브젝트

## 선언
```csharp
public class SpawnableFloorAndCeilProp : SpawnablePropBase, IColorEditableProp, IMoveableProp, IRotatableProp
```

## 멤버
### 속성
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

### 배치 가능성 검증
```csharp
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
{
    // 히트 포인트로 즉시 이동
    Move(hitPosition);

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

### 스냅 회전
```csharp
public void RotationBySnapValue(float snapStepValue)
{
    var currentRot = transform.eulerAngles.y;
    var targetRot = Mathf.Round((currentRot + snapStepValue) / snapStepValue) * snapStepValue;
    transform.rotation = Quaternion.Euler(0,targetRot,0);
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
    var gizmoRotation = Quaternion.Euler(0, 0, 0);

    // 배치 타입에 따른 오프셋 방향 계산
    Vector3 offsetDirection = PlacementType switch
    {
        PlacementType.Floor => (Vector3.up * bounds.size.y),    // 오브젝트 위쪽
        PlacementType.Ceiling => (Vector3.down * bounds.size.y), // 오브젝트 아래쪽
        _ => Vector3.zero
    };

    Vector3 offset = transform.position + offsetDirection;
    return (offset, gizmoRotation);
}
```

## 기능 설명
### 편집 기능
- 이동, 회전, 색상 변경 지원
- 하이라이트 상태 표시

### 편집 가능성 검증
- **색상 편집**: 색상 변경 인터페이스 지원 지원 + 오브젝트 데이터에 색상 리스트 존재
- **이동 가능**: 이동 인터페이스 지원
- **회전 가능**: 회전 인터페이스 지원

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
- **Floor**: 오브젝트 위쪽 (bounds.height만큼 위)
- **Ceiling**: 오브젝트 아래쪽 (bounds.height만큼 아래)
- 기즈모는 수직 방향으로 표시

## 의존성/상속 관계
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase)를 상속받음.
- [`IColorEditableProp`](/docs/projects/rfice/HousingSystem/IColorEditableProp), [`IMoveableProp`](/docs/projects/rfice/HousingSystem/IMoveableProp), [`IRotatableProp`](/docs/projects/rfice/HousingSystem/IRotatableProp) 인터페이스 구현.
- [`PropEditingState`](/docs/projects/rfice/HousingSystem/PropEditingState), `MyRoomMaterialChangeHelper`에 의존.

## 관련 클래스
- [`PropEditingState`](/docs/projects/rfice/housingsystem/propeditingstate/)
- [`SpawnablePropBase`](/docs/projects/rfice/housingsystem/spawnablepropbase/)
- [`IColorEditableProp`](/docs/projects/rfice/housingsystem/icoloreditableprop/)
- [`IMoveableProp`](/docs/projects/rfice/housingsystem/imoveableprop/)
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/)

+++
title = "PropEditingState"
description = "오브젝트 편집 상태에 따라 오브젝트의 Material 효과를 표현하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 418
+++
## 개요
`PropEditingState`는 MyRoomEditor에서 오브젝트의 시각적 하이라이트 상태를 관리하는 클래스입니다. 머티리얼의 셰이더 키워드를 통해 선택, 유효성 등의 시각적 피드백을 제공합니다.

## 역할
- 오브젝트의 하이라이트 상태 관리
- 셰이더 키워드를 통한 시각적 피드백 제공
- 편집 중 상태 표시 (선택됨, 유효함, 무효함 등)

## 멤버
### 열거형
```csharp
/// <summary>
/// 하이라이트 상태를 정의하는 열거형
/// None: 기본 상태, Selected: 선택됨, Valid: 유효함, Invalid: 유효하지 않음
/// </summary>
public enum HighlightState
{
    None,       // 기본 상태 (하이라이트 없음)
    Selected,   // 선택된 상태 (파란색)
    Valid,      // 유효한 배치 위치 (녹색)
    Invalid     // 유효하지 않은 배치 위치 (빨간색)
}
```

### 필드
```csharp
/// <summary>
/// 하이라이트 효과를 적용할 대상 Material 리스트
/// Setup() 메서드에서 _HIGHLIGHTSTATE 속성을 가진 Material들만 수집
/// </summary>
private readonly List<Material> targetMaterials = new List<Material>();

/// <summary>
/// 하이라이트 상태를 확인하는 Material 속성 이름
/// 이 속성이 있는 Material만 하이라이트 효과 적용 대상으로 간주
/// </summary>
private const string StatePropertyName = "_HIGHLIGHTSTATE";

/// <summary>
/// 하이라이트 상태와 Shader 키워드를 매핑하는 사전
/// 각 상태에 해당하는 Shader 키워드를 정의
/// </summary>
private static readonly Dictionary<HighlightState, string> StateKeywords = new()
{
    { HighlightState.None, "_HIGHLIGHTSTATE_NONE" },
    { HighlightState.Selected, "_HIGHLIGHTSTATE_BLUE" },
    { HighlightState.Valid, "_HIGHLIGHTSTATE_GREEN" },
    { HighlightState.Invalid, "_HIGHLIGHTSTATE_RED" },
};
```

### 메서드
```csharp
/// <summary>
/// 하이라이트 시스템을 초기화하는 메서드.
/// 오브젝트의 모든 자식 Renderer에서 하이라이트 가능한 Material들을 찾아 수집.
/// </summary>
public void Setup()

 /// <summary>
/// 하이라이트 상태를 기본 상태(None)로 변경하는 메서드.
/// 하이라이트 효과를 해제.
/// </summary>
public void Default()

/// <summary>
/// 하이라이트 상태를 선택됨(Selected)으로 변경하는 메서드.
/// 파란색 하이라이트 효과 적용.
/// </summary>
public void Selected()

/// <summary>
/// 하이라이트 상태를 유효함(Valid)으로 변경하는 메서드.
/// 녹색 하이라이트 효과 적용.
/// </summary>
public void Valid()

/// <summary>
/// 하이라이트 상태를 유효하지 않음(Invalid)으로 변경하는 메서드.
/// 빨간색 하이라이트 효과 적용.
/// </summary>
public void Invalid()

/// <summary>
/// 하이라이트 상태를 설정하는 프라이빗 메서드.
/// 지정된 상태에 해당하는 Shader 키워드를 활성화.
/// </summary>
/// <param name="newState">설정할 새로운 하이라이트 상태</param>
private void SetState(HighlightState newState)

/// <summary>
/// Shader 키워드를 변경하는 프라이빗 메서드.
/// 기존 하이라이트 키워드들을 모두 비활성화하고 새로운 키워드만 활성화.
/// </summary>
/// <param name="keyword">활성화할 Shader 키워드</param>
private void ChangeKeyword(string keyword)
```

## 코드 스니펫
### Material 초기화
```csharp
public void Setup()
{
    // 자식 오브젝트들의 모든 Renderer 컴포넌트 가져오기
    var renderers = GetComponentsInChildren<Renderer>();

    foreach (var renderer in renderers)
    {
        // 각 Renderer의 모든 Material 순회
        foreach (var material in renderer.materials)
        {
            // Material이 존재하고 하이라이트 속성을 가지고 있는 경우만 수집
            if (material != null && material.HasProperty(StatePropertyName))
            {
                targetMaterials.Add(material);
            }
        }
    }
}
```

### 하이라이트 변경 호출 프로세스
```csharp
public void Selected()
{
    SetState(HighlightState.Selected);
}

private void SetState(HighlightState newState)
{
    // 상태에 해당하는 키워드를 찾아 활성화
    ChangeKeyword(StateKeywords[newState]);
}
```

### 키워드 변경 로직
```csharp
private void ChangeKeyword(string keyword)
{
    // 수집된 모든 대상 Material에 대해 키워드 변경 수행
    foreach (var material in targetMaterials)
    {
        // 현재 활성화된 모든 키워드 중 하이라이트 관련 키워드만 비활성화
        foreach (var enabledKeyword in material.enabledKeywords)
        {
            // "_HIGHLIGHTSTATE"로 시작하는 키워드만 대상으로 함
            if (enabledKeyword.ToString().StartsWith("_HIGHLIGHTSTATE"))
            {
                material.DisableKeyword(enabledKeyword);
            }
        }

        // 새로운 키워드 활성화
        material.EnableKeyword(keyword);
    }
}
```

## 기능 설명
### 하이라이트 상태 시스템
- **None**: 기본 상태, 하이라이트 없음 (`_HIGHLIGHTSTATE_NONE`)
- **Selected**: 선택된 오브젝트를 파란색으로 표시 (`_HIGHLIGHTSTATE_BLUE`)
- **Valid**: 유효한 배치 위치를 녹색으로 표시 (`_HIGHLIGHTSTATE_GREEN`)
- **Invalid**: 유효하지 않은 배치 위치를 빨간색으로 표시 (`_HIGHLIGHTSTATE_RED`)

### 머티리얼 관리
- `Setup()` 메서드에서 자식 Renderer들의 Material 중 `_HIGHLIGHTSTATE` 속성을 가진 Material들을 수집
- 하이라이트 효과를 지원하는 Material만 대상으로 함

### 키워드 기반 렌더링
- 기존에 활성화된 `_HIGHLIGHTSTATE`로 시작하는 키워드들을 모두 비활성화
- 새로운 상태에 해당하는 키워드만 활성화
- Material의 `EnableKeyword()`와 `DisableKeyword()`를 사용하여 동적 변경

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음.
- [`SpawnablePropBase`](/docs/projects/rfice/HousingSystem/SpawnablePropBase) 등에서 동적으로 컴포넌트 추가.
- 셰이더에서 `_HIGHLIGHTSTATE_*` 키워드 사용.
- [`IMyRoomEditorEditableObject.Focused()`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject), [`Selected()`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject) 등에서 호출.

## Shader 요구사항
- 하이라이트 효과를 사용하려면 Material의 Shader가 다음 키워드를 지원해야함
  - `_HIGHLIGHTSTATE_NONE`
  - `_HIGHLIGHTSTATE_BLUE`
  - `_HIGHLIGHTSTATE_GREEN`
  - `_HIGHLIGHTSTATE_RED`

## 사용 예시
### 하이라이트 기능 셋업 
```csharp
// 배치 오브젝트 클래스(SpawnablePropBase의서브 클래스)에서 Setup() 호출
protected override void SetupPropHighlight()
{
    _propEditingState.Setup();
}

// PropEditingState에서 Material및 렌더러 검색하여 캐싱
public void Setup()
{
    var renderers = GetComponentsInChildren<Renderer>();
    foreach (var renderer in renderers)
    {
        foreach (var material in renderer.materials)
        {
            if (material != null && material.HasProperty(StatePropertyName))
            {
                targetMaterials.Add(material);
            }
        }
    }
}
```

### 하이라이트 표시
```csharp
//오브젝트 이동시 배치 가능한 위치일때 Valid 하이라이트 처리
public bool IsPlaceableArea(Vector3 hitPosition, IPlaceableArea area)
{
    Move(hitPosition);
    transform.rotation = area.GetPlacementRotation();
    
    if (area.GetPlacementType() != PlacementType)
    {
        _propEditingState.Invalid();
        return false;
    }
    if (area.IsPlacementAreaInProp(out var parent))
    {
        SetPropParent(parent);
    }
    else
    {
        ClearPropParent();
    }

    _propEditingState.Valid();
    return true;
}

// 오브젝트 선택/포커싱 할대 Focused/Unfocused 하이라이트 처리
if (InputUtils.GetRaycastHit(out RaycastHit hits, _targetLayer, _firstPriorityLayer))
{
    if (hits.transform.TryGetComponent(out IMyRoomEditorEditableObject focusedObject)
        && InputUtils.IsPointerOnUI() == false)
    {
        if (focusedObject.Equals(_focusedObject)) continue;
        if (IsSelectedObject(focusedObject))
        {
            _focusedObject?.Unfocused();
            _focusedObject = focusedObject;
        }
        else
        {
            if (IsSelectedObject(_focusedObject) == false)
            {
                _focusedObject?.Unfocused();
            }
            _focusedObject = focusedObject;
            _focusedObject.Focused();
        }
    }
    else
    {
        //Unfocus조건
        //1. 선택된 오브젝트는 Unfocus되지 않는다.
        //2. 선택된 오브젝트가 아니며 포커싱 중인 오브젝트가 있는 경우는 Unfocus 한다.
        if (IsSelectedObject(_focusedObject))
        {
            _focusedObject = null;
        }
        else
        {
            _focusedObject?.Unfocused();
            _focusedObject = null;
        }
    }
} 
```


## 관련 클래스

- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/)
- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/)
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/)
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/)
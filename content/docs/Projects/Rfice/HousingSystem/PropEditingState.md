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

`PropEditingState`는 오브젝트 편집 상태에 따라 오브젝트의 Material 효과를 표현하는 클래스. Shader 키워드를 사용하여 오브젝트의 하이라이트 상태를 시각적으로 표현.

## 주요 역할

- **Material 관리**: 오브젝트의 Renderer 컴포넌트에서 하이라이트 가능한 Material들을 수집
- **상태 표현**: 선택, 유효, 무효 상태에 따라 다른 색상으로 하이라이트
- **Shader 키워드**: Material의 Shader 키워드를 동적으로 활성화/비활성화

## HighlightState 열거형

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

## 주요 멤버

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

### 주요 메서드
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

## 주요 기능 설명

### Material 수집
- `Setup()` 메서드에서 자식 Renderer들의 Material 중 `_HIGHLIGHTSTATE` 속성을 가진 Material들을 수집
- 하이라이트 효과를 지원하는 Material만 대상으로 함

### 상태별 하이라이트
- **None**: 기본 상태, 하이라이트 없음 (`_HIGHLIGHTSTATE_NONE`)
- **Selected**: 선택된 오브젝트를 파란색으로 표시 (`_HIGHLIGHTSTATE_BLUE`)
- **Valid**: 유효한 배치 위치를 녹색으로 표시 (`_HIGHLIGHTSTATE_GREEN`)
- **Invalid**: 유효하지 않은 배치 위치를 빨간색으로 표시 (`_HIGHLIGHTSTATE_RED`)

### Shader 키워드 관리
- 기존에 활성화된 `_HIGHLIGHTSTATE`로 시작하는 키워드들을 모두 비활성화
- 새로운 상태에 해당하는 키워드만 활성화
- Material의 `EnableKeyword()`와 `DisableKeyword()`를 사용하여 동적 변경

## Shader 요구사항

하이라이트 효과를 사용하려면 Material의 Shader가 다음 키워드를 지원해야함
- `_HIGHLIGHTSTATE_NONE`
- `_HIGHLIGHTSTATE_BLUE`
- `_HIGHLIGHTSTATE_GREEN`
- `_HIGHLIGHTSTATE_RED`

## 사용 예시

### 기본적인 사용
```csharp
var editingState = GetComponent<PropEditingState>();
editingState.Setup();  // Material 초기화

// 상태 변경
editingState.Selected();  // 파란색 하이라이트
editingState.Valid();     // 녹색 하이라이트
editingState.Invalid();   // 빨간색 하이라이트
editingState.Default();   // 하이라이트 해제
```

## 관련 클래스

- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/): 바닥/천장 배치 오브젝트
- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/): 벽 배치 오브젝트
- [`SpawnablePhotoFrameProp`](/docs/projects/rfice/housingsystem/spawnablephotoframeprop/): 사진 프레임 오브젝트
- [`SpawnableScreenProp`](/docs/projects/rfice/housingsystem/spawnablescreenprop/): 스크린 오브젝트
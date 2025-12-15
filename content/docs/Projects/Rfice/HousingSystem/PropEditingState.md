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

`PropEditingState`는 오브젝트 편집 상태에 따라 오브젝트의 Material 효과를 표현하는 클래스입니다. Shader 키워드를 사용하여 오브젝트의 하이라이트 상태를 시각적으로 표현합니다.

## 주요 역할

- **Material 관리**: 오브젝트의 Renderer 컴포넌트에서 하이라이트 가능한 Material들을 수집
- **상태 표현**: 선택, 유효, 무효 상태에 따라 다른 색상으로 하이라이트
- **Shader 키워드**: Material의 Shader 키워드를 동적으로 활성화/비활성화

## HighlightState 열거형

```csharp
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
private readonly List<Material> targetMaterials = new List<Material>();
private const string StatePropertyName = "_HIGHLIGHTSTATE";

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
public void Setup()
public void Default()
public void Selected()
public void Valid()
public void Invalid()
private void SetState(HighlightState newState)
private void ChangeKeyword(string keyword)
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System.Collections.Generic;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.Components.MyRoomEditor
{
    public class PropEditingState : MonoBehaviour
    {
        public enum HighlightState
        {
            None,
            Selected,
            Valid,
            Invalid
        }

        private readonly List<Material> targetMaterials = new List<Material>();
        private const string StatePropertyName = "_HIGHLIGHTSTATE";

        private static readonly Dictionary<HighlightState, string> StateKeywords = new()
        {
            { HighlightState.None, "_HIGHLIGHTSTATE_NONE" },
            { HighlightState.Selected, "_HIGHLIGHTSTATE_BLUE" },
            { HighlightState.Valid, "_HIGHLIGHTSTATE_GREEN" },
            { HighlightState.Invalid, "_HIGHLIGHTSTATE_RED" },
        };

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

        public void Default()
        {
            SetState(HighlightState.None);
        }

        public void Selected()
        {
            SetState(HighlightState.Selected);
        }

        public void Valid()
        {
            SetState(HighlightState.Valid);
        }

        public void Invalid()
        {
            SetState(HighlightState.Invalid);
        }

        private void SetState(HighlightState newState)
        {
            ChangeKeyword(StateKeywords[newState]);
        }

        private void ChangeKeyword(string keyword)
        {
            foreach (var material in targetMaterials)
            {
                foreach (var enabledKeyword in material.enabledKeywords)
                {
                    // "_HIGHLIGHTSTATE"로 시작하는 키워드만 해제
                    if (enabledKeyword.ToString().StartsWith("_HIGHLIGHTSTATE"))
                    {
                        material.DisableKeyword(enabledKeyword);
                    }
                }
                material.EnableKeyword(keyword);
            }
        }
    }
}
```

### Material 초기화
```csharp
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

### 키워드 변경 로직
```csharp
private void ChangeKeyword(string keyword)
{
    foreach (var material in targetMaterials)
    {
    foreach (var enabledKeyword in material.enabledKeywords)
        {
            // "_HIGHLIGHTSTATE"로 시작하는 키워드만 해제
            if (enabledKeyword.ToString().StartsWith("_HIGHLIGHTSTATE"))
            {
                material.DisableKeyword(enabledKeyword);
            }
        }
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

하이라이트 효과를 사용하려면 Material의 Shader가 다음 키워드를 지원해야 합니다:
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

## 의존성

- **UnityEngine**: Renderer, Material 클래스 사용
- **Shader 지원**: 하이라이트 키워드를 지원하는 커스텀 Shader 필요

## 관련 클래스

- **사용자**: `SpawnablePropBase`의 서브클래스들
- **호출 시점**: 오브젝트의 편집 상태 변경 시

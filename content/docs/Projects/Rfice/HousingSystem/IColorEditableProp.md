+++
title = "IColorEditableProp"
description = "색상 편집 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 420
+++

## 개요

`IColorEditableProp`는 색상 편집 가능한 오브젝트를 정의하는 인터페이스. 색상 리스트 제공 및 색상 적용 기능을 정의.

## 인터페이스 멤버

### 메서드
```csharp
/// <summary>
/// 오브젝트가 지원하는 색상 리스트 반환
/// </summary>
List<MyRoomPropColor> GetColorList();

/// <summary>
/// 지정된 인덱스의 색상을 Material로 적용
/// </summary>
void SetColor(Material mat, int colorIndex);
```

## 주요 기능 설명

- **GetColorList**: 오브젝트가 지원하는 색상 리스트 반환
- **SetColor**: 지정된 인덱스의 색상을 Material로 적용

## 상속 관계 및 구현체

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/housingsystem/imyroomeditoreditableobject/)를 확장
- 색상 편집이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/), [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/))

## 사용 예시

```csharp
if (editableObject.IsEditableColor(out IColorEditableProp colorProp))
{
    var colors = colorProp.GetColorList();
    // 첫 번째 색상 적용
    colorProp.SetColor(colors[0].material, 0);
}

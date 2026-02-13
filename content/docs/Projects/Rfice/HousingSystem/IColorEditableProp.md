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

`IColorEditableProp` 인터페이스는 MyRoom 에디터에서 색상 편집이 가능한 프로퍼티를 정의합니다. 이 인터페이스를 구현하는 클래스는 색상 목록을 제공하고 색상을 설정할 수 있습니다.

## 역할
- MyRoomEditor에서 색상 편집 기능을 제공하는 인터페이스 정의
- 색상 목록 조회 및 색상 적용 기능 표준화

## 선언
```csharp
public interface IColorEditableProp : IMyRoomEditorEditableObject
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 사용할 수 있는 색상 목록을 반환합니다.
/// </summary>
List<MyRoomPropColor> GetColorList()

/// <summary>
/// 지정된 색상 인덱스로 머티리얼의 색상을 설정합니다.
/// </summary>
/// <param name="mat">색상을 적용할 머티리얼</param>
/// <param name="colorIndex">색상 목록의 인덱스</param>
void SetColor(Material mat, int colorIndex)
```

## 기능 설명

### 색상 목록 제공
- `GetColorList()` 메서드로 편집 가능한 색상 목록을 반환
- `MyRoomPropColor` 객체 리스트 형태로 색상 정보 제공

### 색상 적용
- `SetColor()` 메서드로 지정된 머티리얼에 색상 적용
- 색상 인덱스를 통해 목록에서 특정 색상을 선택하여 적용

## 의존성/상속 관계

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject)를 상속받음.
- 색상 편집이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/), [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/))

## 사용 예시

#### 색상 편집 가능 여부 확인
```csharp
if (prop.TryGetComponent(out IMyRoomEditorEditableObject editableObject))
{
    if (editableObject.IsEditableColor(out IColorEditableProp colorProp))
    {
        var colors = colorProp.GetColorList();
        // 색상 목록을 UI에 표시
    }
}
```

#### 색상 적용
```csharp
colorProp.SetColor(renderer.material, selectedColorIndex);
```

## 관련 클래스

- [`SpawnableWallProp`](/docs/projects/rfice/housingsystem/spawnablewallprop/)
- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/)
- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
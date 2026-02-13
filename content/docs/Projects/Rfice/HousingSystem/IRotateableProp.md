+++
title = "IRotatableProp"
description = "회전 가능한 오브젝트 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 422
+++
## 개요

`IRotatableProp` 인터페이스는 MyRoomEditor에서 회전 가능한 오브젝트의 회전 기능을 정의합니다. 이 인터페이스를 구현하는 클래스는 자유 회전과 스냅 회전을 지원합니다.

## 역할

- MyRoomEditor에서 오브젝트의 회전 상태 관리
- 자유 회전 및 스냅 회전 기능 제공
- 회전 값의 설정과 조회 지원

## 선언
```csharp
public interface IRotatableProp : IMyRoomEditorEditableObject
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 현재 회전 값을 반환합니다.
/// </summary>
/// <returns>현재 회전 Quaternion</returns>
Quaternion GetRotation()

/// <summary>
/// 회전 값을 설정합니다.
/// </summary>
/// <param name="rotation">설정할 회전 Quaternion</param>
void SetRotation(Quaternion rotation)

/// <summary>
/// 스냅 값에 따라 회전을 적용합니다.
/// </summary>
/// <param name="snapStepValue">스냅 단계 값 (도 단위)</param>
void RotationBySnapValue(float snapStepValue)
```

## 기능 설명

### 회전 값 관리
- `GetRotation()`: 객체의 현재 회전 상태를 Quaternion으로 반환
- `SetRotation()`: 지정된 회전 값으로 객체 회전 설정

### 스냅 회전
- `RotationBySnapValue()`: 지정된 각도 간격으로 회전을 스냅
- 주로 사용자 인터페이스에서 정밀한 회전 조정을 위해 사용

## 의존성/상속 관계

- [`IMyRoomEditorEditableObject`](/docs/projects/rfice/HousingSystem/IMyRoomEditorEditableObject)를 상속받음.
- 이동이 가능한 오브젝트들에서 구현([`SpawnableFloorAndCeilProp`](/docs/projects/rfice/housingsystem/spawnablefloorandceilprop/))

## 사용 예시

#### 회전 값 설정
```csharp
if (editableObject.IsRotatableProp(out IRotatableProp rotatableProp))
{
    Quaternion newRotation = Quaternion.Euler(0, 45, 0);
    rotatableProp.SetRotation(newRotation);
}
```

#### 스냅 회전 적용
```csharp
rotatableProp.RotationBySnapValue(15f); // 15도 단위로 스냅 회전
```

#### 회전 값 조회
```csharp
Quaternion currentRotation = rotatableProp.GetRotation();
float yAngle = currentRotation.eulerAngles.y;
// 회전 각도를 UI에 표시
```

## 관련 클래스

- [`MyRoomEditorPropRotator`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropRotator)
- [`SpawnableFloorAndCeilProp`](/docs/projects/rfice/HousingSystem/SpawnableFloorAndCeilProp)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
+++
title = "MyRoomEditorPropRotator"
description = "오브젝트의 회전을 담당하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 408
+++
## 개요
`MyRoomEditorPropRotator`는 MyRoomEditor에서 오브젝트의 회전 편집을 담당하는 클래스입니다. [`MyRoomEditorPropEditor`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditor)를 상속받아 회전 편집 기능을 구현하며, PointerDelta 통한 실시간 회전과 기즈모 표시를 제공합니다.

## 역할

- 오브젝트의 회전 편집 기능 제공
- PointerDelta를 추적하여 실시간 회전 조작
- 회전 화살표 기즈모 표시 및 업데이트
- 스냅 회전 기능 지원
- 회전 각도에 따른 머티리얼 파라미터 업데이트(커스텀 쉐이더 효과)
- ESC 키로 회전 취소 및 원래 각도 복원

## 선언
```csharp
public class MyRoomEditorPropRotator : MyRoomEditorPropEditor
```

## 멤버
### 이벤트
```csharp
/// <summary>
/// 오브젝트 회전 완료시 발생되는 이벤트
/// </summary>
public event Action OnFinishRotate;
```

### 속성
```csharp
/// <summary>
/// 회전 방향을 표시하는 화살표 기즈모 오브젝트.
/// </summary>
[SerializeField]
private GameObject rotateArrow;

/// <summary>
/// 회전 기즈모의 재질.
/// </summary>
[SerializeField]
private Material rotateMaterial;

/// <summary>
/// 우클릭 시 회전 스냅 값 (45도 단위).
/// </summary>
[SerializeField]
private float rotateSnapStepValue = 45;

/// <summary>
/// 회전 가능한 오브젝트 인터페이스 참조.
/// </summary>
private IRotatableProp _rotatableProp;

/// <summary>
/// 회전 감지 코루틴 참조.
/// </summary>
private Coroutine _detector;

/// <summary>
/// 셰이더 속성 ID 캐싱 (_Angle).
/// </summary>
private readonly int _rotateAnglePropertyId = Shader.PropertyToID("_Angle");
```

### 메서드
```csharp
/// <summary>
/// 회전할 오브젝트 설정 메서드.
/// </summary>
/// <param name="setUpObject">설정할 편집 가능 오브젝트</param>
/// <returns>설정 성공 여부</returns>
public override bool Setup(IMyRoomEditorEditableObject setUpObject)

/// <summary>
/// 회전 모드 활성화 메서드.
/// </summary>
public override void Enable()

/// <summary>
/// 회전을 감지하는 코루틴 메서드.
/// </summary>
private IEnumerator CoDetectRotate()

/// <summary>
/// 마우스 클릭 이벤트 핸들러.
/// </summary>
public override void OnPointerDown()

/// <summary>
/// 회전 확정 메서드.
/// </summary>
private void RotateAccept()

/// <summary>
/// 회전 동작 해제 메서드.
/// </summary>
private void ReleaseRotateBehaviour()

/// <summary>
/// 회전 취소 이벤트 핸들러 (ESC 키).
/// </summary>
public override void OnCancel()
```

## 코드 스니펫

### 회전 모드 시작 프로세스
```csharp
public override bool Setup(IMyRoomEditorEditableObject setUpObject)
    {
        if (!setUpObject.IsRotatableProp(out _rotatableProp)) return false; // 회전 가능한 프로퍼티인지 확인, 아니면 false 반환
        SelectedObject = setUpObject; // 선택된 오브젝트 설정
        CachedRotation = _rotatableProp.GetRotation(); // 초기 회전 값 캐시
        return true; // 설정 성공
    }
        
public override void Enable()
{
    _detector = StartCoroutine(CoDetectRotate()); // 회전 감지 코루틴 시작
    rotateArrow.SetActive(true); // 회전 화살표 기즈모 활성화
    SetGizmo(); // 기즈모 위치 설정
}
```

### 회전 감지 및 적용 프로세스
```csharp
private IEnumerator CoDetectRotate()
{
    while (true)
    {
        var delta = InputUtils.PointerDelta().x; // 마우스 포인터의 X축 델타 값 가져오기
        Quaternion deltaRotation = Quaternion.Euler(0, -delta, 0); // X축 델타를 Y축 회전으로 변환
        Quaternion rotation = _rotatableProp.GetRotation() * deltaRotation; // 현재 회전에 델타 회전 적용
        _rotatableProp.SetRotation(rotation); // 회전 설정
        rotateMaterial.SetFloat(_rotateAnglePropertyId, -rotation.eulerAngles.y); // 셰이더에 회전각도 전달
        yield return null; // 다음 프레임까지 대기
    }
}

public override void OnPointerDown()
{
    if (InputUtils.IsPointerOnUI()) return; // UI 위에서 클릭했으면 무시
    RotateAccept(); // 회전 확정
}

private void RotateAccept()
{
    ReleaseRotateBehaviour(); // 회전 동작 해제
}

private void ReleaseRotateBehaviour()
{
    StopCoroutine(_detector); // 감지 코루틴 중지
    SelectedObject.Deselected(); // 선택 해제
    CleanUp(); // 리소스 정리
    rotateArrow.SetActive(false); // 화살표 기즈모 비활성화
    OnFinishRotate?.Invoke(); // 회전 완료 이벤트 호출
}
```


## 기능 설명
### 회전 편집 활성화
- 회전 검출 코루틴 시작
- 회전 화살표 기즈모 활성화
- 기즈모 위치 및 회전 설정

### 회전 프로세스
1. `Setup(IMyRoomEditorEditableObject setUpObject)`: 회전 가능한 오브젝트 확인 및 초기 상태 캐시
2. `Enable()`: 회전 감지 코루틴 시작 및 기즈모 활성화
3. `CoDetectRotate()`: PointerDelta를 통해 실시간 회전 적용
4. `RotateAccept()()`: 마우스 클릭 시 회전 적용

### 실시간 회전 조작
- 포인터 델타 값을 기반으로 실시간 회전 적용
- Y축 회전을 중심으로 한 쿼터니언 계산
- 회전 값에 따라 커스텀 쉐이더 머티리얼 파라미터 업데이트

### 기즈모 표시
- 회전 화살표를 오브젝트의 기즈모 위치에 표시
- 기즈모 회전 방향 설정

### 스냅 회전
- 우클릭 시 지정된 스냅 값만큼 회전
- 정밀한 각도 조정 지원

### 취소 및 복원
- 취소 시 캐시된 회전 값으로 복원
- 편집 상태 해제 및 이벤트 발생

### Material 효과
- Shader의 _Angle 속성을 사용하여 회전 각도를 시각적으로 표현
- 실시간으로 회전 값에 따라 Material 업데이트
- ![rfice_myroom_transformGizmo](/images/rfice_myroom_transformGizmo.png)

## 의존성/상속 관계
- [`MyRoomEditorPropEditor`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditor)를 상속받음.
- [`IRotatableProp`](/docs/projects/rfice/HousingSystem/IRotateableProp) 인터페이스 사용.
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/HousingSystem/MyRoomEditorInputUtils)에 의존.

## 사용 예시
#### [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/HousingSystem/MyRoomEditorPropEditingManager)에서 회전 편집 모드 전환
```csharp
private void OnChangedEditMode(PropEditMode mode)
{
    editingMode = mode;
    if (editingMode == PropEditMode.Disable)
    {
        CleanUpPropEditor();
        return;
    }
    
    propEditor?.Disable();
    propEditor = SwitchPropEditor();
    if(propEditor.Setup(_editingObject)) propEditor.Enable();
}

private MyRoomEditorPropEditor SwitchPropEditor()
{
    return editingMode switch
    {
        PropEditMode.Select => propSelector,
        PropEditMode.Move => propMover,
        PropEditMode.Rotate => propRotator,
    };
}
```

## 관련 클래스
- [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/)
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/)
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/)
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/)
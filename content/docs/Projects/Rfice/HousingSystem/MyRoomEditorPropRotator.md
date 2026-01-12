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

`MyRoomEditorPropRotator`는 [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/)를 상속받아 오브젝트의 회전을 담당하는 클래스. InputUtils를 통해 초기 마우스 상태를 캐싱하고 마우스의 이동범위만큼 오브젝트를 좌/우로 회전.

## 주요 역할

- **자유 회전**: 마우스 드래그로 실시간 자유 회전
- **스냅 회전**: 우클릭으로 단계별 회전 (45도 단위)
- **기즈모 표시**: 회전 방향을 나타내는 기즈모 표시
- **실행 취소**: ESC 키로 회전 취소 및 원래 각도 복원
- **시각적 피드백**: 회전 각도에 따른 Material 효과 적용

## 주요 멤버

### 이벤트
```csharp
/// <summary>
/// 오브젝트 회전 완료시 발생되는 이벤트
/// </summary>
public event Action OnFinishRotate;
```

### 필드
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

### 주요 메서드
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

## 주요 기능 설명

### 회전 프로세스
1. **Setup**: 회전 가능한 오브젝트 확인 및 초기 회전 값 캐시
2. **Enable**: 회전 감지 코루틴 시작 및 기즈모 활성화
3. **실시간 회전**: 마우스 드래그로 실시간 회전 적용
4. **시각적 피드백**: Material의 _Angle 속성으로 회전 각도 반영
5. **클릭으로 확정**: 마우스 클릭 시 회전 완료
6. **데이터 업데이트**: 회전 완료 후 배치 정보 업데이트

### 입력 처리
- **마우스 delta**: 마우스 이동에 따른 실시간 회전
- **우클릭**: 45도 단위 스냅 회전
- **좌클릭**: 회전 확정
- **ESC**: 회전 취소

### Material 효과
- Shader의 _Angle 속성을 사용하여 회전 각도를 시각적으로 표현
- 실시간으로 회전 값에 따라 Material 업데이트
- ![rfice_myroom_transformGizmo](/images/rfice_myroom_transformGizmo.png)


## 관련 클래스
- [`MyRoomEditorPropEditor`](/docs/projects/rfice/housingsystem/myroompropeditor/): 부모 클래스
- [`MyRoomEditorPropEditingManager`](/docs/projects/rfice/housingsystem/myroomeditorpropeditingmanager/): 사용자
- [`MyRoomEditorInputUtils`](/docs/projects/rfice/housingsystem/myroomeditorinpututils/): 입력 처리 및 포인터 델타 계산
- [`IRotatableProp`](/docs/projects/rfice/housingsystem/irotateableprop/): 회전 가능한 오브젝트 인터페이스
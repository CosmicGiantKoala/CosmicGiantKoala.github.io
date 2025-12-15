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

`MyRoomEditorPropRotator`는 `MyRoomEditorPropEditor`를 상속받아 오브젝트의 회전을 담당하는 클래스입니다. InputUtils를 통해 초기 마우스 상태를 캐싱하고 마우스의 이동범위만큼 오브젝트를 좌/우로 회전시킵니다.

## 주요 역할

- **자유 회전**: 마우스 드래그로 실시간 자유 회전
- **스냅 회전**: 우클릭으로 단계별 회전 (45도 단위)
- **기즈모 표시**: 회전 방향을 나타내는 기즈모 표시
- **실행 취소**: ESC 키로 회전 취소 및 원래 각도 복원
- **시각적 피드백**: 회전 각도에 따른 Material 효과 적용

## 주요 멤버

### 이벤트
```csharp
public event Action OnUpdatePlacementProp;
public event Action OnFinishRotate;
```

### 필드
```csharp
[SerializeField]
private GameObject rotateArrow;

[SerializeField]
private Material rotateMaterial;

[SerializeField]
private float rotateSnapStepValue = 45;

private IRotatableProp _rotatableProp;
private Coroutine _detector;
private int _targetLayer;
private readonly int _rotateAnglePropertyId = Shader.PropertyToID("_Angle");
```

### 주요 메서드
```csharp
private IEnumerator CoDetectRotate()
private void SetGizmo()
private void RotateAccept()
private void ReleaseRotateBehaviour()
```

## 코드 스니펫

### 전체 클래스 코드
```csharp
using System;
using System.Collections;
using UnityEngine;

namespace Dev.Scripts.Rsup.Scenes.MyRoomEditor
{
    public class MyRoomEditorPropRotator : MyRoomEditorPropEditor
    {
        [SerializeField]
        private GameObject rotateArrow;
        
        [SerializeField]
        private Material rotateMaterial;
        
        [SerializeField]
        private float rotateSnapStepValue = 45;
        public event Action OnUpdatePlacementProp; 
        public event Action OnFinishRotate;
        private IRotatableProp _rotatableProp;
        private Coroutine _detector;
        private int _targetLayer;
        private readonly int _rotateAnglePropertyId = Shader.PropertyToID("_Angle");

        public override void Enable()
        {
            Debug.Log("RotateStart");
            _detector = StartCoroutine(CoDetectRotate());
            rotateArrow.SetActive(true);
            SetGizmo();
        }

        public override void Disable()
        {
            StopCoroutine(_detector);
        }

        public override bool Setup(IMyRoomEditorEditableObject setUpObject)
        {
            if (!setUpObject.IsRotatableProp(out _rotatableProp)) return false;
            SelectedObject = setUpObject;
            CachedRotation = _rotatableProp.GetRotation();
            return true;
        }

        public override void CleanUp()
        {
            _rotatableProp = null;
            SelectedObject = null;
        }

        public override void OnPointerDown()
        {
            if (InputUtils.IsPointerOnUI()) return;
            RotateAccept();
        }

        public override void OnPointerUp()
        {
        }

        public override void OnCancel()
        {
            _rotatableProp.SetRotation(CachedRotation);
            ReleaseRotateBehaviour();
            Debug.Log("RotateCanceled");
        }

        public override void OnRightClick()
        {
            _rotatableProp.RotationBySnapValue(rotateSnapStepValue);
        }

        private IEnumerator CoDetectRotate()
        {
            while (true)
            {
                var delta = InputUtils.PointerDelta().x;
                Quaternion deltaRotation = Quaternion.Euler(0, -delta, 0);
                Quaternion rotation = _rotatableProp.GetRotation() *deltaRotation;
                _rotatableProp.SetRotation(rotation);
                rotateMaterial.SetFloat(_rotateAnglePropertyId, -rotation.eulerAngles.y);
                yield return null;
            }
        }

        private void SetGizmo()
        {
            var gizmoPoint = _rotatableProp.GetGizmoPositionAndRotation();
            rotateArrow.transform.position = gizmoPoint.Item1;
            rotateArrow.transform.rotation = gizmoPoint.Item2;
        }

        private void RotateAccept()
        {
            ReleaseRotateBehaviour();
            OnUpdatePlacementProp?.Invoke();
        }

        private void ReleaseRotateBehaviour()
        {
            StopCoroutine(_detector);
            SelectedObject.Deselected();
            CleanUp();
            Debug.Log("RotateReleased");
            rotateArrow.SetActive(false);
            OnFinishRotate?.Invoke();
        }
    }
}
```

### 회전 감지 코루틴
```csharp
private IEnumerator CoDetectRotate()
{
    while (true)
    {
        var delta = InputUtils.PointerDelta().x;
        Quaternion deltaRotation = Quaternion.Euler(0, -delta, 0);
        Quaternion rotation = _rotatableProp.GetRotation() *deltaRotation;
        _rotatableProp.SetRotation(rotation);
        rotateMaterial.SetFloat(_rotateAnglePropertyId, -rotation.eulerAngles.y);
        yield return null;
    }
}
```

### 기즈모 설정
```csharp
private void SetGizmo()
{
    var gizmoPoint = _rotatableProp.GetGizmoPositionAndRotation();
    rotateArrow.transform.position = gizmoPoint.Item1;
    rotateArrow.transform.rotation = gizmoPoint.Item2;
}
```

### 회전 취소
```csharp
public override void OnCancel()
{
    _rotatableProp.SetRotation(CachedRotation);
    ReleaseRotateBehaviour();
    Debug.Log("RotateCanceled");
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
- **드래그**: 마우스 이동에 따른 실시간 회전
- **우클릭**: 45도 단위 스냅 회전
- **좌클릭**: 회전 확정
- **ESC**: 회전 취소

### 기즈모 표시
- 회전 방향을 나타내는 화살표 표시
- 오브젝트의 기즈모 위치 및 회전에 따라 표시

### Material 효과
- Shader의 _Angle 속성을 사용하여 회전 각도를 시각적으로 표현
- 실시간으로 회전 값에 따라 Material 업데이트

## 의존성

- `MyRoomEditorInputUtils`: 입력 처리 및 포인터 델타 계산
- `IRotatableProp`: 회전 가능한 오브젝트 인터페이스

## 관련 클래스

- **부모 클래스**: `MyRoomEditorPropEditor`
- **사용자**: `MyRoomEditorPropEditingManager`
- **관련 인터페이스**: `IRotatableProp`

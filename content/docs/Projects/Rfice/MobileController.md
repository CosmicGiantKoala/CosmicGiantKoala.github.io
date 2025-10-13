+++
title = "모바일 컨트롤러"
# description = "Rfice 개요"
icon = "joystick"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 307
+++

1. 전체 구조 및 연관 관계
   주요 의존성 및 연관 컴포넌트
   MobileInputController는 Unity의 입력 시스템과 DI(Dependency Injection) 패턴을 활용한 모바일 터치 입력 처리 컨트롤러입니다.
   주요 연관 컴포넌트:

RficeAction: Unity Input System의 액션 맵

CameraInputDispatcher: 카메라 입력 이벤트 디스패처

MoveInputDispatcher: 이동 입력 이벤트 디스패처

UIInputDispatcher: UI 입력 이벤트 디스패처

ObjectBarHandler: 오브젝트 바 처리 핸들러

FloatingListViewCloseGestureHandler: 플로팅 리스트뷰 제스처 핸들러
2. 핵심 기능 분석
   2.1 터치 입력 처리 시스템``` c#
   private void OnTouchInputChanged(Finger activeFinger)
```

터치 상태 변화를 감지하고 터치 개수에 따라 다른 동작을 수행합니다.
터치 개수별 동작:
0개: 모든 터치 관련 동작 중지
1개: 카메라 회전 또는 UI 상호작용
2개: 핀치 줌 기능
2.2 카메라 회전 제어``` c#
private IEnumerator CoTouchCameraRotate()
{
    _cameraInputDispatcher.OnTouchCameraRotatedStart();
    while (_isRotating)
    {
        var rotateDelta = (_rotateContactedVector - _rotateMovedVector) * rotateSensitivity;
        var reverseVerticalAxis = new Vector2(rotateDelta.x, -rotateDelta.y);
        var targetAxis = Vector2.Lerp(previousReverseVerticalAxis, reverseVerticalAxis, rotateSmooth);
        _cameraInputDispatcher.OnTouchCameraRotated(targetAxis);
        yield return null;
    }
}
```

핵심 특징:
터치 시작점과 현재 위치의 델타값으로 회전량 계산
Y축 반전 처리로 직관적인 조작감 제공
Lerp를 통한 부드러운 회전 보간
2.3 핀치 줌 제어``` c#
private IEnumerator CoTouchCameraZoom()
{
var pinchInitialDistance = Vector2.Distance(_zoomVectorDictionarys[firstTouch.Key],
_zoomVectorDictionarys[lastTouch.Key]);
while (_isZooming)
{
var distance = Vector2.Distance(_zoomVectorDictionarys[firstTouch.Key],
_zoomVectorDictionarys[lastTouch.Key]);
var zoomValue = Mathf.Clamp(((distance - prevDistance) / pinchInitialDistance) * zoomSensitivity, -1f, 1f);
_cameraInputDispatcher.OnZoomEvent(zoomValue);
prevDistance = distance;
yield return null;
}
}
```

핵심 특징:
두 터치 포인트 간 거리 계산으로 줌 레벨 결정
초기 거리 대비 변화량을 정규화하여 일관된 줌 속도 제공
Dictionary를 활용한 멀티터치 ID 관리
2.4 UI 터치 감지 시스템``` c#
private bool IsPositionOnUI(Vector2 screenPoint)
{
    _pointerEventData.position = screenPoint;
    foreach (var graphicRaycaster in _graphicRaycasters)
    {
        if(!graphicRaycaster.IsDestroyed())
            graphicRaycaster.Raycast(_pointerEventData, _raycastResults);
    }
    return _raycastResults.Count > 0;
}
```

핵심 특징:
GraphicRaycaster를 활용한 UI 요소 검출
터치 위치가 UI 위에 있는지 실시간 판단
UI 터치 시 게임 로직 실행 방지
2.5 달리기 모드 전환``` c#
private IEnumerator CoCheckSwitchRun()
{
yield return new WaitForSeconds(runSwitcingDuration);
if (!_isRuning)
{
_isRuning = true;
_moveInputDispatcher.OnRunStarted();
}
}
```

핵심 특징:
일정 시간 이상 이동 입력 시 자동으로 달리기 모드 전환
타이머 기반 상태 변경으로 직관적인 UX 제공
3. 상태 관리 시스템
주요 상태 변수:``` c#
private bool _isMoving;    // 이동 중 여부
private bool _isRuning;    // 달리기 중 여부
private bool _isRotating;  // 카메라 회전 중 여부
private bool _isZooming;   // 줌 중 여부
```

상태 충돌 방지 로직:
이동 중일 때는 카메라 회전 중지
줌 시작 시 카메라 회전 자동 중지
UI 터치 시 게임 입력 차단
4. 이벤트 디스패처 패턴
   MobileInputController는 직접 기능을 수행하지 않고, 각각의 전용 디스패처를 통해 이벤트를 전달합니다:

CameraInputDispatcher: 카메라 관련 입력 이벤트

MoveInputDispatcher: 이동 관련 입력 이벤트

UIInputDispatcher: UI 관련 입력 이벤트
이러한 구조로 단일 책임 원칙을 준수하고 느슨한 결합을 구현했습니다.
5. 핵심 설계 패턴
   5.1 DI(Dependency Injection) 패턴``` c#
   [Inject] private CameraInputDispatcher _cameraInputDispatcher;
   [Inject] private MoveInputDispatcher _moveInputDispatcher;
   [Inject] private UIInputDispatcher _uiInputDispatcher;
```
Zenject을 활용한 의존성 주입으로 모듈 간 결합도를 낮췄습니다.
### 5.2 코루틴 기반 비동기 처리
각 입력 타입별로 독립적인 코루틴을 운영하여 동시성을 보장합니다.
### 5.3 상태 기반 입력 처리
터치 개수와 상태에 따른 분기 처리로 복잡한 멀티터치 시나리오를 체계적으로 관리합니다.
이 구조는 확장성이 뛰어나며, 새로운 입력 타입 추가나 기존 기능 수정이 용이한 **모듈화된 아키텍처**를 구현했습니다.
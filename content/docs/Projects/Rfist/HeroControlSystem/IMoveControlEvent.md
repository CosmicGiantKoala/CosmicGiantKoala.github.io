+++
title = "IMoveControlEvent"
description = "이동 제어 이벤트 인터페이스"
icon = "code"
date = "2025-03-06T23:41:00+09:00"
lastmod = "2025-03-06T23:41:00+09:00"
draft = false
toc = true
weight = 280
+++

## 개요

`IMoveControlEvent` 인터페이스는 RFist 게임의 이동 입력 이벤트를 정의합니다.
이동 입력과 실제 이동 이벤트를 구분하여 처리하며, 포커스 모드와 제어 가능 여부를 함께 전달합니다.

## 역할
- 이동 입력 이벤트 계약 정의
- 실제 이동 발생 이벤트 계약 정의
- 이동 방향, 포커스 모드, 제어 가능 여부 전달

## 선언
```csharp
public interface IMoveControlEvent
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 이동 입력 이벤트
/// 입력 디바이스로부터 이동 방향과 포커스 모드, 제어 가능 여부를 전달받습니다.
/// </summary>
/// <param name="direction">이동 방향 (수평/수직)</param>
/// <param name="isFocusMode">포커스 모드 여부</param>
/// <param name="controllable">제어 가능 여부</param>
public void OnMoveControlEvent(Vector2 direction, bool isFocusMode, bool controllable);

/// <summary>
/// 실제 이동 이벤트
/// 실제 이동이 발생했을 때 호출됩니다.
/// </summary>
/// <param name="direction">이동 방향 (수평/수직)</param>
/// <param name="isFocusMode">포커스 모드 여부</param>
public void OnMoveEvent(Vector2 direction, bool isFocusMode);
```

## 기능 설명
### 이벤트 구분
- `IMoveControlEvent`는 두 가지 이벤트를 구분 제공

| 메서드 | 호출 시점 | 용도 |
|--------|----------|------|
| **OnMoveControlEvent** | 입력 디바이스에서 이동 입력이 감지될 때 | 입력 처리, 상태 체크 |
| **OnMoveEvent** | 실제 이동이 실행될 때 | 이동 애니메이션, 이펙트 |

### 이벤트 파라미터
**direction (Vector2)**:
- `x`: 수평 이동 (-1: 좌, 1: 우, 0: 정지)
- `y`: 수직 이동 (-1: 하, 1: 상, 0: 정지)

**controllable (bool) - OnMoveControlEvent 전용**:
- `true`: 이동 제어 가능
- `false`: 이동 제어 불가 (스턴, 컷씬 등)

## 의존성/상속 관계
- 구현 클래스
  - `BaseHeroAbility`
  - `HeroAnimationController`
- `HeroController` 클래스에서 이벤트 등록 및 관리

## 사용 예시
#### [`HeroController`](/docs/projects/rfist/herocontrolsystem/herocontroller)에서 `OnMoveControlEvent` 및 `OnMoveEvent` 이벤트 발신
```csharp
public void Move(float horizontal, float vertical, float deltaTime)
{
    if (_heroStatus.IsNull()) return;
    _moveDirection = new Vector2(horizontal, vertical);

    // 이동 제어 이벤트 통지
    NotifyMoveControlEvents(moveEvent => moveEvent?.OnMoveControlEvent(_moveDirection, _isFocusMode, _controllerState.CanControllable));
    if (_controllerState.CanMove == false) return;

    if (!_isFocusMode)
    {
        // 일반 이동 모드
        if (_lastMoveDirection != _moveDirection)
        {
            // 방향이 변경된 경우
            NotifyMoveControlEvents(moveEvent => moveEvent?.OnMoveEvent(_moveDirection, false));
            heroMoveController.Move(horizontal, vertical, deltaTime, _moveDirection);
            _lastMoveDirection = _moveDirection;
        }
        else
        {
            // 동일한 방향 유지
            heroMoveController.Move(horizontal, vertical, deltaTime, Vector2.zero);
        }
    }
    else
    {
        // 포커스 모드 이동 (타겟을 바라볼며 이동)
        if (_focusTarget != null)
        {
            heroMoveController.FocusMove(horizontal, vertical, deltaTime, _focusTarget.transform);
        }
        NotifyMoveControlEvents(moveEvent => moveEvent?.OnMoveEvent(_moveDirection, true));
    }
}
```

## 관련 클래스
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- `BaseHeroAbility`
- `HeroAnimationController`
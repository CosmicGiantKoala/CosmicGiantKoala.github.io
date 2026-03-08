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

`IMoveControlEvent` 인터페이스는 RFist 게임의 이동 제어 이벤트를 정의합니다.
이동 입력과 실제 이동 이벤트를 구분하여 처리하며, 포커스 모드와 제어 가능 여부를 함께 전달합니다.

## 역할

- 이동 입력 이벤트 계약 정의
- 실제 이동 발생 이벤트 계약 정의
- 이동 방향, 포커스 모드, 제어 가능 여부 전달

## 선언

```csharp
/// <summary>
/// 이동 제어 이벤트 인터페이스
/// 이동 입력과 실제 이동 이벤트를 정의합니다.
/// </summary>
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

`IMoveControlEvent`는 두 가지 이벤트를 구분하여 제공합니다:

| 메서드 | 호출 시점 | 용도 |
|--------|----------|------|
| **OnMoveControlEvent** | 입력 디바이스에서 이동 입력이 감지될 때 | 입력 처리, 상태 체크 |
| **OnMoveEvent** | 실제 이동이 실행될 때 | 이동 애니메이션, 이펙트 |

### 이벤트 파라미터

**direction (Vector2)**:
- `x`: 수평 이동 (-1: 좌, 1: 우, 0: 정지)
- `y`: 수직 이동 (-1: 하, 1: 상, 0: 정지)

**isFocusMode (bool)**:
- `true`: 포커스 모드 (타겟 추적 모드)
- `false`: 일반 모드

**controllable (bool) - OnMoveControlEvent 전용**:
- `true`: 이동 제어 가능
- `false`: 이동 제어 불가 (스턴, 컷씬 등)

## 의존성/상속 관계

### 구현 클래스
- `HeroController`: 이동 입력 및 이동 이벤트 처리
- `NetworkHeroController`: 네트워크 환경에서 이동 이벤트 동기화

### 사용 위치
- 이동 컨트롤러에서 이벤트 수신
- 이동 관련 상태 모니터링

## 사용 예시

### HeroController에서 IMoveControlEvent 구현

```csharp
/// <summary>
/// IMoveControlEvent를 구현하는 HeroController 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController, IMoveControlEvent
{
    /// <summary>
    /// 이동 입력 이벤트 처리
    /// </summary>
    public void OnMoveControlEvent(Vector2 direction, bool isFocusMode, bool controllable)
    {
        // 제어 불가 상태면 리턴
        if (controllable == false) return;
        
        // 이동 방향 저장
        _moveDirection = direction;
        _isFocusMode = isFocusMode;
        
        // 이동 가능 여부 체크
        if (_controllerState.CanMove)
        {
            // 실제 이동 실행
            Move(direction.x, direction.y, Time.deltaTime);
        }
    }

    /// <summary>
    /// 실제 이동 이벤트 처리
    /// </summary>
    public void OnMoveEvent(Vector2 direction, bool isFocusMode)
    {
        // 이동 애니메이션 재생
        _heroAnimationController.PlayMoveAnimation(direction.magnitude);
        
        // 이동 이펙트 재생
        if (direction.magnitude > 0.1f)
        {
            _heroEffectController.PlayMoveEffect();
        }
        
        // 포커스 모드일 때 타겟 추적
        if (isFocusMode && _targetTransform != null)
        {
            LookAt(_targetTransform.position);
        }
    }
}
```

### NetworkHeroController에서 이벤트 동기화

```csharp
/// <summary>
/// NetworkHeroController에서 IMoveControlEvent 사용 예시
/// </summary>
public class NetworkHeroController : NetworkBehaviourCallback, IMoveControlEvent
{
    public void OnMoveControlEvent(Vector2 direction, bool isFocusMode, bool controllable)
    {
        // 로컬 플레이어만 입력 처리
        if (HasStateAuthority == false) return;
        
        // 입력 데이터 생성
        var inputData = new HeroInputData
        {
            Horizontal = direction.x,
            Vertical = direction.y
        };
        
        // 네트워크 입력 설정
        SetInput(inputData);
    }

    public void OnMoveEvent(Vector2 direction, bool isFocusMode)
    {
        // 모든 클라이언트에서 이동 이벤트 처리
        _heroController.OnMoveEvent(direction, isFocusMode);
    }
}
```

### 이벤트 등록 및 해제

```csharp
/// <summary>
/// IMoveControlEvent 등록/해제 예시
/// </summary>
public class MoveEventHandler : MonoBehaviour
{
    [SerializeField] private HeroController _heroController;
    private IMoveControlEvent _moveControlEvent;
    
    private void Awake()
    {
        _moveControlEvent = _heroController;
    }
    
    /// <summary>
    /// 이동 입력 이벤트 발생
    /// </summary>
    public void TriggerMoveControlEvent(Vector2 direction, bool isFocusMode, bool controllable)
    {
        _moveControlEvent?.OnMoveControlEvent(direction, isFocusMode, controllable);
    }
    
    /// <summary>
    /// 실제 이동 이벤트 발생
    /// </summary>
    public void TriggerMoveEvent(Vector2 direction, bool isFocusMode)
    {
        _moveControlEvent?.OnMoveEvent(direction, isFocusMode);
    }
}
```

## 관련 클래스

- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)

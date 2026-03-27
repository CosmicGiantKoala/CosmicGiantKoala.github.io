+++
title = "IControllerState"
description = "영웅 컨트롤러의 상태를 정의하는 인터페이스"
icon = "code"
date = "2025-03-06T21:05:00+09:00"
lastmod = "2025-03-06T21:05:00+09:00"
draft = false
toc = true
weight = 205
+++

## 개요
`IControllerState` 인터페이스는 RFist 게임의 영웅 컨트롤러 상태를 정의합니다.
이동, 대시, 공격, 가드 등의 행동 가능 여부를 제공하며,
[`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler) 클래스가 이 인터페이스를 구현합니다.

## 역할
- 영웅 캐릭터의 행동 가능 상태 계약 정의
- 이동/대시/공격/가드/제어 가능 여부 제공
- 상태 기반 행동 제어의 표준 인터페이스

## 선언
```csharp
public interface IControllerState
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 컨트롤러 상태 초기 설정
/// </summary>
/// <param name="ability">영웅 능력치 컴포넌트</param>
public void Setup(BaseHeroAbility ability);
```

### 속성
```csharp
/// <summary>
/// 이동 가능 여부
/// </summary>
public bool CanMove { get;}

/// <summary>
/// 대시 가능 여부
/// </summary>
public bool CanDash { get;}

/// <summary>
/// 공격 가능 여부
/// </summary>
public bool CanAttack { get;}

/// <summary>
/// 가드 가능 여부
/// </summary>
public bool CanGuard { get; }

/// <summary>
/// 전반적인 제어 가능 여부
/// </summary>
public bool CanControllable { get; }
```

## 기능 설명
### 상태 속성
- `IControllerState`는 5가지 행동 가능 상태 정의

| 속성 | 설명 | 일반적인 제약 조건 |
|------|------|-------------------|
| **CanMove** | 이동 가능 여부 | 피격 중, 스킬 사용 중, 다운, 컷씬, 가드 중 불가 |
| **CanDash** | 대시 가능 여부 | 피격 중, 컷씬, 대시 쿨다운 중 불가 |
| **CanAttack** | 공격 가능 여부 | 피격 중, 컷씬 중 불가 |
| **CanGuard** | 가드 가능 여부 | 스킬 사용 중, 피격 중, 컷씬, 가드 중 불가 |
| **CanControllable** | 전반적 제어 가능 여부 | 피격 중, 컷씬 중 불가 |

### 상태 변화
- 상태는 다음과 같은 상황에서 변경
- **스킬 사용**: 스킬 타입에 따라 CanMove, CanGuard 등이 제한됨
- **피격**: CanMove, CanAttack, CanDash 등이 일시적으로 불가능해짐
- **자세 변경**: 다운/스턴 시 대부분의 행동 불가
- **컷씬**: 모든 행동 제한

## 의존성/상속 관계
- 구현 클래스
  - [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)에서 컨트롤러 상태 구현
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)에서 컨트롤러 상태 확인
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)에서 이동 가능 여부 확인
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)를 통해 구현체에서 `HeroBaseStat` 참조 획득

## 사용 예시
#### [`HeroController`](/docs/projects/rfist/herocontrolsystem/herocontroller)에서 컨트롤러 상태를 확인하여 입력 동작 처리
```csharp
private IControllerState _controllerState;

// 1. 이동동작
/// <summary>
/// 이동 처리
/// </summary>
/// <param name="horizontal">수평 입력값</param>
/// <param name="vertical">수직 입력값</param>
/// <param name="deltaTime">델타 타임</param>
public void Move(float horizontal, float vertical, float deltaTime)
{
    if (_heroStatus.IsNull()) return;
    _moveDirection = new Vector2(horizontal, vertical);

    // 이동 제어 이벤트 통지
    NotifyMoveControlEvents(moveEvent => moveEvent?.OnMoveControlEvent(_moveDirection, _isFocusMode, _controllerState.CanControllable));
    if (_controllerState.CanMove == false) return;
    
    ...
}

// 2. 대시처리
/// <summary>
/// 대시 (방향 벡터 기준)
/// </summary>
/// <param name="vertical">수직 입력값</param>
/// <param name="horizontal">수평 입력값</param>
public void Dash(float vertical, float horizontal)
{
    if (_controllerState.CanDash == false) return;
    var direction = new Vector2(horizontal, vertical);
    _baseHeroAbility?.Dash(direction);
}

// 3. 공격/공격 홀드 처리
/// <summary>
/// 공격 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void Attack(NetworkHeroController.HeroInputSyncData syncData)
{
    if (_controllerState.CanAttack == false) return;
    _baseHeroAbility?.Attack(syncData);
}

/// <summary>
/// 공격 키 홀드
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void AttackHold(NetworkHeroController.HeroInputSyncData syncData)
{
    if (_controllerState.CanAttack == false) return;
    _baseHeroAbility?.AttackHold(syncData);
}

// 4. 가드 처리
/// <summary>
/// 가드 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void Guard(NetworkHeroController.HeroInputSyncData syncData)
{
    if (_controllerState.CanGuard == false) return;
    _baseHeroAbility?.Guard(syncData);
}
```

#### [`HeroRigidbodyController`](/docs/projects/rfist/herocontrolsystem/herorigidbodycontroller)에서 물리 업데이트시 상태 확인
```csharp
Protected IControllerState ControllerState;

/// <summary>
/// 물리 업데이트 - 중력 처리 및 회전 보간
/// </summary>
private void FixedUpdate()
{
    // 리모트 또는 비활성화 상태면 처리하지 않음
    if (_isRemote || _controllerActive == false) return;

    // 착지 상태 체크
    _isGrounded = Physics.CheckSphere(rigidBody.position, 0.25f, _groundLayer);
    
    // 이동 불가 또는 입력 없으면 수평 속도 0으로
    if (ControllerState.CanMove == false || 
        _direction == Vector2.zero)
    {
        rigidBody.linearVelocity = new Vector3(0, Physics.gravity.y, 0);
    }
    else
    {
        // 공중에 있고 점프 중이 아니면 중력 적용
        if (_isGrounded == false && _isJumping == false)
        {
            rigidBody.linearVelocity = new Vector3(
                rigidBody.linearVelocity.x, Physics.gravity.y, rigidBody.linearVelocity.z);
        }
    }

    // 회전 처리
    if (_targetTransform != null)
    {
        OnLookAt(_targetTransform);
    }
    else
    {
        LookAt(_targetDirection);
    }
}
```


## 관련 클래스

- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)

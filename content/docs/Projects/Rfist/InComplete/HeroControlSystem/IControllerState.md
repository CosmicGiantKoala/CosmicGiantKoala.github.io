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
/// <summary>
/// 영웅 컨트롤러의 상태를 정의하는 인터페이스
/// 이동, 대시, 공격, 가드 등의 행동 가능 여부를 제공합니다.
/// </summary>
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

`IControllerState`는 5가지 행동 가능 상태를 정의합니다:

| 속성 | 설명 | 일반적인 제약 조건 |
|------|------|-------------------|
| **CanMove** | 이동 가능 여부 | 피격 중, 스킬 사용 중, 다운, 컷씬, 가드 중 불가 |
| **CanDash** | 대시 가능 여부 | 피격 중, 컷씬, 대시 쿨다운 중 불가 |
| **CanAttack** | 공격 가능 여부 | 피격 중, 컷씬 중 불가 |
| **CanGuard** | 가드 가능 여부 | 스킬 사용 중, 피격 중, 컷씬, 가드 중 불가 |
| **CanControllable** | 전반적 제어 가능 여부 | 피격 중, 컷씬 중 불가 |

### 상태 변화

상태는 다음과 같은 상황에서 변경될 수 있습니다:

- **스킬 사용**: 스킬 타입에 따라 CanMove, CanGuard 등이 제한됨
- **피격**: CanMove, CanAttack, CanDash 등이 일시적으로 불가능해짐
- **자세 변경**: 다운/스턴 시 대부분의 행동 불가
- **컷씬**: 모든 행동 제한

## 의존성/상속 관계

### 구현 클래스
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler): IControllerState의 주요 구현체

### 사용 위치
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController): 이동/전투 액션 전 상태 체크
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController): 이동 가능 여부 확인
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility): 스킬 실행 가능 여부 확인

### 의존 클래스
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) - 초기 설정 시 사용

## 사용 예시

### HeroControllerStateHandler에서 IControllerState 구현

```csharp
/// <summary>
/// IControllerState를 구현하는 HeroControllerStateHandler 클래스 예시
/// </summary>
public class HeroControllerStateHandler : MonoBehaviour, IControllerState
{
    /// <summary>
    /// 이동 가능 여부
    /// </summary>
    public bool CanMove { get; private set; }
    
    /// <summary>
    /// 대시 가능 여부
    /// </summary>
    public bool CanDash { get; private set; }
    
    /// <summary>
    /// 공격 가능 여부
    /// </summary>
    public bool CanAttack { get; private set; }
    
    /// <summary>
    /// 가드 가능 여부
    /// </summary>
    public bool CanGuard { get; private set; }
    
    /// <summary>
    /// 전반적인 제어 가능 여부
    /// </summary>
    public bool CanControllable { get; private set;}

    /// <summary>
    /// 영웅 능력치 설정
    /// </summary>
    public void Setup(BaseHeroAbility ability)
    {
        _baseStat = ability.GetHeroStat();
    }

    /// <summary>
    /// 상태 업데이트 - 모든 상태 플래그를 기반으로 속성 갱신
    /// </summary>
    private void UpdateState()
    {
        CanMove = _hitRecovering == false
                  && _usingSkill == false
                  && _standing
                  && _playingCutScene == false
                  && _usingGuard == false;
        
        CanDash = _hitRecovering == false
                    && _playingCutScene == false
                    && CheckDashCount()
                    && _dashCooldown == false;
        
        CanAttack = _hitRecovering == false &&
                    _playingCutScene == false;
        
        CanGuard = _usingSkill == false
                      && _hitRecovering == false
                      && _playingCutScene == false
                      && _usingGuard == false;
        
        CanControllable = _hitRecovering == false 
                          && _playingCutScene == false;
    }
}
```

### HeroController에서 IControllerState 사용

```csharp
/// <summary>
/// HeroController에서 IControllerState를 사용하여 상태를 체크하는 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    private IControllerState _controllerState;
    
    /// <summary>
    /// 컨트롤러 상태 핸들러 설정
    /// </summary>
    public void SetupControllerStateHandler(IControllerState controllerState)
    {
        _controllerState = controllerState;
    }
    
    /// <summary>
    /// 이동 처리 - 상태 체크 후 실행
    /// </summary>
    public void Move(float horizontal, float vertical, float deltaTime)
    {
        // IControllerState.CanMove로 이동 가능 여부 확인
        if (_controllerState.CanMove == false) return;
        
        // 이동 처리
        heroMoveController.Move(horizontal, vertical, deltaTime, _moveDirection);
    }
    
    /// <summary>
    /// 공격 처리 - 상태 체크 후 실행
    /// </summary>
    public void Attack(HeroInputSyncData syncData)
    {
        // IControllerState.CanAttack으로 공격 가능 여부 확인
        if (_controllerState.CanAttack == false) return;
        
        _baseHeroAbility?.Attack(syncData);
    }
    
    /// <summary>
    /// 대시 처리 - 상태 체크 후 실행
    /// </summary>
    public void Dash(float vertical, float horizontal)
    {
        // IControllerState.CanDash로 대시 가능 여부 확인
        if (_controllerState.CanDash == false) return;
        
        var direction = new Vector2(horizontal, vertical);
        _baseHeroAbility?.Dash(direction);
    }
    
    /// <summary>
    /// 가드 처리 - 상태 체크 후 실행
    /// </summary>
    public void Guard(HeroInputSyncData syncData)
    {
        // IControllerState.CanGuard로 가드 가능 여부 확인
        if (_controllerState.CanGuard == false) return;
        
        _baseHeroAbility?.Guard(syncData);
    }
}
```

### BaseHeroMoveController에서 IControllerState 사용

```csharp
/// <summary>
/// BaseHeroMoveController에서 IControllerState를 사용하는 예시
/// </summary>
public abstract class BaseHeroMoveController : MonoBehaviour
{
    protected IControllerState ControllerState;
    
    /// <summary>
    /// 이동 컨트롤러 초기 설정
    /// </summary>
    public void Setup(IControllerState controllerState, IHeroObjectInfo heroObjectInfo, HeroBaseStat heroBaseStat)
    {
        ControllerState = controllerState;
        // ... 기타 초기화
    }
    
    /// <summary>
    /// FixedUpdate에서 이동 가능 여부 확인
    /// </summary>
    private void FixedUpdate()
    {
        // IControllerState.CanMove로 이동 가능 여부 확인
        if (ControllerState.CanMove == false || _direction == Vector2.zero)
        {
            rigidBody.linearVelocity = new Vector3(0, Physics.gravity.y, 0);
        }
        else
        {
            // 이동 처리
        }
    }
}
```

## 관련 클래스

- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)

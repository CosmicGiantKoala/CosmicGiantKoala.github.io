+++
title = "HeroControllerStateHandler"
description = "영웅 컨트롤러의 상태를 관리하는 핸들러 클래스"
icon = "code"
date = "2025-03-06T21:01:00+09:00"
lastmod = "2025-03-06T21:01:00+09:00"
draft = false
toc = true
weight = 240
+++

## 개요

`HeroControllerStateHandler` 클래스는 RFist 게임의 영웅 컨트롤러 상태를 관리하는 핸들러입니다.
스킬 사용, 피격, 자세 변경(일어나기/다운/스턴), 컷씬 등의 이벤트를 수신하여
[`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)의 행동 가능 상태(CanMove, CanAttack 등)를 동적으로 업데이트합니다.

## 역할

- 스킬 시작/종료에 따른 상태 관리 (이동/공격/가드 가능 여부)
- 피격 시 회복 시간 관리 및 상태 제한
- 대시 횟수 및 쿨다운 관리
- 자세 변경(일어나기/다운/스턴)에 따른 상태 전환
- 컷씬 재생 중 컨트롤 제한

## 선언

```csharp
/// <summary>
/// 영웅 컨트롤러의 상태를 관리하는 핸들러 클래스
/// 스킬, 피격, 자세 변경, 컷씬 등의 이벤트를 수신하여 컨트롤러 상태를 업데이트합니다.
/// </summary>
public class HeroControllerStateHandler : MonoBehaviour, ISkillEvent, IHitEvent, IControllerState, IStanceEvent, ICutSceneEvent
```

## 멤버

### Serialized Fields

```csharp
/// <summary>
/// 영웅 컨트롤러 참조
/// </summary>
[SerializeField]
private HeroController heroController;

/// <summary>
/// 다운 상태 회복 시간
/// </summary>
[SerializeField]
private float takeDownRecovery = 1.5f;

/// <summary>
/// 공격 종료 후 지연 시간
/// </summary>
[SerializeField]
private float attackFinishedDelay = 0.1f;

/// <summary>
/// 스턴 회복 시간
/// </summary>
[SerializeField]
private float stunRecovery = 2f;
```

### Private Fields

```csharp
/// <summary>
/// 스킬 이벤트 인터페이스 (this 캐스팅)
/// </summary>
private ISkillEvent SkillEvent => this;

/// <summary>
/// 피격 이벤트 인터페이스 (this 캐스팅)
/// </summary>
private IHitEvent HitEvent => this;

/// <summary>
/// 자세 변경 이벤트 인터페이스 (this 캐스팅)
/// </summary>
private IStanceEvent StanceEvent => this;

/// <summary>
/// 컷씬 이벤트 인터페이스 (this 캐스팅)
/// </summary>
private ICutSceneEvent CutSceneEvent => this;

/// <summary>
/// 피격 회복 코루틴 참조
/// </summary>
private Coroutine _hitRecoveryCoroutine;

/// <summary>
/// 대시 쿨다운 코루틴 참조
/// </summary>
private Coroutine _dashCooldownCoroutine;

/// <summary>
/// 영웅 기본 능력치
/// </summary>
private HeroBaseStat _baseStat;

/// <summary>
/// 스킬 사용 중 여부
/// </summary>
private bool _usingSkill;

/// <summary>
/// 대시 사용 중 여부
/// </summary>
private bool _usingDash;

/// <summary>
/// 대시 쿨다운 중 여부
/// </summary>
private bool _dashCooldown;

/// <summary>
/// 피격 회복 중 여부
/// </summary>
private bool _hitRecovering;

/// <summary>
/// 서있는 상태 여부
/// </summary>
private bool _standing;

/// <summary>
/// 가드 사용 중 여부
/// </summary>
private bool _usingGuard;

/// <summary>
/// 컷씬 재생 중 여부
/// </summary>
private bool _playingCutScene;

/// <summary>
/// 현재 대시 횟수
/// </summary>
private int _dashCount;
```

### Properties - IControllerState

```csharp
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
```

### Unity Lifecycle

```csharp
/// <summary>
/// 초기화 - HeroController에 상태 핸들러 등록 및 이벤트 구독
/// </summary>
private void Awake()

/// <summary>
/// 파괴 시 이벤트 구독 해제
/// </summary>
private void OnDestroy()
```

### Public Methods - Setup

```csharp
/// <summary>
/// 영웅 능력치 설정
/// </summary>
/// <param name="ability">영웅 능력치 컴포넌트</param>
public void Setup(BaseHeroAbility ability)

/// <summary>
/// 상태 초기화
/// </summary>
public void ResetState()
```

### Private Methods - State Management

```csharp
/// <summary>
/// 상태 업데이트 - 모든 상태 플래그를 기반으로 IControllerState 속성 갱신
/// </summary>
private void UpdateState()

/// <summary>
/// 대시 횟수 체크
/// </summary>
/// <returns>대시 가능 여부</returns>
private bool CheckDashCount()
```

### ISkillEvent Implementation

```csharp
/// <summary>
/// 스킬 시작 시 호출
/// </summary>
/// <param name="skillStartResult">스킬 시작 결과</param>
public void OnSkill(BaseHeroSkill.SkillStartResult skillStartResult)

/// <summary>
/// 스킬 종료 시 호출
/// </summary>
/// <param name="skillFinishResult">스킬 종료 결과</param>
public void OnSkillFinished(BaseHeroSkill.SkillFinishResult skillFinishResult)

/// <summary>
/// 스킬 시작 처리
/// </summary>
private void OnSkillStart()

/// <summary>
/// 스킬 완료 처리
/// </summary>
private void OnSkillComplete()

/// <summary>
/// 대시 시작 처리
/// </summary>
/// <param name="duration">대시 지속 시간</param>
private void OnDash(float duration)

/// <summary>
/// 가드 시작 처리
/// </summary>
private void OnGuard()

/// <summary>
/// 가드 완료 처리
/// </summary>
private void OnGuardComplete()

/// <summary>
/// 대시 완료 처리
/// </summary>
private void OnDashCompleted()

/// <summary>
/// 일어나기 완료 처리
/// </summary>
private void OnStandUpComplete()
```

### IHitEvent Implementation

```csharp
/// <summary>
/// 피격 수신 시 호출
/// </summary>
/// <param name="hitInfo">피격 정보</param>
public void OnHitReceive(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 피격 회복 대기 코루틴
/// </summary>
/// <param name="hitRecoveryTime">회복 시간</param>
private IEnumerator CoWaitHitRecovery(float hitRecoveryTime)

/// <summary>
/// 대시 쿨다운 대기 코루틴
/// </summary>
/// <param name="dashCooldownTime">쿨다운 시간</param>
private IEnumerator CoWaitDashCooldown(float dashCooldownTime)
```

### ICutSceneEvent Implementation

```csharp
/// <summary>
/// 특수 이동 시퀀스(컷씬) 시작 시 호출
/// </summary>
public void OnSpecialMoveSequenceStart()

/// <summary>
/// 특수 이동 시퀀스(컷씬) 종료 시 호출
/// </summary>
public void OnSpecialMoveSequenceEnd()
```

### IStanceEvent Implementation

```csharp
/// <summary>
/// 다운 상태로 전환
/// </summary>
public void TakeDown()

/// <summary>
/// 일어나기 처리
/// </summary>
public void WakeUp()

/// <summary>
/// 스턴 상태로 전환
/// </summary>
public void Stun()
```

## 코드 스니펫

### 상태 업데이트 로직

```csharp
/// <summary>
/// 상태 업데이트 - 모든 상태 플래그를 기반으로 IControllerState 속성 갱신
/// </summary>
private void UpdateState()
{
    // 이동 가능: 피격 회복 중 아님, 스킬 사용 중 아님, 서있음, 컷씬 아님, 가드 중 아님
    CanMove = _hitRecovering == false
              && _usingSkill == false
              && _standing
              && _playingCutScene == false
              && _usingGuard == false;
    
    // 대시 가능: 피격 회복 중 아님, 컷씬 아님, 대시 횟수 체크, 쿨다운 아님
    CanDash = _hitRecovering == false
                && _playingCutScene == false
                && CheckDashCount()
                && _dashCooldown == false;
    
    // 공격 가능: 피격 회복 중 아님, 컷씬 아님
    CanAttack = _hitRecovering == false &&
                _playingCutScene == false;
    
    // 가드 가능: 스킬 사용 중 아님, 피격 회복 중 아님, 컷씬 아님, 가드 중 아님
    CanGuard = _usingSkill == false
                  && _hitRecovering == false
                  && _playingCutScene == false
                  && _usingGuard == false;
    
    // 전반적 제어 가능: 피격 회복 중 아님, 컷씬 아님
    CanControllable = _hitRecovering == false 
                      && _playingCutScene == false;
}
```

### 스킬 타입별 상태 처리

```csharp
/// <summary>
/// 스킬 시작 시 호출
/// </summary>
public void OnSkill(BaseHeroSkill.SkillStartResult skillStartResult)
{
    switch (skillStartResult.SkillType)
    {
        case BaseHeroSkill.SkillType.Attack:
        case BaseHeroSkill.SkillType.AttackHold:
        case BaseHeroSkill.SkillType.Utility:
        case BaseHeroSkill.SkillType.StanceChange:
            OnSkillStart();
            break;
        case BaseHeroSkill.SkillType.Dash:
        case BaseHeroSkill.SkillType.Roll:
            OnDash(skillStartResult.Duration);
            break;
        case BaseHeroSkill.SkillType.Guard:
            OnGuard();
            break;
    }
}
```

### 대시 쿨다운 관리

```csharp
/// <summary>
/// 대시 시작 처리
/// </summary>
private void OnDash(float duration)
{
    _usingSkill = true;
    _usingDash = true;
    _dashCount++;
    
    // 최대 대시 횟수 도달 시 쿨다운 시작
    if (_dashCount >= _baseStat.maxDashCount)
    {
        _dashCooldown = true;
        _dashCooldownCoroutine = StartCoroutine(CoWaitDashCooldown(_baseStat.dashCoolTime));
    }
    
    UpdateState();
}

/// <summary>
/// 대시 쿨다운 대기 코루틴
/// </summary>
private IEnumerator CoWaitDashCooldown(float dashCooldownTime)
{
    yield return new WaitForSeconds(dashCooldownTime);
    _dashCount = 0;
    _dashCooldown = false;
    _dashCooldownCoroutine = null;
    
    UpdateState();
}
```

### 피격 회복 처리

```csharp
/// <summary>
/// 피격 수신 시 호출
/// </summary>
public void OnHitReceive(IHitEvent.HitInfo hitInfo)
{
    // 공격자가 StandUp 상태가 아닐 때만 처리
    if (hitInfo.HitterInfo.HitterStance != IHeroStatus.Stance.StandUp) return;
    
    // 기존 회복 코루틴 중지
    if (_hitRecoveryCoroutine != null) StopCoroutine(_hitRecoveryCoroutine);
    
    // 피격 회복 상태로 전환
    _hitRecovering = true;
    _hitRecoveryCoroutine = StartCoroutine(CoWaitHitRecovery(hitInfo.RecoveryTime));

    UpdateState();
}

/// <summary>
/// 피격 회복 대기 코루틴
/// </summary>
private IEnumerator CoWaitHitRecovery(float hitRecoveryTime)
{
    yield return new WaitForSeconds(hitRecoveryTime);
    _hitRecovering = false;            
    _hitRecoveryCoroutine = null;
    UpdateState();
}
```

## 기능 설명

### 상태 관리 시스템

HeroControllerStateHandler는 다양한 상태 플래그를 조합하여 5가지 행동 가능 상태를 결정합니다:

| 상태 | 조건 |
|------|------|
| **CanMove** | !_hitRecovering && !_usingSkill && _standing && !_playingCutScene && !_usingGuard |
| **CanDash** | !_hitRecovering && !_playingCutScene && CheckDashCount() && !_dashCooldown |
| **CanAttack** | !_hitRecovering && !_playingCutScene |
| **CanGuard** | !_usingSkill && !_hitRecovering && !_playingCutScene && !_usingGuard |
| **CanControllable** | !_hitRecovering && !_playingCutScene |

### 스킬 타입별 처리

스킬 타입에 따라 다른 상태 처리가 이루어집니다:

- **Attack/AttackHold/Utility/StanceChange**: 스킬 사용 중 상태로 전환
- **Dash/Roll**: 대시 횟수 증가 및 쿨다운 관리
- **Guard**: 가드 상태로 전환
- **WakeUpAttack**: 일어나기 완료 처리

### 대시 쿨다운 시스템

- `maxDashCount`만큼 연속 대시 가능
- 최대 횟수 도달 시 `dashCoolTime` 동안 쿨다운
- 쿨다운 중에는 대시 불가

### 피격/스턴/다운 상태

- 피격 시 `RecoveryTime` 동안 회복 상태
- 스턴 시 `stunRecovery` 시간 동안 행동 불가
- 다운 시 `takeDownRecovery` 시간 동안 행동 불가

## 의존성/상속 관계

### 상속/구현
- `MonoBehaviour` 상속
- `ISkillEvent` 인터페이스 구현
- `IHitEvent` 인터페이스 구현
- `IControllerState` 인터페이스 구현
- `IStanceEvent` 인터페이스 구현
- `ICutSceneEvent` 인터페이스 구현

### 의존 클래스
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) - 상태 적용 대상
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) - 능력치 정보
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat) - 대시 횟수/쿨타임 정보
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill) - 스킬 타입 정보

### 사용 인터페이스
- `ISkillEvent` - 스킬 시작/종료 이벤트
- `IHitEvent` - 피격 이벤트
- `IStanceEvent` - 자세 변경 이벤트
- `ICutSceneEvent` - 컷씬 이벤트

## 사용 예시

### HeroController에서 상태 핸들러 사용

```csharp
/// <summary>
/// HeroController가 HeroControllerStateHandler를 설정하는 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    [SerializeField] private HeroControllerStateHandler _stateHandler;
    
    public void Setup(BaseHeroAbility heroAbility, IHeroStatus heroStatus, IHeroObjectInfo heroObjectInfo)
    {
        // ... 다른 초기화 ...
        
        // 상태 핸들러 설정
        _stateHandler.Setup(heroAbility);
    }
    
    /// <summary>
    /// 이동 전 상태 체크
    /// </summary>
    public void Move(float horizontal, float vertical, float deltaTime)
    {
        // 상태 핸들러에서 CanMove 체크
        if (_controllerState.CanMove == false) return;
        
        // 이동 처리
        heroMoveController.Move(horizontal, vertical, deltaTime, _moveDirection);
    }
    
    /// <summary>
    /// 공격 전 상태 체크
    /// </summary>
    public void Attack(HeroInputSyncData syncData)
    {
        if (_controllerState.CanAttack == false) return;
        _baseHeroAbility?.Attack(syncData);
    }
    
    /// <summary>
    /// 대시 전 상태 체크
    /// </summary>
    public void Dash(float vertical, float horizontal)
    {
        if (_controllerState.CanDash == false) return;
        var direction = new Vector2(horizontal, vertical);
        _baseHeroAbility?.Dash(direction);
    }
}
```

### NetworkHeroController에서 상태 핸들러 설정

```csharp
/// <summary>
/// NetworkHeroController에서 HeroControllerStateHandler를 설정하는 예시
/// </summary>
public class NetworkHeroController : NetworkBehaviourCallback
{
    [SerializeField] private HeroController _heroController;
    [SerializeField] private HeroControllerStateHandler _stateHandler;
    [SerializeField] private BaseHeroAbility _heroAbility;
    
    public override void Spawned()
    {
        // HeroController 설정
        _heroController.Setup(_heroAbility, _heroStatus, this);
        
        // 상태 핸들러 설정 (HeroController에 자동 등록됨)
        _stateHandler.Setup(_heroAbility);
    }
}
```

## 관련 클래스

- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill)
- [`ISkillEvent`](/docs/projects/rfist/HeroSkillSystem/ISkillEvent)
- [`IHitEvent`](/docs/projects/rfist/HeroHitSystem/IHitEvent)
- [`IStanceEvent`](/docs/projects/rfist/HeroAbilitySystem/IStanceEvent)
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)

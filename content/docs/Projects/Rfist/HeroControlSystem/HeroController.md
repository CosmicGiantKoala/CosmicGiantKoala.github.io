+++
title = "HeroController"
description = "영웅 캐릭터의 전반적인 제어를 담당하는 핵심 컨트롤러 클래스"
icon = "code"
date = "2025-03-06T20:23:00+09:00"
lastmod = "2025-03-06T20:23:00+09:00"
draft = false
toc = true
weight = 200
+++

## 개요
`HeroController` 클래스는 RFist 게임의 영웅 캐릭터 전반을 제어하는 핵심 컨트롤러입니다.
이동, 전투 액션, 이벤트 통지 시스템 등의 기능을 통합 관리하며,
다양한 이벤트 인터페이스를 통해 애니메이션, 스킬, 피격 등을 담당하는 시스템과 연동됩니다.

## 역할
- 영웅 캐릭터의 이동 및 전투 액션 제어
- 6가지 이벤트 타입(MoveControl, Hit, Skill, Attack, Stance, CutScene)의 등록 및 통지
- 컨트롤러 상태(IControllerState) 기반 행동 제어
- 자동 타겟팅 및 방향 전환 처리

## 선언
```csharp
public class HeroController : MonoBehaviour, IHeroController, IHeroDetector, ISkillEventInvoker, ICutSceneEventInvoker
```

## 멤버
### 속성
```csharp
/// <summary>
/// 스킬 이벤트 발신자 인터페이스
/// </summary>
public ISkillEventInvoker SkillEventNotifier => this;

/// <summary>
/// 영웅 컨트롤러 인터페이스
/// </summary>
public IHeroController HeroObjectController => this;

/// <summary>
/// 컨트롤러 활성화 여부
/// </summary>
public bool IsActive => _isActive;

/// <summary>
/// 영웅 능력치 컴포넌트
/// </summary>
private BaseHeroAbility _baseHeroAbility;

/// <summary>
/// 이동 제어 이벤트 리스너 목록
/// </summary>
private readonly HashSet<IMoveControlEvent> _moveControlEvents = new HashSet<IMoveControlEvent>();

/// <summary>
/// 피격 이벤트 리스너 목록
/// </summary>
private readonly HashSet<IHitEvent> _hitEvents = new HashSet<IHitEvent>();

/// <summary>
/// 스킬 이벤트 리스너 목록
/// </summary>
private readonly HashSet<ISkillEvent> _skillEvents = new HashSet<ISkillEvent>();

/// <summary>
/// 공격 이벤트 리스너 목록
/// </summary>
private readonly HashSet<IAttackEvent> _attackEvents = new HashSet<IAttackEvent>();

/// <summary>
/// 자세 변경 이벤트 리스너 목록
/// </summary>
private readonly HashSet<IStanceEvent> _stanceEvents = new HashSet<IStanceEvent>();

/// <summary>
/// 컷씬 이벤트 리스너 목록
/// </summary>
private readonly HashSet<ICutSceneEvent> _cutSceneEvents = new HashSet<ICutSceneEvent>();

/// <summary>
/// 컨트롤러 상태 핸들러
/// </summary>
private IControllerState _controllerState;
```

### 메서드
```csharp
/// <summary>
/// 컨트롤러 상태 핸들러 설정
/// </summary>
/// <param name="controllerState">컨트롤러 상태 인터페이스</param>
public void SetupControllerStateHandler(IControllerState controllerState)

/// <summary>
/// 컨트롤러 초기 설정
/// </summary>
/// <param name="heroAbility">영웅 능력치 컴포넌트</param>
/// <param name="heroStatus">영웅 상태 인터페이스</param>
/// <param name="heroObjectInfo">영웅 오브젝트 정보</param>
public void Setup(BaseHeroAbility heroAbility, IHeroStatus heroStatus, IHeroObjectInfo heroObjectInfo)

/// <summary>
/// 로컬 플레이어 설정
/// </summary>
/// <param name="hasInputAuthority">입력 권한 여부</param>
public void SetLocalPlayer(bool hasInputAuthority)

/// <summary>
/// 방향키 이동 처리
/// </summary>
/// <param name="horizontal">수평 입력값</param>
/// <param name="vertical">수직 입력값</param>
/// <param name="deltaTime">델타 타임</param>
public void Move(float horizontal, float vertical, float deltaTime)

/// <summary>
/// DoTween을 사용하여 절대 방향으로 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)

/// <summary>
/// DoTween을 사용하여 상대 방향으로 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void MoveToRelativeDirection(float distance, float time, Vector3 direction)

/// <summary>
/// DoTween을 사용하여 넉백 이동
/// </summary>
/// <param name="attackerPos">공격자 위치 (넉백 방향 계산용)</param>
/// <param name="force">넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force)

/// <summary>
/// 대시 이동(IHeroController 구현)
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void Dash(float distance, float time, Vector3 direction)

/// <summary>
/// 타겟을 찾아 바라보기
/// </summary>
/// <param name="autoTargetingDistance">자동 타겟팅 거리</param>
/// <param name="autoTargetingAngle">자동 타겟팅 각도</param>
public void FindAndLookTarget(float autoTargetingDistance = 0, int autoTargetingAngle = 0)

/// <summary>
/// 타겟 찾기
/// </summary>
/// <param name="targetDistanceRange">타겟 감지 거리</param>
/// <param name="targetAngleRange">타겟 감지 각도</param>
/// <param name="target">찾은 타겟 트랜스폼</param>
/// <returns>타겟 찾기 성공 여부</returns>
public bool FindTarget(float targetDistanceRange, int targetAngleRange, out Transform target)

/// <summary>
/// 특정 방향 바라보기
/// </summary>
/// <param name="direction">바라볼 방향</param>
public void LookAt(Vector3 direction)

/// <summary>
/// 특정 타겟 바라보기
/// </summary>
/// <param name="target">바라볼 타겟 트랜스폼</param>
public void LookAt(Transform target)

/// <summary>
/// 피격 수신 처리
/// </summary>
/// <param name="hitInfo">피격 정보</param>
public void OnHitReceive(IHitEvent.HitInfo hitInfo)

// 전투입력 메서드
public void Dash(float vertical, float horizontal)
public void Attack(NetworkHeroController.HeroInputSyncData syncData)
public void AttackHold(NetworkHeroController.HeroInputSyncData syncData)
public void StopAttackHold(NetworkHeroController.HeroInputSyncData syncData)
public void Guard(NetworkHeroController.HeroInputSyncData syncData)
public void StopGuard(NetworkHeroController.HeroInputSyncData syncData)
public void UltimateSkill(NetworkHeroController.HeroInputSyncData syncData)
public void AttackGuardDualInput(NetworkHeroController.HeroInputSyncData syncData)

// 이벤트 발신 메서드
public void NotifySkillEvents(Action<ISkillEvent> action)
private void NotifyHitEvents(Action<IHitEvent> action)
private void NotifyMoveControlEvents(Action<IMoveControlEvent> action)
public void NotifyAttackEvents(Action<IAttackEvent> action)
private void NotifyStanceEvents(Action<IStanceEvent> action)
public void NotifyCutSceneEvents(Action<ICutSceneEvent> action)

// 이벤트 레지스터 메서드
public void Register(IMoveControlEvent moveControlEvent)
public void UnRegister(IMoveControlEvent moveControlEvent)
public void Register(IHitEvent hitEvent)
public void UnRegister(IHitEvent hitEvent)
public void Register(ISkillEvent skillEvent)
public void UnRegister(ISkillEvent skillEvent)
public void Register(IAttackEvent attackEvent)
public void UnRegister(IAttackEvent attackEvent)
public void Register(IStanceEvent stanceEvent)
public void UnRegister(IStanceEvent stanceEvent)
public void Register(ICutSceneEvent cutSceneEvent)
public void UnRegister(ICutSceneEvent cutSceneEvent)
```

## 코드 스니펫

### 초기 설정
```csharp
/// <summary>
/// 컨트롤러 초기 설정
/// </summary>
public void Setup(BaseHeroAbility heroAbility, IHeroStatus heroStatus, IHeroObjectInfo heroObjectInfo)
{
    _baseHeroAbility = heroAbility;
    
    // 이벤트 리스너 등록
    Register(_baseHeroAbility.HitEvent);
    Register(_baseHeroAbility.MoveControlEvent);
    Register(_baseHeroAbility.StanceEvent);
    Register(_baseHeroAbility.SkillEvent);
    
    // 컨트롤러 상태 및 이동 컨트롤러 설정
    _controllerState.Setup(_baseHeroAbility);
    heroMoveController.Setup(_controllerState, heroObjectInfo, heroAbility.GetHeroStat());
}

/// <summary>
/// 로컬 플레이어 설정
/// </summary>
/// <param name="hasInputAuthority">입력 권한 여부</param>
public void SetLocalPlayer(bool hasInputAuthority)
{
    _isLocalPlayer = hasInputAuthority;
}

/// <summary>
/// 컨트롤러 상태 핸들러 설정
/// </summary>
/// <param name="controllerState">컨트롤러 상태 인터페이스</param>
public void SetupControllerStateHandler(IControllerState controllerState)
{
    _controllerState = controllerState;
}
```

### 이동 처리 로직
```csharp
/// <summary>
/// 이동 처리
/// </summary>
public void Move(float horizontal, float vertical, float deltaTime)
{
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

### 트윈 이동 호출
```csharp
/// <summary>
/// DoTween을 사용하여 절대 방향으로 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)
{
    heroMoveController.MoveToAbsoluteDirection(distance, time, direction);
}

/// <summary>
/// DoTween을 사용하여 상대 방향으로 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void MoveToRelativeDirection(float distance, float time, Vector3 direction)
{
    heroMoveController.MoveToRelativeDirection(distance, time, direction);
}

/// <summary>
/// DoTween을 사용하여 넉백 처리
/// </summary>
/// <param name="attackerPos">공격자 위치 (넉백 방향 계산용)</param>
/// <param name="force">넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force)
{
    heroMoveController.KnockBack(attackerPos, force);
}
```

### 타겟팅 및 방향전환 메서드
```csharp
/// <summary>
/// 타겟을 찾아 바라보기
/// </summary>
/// <param name="autoTargetingDistance">자동 타겟팅 거리</param>
/// <param name="autoTargetingAngle">자동 타겟팅 각도</param>
public void FindAndLookTarget(float autoTargetingDistance = 0, int autoTargetingAngle = 0)
{
    if (_isLocalPlayer == false) return;
    if (FindTarget(autoTargetingDistance, autoTargetingAngle, out var target))
    {
        LookAt(target);
    }
}

/// <summary>
/// 타겟 찾기
/// </summary>
/// <param name="targetDistanceRange">타겟 감지 거리</param>
/// <param name="targetAngleRange">타겟 감지 각도</param>
/// <param name="target">찾은 타겟 트랜스폼</param>
/// <returns>타겟 찾기 성공 여부</returns>
public bool FindTarget(float targetDistanceRange, int targetAngleRange, out Transform target)
{
    return autoTargetingComponent.FindTarget(targetAngleRange, targetAngleRange, out target);
}

/// <summary>
/// 특정 방향 바라보기
/// </summary>
/// <param name="direction">바라볼 방향</param>
public void LookAt(Vector3 direction)
{
    heroMoveController.LookAt(direction);
}

/// <summary>
/// 특정 타겟 바라보기
/// </summary>
/// <param name="target">바라볼 타겟 트랜스폼</param>
public void LookAt(Transform target)
{
    heroMoveController.LookAt(target);
}
```

### 자세 변경 처리
```csharp
/// <summary>
/// 자세 변경 시 처리
/// </summary>
public void OnStanceChanged(IHeroStatus.Stance stance)
{
    switch (stance)
    {
        case IHeroStatus.Stance.StandUp:
            NotifyStanceEvents(wakeup => wakeup?.WakeUp());
            break;
        case IHeroStatus.Stance.Down:
            NotifyStanceEvents(down => down?.TakeDown());
            break;
        case IHeroStatus.Stance.Stun:
            NotifyStanceEvents(stun => stun?.Stun());
            break;
    }
}
```

### 이벤트 통지 시스템
```csharp
/// <summary>
/// 스킬 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifySkillEvents(Action<ISkillEvent> action)
{
    foreach (var skillEvent in _skillEvents)
    {
        action?.Invoke(skillEvent);
    }
}

/// <summary>
/// 피격 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyHitEvents(Action<IHitEvent> action)
{
    foreach (var hitEvent in _hitEvents)
    {
        action?.Invoke(hitEvent);
    }
}

/// <summary>
/// 이동 제어 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyMoveControlEvents(Action<IMoveControlEvent> action)
{
    foreach (var moveControlEvent in _moveControlEvents)
    {
        action?.Invoke(moveControlEvent);
    }
}

/// <summary>
/// 공격 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifyAttackEvents(Action<IAttackEvent> action)
{
    foreach (var attackEvent in _attackEvents)
    {
        action?.Invoke(attackEvent);
    }
}

/// <summary>
/// 자세 변경 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyStanceEvents(Action<IStanceEvent> action)
{
    foreach (var stanceEvent in _stanceEvents)
    {
        action?.Invoke(stanceEvent);
    }
}

/// <summary>
/// 컷씬 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifyCutSceneEvents(Action<ICutSceneEvent> action)
{
    foreach (var cutSceneEvent in _cutSceneEvents)
    {
        action?.Invoke(cutSceneEvent);
    }
}
```


### 전투 입력 처리
```csharp
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

/// <summary>
/// 공격 키 홀드 종료
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void StopAttackHold(NetworkHeroController.HeroInputSyncData syncData)
{
    _baseHeroAbility?.AttackHoldFinished(syncData);
}

/// <summary>
/// 가드 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void Guard(NetworkHeroController.HeroInputSyncData syncData)
{
    if (_controllerState.CanGuard == false) return;
    _baseHeroAbility?.Guard(syncData);
}

/// <summary>
/// 가드 종료
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void StopGuard(NetworkHeroController.HeroInputSyncData syncData)
{
    _baseHeroAbility?.StopGuard(syncData);
}

/// <summary>
/// 궁극기 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void UltimateSkill(NetworkHeroController.HeroInputSyncData syncData)
{
    _baseHeroAbility?.UltimateSkill(syncData);
}

/// <summary>
/// 공격+가드 동시 입력 처리
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void AttackGuardDualInput(NetworkHeroController.HeroInputSyncData syncData)
{
    _baseHeroAbility?.AttackGuardDualInput(syncData);
}

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
```

## 기능 설명
### 이동 시스템
- HeroController는 두 가지 이동 모드를 지원
- **일반 이동 모드**: 입력 방향으로 자유롭게 이동하며, 방향 변경 시에만 이벤트를 발생시켜 성능을 최적화합니다.
- **포커스 모드 이동**: 지정된 타겟을 향해 방향을 유지하면서 이동합니다. 측면/후방 이동 시에도 타겟을 계속 바라봅니다.(비개발 항목)
- 이동 처리는 [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)에 위임되며, 대시/넉백 등의 특수 이동은 DoTween을 활용한 트윈 기반 이동을 사용

### 이벤트 시스템
- HeroController는 6가지 이벤트 타입을 관리하는 옵서버 패턴을 구현

| 이벤트 타입 | 인터페이스 | 용도 |
|------------|-----------|------|
| MoveControl | `IMoveControlEvent` | 이동 입력 및 제어 상태 변화 |
| Hit | `IHitEvent` | 피격 수신 |
| Skill | `ISkillEvent` | 스킬 사용 및 상태 변화 |
| Attack | `IAttackEvent` | 공격 실행 및 완료 |
| Stance | `IStanceEvent` | 자세(StandUp/Down/Stun) 변경 |
| CutScene | `ICutSceneEvent` | 컷씬 시작/종료 |

- 각 이벤트 타입은 `Register()`/`UnRegister()` 메서드로 구독/해제할 수 있으며, `NotifyXXXEvents()` 메서드로 모든 구독자에게 이벤트 통지

### 상태 기반 행동 제어
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)를 통해 현재 캐릭터가 어떤 행동을 할 수 있는지 제어
- 전투 액션(Attack, Guard, Dash 등) 실행 전 해당 상태를 체크하여 부적절한 상태에서는 실행되지 않도록 제어.
- `CanMove`: 이동 가능 여부
- `CanAttack`: 공격 가능 여부
- `CanGuard`: 가드 가능 여부
- `CanDash`: 대시 가능 여부
- `CanControllable`: 전반적인 제어 가능 여부

## 의존성/상속 관계
- `MonoBehaviour`를 상속 받음
- 인터페이스 구현
  - [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController) 인터페이스 구현
  - `IHeroDetector` 인터페이스 구현
  - [`ISkillEventInvoker`](/docs/projects/rfist/HeroSkillSystem/ISkillEventInvoker) 인터페이스 구현
  - [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker) 인터페이스 구현
- 관리되는 이벤트
    - `IMoveControlEvent`
    - `IHitEvent`
    - `ISkillEvent`
    - `IAttackEvent`
    - `IStanceEvent`
    - `ICutSceneEvent`
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController) 베이스 이동 클래스를 통해 이동 및 트윈이동 제어
- `AutoTargeting` 클래스를 통해 타겟팅
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) 베이스 어빌리티 클래스를 통해 공격/가드/대시 등의 스킬 동작 처리
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState) 컨트롤러 상태 핸들러를 통해 입력 동작 제어
- [`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/IHeroStatus) 상태 인터페이스를 하위 컴포넌트에 셋업 
- [`NetworkHeroController.HeroInputSyncData`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController) 입력 동기화 관련 데이터


## 사용 예시
#### [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)에서 셋업 동작 실행 및 참조 전달
```csharp
private void UpdateAbility(BaseHeroAbility.BaseAbilityType abilityType)
{
    // 기존 능력 해제
    if(_baseHeroAbility != null) ReleaseAbility();
    
    // 새로운 능력 생성
    _baseHeroAbility = heroAbilityManager.CreateAbility(abilityType, modelTransform);
    if (_baseHeroAbility == null)
    {
        Debug.LogError($"[NetworkHeroObject] Can't create ability : {abilityType}");
        return;
    }
    
    // 모델 업데이트
    heroModelController.UpdateModel(_baseHeroAbility, (Team)UserProfileRef.TeamIndex, gameObject.transform, modelTransform);
    
    // 애니메이터 설정
    _baseHeroAnimator = _baseHeroAbility.GetBaseHeroAnimator();
    
    // 컨트롤러 설정
    heroController.Setup(_baseHeroAbility, networkHeroStatus, HeroObjectInfo);
    
    // 애니메이션 컨트롤러 설정
    heroAnimationController.Setup(_baseHeroAnimator, networkHeroStatus);
    _baseHeroAnimator.Setup(heroModelController.GetModelAnimator(), _baseHeroAbility);
    
    // 능력 설정
    _baseHeroAbility.Setup(networkHeroStatus, heroController.HeroObjectController, this, heroController.SkillEventNotifier);
    networkHeroStatus.Setup(_baseHeroAbility.GetHeroStat() , 0);
    _baseHeroAbility.SetupHitBoxHandle(networkHeroStatus.OnHitHandle, networkHeroStatus);
    
    // 이펙트 설정
    _heroEffect = heroModelController.GetHeroRenderer();
    Register((IMatchEvent)_baseHeroAbility);

    // 이벤트 리스너들에게 능력 변경 알림
    foreach (var heroEvent in _heroEvents)
    {
        heroEvent.OnAbilityChanged(abilityType);
        heroEvent.OnModeChanged(IHeroEvent.HeroMode.Standard);
    }

    // 이펙트 컨트롤러 설정 코루틴 시작
    if (_setupEffectController != null) StopCoroutine(_setupEffectController);
    _setupEffectController = StartCoroutine(CoSetupEffectController());
}
```

#### [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)에서 이벤트 리스너 등록/해제
```csharp
//이벤트 리스너 등록
public void Register(ISkillEvent skillEvent)
{
    heroController.Register(skillEvent);
}

public void Register(IAttackEvent attackEvent)
{
    heroController.Register(attackEvent);
}

public void Register(ICutSceneEvent cutSceneEvent)
{
    heroController.Register(cutSceneEvent);
}


//이벤트 리스너 해제
public void UnRegister(ISkillEvent skillEvent)
{
    heroController.UnRegister(skillEvent);
}

public void UnRegister(IAttackEvent attackEvent)
{
    heroController.UnRegister(attackEvent);
}

public void UnRegister(ICutSceneEvent cutSceneEvent)
{
    heroController.UnRegister(cutSceneEvent);
}

// NetworkHeroObject가 디스폰시에도 이벤트 리스너 해제
protected override void OnDespawned(NetworkRunner runner, bool hasState)
{
    // 설정 코루틴 중지
    if (_setupCoroutine != null)
    {
        StopCoroutine(_setupCoroutine);
        _setupCoroutine = null;
    }
    
    // 모든 이벤트 등록 해제
    UnRegister((IMatchEvent)heroAnimationController);
    heroController.UnRegister(heroAnimationController.MoveControlEvent);
    heroController.UnRegister(heroAnimationController.HitEvent);
    heroController.UnRegister(heroAnimationController.StanceEvent);
    heroController.UnRegister(_baseHeroAbility.HitEvent);
    heroController.UnRegister(_baseHeroAbility.MoveControlEvent);
    heroController.UnRegister(_baseHeroAbility.StanceEvent);
    heroController.UnRegister((IAttackEvent)this);
    heroController.UnRegister(_baseHeroAbility.SkillEvent);
    
    // 로컬 플레이어인 경우 사망 이벤트 해제
    if (IsRemote() == false)
    {
        networkHeroStatus.OnDeath -= OnDeathEvent;    
    }
    
    // 이벤트 및 참조 정리
    networkHeroStatus.OnHpChanged -= heroAnimationController.OnHealthChange;
    heroController.DetectCloseHeroEvent = null;
    _heroEvents.Clear();
    
    // 디스폰 알림
    HeroObjectEvent.Instance.NotifyDeSpawned(this);
}
```

#### [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)에서 입력 전달
```csharp
private HeroController heroController;

[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_UpdateHeroInputData(HeroInputData heroInputData)
{
    // 이동 입력 처리
    heroController.Move(heroInputData.Horizontal, heroInputData.Vertical, Runner.DeltaTime);
    
    // 개별 스킬/액션 입력 처리
    ProcessDash(heroInputData);
    ProcessAttack(heroInputData);
    ProcessAttackHold(heroInputData);
    ProcessFocus(heroInputData);
    ProcessGuard(heroInputData);
    ProcessUltimateSkill(heroInputData);
    ProcessAttackGuardDualInput(heroInputData);
}

private void ProcessAttack(HeroInputData inputData)
{
    if (inputData.IsAttack())
    {
        // 클라이언트 타임스탬프와 서버 시뮬레이션 타임으로 동기화 데이터 생성
        var syncData = new HeroInputSyncData(inputData.AttackTimeStamp, Runner.SimulationTime);
        heroController.Attack(syncData);
    }
}

private void ProcessAttackHold(HeroInputData inputData)
{
    var syncData = new HeroInputSyncData(inputData.AttackTimeStamp, Runner.SimulationTime);
    if (inputData.IsAttackHold())
    {
        heroController.AttackHold(syncData);
    }
    else
    {
        heroController.StopAttackHold(syncData);
    }
}

private void ProcessDash(HeroInputData inputData)
{
    if (inputData.IsDash())
    {
        heroController.Dash(inputData.Horizontal, inputData.Vertical);
    }
}

private void ProcessGuard(HeroInputData inputData)
{
    var syncData = new HeroInputSyncData(inputData.AttackTimeStamp, Runner.SimulationTime);
    if (inputData.IsGuard())
    {
        heroController.Guard(syncData);
    }
    else
    {
        heroController.StopGuard(syncData);
    }
}

private void ProcessFocus(HeroInputData heroInputData)
{
    if (heroInputData.IsFocusMode())
    {
        // 현재 포커스 상태의 반대로 토글
        heroController.ToggleFocusMode(!heroStatus.GetFocusState());
    }
}

private void ProcessUltimateSkill(HeroInputData inputData)
{
    if (inputData.IsUltimateSkill())
    {
        var syncData = new HeroInputSyncData(inputData.AttackTimeStamp, Runner.SimulationTime);
        heroController.UltimateSkill(syncData);
    }
}

private void ProcessAttackGuardDualInput(HeroInputData inputData)
{
    if (inputData.IsAttackGuardDualInput())
    {
        var syncData = new HeroInputSyncData(inputData.AttackTimeStamp, Runner.SimulationTime);
        heroController.AttackGuardDualInput(syncData);
    }
}
```

#### [`NetworkHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroStatus)에서 피격 및 자세 변경시 호출
```csharp
[Rpc(RpcSources.All, RpcTargets.All)]
private void RPC_UpdateHitInfo(IHitEvent.HitInfo hitInfo)
{
    heroController.OnHitReceive(hitInfo);
    UpdateStance(hitInfo.HitterInfo);
    UpdateStiffness(hitInfo);
}

private void UpdateStance(IHitEvent.HitInfo.HitterState hitterState)
{
    if (CurrentStance == hitterState.HitterStance) return;
    ChangeStance(hitterState.HitterStance);
    heroController.OnStanceChanged(hitterState.HitterStance);
}
```


## 관련 클래스
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/IHeroStatus)
- [`IMoveControlEvent`](/docs/projects/rfist/HeroControlSystem/IMoveControlEvent)
- [`IHitEvent`](/docs/projects/rfist/HeroHitSystem/IHitEvent)
- [`ISkillEvent`](/docs/projects/rfist/HeroSkillSystem/ISkillEvent)
- [`IAttackEvent`](/docs/projects/rfist/HeroHitSystem/IAttackEvent)
- [`IStanceEvent`](/docs/projects/rfist/HeroAbilitySystem/IStanceEvent)
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)

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
이동, 전투 액션, 이벤트 통지 시스템, 포커스 모드 등의 기능을 통합 관리하며,
다양한 이벤트 인터페이스를 통해 애니메이션, 스킬, 피격 등의 시스템과 연동됩니다.

## 역할

- 영웅 캐릭터의 이동 및 전투 액션 제어
- 포커스 모드(타겟팅 시스템) 관리
- 6가지 이벤트 타입(MoveControl, Hit, Skill, Attack, Stance, CutScene)의 등록 및 통지
- 컨트롤러 상태(IControllerState) 기반 행동 제어
- 자동 타겟팅 및 방향 전환 처리

## 선언

```csharp
/// <summary>
/// 영웅 캐릭터의 전반적인 제어를 담당하는 핵심 컨트롤러 클래스
/// 이동, 전투 액션, 이벤트 통지, 포커스 모드 등의 기능을 관리합니다.
/// </summary>
public class HeroController : MonoBehaviour, IHeroController, IHeroDetector, ISkillEventInvoker, ICutSceneEventInvoker
```

## 멤버

### 이벤트

```csharp
/// <summary>
/// 포커스 모드 변경 시 발생하는 이벤트
/// </summary>
public event Action<bool> OnFocusModeChangedEvent;

/// <summary>
/// 회피(닷지) 시작 시 발생하는 이벤트
/// </summary>
public event Action OnDodgingEvent;

/// <summary>
/// 주변 영웅 감지 델리게이트
/// </summary>
public delegate void DetectCloseHeroAction(Transform myTransform, float angle = 0, float distance = 0,
    Action<NetworkHeroObject> onAction = null);

/// <summary>
/// 주변 영웅 감지 이벤트
/// </summary>
public DetectCloseHeroAction DetectCloseHeroEvent;
```

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
```

### Private Fields

```csharp
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

/// <summary>
/// 영웅 상태 인터페이스
/// </summary>
private IHeroStatus _heroStatus;
```

### 메서드

#### Setup

```csharp
/// <summary>
/// 컨트롤러 활성화/비활성화 설정
/// </summary>
/// <param name="isActive">활성화 여부</param>
public void SetActive(bool isActive)

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
```

#### Focus Mode

```csharp
/// <summary>
/// 포커스 모드 초기화 (비활성화)
/// </summary>
public void ResetFocusMode()

/// <summary>
/// 포커스 모드 설정
/// </summary>
/// <param name="isFocusMode">포커스 모드 활성화 여부</param>
public void SetFocusMode(bool isFocusMode)

/// <summary>
/// 포커스 모드 토글
/// </summary>
/// <param name="isFocusMode">포커스 모드 활성화 여부</param>
public void ToggleFocusMode(bool isFocusMode)

/// <summary>
/// 포커스 타겟 변경
/// </summary>
public void FocusChange()
```

#### Movement

```csharp
/// <summary>
/// 이동 처리
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
/// RigidBody.AddForce를 통해 넉백 처리
/// </summary>
/// <param name="attackerPos">공격자 위치 (넉백 방향 계산용)</param>
/// <param name="force">넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force)

/// <summary>
/// 대시 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향</param>
public void Dash(float distance, float time, Vector3 direction)

/// <summary>
/// 대시 (방향 벡터 기준)
/// </summary>
/// <param name="vertical">수직 입력값</param>
/// <param name="horizontal">수평 입력값</param>
public void Dash(float vertical, float horizontal)

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
```

#### Combat

```csharp
/// <summary>
/// 공격 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void Attack(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 공격 키 홀드
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void AttackHold(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 공격 키 홀드 종료
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void StopAttackHold(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 가드 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void Guard(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 가드 종료
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void StopGuard(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 궁극기 실행
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void UltimateSkill(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 공격+가드 동시 입력 처리
/// </summary>
/// <param name="syncData">입력 동기화 데이터</param>
public void AttackGuardDualInput(NetworkHeroController.HeroInputSyncData syncData)

/// <summary>
/// 피격 수신 처리
/// </summary>
/// <param name="hitInfo">피격 정보</param>
public void OnHitReceive(IHitEvent.HitInfo hitInfo)
```

#### Event Notification

```csharp
/// <summary>
/// 스킬 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifySkillEvents(Action<ISkillEvent> action)

/// <summary>
/// 피격 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyHitEvents(Action<IHitEvent> action)

/// <summary>
/// 이동 제어 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyMoveControlEvents(Action<IMoveControlEvent> action)

/// <summary>
/// 공격 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifyAttackEvents(Action<IAttackEvent> action)

/// <summary>
/// 자세 변경 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
private void NotifyStanceEvents(Action<IStanceEvent> action)

/// <summary>
/// 컷씬 이벤트 리스너들에게 이벤트 통지
/// </summary>
/// <param name="action">실행할 이벤트 액션</param>
public void NotifyCutSceneEvents(Action<ICutSceneEvent> action)
```

#### Event Registration

```csharp
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

### 이동 처리 로직

```csharp
/// <summary>
/// 이동 처리
/// </summary>
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

### 포커스 모드 토글

```csharp
/// <summary>
/// 포커스 모드 토글
/// </summary>
public void ToggleFocusMode(bool isFocusMode)
{
    if (DetectCloseHeroEvent != null)
    {
        if (!isFocusMode)
        {
            SetFocusMode(false);
            return;
        }
        
        // 주변 영웅 감지 및 포커스 설정
        DetectCloseHeroEvent(transform, 90, 10, networkHeroObject =>
        {
            if (networkHeroObject.IsNull())
            {
                // 감지된 영웅 없음
            }
            else
            {
                _focusTarget = networkHeroObject.GetModelTransform().gameObject;
                SetFocusMode(isFocusMode);
            }
        });
    }
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
public void NotifySkillEvents(Action<ISkillEvent> action)
{
    foreach (var skillEvent in _skillEvents)
    {
        action?.Invoke(skillEvent);
    }
}

/// <summary>
/// 이동 제어 이벤트 리스너들에게 이벤트 통지
/// </summary>
private void NotifyMoveControlEvents(Action<IMoveControlEvent> action)
{
    foreach (var moveControlEvent in _moveControlEvents)
    {
        action?.Invoke(moveControlEvent);
    }
}
```

### 초기 설정

```csharp
/// <summary>
/// 컨트롤러 초기 설정
/// </summary>
public void Setup(BaseHeroAbility heroAbility, IHeroStatus heroStatus, IHeroObjectInfo heroObjectInfo)
{
    _baseHeroAbility = heroAbility;
    _heroStatus = heroStatus;
    
    // 이벤트 리스너 등록
    Register(_baseHeroAbility.HitEvent);
    Register(_baseHeroAbility.MoveControlEvent);
    Register(_baseHeroAbility.StanceEvent);
    Register(_baseHeroAbility.SkillEvent);
    
    // 컨트롤러 상태 및 이동 컨트롤러 설정
    _controllerState.Setup(_baseHeroAbility);
    heroMoveController.Setup(_controllerState, heroObjectInfo, heroAbility.GetHeroStat());
}
```

## 기능 설명

### 이동 시스템

HeroController는 두 가지 이동 모드를 지원합니다:

- **일반 이동 모드**: 입력 방향으로 자유롭게 이동하며, 방향 변경 시에만 이벤트를 발생시켜 성능을 최적화합니다.
- **포커스 모드 이동**: 지정된 타겟을 향해 방향을 유지하면서 이동합니다. 측면/후방 이동 시에도 타겟을 계속 바라봅니다.

이동 처리는 `BaseHeroMoveController`에 위임되며, 대시/넉백 등의 특수 이동은 DoTween을 활용한 트윈 기반 이동을 사용합니다.

### 포커스 모드 시스템

포커스 모드는 전투에서 타겟을 고정하여 공격하는 기능을 제공합니다:

1. **활성화**: `ToggleFocusMode(true)` 호출 시 주변 영웅 감지(90도 각도, 10 거리 범위)
2. **타겟 설정**: 감지된 영웅이 있으면 해당 영웅을 포커스 타겟으로 설정
3. **이동**: 포커스 모드 중 이동 시 타겟을 계속 바라볼 수 있도록 `FocusMove()` 호출
4. **전환**: `FocusChange()`로 다른 타겟으로 전환 가능

### 이벤트 시스템

HeroController는 6가지 이벤트 타입을 관리하는 옵서버 패턴을 구현합니다:

| 이벤트 타입 | 인터페이스 | 용도 |
|------------|-----------|------|
| MoveControl | `IMoveControlEvent` | 이동 입력 및 제어 상태 변화 |
| Hit | `IHitEvent` | 피격 수신 |
| Skill | `ISkillEvent` | 스킬 사용 및 상태 변화 |
| Attack | `IAttackEvent` | 공격 실행 및 완료 |
| Stance | `IStanceEvent` | 자세(StandUp/Down/Stun) 변경 |
| CutScene | `ICutSceneEvent` | 컷씬 시작/종료 |

각 이벤트 타입은 `Register()`/`UnRegister()` 메서드로 구독/해제할 수 있으며, `NotifyXXXEvents()` 메서드로 모든 구독자에게 이벤트를 통지합니다.

### 상태 기반 행동 제어

`IControllerState`를 통해 현재 캐릭터가 어떤 행동을 할 수 있는지 제어합니다:

- `CanMove`: 이동 가능 여부
- `CanAttack`: 공격 가능 여부
- `CanGuard`: 가드 가능 여부
- `CanDash`: 대시 가능 여부
- `CanControllable`: 전반적인 제어 가능 여부

전투 액션(Attack, Guard, Dash 등) 실행 전 해당 상태를 체크하여 부적절한 상태에서는 실행되지 않도록 합니다.

## 의존성/상속 관계

### 상속/구현
- `MonoBehaviour` 상속
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController) 인터페이스 구현
- [`IHeroDetector`](/docs/projects/rfist/HeroHitSystem/IHeroDetector) 인터페이스 구현
- [`ISkillEventInvoker`](/docs/projects/rfist/HeroSkillSystem/ISkillEventInvoker) 인터페이스 구현
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker) 인터페이스 구현

### 의존 클래스
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController) - 이동 제어
- [`AutoTargeting`](/docs/projects/rfist/HeroControlSystem/AutoTargeting) - 자동 타겟팅
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) - 능력치 및 스킬 실행
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState) - 상태 관리
- [`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/IHeroStatus) - 상태 인터페이스
- [`NetworkHeroController.HeroInputSyncData`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController) - 입력 동기화 데이터

### 사용 인터페이스
- `IMoveControlEvent` - 이동 제어 이벤트
- `IHitEvent` - 피격 이벤트
- `ISkillEvent` - 스킬 이벤트
- `IAttackEvent` - 공격 이벤트
- `IStanceEvent` - 자세 변경 이벤트
- `ICutSceneEvent` - 컷씬 이벤트

## 사용 예시

### NetworkHeroController에서 HeroController 사용

```csharp
/// <summary>
/// NetworkHeroController에서 HeroController를 초기화하고 입력을 전달하는 예시
/// </summary>
public class NetworkHeroController : NetworkBehaviourCallback
{
    [SerializeField] private HeroController _heroController;
    [SerializeField] private BaseHeroAbility _heroAbility;
    
    private HeroInputSyncData _currentInput;
    
    public override void Spawned()
    {
        // HeroController 초기 설정
        _heroController.Setup(_heroAbility, _heroStatus, this);
        _heroController.SetLocalPlayer(Object.HasInputAuthority);
        _heroController.SetupControllerStateHandler(_stateHandler);
    }
    
    /// <summary>
/// 입력 데이터를 HeroController에 전달하여 이동 처리
    /// </summary>
    public override void FixedUpdateNetwork()
    {
        if (GetInput(out HeroInputSyncData input))
        {
            _currentInput = input;
            
            // 이동 처리
            _heroController.Move(input.HorizontalInput, input.VerticalInput, Time.deltaTime);
            
            // 포커스 모드 토글
            if (input.Buttons.IsSet(HeroButtons.ToggleFocus))
            {
                _heroController.ToggleFocusMode(true);
            }
            
            // 공격 처리
            if (input.Buttons.IsSet(HeroButtons.Attack))
            {
                _heroController.Attack(input);
            }
            
            // 가드 처리
            if (input.Buttons.IsSet(HeroButtons.Guard))
            {
                _heroController.Guard(input);
            }
            
            // 대시 처리
            if (input.Buttons.IsSet(HeroButtons.Dash))
            {
                _heroController.Dash(input.VerticalInput, input.HorizontalInput);
            }
        }
    }
    
    /// <summary>
    /// 피격 시 HeroController에 전달
    /// </summary>
    public void OnHitReceived(IHitEvent.HitInfo hitInfo)
    {
        _heroController.OnHitReceive(hitInfo);
    }
}
```

### HeroAnimationController에서 이벤트 구독

```csharp
/// <summary>
/// HeroAnimationController가 HeroController의 이벤트를 구독하는 예시
/// </summary>
public class HeroAnimationController : MonoBehaviour, IMoveControlEvent, IStanceEvent
{
    [SerializeField] private HeroController _heroController;
    private Animator _animator;
    
    private void Start()
    {
        // 이벤트 구독
        _heroController.Register(this);
    }
    
    private void OnDestroy()
    {
        // 이벤트 해제
        _heroController.UnRegister(this);
    }
    
    /// <summary>
    /// 이동 이벤트 수신 시 애니메이션 파라미터 업데이트
    /// </summary>
    public void OnMoveEvent(Vector2 direction, bool isFocusMode)
    {
        _animator.SetFloat("MoveX", direction.x);
        _animator.SetFloat("MoveY", direction.y);
        _animator.SetBool("IsFocusMode", isFocusMode);
    }
    
    /// <summary>
    /// 자세 변경 이벤트 수신 시 애니메이션 트리거
    /// </summary>
    public void WakeUp()
    {
        _animator.SetTrigger("WakeUp");
    }
    
    public void TakeDown()
    {
        _animator.SetTrigger("TakeDown");
    }
    
    public void Stun()
    {
        _animator.SetTrigger("Stun");
    }
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
- [`AutoTargeting`](/docs/projects/rfist/HeroControlSystem/AutoTargeting)
- [`IMoveControlEvent`](/docs/projects/rfist/HeroControlSystem/IMoveControlEvent)
- [`IHitEvent`](/docs/projects/rfist/HeroHitSystem/IHitEvent)
- [`ISkillEvent`](/docs/projects/rfist/HeroSkillSystem/ISkillEvent)
- [`IAttackEvent`](/docs/projects/rfist/HeroHitSystem/IAttackEvent)
- [`IStanceEvent`](/docs/projects/rfist/HeroAbilitySystem/IStanceEvent)
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)

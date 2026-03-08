+++
title = "NetworkHeroStatus"
description = "Photon Fusion 네트워크 환경에서 `IHeroStatus`를 구현한 영웅의 상태를 관리하는 클래스"
icon = "code"
date = "2025-02-24T16:58:00+09:00"
lastmod = "2025-02-24T16:58:00+09:00"
draft = false
toc = true
weight = 230
+++

## 개요

`NetworkHeroStatus` 클래스는 Photon Fusion 네트워크 환경에서 영웅의 상태(HP, SP, 경직 포인트 등)를 관리하는 클래스입니다.
[`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/networkherostatus) 인터페이스를 구현하여 다양한 상태 변화 이벤트를 제공하며, 모든 상태 변경은 네트워크를 통해 동기화됩니다.
HP(생명력), SP(특수 포인트), 경직 포인트(Stiffness), 자세(Stance) 등의 상태를 관리하고,
상태 효과(Status Boost) 시스템을 통해 일시적인 능력치 변화도 처리합니다.

## 역할

- 영웅의 HP(생명력) 관리 및 네트워크 동기화
- SP(특수 포인트) 관리
- 경직 포인트(Stiffness Point) 관리
- 자세(Stance) 상태 관리
- 공격/가드/무적 상태 관리
- 포커스 모드 상태 관리
- 상태 효과(Status Boost) 시스템 관리
- 히트 처리 및 데미지 계산
- 사망/처치 이벤트 발생

## 선언
```csharp
[RequireComponent(typeof(NetworkObject))]
public class NetworkHeroStatus : NetworkBehaviourCallback, IHeroStatus
```

## 멤버
### 이벤트
```csharp
/// <summary>
/// HP 변경 시 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnHpChange OnHpChanged;

/// <summary>
/// 적 혹은 플레이어 사망시 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnDeathDelegate OnKill;
public event IHeroStatus.OnDeathDelegate OnDeath;

/// <summary>
/// SP(특수 포인트) 변경 시 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnSpChange OnSpChanged;

/// <summary>
/// 피해를 입었을 때 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnDamageDelegate OnDamaged;

/// <summary>
/// 상태 효과 변경 시 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnStatusBoostChange OnStatusBoostChanged;

/// <summary>
/// 경직 포인트 변경 시 발생하는 이벤트
/// </summary>
public event IHeroStatus.OnStiffnessPointChange OnStiffnessPointChanged;
```

### 필드

```csharp
/// <summary>
/// 영웅 컨트롤러 참조
/// </summary>
[SerializeField]
private HeroController heroController;

/// <summary>
/// 현재 처럥(HP)
/// </summary>
private int _healthPoint;

/// <summary>
/// 현재 경직 포인트(Stiffness Point)
/// </summary>
private int _stiffnessPoint;

/// <summary>
/// 현재 특수 포인트(SP)
/// </summary>
private int _specialPoint;

/// <summary>
/// 영웅 기본 스탯
/// </summary>
private HeroBaseStat _heroBaseStat;

/// <summary>
/// 포커스 모드 활성화 여부
/// </summary>
private bool _isFocusMode;

/// <summary>
/// 적용 중인 상태 효과 집합
/// </summary>
private HashSet<IHeroStatus.StatusBoost> _statusBoosts;

/// <summary>
/// 활성화된 상태 효과 코루틴 관리 딕셔너리
/// </summary>
private Dictionary<IHeroStatus.StatusBoost.BoostType, Coroutine> _activeStatusBoostCoroutines;
```

### 속성

```csharp
/// <summary>
/// 현재 자세(Stance) 상태
/// </summary>
public IHeroStatus.Stance CurrentStance { get; private set; }

/// <summary>
/// 공격 상태 여부
/// </summary>
public bool AttackState { get; private set; }

/// <summary>
/// 가드 상태 여부
/// </summary>
public bool GuardState { get; private set; }

/// <summary>
/// 무적 상태 여부
/// </summary>
public bool InvincibleState { get; private set; }

/// <summary>
/// 히트 처리 델리게이트 인스턴스
/// </summary>
public OnHitDelegate OnHitHandle => OnHit;
```

### 메서드
```csharp
/// <summary>
/// 포커스 모드 상태를 설정합니다.
/// 입력 권한이 있는 플레이어만 설정 가능합니다.
/// </summary>
private void SetFocusState(bool isFocusMode)

/// <summary>
/// 포커스 모드 상태를 모든 클라이언트에 동기화하는 RPC
/// </summary>
[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_SetFocusState(bool isFocusMode)

/// <summary>
/// 영웅 상태를 초기 설정합니다.
/// </summary>
/// <param name="defaultBaseHeroStat">기본 영웅 스탯</param>
/// <param name="round">현재 라운드</param>
public void Setup(HeroBaseStat defaultBaseHeroStat, int round)

/// <summary>
/// HP 변경 시 호출됩니다.
/// 이벤트를 발생시키고 사망 체크를 수행합니다.
/// </summary>
private void OnHealthPointChanged()

/// <summary>
/// 경직 포인트 변경 시 호출됩니다.
/// </summary>
private void OnStiffnessChanged()

/// <summary>
/// 히트 처리 시 호출됩니다.
/// </summary>
/// <param name="hitInfo">히트 정보</param>
/// <returns>히트 결과</returns>
private HitBoxHandler.HitResult OnHit(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 자세를 변경합니다.
/// </summary>
/// <param name="stance">변경할 자세</param>
public void ChangeStance(IHeroStatus.Stance stance)

/// <summary>
/// 히트 정보를 모든 클라이언트에 동기화하는 RPC
/// </summary>
[Rpc(RpcSources.All, RpcTargets.All)]
private void RPC_UpdateHitInfo(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 자세를 업데이트합니다.
/// </summary>
private void UpdateStance(IHitEvent.HitInfo.HitterState hitterState)

/// <summary>
/// 경직 포인트를 업데이트합니다.
/// </summary>
private void UpdateStiffness(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 경직 포인트를 모든 클라이언트에 동기화하는 RPC
/// </summary>
[Rpc(RpcSources.All, RpcTargets.All)]
private void RPC_UpdateStiffnessPoint(int stiffnessPoint , bool executeLocal)

/// <summary>
/// 데미지를 적용합니다.
/// </summary>
/// <param name="damage">적용할 데미지</param>
public void ApplyDamage(int damage)

/// <summary>
/// HP를 모든 클라이언트에 동기화하는 RPC
/// </summary>
[Rpc(RpcSources.All, RpcTargets.All)]
private void RPC_UpdateHealthPoint(int healthPoint , bool executeLocal)

/// <summary>
/// HP를 설정합니다.
/// </summary>
public void SetHealthPoint(int hp, bool isSync = false)

/// <summary>
/// 경직도를 설정합니다.
/// </summary>
public void SetStiffnessPoint(int point, bool isSync = false)

/// <summary>
/// 상태 효과를 적용합니다.
/// </summary>
/// <param name="statusBoost">적용할 상태 효과</param>
public void ApplyStatusBoost(IHeroStatus.StatusBoost statusBoost)

/// <summary>
/// 상태 효과 적용 코루틴
/// 지정된 시간 동안 부스트 효과를 적용하고 자동으로 해제합니다.
/// </summary>
private IEnumerator CoUpdateStatusBoost(IHeroStatus.StatusBoost statusBoost)

/// <summary>
/// 상태 효과를 제거합니다.
/// </summary>
private void RemoveStatusBoost(IHeroStatus.StatusBoost.BoostType statusBoost)

/// <summary>
/// 현재 SP를 가져옵니다.
/// </summary>
public IHeroStatus.SpecialPoint GetSp() => new IHeroStatus.SpecialPoint(_specialPoint, _heroBaseStat.maxSpecialPoint);

/// <summary>
/// SP를 변경합니다.
/// </summary>
public void ChangeSpecialPoint(int point)

/// <summary>
/// 적용 중인 상태 효과 목록을 가져옵니다.
/// </summary>
public HashSet<IHeroStatus.StatusBoost> GetStatusBoosts() => _statusBoosts;

/// <summary>
/// 현재 경직도를 가져옵니다.
/// </summary>
public IHeroStatus.StiffnessPoint GetStiffnessPoint() => new IHeroStatus.StiffnessPoint(_stiffnessPoint, _heroBaseStat.maxStiffnessPoint);

/// <summary>
/// 공격 상태를 설정합니다.
/// </summary>
public void SetAttackState(bool attackState)

/// <summary>
/// 가드 상태를 설정합니다.
/// </summary>
public void SetGuardState(bool state)

/// <summary>
/// 무적 상태를 설정합니다.
/// </summary>
public void SetInvincibleState(bool state)

/// <summary>
/// 히트 결과를 첨부합니다.
/// </summary>
public void AttachHitResult(HitBoxHandler.HitResult hitResult)

/// <summary>
/// 히트 결과를 모든 클라이언트에 동기화하는 RPC
/// </summary>
[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_AttachHitResult(int applyDamage, int healPoint)
```

## 코드 스니펫
### 상태 초기화
```csharp
public void Setup(HeroBaseStat defaultBaseHeroStat, int round)
{
    _heroBaseStat = defaultBaseHeroStat;
    ClearHitData();
    
    // HP 초기화
    _healthPoint = _heroBaseStat.maxHealthPoint;
    OnHealthPointChanged();

    // 경직도 초기화
    _stiffnessPoint = 0;
    OnStiffnessChanged();
    
    // 기타 상태 초기화
    CurrentStance = IHeroStatus.Stance.StandUp;
    SetFocusState(false);
    AttackState = false;
    GuardState = false;
    InvincibleState = false;
}
```

### 상태 효과 시스템
```csharp
public void ApplyStatusBoost(IHeroStatus.StatusBoost statusBoost)
{
    Coroutine coroutine;
    // 이미 동일한 타입의 부스트가 적용 중이면 갱신
    if (_statusBoosts.Any(boost => boost.boostType == statusBoost.boostType))
    {
        if (_activeStatusBoostCoroutines.TryGetValue(statusBoost.boostType, out coroutine))
        {
            Debug.Log($"#UpdateStatusBoost {statusBoost.boostType}");
            StopCoroutine(coroutine);
        }
        else
        {
            _activeStatusBoostCoroutines.Add(statusBoost.boostType, null);
        }
    }
    else
    {
        _statusBoosts.Add(statusBoost);
    }

    // 새로운 부스트 코루틴 시작
    coroutine = StartCoroutine(CoUpdateStatusBoost(statusBoost));
    _activeStatusBoostCoroutines[statusBoost.boostType] = coroutine;
    
    Debug.Log($"#ApplyStatusBoost {statusBoost.boostType} {statusBoost.boostValue} {statusBoost.boostDuration}");
    OnStatusBoostChanged?.Invoke(statusBoost.boostType, StatusBoostStarted);
}

private IEnumerator CoUpdateStatusBoost(IHeroStatus.StatusBoost statusBoost)
{
    // 부스트 효과 적용
    switch (statusBoost.boostType)
    {
        case IHeroStatus.StatusBoost.BoostType.GrowPower :
            var boostedPower = Mathf.RoundToInt(_heroBaseStat.power * statusBoost.boostValue);
            Debug.Log($"#Apply Power Boost {_heroBaseStat.power} => {boostedPower}");
            _heroBaseStat.ApplyPowerBoost(boostedPower);
            break;
        case IHeroStatus.StatusBoost.BoostType.GrowHealthPoint:
        case IHeroStatus.StatusBoost.BoostType.GrowSpeed:
                break;
    }
    
    // 지정된 시간 대기
    yield return new WaitForSeconds(statusBoost.boostDuration);
    
    // 부스트 효과 해제
    switch (statusBoost.boostType)
    {
        case IHeroStatus.StatusBoost.BoostType.GrowPower :
            _heroBaseStat.RevertPowerBoost();
            RemoveStatusBoost(IHeroStatus.StatusBoost.BoostType.GrowPower);
            break;
        case IHeroStatus.StatusBoost.BoostType.GrowHealthPoint:
        case IHeroStatus.StatusBoost.BoostType.GrowSpeed:
            break;
    }
}

private void RemoveStatusBoost(IHeroStatus.StatusBoost.BoostType statusBoost)
{
    var targetBoost = _statusBoosts.FirstOrDefault(boost => boost.boostType == statusBoost);
    if (targetBoost.boostType == IHeroStatus.StatusBoost.BoostType.None) return;
    _statusBoosts.Remove(targetBoost);
    
    StopCoroutine(_activeStatusBoostCoroutines[statusBoost]);
    _activeStatusBoostCoroutines[statusBoost] = null;
    
    Debug.Log($"#RemoveStatusBoost {statusBoost}");
    OnStatusBoostChanged?.Invoke(statusBoost, StatusBoostEnded);
}

public void ClearStatusBoosts()
{
    _statusBoosts.Clear();
    foreach (var activeStatusBoostCoroutine in _activeStatusBoostCoroutines)
    {
        StopCoroutine(activeStatusBoostCoroutine.Value);
        _activeStatusBoostCoroutines[activeStatusBoostCoroutine.Key] = null;
    }
    
    _heroBaseStat.RevertPowerBoost();
}
```

### 히트 처리
```csharp
public OnHitDelegate OnHitHandle => OnHit;

private HitBoxHandler.HitResult OnHit(IHitEvent.HitInfo hitInfo)
{
    int savedHealthPoint = _healthPoint;
    RPC_UpdateHitInfo(hitInfo);
    int applyDamage = savedHealthPoint - _healthPoint;
    return new HitBoxHandler.HitResult
    {
        ApplyDamage = applyDamage,
        HealthPoint = _healthPoint,
    };
}

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

private void UpdateStiffness(IHitEvent.HitInfo hitInfo)
{
    _stiffnessPoint = hitInfo.Stiffness;
    OnStiffnessChanged();
}
```

## 기능 설명
### 상태 관리 시스템
| 상태 | 타입 | 설명                           |
|------|------|------------------------------|
| HP | int | 생명력 (0 ~ maxHealthPoint)     |
| SP | int | 특수 포인트 (0 ~ maxSpecialPoint) |
| 경직 포인트 | int | 자세 변경 여부에 영향                 |
| 자세 | Stance | StandUp, Down, Stun 등        |
| 공격 상태 | bool | 현재 공격 중 여부                   |
| 가드 상태 | bool | 현재 가드 중 여부                   |
| 무적 상태 | bool | 피해 무효화 여부                    |
| 포커스 모드 | bool | 타겟 고정 모드                     |

### 상태 효과 타입
| 타입 | 효과 |
|------|------|
| GrowPower | 공격력 일시 증가 |
| GrowHealthPoint | 최대 생명력 일시 증가 |
| GrowSpeed | 이동 속도 일시 증가 |

### 이벤트 발생 조건
- **OnHpChanged**: HP가 변경될 때
- **OnDeath**: HP가 0 이하가 될 때
- **OnKill**: 적을 처치했을 때
- **OnSpChanged**: SP가 변경될 때
- **OnStiffnessPointChanged**: 경직 포인트가 변경될 때
- **OnStatusBoostChanged**: 상태 효과가 시작/종료될 때

### 네트워크 동기화 RPC
- `RPC_UpdateHealthPoint`: HP 동기화
- `RPC_UpdateStiffnessPoint`: 경직 포인트 동기화
- `RPC_UpdateHitInfo`: 히트 정보 동기화
- `RPC_SetFocusState`: 포커스 모드 동기화

## 의존성/상속 관계
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 상속받음
- [`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/IHeroStatus) 인터페이스 구현
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) 클래스로 피격 정보 및 자세 변경 호출
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat) 스크립터블 오브젝트를 통해 플레이어 스탯 설정 및 변경
- [`HitBoxHandler`](/docs/projects/rfist/HeroHitSystem/HitBoxHandler) 클래스에서 `OnHit` 메서드를 `OnHitHandle` 델리게이트를 통해 호출

## 사용 예시
#### [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)에서 상태 초기화 및 셋업
```csharp
private void UpdateAbility(BaseHeroAbility.BaseAbilityType abilityType)
{
    ...
    
    // 능력 설정
    _baseHeroAbility.Setup(networkHeroStatus, heroController.HeroObjectController, this, heroController.SkillEventNotifier);
    networkHeroStatus.Setup(_baseHeroAbility.GetHeroStat() , 0);
    ...
}

[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_ResetHero(int round)
{
    // 상태 초기화
    networkHeroStatus.Setup(_baseHeroAbility.GetHeroStat(), round);
    heroControllerStateHandler.ResetState();
    heroController.ResetFocusMode();
    heroAnimationController.StartMatch();
    
    // 첫 라운드인 경우 특수 게이지 초기화
    if (IsFirstRound(round)) networkHeroStatus.ChangeSpecialPoint(0);
}
```

#### 각 캐릭터별 `SkillManager`에서 `NetworkHeroStatus`의 SP로 궁극기 준비 상태 확인
```csharp
// BaseHeroAbility
public void UltimateSkill(NetworkHeroController.HeroInputSyncData syncData)
{
    if (baseSkillManager.IsUltimateAttackReady() == false) return;
    baseSkillManager.UltimateAttack(syncData);
    OnResetStiffnessRecovery();
}

// BaseSkillManager
public bool IsUltimateAttackReady()
{
    return OnUltimateAttackReady();
}

// RektorSkillManager
protected override bool OnUltimateAttackReady()
{
    var sp = HeroStatus.GetSp();
    if (sp.Current == sp.Max) return true;
    
    var result = new BaseHeroSkill.SkillFinishResult(ultimateAtk, BaseHeroSkill.SkillFinishResult.Fail.NotEnoughSp);
    SkillEventInvoker.NotifySkillEvents(skillEvent => skillEvent?.OnSkillFinished(result));
    return false;
}
```

#### `OnHitHandle` 델리게이트를 `HitHandler`에 셋팅
```csharp
// NetworkHeroObject
private void UpdateAbility(BaseHeroAbility.BaseAbilityType abilityType)
{
    ...
    // 능력 설정
    _baseHeroAbility.Setup(networkHeroStatus, heroController.HeroObjectController, this, heroController.SkillEventNotifier);
    networkHeroStatus.Setup(_baseHeroAbility.GetHeroStat() , 0);
    _baseHeroAbility.SetupHitBoxHandle(networkHeroStatus.OnHitHandle, networkHeroStatus);
    ...
}

// BaseHeroAbility
public void SetupHitBoxHandle(NetworkHeroStatus.OnHitDelegate hitDelegate, IHeroStatus heroStatus)
{
    hitBoxHandler.SetupHitBoxHandle(hitDelegate, heroStatus);
}

// HitBoxHandler
public void SetupHitBoxHandle(NetworkHeroStatus.OnHitDelegate hitDelegate, IHeroStatus heroStatus)
{
    _hitDelegate = hitDelegate;
    _heroStatus = heroStatus;
}

public HitResult OnHit(IHitEvent.HitInfo hitInfo)
{
    return _hitDelegate?.Invoke(hitInfo) ?? new HitResult();
}

```

## 관련 클래스
- [`IHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/IHeroStatus)
- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`HitBoxHandler`](/docs/projects/rfist/HeroHitSystem/HitBoxHandler)

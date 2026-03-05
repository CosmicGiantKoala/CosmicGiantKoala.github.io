+++
title = "IHeroStatus"
description = "영웅의 상태를 관리하는 인터페이스"
icon = "code"
date = "2026-02-23T21:48:37+09:00"
lastmod = "2026-02-23T21:48:37+09:00"
draft = false
toc = true
weight = 220
+++

## 개요

`IHeroStatus` 인터페이스는 RFist 게임에서 영웅 캐릭터의 모든 상태를 관리하는 핵심 인터페이스입니다.
생명력(HP), 특수 포인트(SP), 경직 포인트, 자세(Stance), 상태효과 등의 상태 정보를 제공하고,
상태 변경 시 발생하는 이벤트를 정의합니다.

## 역할
- 영웅의 생명력(HP) 관리 메서드 및 데미지 메서드 정의
- 특수 포인트(SP) 관리 메서드 정의
- 경직 포인트 관리 메서드 정의
- 영웅의 자세(StandUp, Down, Stun) 상태 관리 메서드 정의
- 공격/방어/무적 상태 관리 메서드 정의
- 상태효과(일시적 능력치 변경) 관리 메서드 정의
- 각각의 상태 변경 시 이벤트 정의

## 선언
```csharp
public interface IHeroStatus
```

## 멤버
### 중첩 구조체 및 중첩 열거형
```csharp
/// <summary>
/// 생명력 정보를 담는 구조체
/// </summary>
public struct HealthPoint
{
    public HealthPoint(int current, int max);
    public int Current { get; private set; }
    public int Max { get; private set; }
}

/// <summary>
/// 특수 포인트(SP) 정보를 담는 구조체
/// </summary>
public struct SpecialPoint
{
    public SpecialPoint(int current, int max);
    public int Current { get; private set; }
    public int Max { get; private set; }
}

/// <summary>
/// 경직 포인트 정보를 담는 구조체
/// </summary>
public struct StiffnessPoint
{
    public StiffnessPoint(int current, int max);
    public int Current { get; private set; }
    public int Max { get; private set; }
}

/// <summary>
/// 상태효과 정보를 담는 구조체
/// </summary>
public readonly struct StatusBoost : IEquatable<StatusBoost>
{
    public readonly BoostType boostType;
    public readonly float boostValue;
    public readonly float boostDuration;

    public StatusBoost(BoostType boostType, float boostValue, float boostDuration);
    public bool Equals(StatusBoost other);
}

/// <summary>
/// 영웅의 자세를 정의하는 열거형
/// </summary>
public enum Stance
{
    StandUp,
    Down,
    Stun
}

/// <summary>
/// 상태효과 타입을 정의하는 열거형
/// </summary>
public enum BoostType
{
    None = 0,
    GrowPower,
    GrowHealthPoint,
    GrowSpeed
}
```

### 델리게이트 및 이벤트
```csharp
/// <summary>
/// 생명력 변경 시 호출되는 델리게이트 및 이벤트
/// </summary>
/// <param name="healthPoint">변경된 생명력 정보</param>
public delegate void OnHpChange(HealthPoint healthPoint);
public event OnHpChange OnHpChanged;

/// <summary>
/// 적 혹은 플레이어 사망시 호출되는 델리게이트 및 이벤트
/// </summary>
public delegate void OnDeathDelegate();
public event OnDeathDelegate OnDeath;
public event OnDeathDelegate OnKill;

/// <summary>
/// 피해 입었을 때 호출되는 델리게이트 및 이벤트
/// </summary>
/// <param name="hitInfo">피해 정보</param>
public delegate void OnDamageDelegate(IHitEvent.HitInfo hitInfo);
public event OnDamageDelegate OnDamaged;

/// <summary>
/// 상태효과 변경 시 호출되는 델리게이트 및 이벤트
/// </summary>
/// <param name="type">변경된 부스트 타입</param>
/// <param name="active">활성화 여부</param>
public delegate void OnStatusBoostChange(StatusBoost.BoostType type, bool active);
public event OnStatusBoostChange OnStatusBoostChanged;

/// <summary>
/// SP 변경 시 호출되는 델리게이트 및 이벤트
/// </summary>
/// <param name="specialPoint">변경된 SP 정보</param>
public delegate void OnSpChange(SpecialPoint specialPoint);
public event OnSpChange OnSpChanged;

/// <summary>
/// 경직 포인트 변경 시 호출되는 델리게이트 및 이벤트
/// </summary>
/// <param name="stiffnessPoint">변경된 경직 포인트 정보</param>
public delegate void OnStiffnessPointChange(StiffnessPoint stiffnessPoint);
public event OnStiffnessPointChange OnStiffnessPointChanged;
```

### 속성
```csharp
/// <summary>
/// 현재 자세를 반환합니다.
/// </summary>
public Stance CurrentStance { get; }

/// <summary>
/// 공격 상태 여부를 반환합니다.
/// </summary>
public bool AttackState { get; }

/// <summary>
/// 방어 상태 여부를 반환합니다.
/// </summary>
public bool GuardState { get; }

/// <summary>
/// 무적 상태 여부를 반환합니다.
/// </summary>
public bool InvincibleState { get; }
```

### 메서드

```csharp
/// <summary>
/// 데미지를 적용합니다.
/// </summary>
/// <param name="damage">적용할 데미지량</param>
public void ApplyDamage(int damage);

/// <summary>
/// 현재 생명력 정보를 반환합니다.
/// </summary>
/// <returns>현재 생명력 정보</returns>
public HealthPoint GetHp();

/// <summary>
/// 생명력을 설정합니다.
/// </summary>
/// <param name="hp">설정할 생명력 값</param>
/// <param name="isSync">네트워크 동기화 여부</param>
public void SetHealthPoint(int hp, bool isSync = false);

/// <summary>
/// 자세를 변경합니다.
/// </summary>
/// <param name="stance">변경할 자세</param>
public void ChangeStance(Stance stance);

/// <summary>
/// 상태효과를 적용합니다.
/// </summary>
/// <param name="statusBoost">적용할 상태효과</param>
public void ApplyStatusBoost(StatusBoost statusBoost);

/// <summary>
/// 현재 적용된 모든 상태효과를 반환합니다.
/// </summary>
/// <returns>상태효과 집합</returns>
public HashSet<StatusBoost> GetStatusBoosts();

/// <summary>
/// 모든 상태효과를 초기화합니다.
/// </summary>
public void ClearStatusBoosts();

/// <summary>
/// 현재 SP 정보를 반환합니다.
/// </summary>
/// <returns>현재 SP 정보</returns>
public SpecialPoint GetSp();

/// <summary>
/// SP를 변경합니다.
/// </summary>
/// <param name="point">변경할 SP량</param>
public void ChangeSpecialPoint(int point);

/// <summary>
/// 현재 경직 포인트 정보를 반환합니다.
/// </summary>
/// <returns>현재 경직 포인트 정보</returns>
public StiffnessPoint GetStiffnessPoint();

/// <summary>
/// 경직 포인트를 설정합니다.
/// </summary>
/// <param name="point">설정할 경직 포인트 값</param>
/// <param name="isSync">네트워크 동기화 여부</param>
public void SetStiffnessPoint(int point, bool isSync = false);

/// <summary>
/// 공격 상태를 설정합니다.
/// </summary>
/// <param name="state">설정할 상태</param>
public void SetAttackState(bool state);

/// <summary>
/// 방어 상태를 설정합니다.
/// </summary>
/// <param name="state">설정할 상태</param>
public void SetGuardState(bool state);

/// <summary>
/// 무적 상태를 설정합니다.
/// </summary>
/// <param name="state">설정할 상태</param>
public void SetInvincibleState(bool state);

/// <summary>
/// 피격 정보를 적용합니다
/// </summary>
/// <param name="hitResult">히트 결과</param>
public void AttachHitResult(HitBoxHandler.HitResult hitResult);
```


## 기능 설명
### 상태 관리 시스템
- **생명력(HP) 관리**: 현재/최대 생명력 추적, 데미지 적용, 사망 처리
- **SP 관리**: 필살기 사용에 필요한 포인트 관리
- **경직 포인트**: 공격을 받을 때 쌓이는 경직 게이지 관리
- **자세(Stance)**: StandUp(서있음), Down(다운), Stun(스턴) 3가지 상태 관리
- **전투 상태**: 공격 중, 방어 중, 무적 상태 관리
- **상태효과**: 일시적인 능력치 증가 효과 관리

### 이벤트 시스템
- `OnHpChanged`: 생명력 변화 시 UI 업데이트 등에 사용
- `OnDamaged`: 피해 효과, 히트 스톱 등에 사용
- `OnDeath`/`OnAfterDeath`: 사망 처리, 게임 오버 등에 사용
- `OnStatusBoostChanged`: 상태 효과 발생/제거시 효과 적용 및 UI 표시에 사용

## 의존성/상속 관계
- 구현 클래스
  - [`NetworkHeroStatus`](/docs/projects/rfist/heronetworksystem/networkherostatus) 클래스에서 네트워크 환경에서의 상태 관리 구현
- [`HitBoxHandler`](/docs/projects/rfist/herohitsystem/hitboxhandler) 클래스의 [`IHitEvent`](/docs/projects/rfist/herohitsystem/ihitevent)를 통해 피해 이벤트 정보 전달
- `HealthPoint`, `SpecialPoint`, `StiffnessPoint`, `StatusBoost` 중첩 구조체 및 `Stance`, `BoostType` 중첩 열거형 정의

## 사용 예시
#### `HeroCanvasView`(HUD)에서 영웅의 체력 변경 시 HUD 정보를 수정
```csharp
private NetworkHeroObject heroObject;

private void OnEnable()
{
    heroObject.GetHeroStatus().OnHpChanged += OnHpChanged;
    ...
}

private void OnHpChanged(IHeroStatus.HealthPoint healthPoint)
{
    if (teamAHpGaugeImage.gameObject.activeSelf)
    {
        teamAHpGaugeImage.fillAmount = (float)healthPoint.Current / healthPoint.Max;
    }
    else
    {
        teamBHpGaugeImage.fillAmount = (float)healthPoint.Current / healthPoint.Max;
    }
}
```

#### `BaseHeroAttackSkill`에서 영웅의 공격이 적 히트시 관련 상태 정보를 수정 및 피격결과 전달
```csharp
// BaseHeroSkill에서 정의됨
protected IHeroStatus HeroStatus;

private void OnHitBoxDetected(Collider col, Transform targetTransform, HitBoxHandler hitHandler)
{
    ...
    // 적이 히트 가능한 상태 체크
    if (!hitHandler.CanHit(hitInfo)) return;
    
    OnHitInvoke?.Invoke(hitInfo);
    
    // 적 히트시 SP를 획득
    var spPoint = HeroStatus.GetSp().Current;
    var spGain = damageResult * SpecialPointGainFactor;
    HeroStatus.ChangeSpecialPoint((int)(spPoint + spGain));
    
    // hitHandler를 통해 HitResult를 반환받고 IHeroStatus로 전달 
    var hitResult = hitHandler.OnHit(hitInfo);
    HeroStatus.AttachHitResult(hitResult);
    ...
}
```

#### `RektorSkillManager`(영웅별 스킬매니저)에서 공격이 시작 될 때 공격 상태를 변환
```csharp
private void OnAttackStart(BaseHeroSkill.SkillStartResult skillStartResult)
{
    // 영웅의 방향키가 눌려있는 경우 해당 방향으로 공격
    if (MoveInputDir != Vector2.zero) HeroController.LookAt(new Vector3(MoveInputDir.x, 0, MoveInputDir.y));
    // 타겟팅 보정
    HeroController.FindAndLookTarget(_currentSkill.AutoTargetingDistance, _currentSkill.AutoTargetingAngle);
    // 스킬 발동 이벤트 호출
    SkillEventInvoker.NotifySkillEvents(skillEvent => skillEvent?.OnSkill(skillStartResult));
    // 공격상태로 전환
    HeroStatus.SetAttackState(true);
}
```

## 관련 클래스
- [`NetworkHeroStatus`](/docs/projects/rfist/heronetworksystem/networkherostatus)
- [`IHitEvent`](/docs/projects/rfist/herohitsystem/ihitevent)
- [`HitBoxHandler`](/docs/projects/rfist/herohitsystem/hitboxhandler)

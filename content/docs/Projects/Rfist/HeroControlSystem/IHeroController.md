+++
title = "IHeroController"
description = "영웅 캐릭터의 이동 및 제어 기능을 정의하는 인터페이스"
icon = "code"
date = "2025-03-06T20:39:00+09:00"
lastmod = "2025-03-06T20:39:00+09:00"
draft = false
toc = true
weight = 206
+++

## 개요

`IHeroController` 인터페이스는 RFist 게임의 영웅 캐릭터 이동 및 제어 기능을 정의합니다.
DoTween 기반의 물리법칙 없는 이동, 넉백, 대시, 타겟팅 등의 핵심 기능을 제공하며,
[`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) 클래스가 이 인터페이스를 구현합니다.

## 역할
- 영웅 캐릭터의 이동 기능 계약 정의
- DoTween 기반 절대/상대 이동 인터페이스 제공
- 넉백 및 대시 기능 표준화
- 자동 타겟팅 및 방향 전환 기능 정의
- 동작 중인 Tween 기반 동작 취소 기능 정의

## 선언
```csharp
public interface IHeroController
```

## 멤버
### 메서드
```csharp
/// <summary>
/// DoTween을 이용해 캐릭터를 물리법칙 없이 지정된 방향으로 절대 이동
/// </summary>
/// <param name="distance">이동 거리. DoMove(forward * distance, time)에서 사용</param>
/// <param name="time">이동 시간(초). DoMove(forward * distance, time)에서 사용</param>
/// <param name="direction">이동할 방향 벡터</param>
public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction);

/// <summary>
/// DoTween을 이용해 캐릭터를 물리법칙 없이 상대 방향으로 이동
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간(초)</param>
/// <param name="direction">상대 방향 벡터</param>
public void MoveToRelativeDirection(float distance, float time, Vector3 direction);

/// <summary>
/// DoTween을 사용하여 넉백 처리
/// </summary>
/// <param name="attackerPos">공격자 위치. 넉백은 플레이어 기준 공격자의 반대 방향으로 발생</param>
/// <param name="force">적용할 넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force);

/// <summary>
/// 대시 이동 실행
/// </summary>
/// <param name="distance">대시 거리</param>
/// <param name="time">대시 시간(초)</param>
/// <param name="direction">대시 방향</param>
public void Dash(float distance, float time, Vector3 direction);

/// <summary>
/// 현재 진행 중인 이동 동작 취소
/// </summary>
public void OnCancel();

/// <summary>
/// Rigidbody의 현재 회전값 가져오기
/// </summary>
/// <returns>현재 회전값(Quaternion)</returns>
public Quaternion GetRigidbodyRotation();

/// <summary>
/// 주변에서 가장 가까운 타겟을 찾아 바라보기
/// </summary>
/// <param name="autoTargetingDistance">자동 타겟팅 최대 거리</param>
/// <param name="autoTargetingAngle">자동 타겟팅 각도 범위</param>
public void FindAndLookTarget(float autoTargetingDistance, int autoTargetingAngle);

/// <summary>
/// 주변에서 가장 가까운 타겟 찾기
/// </summary>
/// <param name="autoTargetingDistance">타겟 감지 거리</param>
/// <param name="autoTargetingAngle">타겟 감지 각도 범위</param>
/// <param name="targetTransform">찾은 타겟의 Transform (출력 파라미터)</param>
/// <returns>타겟 찾기 성공 여부</returns>
public bool FindTarget(float autoTargetingDistance, int autoTargetingAngle, out Transform targetTransform);

/// <summary>
/// 특정 Transform을 바라볼도록 회전
/// </summary>
/// <param name="targetPosition">바라볼 대상의 Transform</param>
public void LookAt(Transform targetPosition);

/// <summary>
/// 특정 방향을 바라볼도록 회전
/// </summary>
/// <param name="targetDirection">바라볼 방향 벡터</param>
public void LookAt(Vector3 targetDirection);
```

## 기능 설명
### 이동 기능 정의
- **절대 이동 (`MoveToAbsoluteDirection`)**: 월드 좌표계 기준으로 지정된 방향으로 이동
- **상대 이동 (`MoveToRelativeDirection`)**: 캐릭터의 현재 방향 기준으로 상대적인 방향으로 이동
- **넉백(`KnockBack`)**: 공격자 기준 반대 방향으로 이동

### 회전 기능 정의
- **타겟 서칭(`FindTarget`)**: 조건(거리, 각도)에 맞는 타겟을 찾아 반환
- **타겟 방향으로 회전(`FindAndLookTarget`)**: 타겟을 찾아 즉시 바라보기
- **특정 방향으로 회전(`LookAt`)**: 특정 위치나 방향을 바라볼 수 있도록 회전

## 의존성/상속 관계
- 구현 클래스
  - [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) IHeroController의 구현체로, 모든 메서드를 구현
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)에서 HeroController를 통해 간접적으로 사용
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)를 상속받는 클래스들이 피격, 넉백과 관련된 제어가 필요할 때 사용
- `BaseHeroSkill`를 상속받는 클래스들이 스킬과 관련된 제어가 필요할 때 사용

## 사용 예시
#### `BaseHeroAbility`를 상속한 캐릭터 어빌리티 클래스에서 넉백 이동에 사용
```csharp
// MaiAbility.cs
private IHeroController _heroController;

protected override void OnHit(IHitEvent.HitInfo hitInfo)
{
    if (hitInfo.HitterInfo.InvincibleState)
    {
        PlayTrailEffect();
        return;
    }
    
    if (hitInfo.HitterInfo.GuardState)
    {
        OnGuard(hitInfo);
        SetupStiffnessRoutine();
    }
    else
    {
        var hitEffect = GetHitEffectType(hitInfo);
        var effect = FindEffect(hitEffect);
        if (effect is not null)
        {
            PlayEffect(effect, hitInfo);
            PlaySoundEffect(effect);
        }

        var spPoint = _heroStatus.GetSp().Current;
        _heroStatus.ChangeSpecialPoint(spPoint + hitInfo.Damage);
        _heroStatus.ApplyDamage(hitInfo.Damage);
        SetupStiffnessRoutine();
        _skillManager.Hit(hitInfo);
    }
    
    if (_heroObjectInfo.IsRemote()) return;
    _heroController.KnockBack(hitInfo.AttackerPos, hitInfo.KnockBackPower);
}
```

#### `BaseSkillManager`를 상속한 캐릭터 스킬매니저 클래스에서 공격 대상 타겟팅시 사용
```csharp
//MaiSkillManager.cs
protected IHeroController HeroController;

private void OnAttackStart(BaseHeroSkill.SkillStartResult skillStartResult)
{
    if (MoveInputDir == Vector2.zero)
    {
        if (_currentSkill != null && _currentSkill.AutoTargeting && HeroObjectInfo.IsRemote() == false)
        {
            HeroController.FindAndLookTarget(_currentSkill.AutoTargetingDistance, _currentSkill.AutoTargetingAngle);
        }
    }
    else
    {
        HeroController.LookAt(new Vector3(MoveInputDir.x, 0, MoveInputDir.y));
    }
    SkillEventInvoker.NotifySkillEvents(skillEvent => skillEvent?.OnSkill(skillStartResult));
    HeroStatus.SetAttackState(true);
}
```

#### 'BaseHeroSkill'를 상속한 캐릭터 스킬 클래스에서 다양한 용도로 사용
```csharp
1. 공격스킬 사용 시 스킬의 이동 동작 수행
// BaseHeroAttackSkill.cs
protected IHeroController HeroController;
/// <summary>
/// 스킬 이동을 수행합니다.
/// </summary>
private void OnSkillMovement()
{
    _canMove = false;
    if (_characterMovement.direction == CharacterMovement.Direction.Forward)
    {
        HeroController.MoveToRelativeDirection(
            _characterMovement.moveDistance, 
            _characterMovement.moveToDistanceTime, 
            Vector3.forward);
    }
}

2. 피격, 캔슬등 스킬 취소시 이동 동작 취소
// BaseHeroAttackSkill.cs
protected IHeroController HeroController;

/// <summary>
/// 피격, 혹은 외부적 요인으로 스킬 캔슬시 호출
/// </summary>
protected override void SkillCancellationByExternal()
{
    HeroController.OnCancel();
    var result = new SkillFinishResult(this, SkillFinishResult.Fail.CancellationByExternal);
    OnFinishSkill?.Invoke(result);
}

/// <summary>
/// 스킬캔슬 등을 통한 스킬 캔슬시 호출
/// </summary>
protected override void SkillCancellationBySelf()
{
    HeroController.OnCancel();
    var result = new SkillFinishResult(this, SkillFinishResult.Fail.SelfCancellation);
    OnFinishSkill?.Invoke(result);
}

3. 대시(혹은 다른 이동기) 스킬 사용시 이동 동작 호출시 사용
// DashSkill.cs
protected IHeroController HeroController;

private void ExecuteDash(Vector3 direction)
{
    var data = skillData.FirstOrDefault(data => data.SkillId == GetSkillId());
    if (data == null) return;
    var movement = data.GetCharacterMovement();

    HeroController.Dash(movement.moveDistance, movement.moveToDistanceTime, direction);

    PlayDashEffect(data);
}
```

## 관련 클래스
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- `BaseHeroSkill`
- `BaseSkillManager`
- `BaseHeroAttackSkill`

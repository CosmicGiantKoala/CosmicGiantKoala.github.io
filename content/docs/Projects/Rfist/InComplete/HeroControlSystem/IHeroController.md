+++
title = "IHeroController"
description = "영웅 캐릭터의 이동 및 제어 기능을 정의하는 인터페이스"
icon = "code"
date = "2025-03-06T20:39:00+09:00"
lastmod = "2025-03-06T20:39:00+09:00"
draft = false
toc = true
weight = 210
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

## 선언

```csharp
/// <summary>
/// 영웅 캐릭터의 이동 및 제어 기능을 정의하는 인터페이스
/// DoTween 기반 이동, 넉백, 대시, 타겟팅 등의 기능을 제공합니다.
/// </summary>
public interface IHeroController
```

## 멤버

### 메서드

#### 이동

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
```

#### 넉백 및 대시

```csharp
/// <summary>
/// RigidBody.AddForce를 통해 Hero를 넉백시킴
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
```

#### 제어

```csharp
/// <summary>
/// 현재 진행 중인 이동 동작 취소
/// </summary>
public void OnCancel();

/// <summary>
/// Rigidbody의 현재 회전값 가져오기
/// </summary>
/// <returns>현재 회전값(Quaternion)</returns>
public Quaternion GetRigidbodyRotation();
```

#### 타겟팅

```csharp
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

### 이동 시스템

`IHeroController`는 두 가지 이동 방식을 제공합니다:

- **절대 이동 (`MoveToAbsoluteDirection`)**: 월드 좌표계 기준으로 지정된 방향으로 이동
- **상대 이동 (`MoveToRelativeDirection`)**: 캐릭터의 현재 방향 기준으로 상대적인 방향으로 이동

두 이동 방식 모두 DoTween을 사용하여 물리 엔진의 영향 없이 부드러운 이동을 구현합니다.

### 넉백 시스템

`KnockBack` 메서드는 RigidBody의 AddForce를 사용하여 물리 기반 넉백을 구현합니다:
- 공격자 위치를 기준으로 반대 방향으로 넉백 발생
- 지정된 힘(force)만큼 impulse 타입으로 힘 적용

### 타겟팅 시스템

자동 타겟팅 기능을 통해 전투 중 적을 자동으로 감지하고 바라볼 수 있습니다:
- `FindTarget`: 조건(거리, 각도)에 맞는 타겟을 찾아 반환
- `FindAndLookTarget`: 타겟을 찾아 즉시 바라보기
- `LookAt`: 특정 위치나 방향을 바라볼 수 있도록 회전

## 의존성/상속 관계

### 구현 클래스
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController): IHeroController의 주요 구현체로, 모든 메서드를 구현

### 사용 위치
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController): HeroController를 통해 간접적으로 사용
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController): 실제 이동 로직을 처리하고 HeroController에서 호출
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility): 스킬 실행 중 이동 제어가 필요할 때 사용

## 사용 예시

### HeroController에서 IHeroController 구현

```csharp
/// <summary>
/// IHeroController를 구현하는 HeroController 클래스 예시
/// </summary>
public class HeroController : MonoBehaviour, IHeroController
{
    [SerializeField] private BaseHeroMoveController heroMoveController;
    [SerializeField] private AutoTargeting autoTargetingComponent;

    /// <summary>
    /// DoTween을 이용한 절대 방향 이동 구현
    /// </summary>
    public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)
    {
        heroMoveController.MoveToAbsoluteDirection(distance, time, direction);
    }

    /// <summary>
    /// DoTween을 이용한 상대 방향 이동 구현
    /// </summary>
    public void MoveToRelativeDirection(float distance, float time, Vector3 direction)
    {
        heroMoveController.MoveToRelativeDirection(distance, time, direction);
    }

    /// <summary>
    /// RigidBody.AddForce를 통한 넉백 구현
    /// </summary>
    public void KnockBack(Vector3 attackerPos, float force)
    {
        heroMoveController.KnockBack(attackerPos, force);
    }

    /// <summary>
    /// 대시 이동 구현 (포커스 모드 여부에 따라 분기)
    /// </summary>
    public void Dash(float distance, float time, Vector3 direction)
    {
        if (_isFocusMode)
        {
            MoveToRelativeDirection(distance, time, direction);
        }
        else
        {
            if (direction == Vector3.zero)
            {
                MoveToRelativeDirection(distance, time, Vector3.forward);
            }
            else
            {
                heroMoveController.LookAt(direction);
                MoveToRelativeDirection(distance, time, Vector3.forward);
            }
        }
    }

    /// <summary>
    /// 타겟 찾기 및 바라보기
    /// </summary>
    public void FindAndLookTarget(float autoTargetingDistance = 0, int autoTargetingAngle = 0)
    {
        if (_isLocalPlayer == false) return;
        if (FindTarget(autoTargetingDistance, autoTargetingAngle, out var target))
        {
            LookAt(target);
        }
    }

    /// <summary>
    /// 타겟 찾기 구현
    /// </summary>
    public bool FindTarget(float targetDistanceRange, int targetAngleRange, out Transform target)
    {
        return autoTargetingComponent.FindTarget(targetAngleRange, targetAngleRange, out target);
    }

    /// <summary>
    /// 특정 방향 바라보기
    /// </summary>
    public void LookAt(Vector3 direction)
    {
        heroMoveController.LookAt(direction);
    }

    /// <summary>
    /// 특정 타겟 바라보기
    /// </summary>
    public void LookAt(Transform target)
    {
        heroMoveController.LookAt(target);
    }

    /// <summary>
    /// Rigidbody 회전값 가져오기
    /// </summary>
    public Quaternion GetRigidbodyRotation()
    {
        return heroMoveController.GetRigidbodyRotation();
    }

    /// <summary>
    /// 이동 취소
    /// </summary>
    public void OnCancel()
    {
        heroMoveController.Cancel();
    }
}
```

### BaseHeroAbility에서 IHeroController 사용

```csharp
/// <summary>
/// BaseHeroAbility에서 HeroController의 이동 기능을 사용하는 예시
/// </summary>
public abstract class BaseHeroAbility : MonoBehaviour
{
    protected IHeroController _heroController;

    /// <summary>
    /// 스킬 실행 중 대시 이동
    /// </summary>
    protected void SkillDash(float distance, float time, Vector3 direction)
    {
        _heroController.Dash(distance, time, direction);
    }

    /// <summary>
    /// 공격 시 타겟 방향으로 회전
    /// </summary>
    protected void FaceTarget(Transform target)
    {
        _heroController.LookAt(target);
    }

    /// <summary>
    /// 피격 시 넉백 처리
    /// </summary>
    public void ApplyKnockBack(Vector3 attackerPos, float force)
    {
        _heroController.KnockBack(attackerPos, force);
    }
}
```

## 관련 클래스

- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`BaseHeroMoveController`](/docs/projects/rfist/HeroControlSystem/BaseHeroMoveController)
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`AutoTargeting`](/docs/projects/rfist/HeroControlSystem/AutoTargeting)

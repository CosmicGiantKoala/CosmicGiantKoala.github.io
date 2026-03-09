+++
title = "BaseHeroMoveController"
description = "영웅 이동 제어의 기반 추상 클래스"
icon = "code"
date = "2025-03-06T20:43:00+09:00"
lastmod = "2025-03-06T20:43:00+09:00"
draft = false
toc = true
weight = 220
+++

## 개요

`BaseHeroMoveController` 클래스는 RFist 게임의 영웅 이동 제어를 위한 기반 추상 클래스입니다.
Rigidbody 기반([`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)), KCC(`HeroSimpleKccController`) 등 다양한 이동 구현체의 공통 인터페이스를 제공하며, 템플릿 메서드 패턴을 통해 구체적인 이동 로직은 하위 클래스에서 구현하도록 합니다.

## 역할
- 다양한 이동 구현체([`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController), `HeroSimpleKccController` 등)의 공통 인터페이스 제공
- 이동, 회전, 순간 이동, 넉백 등의 기본 동작 정의
- 템플릿 메서드 패턴을 통한 구현체 확장 지원
- 이동 관련 이벤트 발행 및 상태 관리

## 선언
```csharp
[DisallowMultipleComponent]
public abstract class BaseHeroMoveController : MonoBehaviour
```

## 멤버
### 속성
```csharp
/// <summary>
/// 컨트롤러 상태 인터페이스
/// </summary>
protected IControllerState ControllerState;

/// <summary>
/// 영웅 오브젝트 정보 인터페이스
/// </summary>
protected IHeroObjectInfo HeroObjectInfo;

/// <summary>
/// 영웅 기본 능력치
/// </summary>
protected HeroBaseStat HeroBaseStat;
```

### 메서드
```csharp
/// <summary>
/// 일반 이동 처리
/// </summary>
/// <param name="deltaTime">델타 타임</param>
/// <param name="turnDirection">전환 방향 (기본값: default)</param>
public void Move(float horizontal, float vertical, float deltaTime, Vector2 targetDirection = default)
protected abstract void OnMove(Vector2 moveDirection, float deltaTime, Vector2 turnDirection = default);

/// <summary>
/// 절대 방향 이동 처리
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (월드 좌표계)</param>
public void MoveToAbsoluteDirection(float distance, float time, Vector3 direction)
protected abstract void OnMoveToAbsoluteDirection(float distance, float time, Vector3 direction);

/// <summary>
/// 상대 방향 이동 처리
/// </summary>
/// <param name="distance">이동 거리</param>
/// <param name="time">이동 시간</param>
/// <param name="direction">이동 방향 (로컬 좌표계)</param>
public void MoveToRelativeDirection(float distance, float time, Vector3 direction)
protected abstract void OnMoveToRelativeDirection(float distance, float time, Vector3 direction);

/// <summary>
/// 넉백 처리
/// </summary>
/// <param name="attackerPos">공격자 위치</param>
/// <param name="force">넉백 힘</param>
public void KnockBack(Vector3 attackerPos, float force)
protected abstract void OnKnockBack(Vector3 attackerPos, float force);

/// <summary>
/// 특정 트랜스폼을 바라볼도록 회전
/// </summary>
/// <param name="targetPosition">바라볼 대상 트랜스폼</param>
public void LookAt(Transform skillResultHitTransform)
protected abstract void OnLookAt(Transform targetPosition);

/// <summary>
/// 특정 방향을 바라볼도록 회전
/// </summary>
/// <param name="targetDirection">바라볼 방향 벡터</param>
public void LookAt(Vector3 targetDirection)
protected abstract void OnLookAt(Vector3 targetDirection);

/// <summary>
/// 현재 회전값 가져오기
/// </summary>
/// <returns>현재 회전값(Quaternion)</returns>
public Quaternion GetRigidbodyRotation()
protected abstract Quaternion GetRotation();

/// <summary>
/// 순간 이동 처리
/// </summary>
/// <param name="position">이동할 위치</param>
/// <param name="rotation">설정할 회전값</param>
public void SetPositionAndRotation(Vector3 position, Quaternion rotation)
protected abstract void OnTeleport(Vector3 position, Quaternion rotation);

/// <summary>
/// 트윈 이동 취소 (구현체에서 재정의)
/// </summary>
public void Cancel()
protected abstract void OnCancelTween();

/// <summary>
/// 이동 컨트롤러 초기 설정
/// </summary>
/// <param name="controllerState">컨트롤러 상태 인터페이스</param>
/// <param name="heroObjectInfo">영웅 오브젝트 정보</param>
/// <param name="heroBaseStat">영웅 기본 능력치</param>
public void Setup(IControllerState controllerState, IHeroObjectInfo heroObjectInfo, HeroBaseStat heroBaseStat)
protected abstract void _Setup();

/// <summary>
/// 컨트롤러 활성화/비활성화 설정
/// </summary>
/// <param name="isActive">활성화 여부</param>
protected abstract void _SetActive(bool isActive);
public void SetActive(bool isActive)
```

## 코드 스니펫
### 초기 설정 흐름
```csharp
public void Setup(IControllerState controllerState, IHeroObjectInfo heroObjectInfo, HeroBaseStat heroBaseStat)
{
    // 의존성 주입
    ControllerState = controllerState;
    HeroObjectInfo = heroObjectInfo;
    HeroBaseStat = heroBaseStat;
    
    // 구현체별 추가 설정 호출
    _Setup();
}
```

## 기능 설명
### 이동 유형

| 이동 유형 | 메서드 | 설명 |
|----------|--------|------|
| 일반 이동 | `Move` | 입력값 기반의 기본 이동 |
| 절대 이동 | `MoveToAbsoluteDirection` | 월드 좌표계 기준 이동 |
| 상대 이동 | `MoveToRelativeDirection` | 로컬 좌표계 기준 이동 |
| 넉백 | `KnockBack` | 물리 기반 넉백 |
| 순간 이동 | `SetPositionAndRotation` | 위치/회전 즉시 변경 |

## 의존성/상속 관계
### 상속/구현
- `MonoBehaviour`를 상속 받음
- 구현 클래스
  - [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController) 클래스에서 이동 구현
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState) 인터페이스를 통해 컨트롤러 상태 정보 확인
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat) 클래스에서 영웅 기본 능력치 정보 확인
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) 클래스에서 이동 제어
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) 클래스에서 스킬 실행 중 이동 제어

## 사용 예시
#### [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)에서 이동 명령 호출
```csharp
private BaseHeroMoveController heroMoveController;

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
        ...
    }
}
```

#### `DualMatchPresenter`에서 라운드 초기화 및 영웅 리셋시 초기 위치로 영웅 텔레포트
```csharp
// DualMatchPresenter
private HeroSystem heroSystem;

private void SetupLocalPlayer()
{
    var spawnPoint = spawnPointHandler.GetSpawnPointPositionAndRotation();
    var networkHeroObject = heroSystem.GetNetworkHeroObject();
    networkHeroObject.SetPositionAndRotation(spawnPoint.position, spawnPoint.rotation);
    networkHeroObject.ResetHero(_currentRound);
    networkHeroObject.EnableModelLights(false);
}

// NetworkHeroObject
private HeroController heroController;

public void SetPositionAndRotation(Vector3 position, Quaternion rotation)
{
    heroController.SetPositionAndRotation(position, rotation);
}

// HeroController
private BaseHeroMoveController heroMoveController;

public void SetPositionAndRotation(Vector3 position, Quaternion rotation)
{
    heroMoveController.SetPositionAndRotation(position, rotation);
}

// BaseHeroMoveController
public void SetPositionAndRotation(Vector3 position, Quaternion rotation)
{
    OnTeleport(position, rotation);
}
```

#### [`BaseHeroAttackSkill`](/docs/projects/rfist/heroskillsystem/baseheroattackskill))에서 스킬 효과에 따라 스킬사용시 캐릭터 이동  
```csharp
// BaseHeroAttackSkill
protected IHeroController HeroController;

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

// HeroController(IHeroController 구현체)
private BaseHeroMoveController heroMoveController;

public void MoveToRelativeDirection(float distance, float time, Vector3 direction)
{
    heroMoveController.MoveToRelativeDirection(distance, time, direction);
}

// BaseHeroMoveController
public void MoveToRelativeDirection(float distance, float time, Vector3 direction)
{
    OnMoveToRelativeDirection(distance, time, direction);
}
```

#### 캐릭터 피격 후 각 캐릭터 상태에 따라 넉백 적용
```csharp
// RektorAbility
private IHeroController _heroController;

protected override void OnHit(IHitEvent.HitInfo hitInfo)
{
    ...
        
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

        if (_isSuperArmor) return; 
    
        _skillManager.Hit(hitInfo);
    }
    
    if (_heroObjectInfo.IsRemote()) return;
    _heroController.KnockBack(hitInfo.AttackerPos, hitInfo.KnockBackPower);
}

// HeroController(IHeroController 구현체)
private BaseHeroMoveController heroMoveController;

public void KnockBack(Vector3 attackerPos, float force)
{
    heroMoveController.KnockBack(attackerPos, force);
}

// BaseHeroMoveController
public void KnockBack(Vector3 attackerPos, float force)
{
    OnKnockBack(attackerPos, force);
}
```

## 관련 클래스
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`HeroRigidbodyController`](/docs/projects/rfist/HeroControlSystem/HeroRigidbodyController)
- [`IControllerState`](/docs/projects/rfist/HeroControlSystem/IControllerState)
- [`HeroBaseStat`](/docs/projects/rfist/HeroAbilitySystem/HeroBaseStat)
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController)

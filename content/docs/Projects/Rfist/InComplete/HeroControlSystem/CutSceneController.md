+++
title = "CutSceneController"
description = "특수 스킬(컷씬) 시퀀스를 제어하는 컨트롤러"
icon = "code"
date = "2025-03-06T23:05:00+09:00"
lastmod = "2025-03-06T23:05:00+09:00"
draft = false
toc = true
weight = 250
+++

## 개요

`CutSceneController` 클래스는 RFist 게임의 특수 스킬(컷씬) 시퀀스를 제어하는 컨트롤러입니다.
공격자와 피격자 간의 컷씬 연출을 관리하며, 데미지 처리와 함께 양측의 컷씬 이벤트를 통제합니다.

## 역할

- 공격자와 피격자 간의 컷씬 연출 관리
- 컷씬 시작/종료 시 이벤트 통지
- 컷씬 중 데미지 처리 및 사망 판정
- 로컬/원격 플레이어 구분에 따른 이벤트 처리

## 선언

```csharp
/// <summary>
/// 특수 스킬(컷씬) 시퀀스를 제어하는 컨트롤러
/// 공격자와 피격자 간의 컷씬 연출 및 데미지 처리를 관리합니다.
/// </summary>
public class CutSceneController : MonoBehaviour
```

## 멤버

### Private Fields

```csharp
/// <summary>
/// 공격자 네트워크 영웅 오브젝트
/// </summary>
private NetworkHeroObject _attacker;

/// <summary>
/// 피격자 네트워크 영웅 오브젝트
/// </summary>
private NetworkHeroObject _hitter;

/// <summary>
/// 공격자가 로컬 플레이어인지 여부
/// </summary>
private bool _attackIsLocal;

/// <summary>
/// 사망 처리 여부
/// </summary>
private bool _isDead;

/// <summary>
/// 컷씬 이벤트 발신자 목록
/// </summary>
private readonly HashSet<ICutSceneEventInvoker> _cutSceneEventInvokers = new HashSet<ICutSceneEventInvoker>();
```

### Public Methods - Lifecycle

```csharp
/// <summary>
/// 컷씬 컨트롤러 초기화
/// </summary>
/// <param name="attacker">공격자 네트워크 영웅 오브젝트</param>
/// <param name="hitter">피격자 네트워크 영웅 오브젝트</param>
public void Initialize(NetworkHeroObject attacker, NetworkHeroObject hitter)

/// <summary>
/// 초기화 여부 확인
/// </summary>
/// <returns>초기화 완료 여부</returns>
private bool IsInitialized()
```

### Public Methods - CutScene Control

```csharp
/// <summary>
/// 컷씬 시작
/// </summary>
public void StartCutScene()

/// <summary>
/// 컷씬 종료 처리
/// </summary>
public void OnEndCutScene()
```

### Public Methods - Damage

```csharp
/// <summary>
/// 피격자에게 데미지 적용
/// </summary>
/// <param name="damage">데미지량</param>
/// <param name="canDead">사망 가능 여부</param>
public void ApplyDamageToHitter(int damage, bool canDead)
```

## 코드 스니펫

### 컷씬 시작

```csharp
/// <summary>
/// 컷씬 시작
/// </summary>
public void StartCutScene()
{
    if (IsInitialized() == false)
    {
        Debug.LogError($"[CutSceneController] Not Initialized");
        return;
    }
    
    // 공격자가 로컬인지 확인
    _attackIsLocal = !_attacker.IsRemote();

    // 모든 컷씬 이벤트 리스너에게 시작 통지
    foreach (var cutSceneEventInvoker in _cutSceneEventInvokers)
    {
        cutSceneEventInvoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceStart());
    }
}
```

### 데미지 적용

```csharp
/// <summary>
/// 피격자에게 데미지 적용
/// </summary>
public void ApplyDamageToHitter(int damage, bool canDead)
{
    // 로컬 공격자인 경우 공격 이벤트 발생
    if (_attackIsLocal)
    {
        var hitInfo = new IHitEvent.HitInfo();
        _attacker.GetBaseHeroAbility().ExternalAttackEvent(hitInfo);
    }
    
    // 현재 체 계산
    var currentHp = _hitter.GetHeroStatus().GetHp().Current;
    var hp = currentHp - damage;

    // 사망 처리 (최소 1 유지 또는 0으로 설정)
    if (hp <= 0)
    {
        hp = canDead ? 0 : 1;
    }
    
    // 체 변경 적용
    _hitter.GetBaseHeroAbility().ChangeHp(hp);
}
```

### 컷씬 종료

```csharp
/// <summary>
/// 컷씬 종료 처리
/// </summary>
public void OnEndCutScene()
{
    _attacker = null;
    _hitter = null;
    
    // 모든 컷씬 이벤트 리스너에게 종료 통지
    foreach (var cutSceneEventInvoker in _cutSceneEventInvokers)
    {
        cutSceneEventInvoker.NotifyCutSceneEvents(action => action?.OnSpecialMoveSequenceEnd());
    }
    _cutSceneEventInvokers.Clear();
}
```

## 기능 설명

### 컷씬 생명주기

1. **초기화 (Initialize)**: 공격자와 피격자 설정, 이벤트 발신자 등록
2. **시작 (StartCutScene)**: 로컬 여부 확인, 이벤트 통지
3. **데미지 처리 (ApplyDamageToHitter)**: 체력 계산 및 사망 판정
4. **종료 (OnEndCutScene)**: 참조 해제, 이벤트 통지, 정리

### 이벤트 통지 시스템

컷씬 시작/종료 시 양측의 `ICutSceneEventInvoker`를 통해 이벤트를 통지합니다:
- `OnSpecialMoveSequenceStart()`: 컷씬 시작 시 호출
- `OnSpecialMoveSequenceEnd()`: 컷씬 종료 시 호출

이 이벤트는 [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)에서 수신되어
컨트롤러 상태를 업데이트합니다.

### 데미지 처리

- **로컬 공격자**: 공격 이벤트 발생 및 체력 변경
- **사망 판정**: `canDead` 파라미터에 따라 최소 체력 1 유지 또는 0으로 설정
- **네트워크 동기화**: 공격자의 로컬 여부에 따라 이벤트 처리 분기

## 의존성/상속 관계

### 상속/구현
- `MonoBehaviour` 상속

### 의존 클래스
- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject) - 공격자/피격자 정보
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker) - 이벤트 발신
- [`IHitEvent`](/docs/projects/rfist/HeroHitSystem/IHitEvent) - 공격 이벤트
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility) - 체력 변경

### 사용 위치
- 특수 스킬 시스템에서 컷씬 연출 시 사용

## 사용 예시

### 특수 스킬에서 컷씬 컨트롤러 사용

```csharp
/// <summary>
/// 궁극기 스킬에서 CutSceneController를 사용하는 예시
/// </summary>
public class UltimateSkill : BaseHeroSkill
{
    [SerializeField] private CutSceneController cutSceneController;
    
    /// <summary>
    /// 스킬 실행 시 컷씬 시작
    /// </summary>
    public override void OnSkillStart()
    {
        // 타겟 찾기
        var target = FindTarget();
        if (target == null) return;
        
        // 컷씬 컨트롤러 초기화
        cutSceneController.Initialize(
            Owner.NetworkHeroObject,  // 공격자
            target.NetworkHeroObject  // 피격자
        );
        
        // 컷씬 시작
        cutSceneController.StartCutScene();
        
        // 애니메이션 및 연출 시작
        PlayCutSceneAnimation();
    }
    
    /// <summary>
    /// 컷씬 중 데미지 적용 (애니메이션 이벤트에서 호출)
    /// </summary>
    public void OnCutSceneDamage()
    {
        // 데미지 적용 (사망 가능)
        cutSceneController.ApplyDamageToHitter(
            damage: skillData.damage,
            canDead: true
        );
    }
    
    /// <summary>
    /// 컷씬 종료 (애니메이션 이벤트에서 호출)
    /// </summary>
    public void OnCutSceneEnd()
    {
        cutSceneController.OnEndCutScene();
    }
}
```

### 스킬 데이터 기반 컷씬 설정

```csharp
/// <summary>
/// 스킬 데이터에 따른 컷씬 설정
/// </summary>
public void SetupCutScene(SkillData skillData, NetworkHeroObject target)
{
    // 컷씬 컨트롤러 초기화
    cutSceneController.Initialize(Owner.NetworkHeroObject, target);
    
    // 스킬 타입에 따른 사망 가능 여부 설정
    bool canDead = skillData.skillType == SkillType.Ultimate;
    
    // 데미지 계산
    int damage = CalculateDamage(skillData);
    
    // 컷씬 시작
    cutSceneController.StartCutScene();
}
```

## 관련 클래스

- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker)
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill)

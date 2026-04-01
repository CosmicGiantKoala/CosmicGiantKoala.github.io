+++
title = "CutSceneController"
description = "특수 스킬(컷씬) 시퀀스를 제어하는 컨트롤러"
icon = "code"
date = "2025-03-06T23:05:00+09:00"
lastmod = "2025-03-06T23:05:00+09:00"
draft = false
toc = true
weight = 222
+++

## 개요
`CutSceneController` 클래스는 RFist 게임의 [`Timeline`](https://docs.unity3d.com/Packages/com.unity.timeline@1.8/manual/index.html) 기반 특수 스킬(궁극기)에서 발생하는 이벤트 및 데미지를 처리하는 컨트롤러입니다.
`TimelineManager`가 생성한 타임라인(PlayableDirector)에 바인딩되어, 타임라인 재생 중 특정 시점에 데미지 적용 및 컷씬 이벤트를 처리합니다.

## 역할
- `TimelineManager`에서 발생하는 컷씬 이벤트 처리 (시작/종료)
- 컷씬 중 피격자에게 데미지 적용
- 로컬/원격 플레이어 구분에 따른 공격 이벤트 발생

#### `Timeline` 패널에서 `CutSceneController` 호출   
![image](/images/rfist_cutscene.png)


## 선언
```csharp
public class CutSceneController : MonoBehaviour
```

## 멤버
### 속성
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
/// 컷씬 이벤트 발신자 목록
/// </summary>
private readonly HashSet<ICutSceneEventInvoker> _cutSceneEventInvokers = new HashSet<ICutSceneEventInvoker>();
```

### 메서드
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

/// <summary>
/// 컷씬 시작
/// </summary>
public void StartCutScene()

/// <summary>
/// 컷씬 종료 처리
/// </summary>
public void OnEndCutScene()

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
    
    // 피격자 데미지 계산
    var currentHp = _hitter.GetHeroStatus().GetHp().Current;
    var hp = currentHp - damage;

    // 사망 처리 (최소 1 유지 또는 0으로 설정)
    if (hp <= 0)
    {
        hp = canDead ? 0 : 1;
    }
    
    // 피격자 체력 변경
    _hitter.GetBaseHeroAbility().ChangeHp(hp);
}
```

## 기능 설명
### 컷씬 생명주기
1. **초기화 (Initialize)**: 공격자와 피격자 설정, 이벤트 발신자 등록
2. **시작 (StartCutScene)**: 로컬 여부 확인, 이벤트 통지
3. **데미지 처리 (ApplyDamageToHitter)**: 체력 계산 및 사망 판정
4. **종료 (OnEndCutScene)**: 참조 해제, 이벤트 통지, 정리

### 이벤트 통지 시스템
- 컷씬 시작/종료 시 [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/icutsceneeventinvoker)를 통해 이벤트를 통지
- `OnSpecialMoveSequenceStart()`: 컷씬 시작 시 호출
- `OnSpecialMoveSequenceEnd()`: 컷씬 종료 시 호출
- 해당 이벤트는 [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler) 및 `HitPanel`에서 수신

### 데미지 처리
- **공격자가 로컬 플레이어일시**: 공격 이벤트 발생
- **피격자**: 공격자의 호출에 따라 체력 계산 및 변경
- **사망 판정**: `canDead` 파라미터에 따라 최소 체력 1 유지 또는 0으로 설정
- **네트워크 동기화**: 공격자의 로컬 여부에 따라 이벤트 처리 분기

## 의존성/상속 관계
- `MonoBehaviour`를 상속 받음
- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject) 공격자/피격자 오브젝트
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker) 이벤트 발신 인터페이스
- [`IHitEvent`](/docs/projects/rfist/HeroHitSystem/IHitEvent)를 통해 공격 이벤트 발생
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)의 메서드를 통해 피격자 체력 변경

## 사용 예시
#### `SuperAttackEventBehaviour`에서 Timeline의 프레임 처리시 데미지 처리 메서드 호출
```csharp
public override void ProcessFrame(Playable playable, FrameData info, object playerData)
{
    if (_triggered || info.effectiveWeight <= 0f)
        return;

    // playerData에서 set
    if (cutSceneController == null && playerData is CutSceneController csc)
    {
        cutSceneController = csc;
        //Debug.Log("Fallback - CutSceneController Binding success");
    }

    if (cutSceneController == null)
    {
        Debug.LogWarning(" cutSceneController null");
        return;
    }

    Debug.Log($" Special Attack : {damage}");
    cutSceneController.ApplyDamageToHitter(damage, canDead);
    _triggered = true;
}
```

## 관련 클래스
- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)
- [`ICutSceneEventInvoker`](/docs/projects/rfist/HeroControlSystem/ICutSceneEventInvoker)
- [`ICutSceneEvent`](/docs/projects/rfist/HeroControlSystem/ICutSceneEvent)
- [`HeroControllerStateHandler`](/docs/projects/rfist/HeroControlSystem/HeroControllerStateHandler)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`BaseHeroSkill`](/docs/projects/rfist/HeroSkillSystem/BaseHeroSkill)

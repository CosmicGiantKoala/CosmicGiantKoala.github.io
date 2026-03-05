+++
title = "NetworkHeroObject"
description = "Photon Fusion 네트워크 환경에서 영웅 오브젝트의 수명주기를 관리하는 메인 클래스"
icon = "code"
date = "2025-02-24T16:45:00+09:00"
lastmod = "2025-02-24T16:45:00+09:00"
draft = false
toc = true
weight = 202
+++

## 개요
- `NetworkHeroObject` 클래스는 Photon Fusion의 [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 랩핑한 `NetworkBehaviourCallBack` 클래스를 상속받아, 영웅 오브젝트의 전체 수명주기를 관리하는 메인 클래스입니다.
- 해당 클래스는 모든 영웅 컴포넌트들을 통합 관리하고 네트워크 동기화를 담당합니다. 해당 클래스는 파사드 패턴을 적용하여
[`NetworkHeroStatus`](/docs/projects/rfist/heronetworksystem/networkherostatus), [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController), `HeroModelController`, `HeroAnimationController` 등의 복잡한 하위 컴포넌트들을 캡슐화합니다. 
- 이벤트 기반 통신은 NetworkHeroObject를 통해 중앙 관리되며, 하위 컴포넌트 직접 접근이 필요한 경우 `GetXXX()` 메서드를 통해 제한적으로 노출합니다. 네트워크를 통해 플레이어의 프로필, 능력 등을 모든 클라이언트에 동기화하며, 각 하위 컴포넌트들의 초기화와 조율을 담당합니다.


## 역할
- 영웅 오브젝트의 스폰/디스폰 수명주기 관리
- 모든 영웅 컴포넌트 초기화 및 설정 조율
- 네트워크를 통한 사용자 프로필 동기화
- 네트워크를 통한 영웅 능력(Ability) 동기화
- 다양한 이벤트 리스너 등록/해제 관리
- 채팅 및 이모티콘 네트워크 동기화
- 매치 시작/종료 이벤트 브로드캐스트
- 하위 컴포넌트 제한적 노출 (`GetXXX()` 메서드 제공)
  - `GetHeroStatus()`, `GetBaseHeroAbility()`, `GetHeroModelController()` 등
  - 외부에서 필요한 경우에만 직접 접근 가능
- 이벤트 라우팅 중앙화
    - `Register()`/`UnRegister()` 메서드를 통한 이벤트 등록/해제
    - `heroController`에 이벤트 리스너 연결 및 관리

## 선언
```csharp
public class NetworkHeroObject : NetworkBehaviourCallback, IHeroObjectInfo , IAttackEvent , INetworkChat
```

## 멤버
### 필드
```csharp
/// <summary>
/// 네트워크 동기화되는 영웅 상태 컴포넌트
/// </summary>
[SerializeField]
private NetworkHeroStatus networkHeroStatus;

/// <summary>
/// 영웅 동작을 제어하는 컨트롤러
/// </summary>
[SerializeField]
private HeroController heroController;

/// <summary>
/// 영웅 3D 모델을 관리하는 컨트롤러
/// </summary>
[SerializeField]
private HeroModelController heroModelController;

/// <summary>
/// 영웅 애니메이션을 관리하는 컨트롤러
/// </summary>
[SerializeField]
private HeroAnimationController heroAnimationController;

/// <summary>
/// 영웅 능력(Ability)을 생성하고 관리하는 매니저
/// </summary>
[SerializeField]
private HeroAbilityManager heroAbilityManager;

/// <summary>
/// 영웅 모델의 Transform
/// </summary>
[SerializeField]
private Transform modelTransform;

/// <summary>
/// 채팅 UI 위치를 위한 Transform
/// </summary>
[SerializeField]
private Transform chattingTransform;

/// <summary>
/// 카메라 타겟 Transform
/// </summary>
[SerializeField]
private Transform cameraTargetTransform;

/// <summary>
/// 영웅 컨트롤러의 상태를 관리하는 핸들러
/// </summary>
[SerializeField]
private HeroControllerStateHandler heroControllerStateHandler;

/// <summary>
/// 현재 영웅의 능력 컴포넌트
/// </summary>
private BaseHeroAbility _baseHeroAbility;

/// <summary>
/// 현재 영웅의 애니메이터
/// </summary>
private BaseHeroAnimator _baseHeroAnimator;

/// <summary>
/// 사운드 컨트롤러
/// </summary>
private ISoundController _soundController;

/// <summary>
/// 이펙트 컨트롤러
/// </summary>
private IEffectController _effectController;

/// <summary>
/// 영웅 이펙트 인터페이스
/// </summary>
private IHeroEffect _heroEffect;
```

### 네트워크 동기화 속성
```csharp
/// <summary>
/// 네트워크 동기화되는 영웅 능력 타입
/// </summary>
[Networked]
public BaseHeroAbility.BaseAbilityType BaseAbilityType { get; private set; }

/// <summary>
/// 네트워크 동기화되는 사용자 프로필 정보
/// </summary>
[Networked]
private ref UserProfile UserProfileRef => ref MakeRef<UserProfile>();
```

### 메서드
```csharp
/// <summary>
/// 영웅을 리셋합니다.
/// 입력 권한이 있는 플레이어만 호출 가능합니다.
/// </summary>
public void ResetHero(int round = 0)

/// <summary>
/// 영웅 리셋을 모든 클라이언트에 동기화하는 RPC
/// </summary>
/// <param name="round">현재 라운드 번호</param>
[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_ResetHero(int round)

/// <summary>
/// 영웅의 HUD 스프라이트를 가져옵니다.
/// </summary>
/// <returns>영웅 스프라이트</returns>
public Sprite GetHeroSprite()

/// <summary>
/// 영웅 능력 타입이 변경되었을 때 호출됩니다.
/// </summary>
private void OnAbilityChanged()

/// <summary>
/// 영웅 능력을 업데이트합니다.
/// 기존 능력 해제 후 새로운 능력 생성 및 설정
/// </summary>
/// <param name="abilityType">설정할 능력 타입</param>
private void UpdateAbility(BaseHeroAbility.BaseAbilityType abilityType)

/// <summary>
/// 현재 영웅 능력을 해제합니다.
/// 모든 이벤트 등록 해제 및 능력 오브젝트 파괴
/// </summary>
private void ReleaseAbility()

/// <summary>
/// 영웅 능력을 네트워크에 동기화합니다.
/// </summary>
public void SyncHeroAbility(BaseHeroAbility heroAbility)

/// <summary>
/// 사용자 프로필을 네트워크에 동기화합니다.
/// </summary>
public void SyncUserProfile(string userId, string userName, string userProfileImageURL, int teamIndex)

/// <summary>
/// 원격 플레이어(상대방)인지 확인합니다.
/// </summary>
public bool IsRemote()

/// <summary>
/// 사용자 이름을 가져옵니다.
/// </summary>
/// <returns>사용자 이름</returns>
public string GetUserName();

/// <summary>
/// 사용자 프로필 이미지 URL을 가져옵니다.
/// </summary>
/// <returns>프로필 이미지 URL</returns>
public string GetUserProfileImageURL()

/// <summary>
/// Fusion Player ID를 가져옵니다.
/// </summary>
/// <returns>플레이어 ID</returns>
public int GetFusionId()

/// <summary>
/// 현재 위치를 가져옵니다.
/// </summary>
/// <returns>월드 좌표 위치</returns>
public Vector3 GetPosition()

/// <summary>
/// 현재 회전을 가져옵니다.
/// </summary>
/// <returns>회전 값</returns>
public Quaternion GetRotation()

/// <summary>
/// 현재 영웅 능력을 가져옵니다.
/// </summary>
/// <returns>영웅 능력 컴포넌트</returns>
public BaseHeroAbility GetBaseHeroAbility()

/// <summary>
/// 컨트롤 활성화/비활성화를 설정합니다.
/// </summary>
/// <param name="isEnable">활성화 여부</param>
public void ActiveControl(bool isEnable)

/// <summary>
/// 모델 Transform을 가져옵니다.
/// </summary>
/// <returns>모델 Transform</returns>
public Transform GetModelTransform()

/// <summary>
/// 영웅 상태 인터페이스를 가져옵니다.
/// </summary>
/// <returns>IHeroStatus 인터페이스</returns>
public IHeroStatus GetHeroStatus()

/// <summary>
/// 영웅 기본 스탯을 가져옵니다.
/// </summary>
/// <returns>HeroBaseStat 데이터</returns>
public HeroBaseStat GetHeroBaseStat()

/// <summary>
/// 매치 시작/종료를 알립니다.
/// </summary>
public void StartMatch()
public void StopMatch(bool isWin)

/// <summary>
/// 위치와 회전을 설정합니다.
/// </summary>
/// <param name="position">설정할 위치</param>
/// <param name="rotation">설정할 회전</param>
public void SetPositionAndRotation(Vector3 position, Quaternion rotation)

/// <summary>
/// 다른 플레이어를 공격했을 때 호출됩니다.
/// </summary>
/// <param name="hitInfo">히트 정보</param>
public void OnStrikeAnotherPlayer(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 공격 동작을 모든 클라이언트에 동기화하는 RPC
/// </summary>
/// <param name="hitInfo">히트 정보</param>
[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_OnStrikeAnotherPlayer(IHitEvent.HitInfo hitInfo)

/// <summary>
/// 렌더링 프레임마다 호출되어 네트워크 상태 변경을 처리합니다.
/// </summary>
public override void Render()
```

### 이벤트 리스너 메서드
```csharp
/// <summary>
/// 영웅 이벤트 리스너를 등록/해제합니다.
/// </summary>
/// <param name="heroEvent">등록할 영웅 이벤트</param>
public void Register(IHeroEvent heroEvent)
public void UnRegister(IHeroEvent heroEvent)

/// <summary>
/// 스킬 이벤트 리스너를 등록/해체합니다.
/// </summary>
/// <param name="skillEvent">등록할 스킬 이벤트</param>
public void Register(ISkillEvent skillEvent)
public void UnRegister(ISkillEvent skillEvent)

/// <summary>
/// 공격 이벤트 리스너를 등록/해제합니다.
/// </summary>
/// <param name="attackEvent">등록할 공격 이벤트</param>
public void Register(IAttackEvent attackEvent)
public void UnRegister(IAttackEvent attackEvent)

/// <summary>
/// 매치 이벤트 리스너를 등록/해제합니다.
/// </summary>
/// <param name="matchEvent">등록할 매치 이벤트</param>
private void Register(IMatchEvent matchEvent)
private void UnRegister(IMatchEvent matchEvent)

/// <summary>
/// 컷씬 이벤트 리스너를 등록/해제합니다.
/// </summary>
/// <param name="cutSceneEvent">등록할 컷씬 이벤트</param>
public void Register(ICutSceneEvent cutSceneEvent)
public void UnRegister(ICutSceneEvent cutSceneEvent)
```

## 코드 스니펫
### 능력 업데이트
```csharp
[Networked]
public BaseHeroAbility.BaseAbilityType BaseAbilityType { get; private set; }

private ChangeDetector _changes;

public override void Render()
{
    foreach (var change in _changes.DetectChanges(this))
    {
        switch (change)
        {
            case nameof(BaseAbilityType):
                OnAbilityChanged();
                break;
            case nameof(UserProfileRef):
                OnUserProfileChanged();
                break;
             ...
        }
    }
}

private void OnAbilityChanged()
{
   UpdateAbility(BaseAbilityType);
}

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
    heroModelController.UpdateModel(_baseHeroAbility, (Team)UserProfileRef.TeamIndex, 
        gameObject.transform, modelTransform);
    
    // 애니메이터 설정
    _baseHeroAnimator = _baseHeroAbility.GetBaseHeroAnimator();
    
    // 컨트롤러 설정
    heroController.Setup(_baseHeroAbility, networkHeroStatus, HeroObjectInfo);
    
    // 애니메이션 컨트롤러 설정
    heroAnimationController.Setup(_baseHeroAnimator, networkHeroStatus);
    _baseHeroAnimator.Setup(heroModelController.GetModelAnimator(), _baseHeroAbility);
    
    // 능력 설정
    _baseHeroAbility.Setup(networkHeroStatus, heroController.HeroObjectController, 
        this, heroController.SkillEventNotifier);
    networkHeroStatus.Setup(_baseHeroAbility.GetHeroStat(), 0);
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

### 라운드 시작시 초기화 동작
```csharp
public void ResetHero(int round = 0)
{
    if (Object.HasInputAuthority == false) return;
    RPC_ResetHero(round);
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

## 기능 설명
### 수명주기 관리
1. **스폰 (OnSpawned)**
   - 이벤트 리스너 등록
   - [`ChangeDetector`](https://doc.photonengine.com/ko-kr/fusion/current/manual/data-transfer/change-detection) 초기화
   - 플레이어 프로필 및 영웅 능력 설정 대기
   - 셋업 코루틴 시작
2. **디스폰 (OnDespawned)**
   - 이벤트 리스너 해제
   - 리소스 정리
   - 디스폰 알림
   - 셋업 코루틴 중지

### 게임 라운드 시작/종료시 초기화
- `NetworkHeroStatus` 항목을 `HeroBaseStat`을 통해 초기화
  - 라운드 조건에 따라 SP초기화
- `HeroControllerStateHandle` 컨트롤러 상태 초기화
- Focus모드 초기화
- `HeroAnimationController` 애니메이션 컨트롤러 초기화

### 네트워크 동기화 속성
| 속성 | 타입 | 설명 |
|------|------|------|
| BaseAbilityType | BaseAbilityType | 영웅 능력 타입 |
| UserProfileRef | UserProfile | 사용자 프로필 정보 |

<br>

### 이벤트 등록 시스템
- `IHeroEvent`: 영웅 관련 이벤트
  - 영웅의 포커스 상태, 능력 변경 사항 브로드 캐스팅
- `ISkillEvent`: 스킬 관련 이벤트
  - 스킬 사용/종료 상태 브로드 캐스팅
- `IAttackEvent`: 공격 관련 이벤트
  - 공격 성공 정보 브로드 캐스팅
- `IMatchEvent`: 매치 관련 이벤트
  - 매치 시작/종료 상태 및 승패정보 브로드 캐스팅
- `ICutSceneEvent`: 컷씬 관련 이벤트
  - 컷씬 시작/종료 상태 브로드 캐스팅

### 컴포넌트 초기화 흐름
- 능력 변경 시 `UpdateAbility()`에서 다음 순서로 컴포넌트 설정:
1. **기존 능력 해제** - `ReleaseAbility()`로 이벤트 해제 및 오브젝트 파괴
2. **Ability 생성** - `HeroAbilityManager`에서 새 능력 인스턴스 생성
3. **모델 업데이트** - `HeroModelController`에 모델/텍스처 적용
4. **애니메이터 설정** - `BaseHeroAnimator` 연결 및 초기화
5. **컨트롤러 설정** - `HeroController`에 능력과 상태 주입
6. **이펙트 설정** - 사운드/이펙트 컨트롤러 연결
7. **이벤트 등록** - `IMatchEvent` 등록 및 능력 변경 알림 브로드캐스트

### ChangeDetector를 통한 네트워크 동기화
- `Render()`에서 변경된 네트워크 속성을 감지하여 처리:
- `BaseAbilityType` 변경 → `OnAbilityChanged()` → `UpdateAbility()` 호출
- `UserProfileRef` 변경 → `OnUserProfileChanged()` → 프로필 설정 완료 처리

## 의존성/상속 관계
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 상속받음
- `IHeroObjectInfo` 인터페이스 구현
- `IAttackEvent` 인터페이스 구현
- `INetworkChat` 인터페이스 구현
- [`NetworkHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroStatus) 
  - 셋업 및 이벤트 리스닝 제어
  - 주입 및 참조 관리
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
  - 셋업 및 이벤트 리스닝 제어
  - 주입 및 참조 관리
  - 외부 호출에 따라 활성화 제어
- [`HeroModelController`](/docs/projects/rfist/HeroAnimationSystem/HeroModelController) 
  - 능력 변경시 모델 업데이트 및 셋업
  - 주입 및 참조 관리
- [`HeroAnimationController`](/docs/projects/rfist/HeroAnimationSystem/HeroAnimationController)
  - 셋업 및 이벤트 리스닝 제어
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
  - `BaseAbilityType` 네트워크 동기화
  - 능력 변경시 초기화
  - 셋업 및 이벤트 리스닝 제어
  - 주입 및 참조 관리
- `BaseHeroAnimator` 셋업 및 참조 관리, 공격 성공시 호출
- `ISoundController` 주입 및 참조 관리
- `IEffectController` 주입 및 참조관리
- `IHeroEffect` 주입 및 참조 관리


## 사용 예시

## 관련 클래스
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)
- [`NetworkHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroStatus)
- [`NetworkHeroController`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroController)
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroInput)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`HeroModelController`](/docs/projects/rfist/HeroAnimationSystem/HeroModelController)
- [`BaseHeroAbility`](/docs/projects/rfist/HeroAbilitySystem/BaseHeroAbility)
- [`HeroAnimationController`](/docs/projects/rfist/HeroAnimationSystem/HeroAnimationController)
- `BaseHeroAnimator`
- `IHeroEffect`
- `IEffectController`
- `ISoundController`
- `IAttackEvent`
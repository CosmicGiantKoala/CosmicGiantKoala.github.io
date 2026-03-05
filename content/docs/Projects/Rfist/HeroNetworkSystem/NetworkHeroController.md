+++
title = "NetworkHeroController"
description = "네트워크로부터 입력을 수신하여 실제 게임 로직을 실행하는 입력 실행기 클래스"
icon = "code"
date = "2025-02-24T16:30:00+09:00"
lastmod = "2025-02-24T16:30:00+09:00"
draft = false
toc = true
weight = 210
+++

## 개요

`NetworkHeroController` 클래스는 Photon Fusion의 [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 랩핑한 `NetworkBehaviourCallback` 클래스를 상속받아 네트워크로부터 입력을 수신하여 실제 게임 로직을 실행하는 입력 실행기입니다. [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/networkheroinput)으로부터 전송된 입력 데이터를 수신하고, RPC를 통해 모든 클라이언트에 동기화한 후 [`HeroController`](docs/projects/rfist/HeroControlSystem/HeroController)를 호출하여 실제 게임 동작을 실행합니다.

## 역할
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)를 랩핑한 `NetworkBehaviourCallback`클래스를 통해 네트워크 입력 수신
- [RPC(Remote Procedure Call)](https://doc.photonengine.com/fusion/current/manual/data-transfer/rpcs)를 통한 입력 데이터 브로드캐스트
- 수신된 입력을 조건 처리 후 각종 액션(이동, 공격, 가드 등)으로 변환
- 네트워크 지연(Latency) 측정을 위한 타임스탬프 동기화
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)의 메서드를 호출하여 실제 게임 동작 실행

## 선언
```csharp
public class NetworkHeroController : NetworkBehaviourCallback
```

## 멤버
### 필드
```csharp
/// <summary>
/// 실제 영웅 동작을 제어하는 로컬 게임 로직 컨트롤러
/// </summary>
[SerializeField]
protected HeroController heroController;

/// <summary>
/// FixedUpdateNetwork에서 처리된 마지막 입력 데이터
/// </summary>
protected HeroInputData FixedInputData;
```

### 중첩 구조체
```csharp
/// <summary>
/// 네트워크 지연을 계산하기 위한 입력 동기화 데이터 구조체
/// 클라이언트 타임스탬프와 서버 시뮬레이션 타임을 저장하여 지연 시간을 측정합니다.
/// </summary>
public readonly struct HeroInputSyncData
{
    /// <summary>
    /// 클라이언트에서 입력이 발생한 시간
    /// </summary>
    public readonly float ClientTimeStamp;
    
    /// <summary>
    /// 서버에서 입력을 처리한 시뮬레이션 시간
    /// </summary>
    public readonly float SimulationTimeStamp;
    
    /// <summary>
    /// HeroInputSyncData 생성자
    /// </summary>
    /// <param name="clientTimeStamp">클라이언트 타임스탬프</param>
    /// <param name="simulationTimeStamp">서버 시뮬레이션 타임</param>
    public HeroInputSyncData(float clientTimeStamp, float simulationTimeStamp)
    
    /// <summary>
    /// 네트워크 지연 시간을 계산합니다.
    /// SimulationTimeStamp와 ClientTimeStamp의 차이를 반환합니다.
    /// </summary>
    /// <returns>지연 시간(초)</returns>
    public float Latency() => => SimulationTimeStamp - ClientTimeStamp;
}
```

### 메서드
```csharp
/// <summary>
/// HeroInputData를 모든 클라이언트에 동기화하는 RPC 메서드
/// 입력 권한을 가진 클라이언트에서 호출되어 모든 클라이언트에서 실행됩니다.
/// </summary>
/// <param name="heroInputData">동기화할 입력 데이터</param>
[Rpc(RpcSources.InputAuthority, RpcTargets.All)]
private void RPC_UpdateHeroInputData(HeroInputData heroInputData)

/// <summary>
/// 공격 입력을 처리합니다.
/// 공격 버튼이 눌렸을 때 HeroController의 Attack 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessAttack(HeroInputData inputData)

/// <summary>
/// 공격 홀드(차지) 입력을 처리합니다.
/// 공격 버튼을 누르고 있을 때/뗄 때 HeroController의 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessAttackHold(HeroInputData inputData)

/// <summary>
/// 대시 입력을 처리합니다.
/// 대시 버튼이 눌렸을 때 HeroController의 Dash 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessDash(HeroInputData inputData)

/// <summary>
/// 가드 입력을 처리합니다.
/// 가드 버튼이 눌려있을 때/떼었을 때 HeroController의 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessGuard(HeroInputData inputData)

/// <summary>
/// 포커스 모드 입력을 처리합니다.
/// 포커스 모드 버튼이 눌렸을 때 현재 상태를 토글합니다.
/// </summary>
/// <param name="heroInputData">입력 데이터</param>
private void ProcessFocus(HeroInputData heroInputData)

/// <summary>
/// 궁극기 입력을 처리합니다.
/// 궁극기 버튼이 눌렸을 때 HeroController의 UltimateSkill 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessUltimateSkill(HeroInputData inputData)

/// <summary>
/// 공격+가드 동시 입력을 처리합니다.
/// 특수 스킬 발동 입력이 감지되면 HeroController의 메서드를 호출합니다.
/// </summary>
/// <param name="inputData">입력 데이터</param>
private void ProcessAttackGuardDualInput(HeroInputData inputData)

/// <summary>
/// 네트워크 Fixed Update에서 입력을 수신하고 처리합니다.
/// Fusion의 시뮬레이션 루프에서 매 프레임 호출됩니다.
/// </summary>
public override void FixedUpdateNetwork()
```

## 코드 스니펫
### 네트워크 입력 수신 및 RPC 호출
```csharp
public override void FixedUpdateNetwork()
{
    // 1. 네트워크에서 HeroInputData 수신
    if (GetInput<HeroInputData>(out var heroInputData))
    {
        // 2. 컨트롤러 활성화 상태 검증
        if (heroController.IsActive == false)
        {
            RPC_UpdateHeroInputData(default);
            return;
        }
        
        // 3. RPC를 통해 모든 클라이언트에 입력 동기화
        RPC_UpdateHeroInputData(heroInputData);
        FixedInputData = heroInputData;
    }
}

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
```

### 입력 데이터 처리
```csharp
private void ProcessAttack(HeroInputData inputData)
{
    if (inputData.IsAttack())
    {
        // 동기화 데이터 생성 (지연 측정용)
        var syncData = new HeroInputSyncData(
            inputData.AttackTimeStamp, 
            Runner.SimulationTime
        );
        
        // 실제 게임 로직 실행
        heroController.Attack(syncData);
    }
}
```

## 기능 설명
### 네트워크 입력 동기화 시스템
1. **입력 수신**: `FixedUpdateNetwork()`에서 Fusion의 [`GetInput<T>()`](https://doc.photonengine.com/ko-kr/fusion/current/manual/input/player-input)를 통해 로컬 입력을 수신
2. **입력 검증**: 컨트롤러가 활성화된 상태인지 확인
3. **RPC 브로드캐스트**: `RPC_UpdateHeroInputData()`를 통해 모든 클라이언트에 브로드캐스트
4. **동일한 처리**: 모든 클라이언트에서 동일한 입력으로 [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) 메서드 호출

### 입력 처리 종류
| 메서드 | 입력 | 실행 동작          |
|--------|------|----------------|
| **ProcessAttack** | Attack | 일반 공격          |
| **ProcessAttackHold** | AttackHold | 공격 홀드(홀드/홀드종료) |
| **ProcessDash** | Dash | 대시/회피          |
| **ProcessGuard** | Guard | 가드(홀드/홀드종료)    |
| **ProcessFocus** | FocusMode | 포커스 모드 토글      |
| **ProcessUltimateSkill** | UltimateAttack | 궁극기 스킬         |
| **ProcessAttackGuardDualInput** | AttackGuardDualInput | 공격과 가드 동시입력    |

<br>

### 네트워크 지연 측정
- [`HeroInputSyncData`](/docs/projects/rfist/heronetworksystem/networkherocontroller/#중첩-구조체) 구조체 사용
- 클라이언트에서 입력 발생 시각(`ClientTimeStamp`) 기록
- 서버에서 입력 처리 시각(`SimulationTimeStamp`) 기록
- `Latency()` 메서드로 네트워크 왕복 시간 계산

## 의존성/상속 관계
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour) 상속
- 동기화된 입력을 [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController) 클래스를 통해 실제 영웅 동작 제어
- [`HeroInputData`](/docs/projects/rfist/herocontrolsystem/HeroInputData) 구조체를 통해 입력 데이터 처리
- [`HeroInputSyncData`](/docs/projects/rfist/heronetworksystem/networkherocontroller/#중첩-구조체) 중첩 구조체 정의

## 사용 예시
#### 캐릭터별 SkillManager 클래스([`BaseSkillManager`](/docs/projects/rfist/heroskillsystem/baseskillmanager))에서 `HeroInputSyncData` 구조체를 통해 동작 입력시간 보정
```csharp
protected override void OnStartAttackHold(NetworkHeroController.HeroInputSyncData syncData)
{
    // AttackHold조건 판별
    if (_isAttackHold) return;
    if (_isGuard) return;
    if (HeroStatus.CurrentStance != IHeroStatus.Stance.StandUp) return;
    
    // 동작중인 공격 캔슬
    if (_currentSkill?.skillType == BaseHeroSkill.SkillType.Attack) _currentSkill.CancellationByInternal();
    
    // AttackHold 플래그 처리 및 지연시간 적용
    _isAttackHold = true;
    _attackHoldDuration = syncData.Latency();
    
    _skillQueue.Clear();
    if (_skillCoroutine != null)
    {
        if (_skillQueue.Count < 2)
        {
            _skillQueue.Enqueue(new SkillStruct(chargingSkill,
                new BaseHeroSkill.SkillExecutionData(), 
                OnAttackHoldStart, OnSkillComplete, OnAttackSucceed));
        }
    }
    else
    {
        // 스킬 실행 데이터에 지연시간 데이터 포함
        _skillCoroutine = StartCoroutine(DoSkill(chargingSkill,
            new BaseHeroSkill.SkillExecutionData(syncData.Latency()), 
            OnAttackHoldStart, OnSkillComplete, OnAttackSucceed));
    }
}
```

## 관련 클래스
- [`NetworkBehaviour`](https://doc.photonengine.com/fusion/current/manual/network-behaviour)
- [`NetworkHeroObject`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroObject)
- [`HeroController`](/docs/projects/rfist/HeroControlSystem/HeroController)
- [`NetworkHeroStatus`](/docs/projects/rfist/HeroNetworkSystem/NetworkHeroStatus)
- [`HeroInputData`](/docs/projects/rfist/herocontrolsystem/HeroInputData)
- [`IHeroController`](/docs/projects/rfist/HeroControlSystem/IHeroController)
- [`NetworkHeroInput`](/docs/projects/rfist/HeroNetworkSystem/networkheroinput)
+++
title = "ITarget"
description = "SlimeRush 게임의 전투 시스템에서 타겟을 정의"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 214
+++
## 개요
`ITarget` 인터페이스는 SlimeRush 게임의 전투 시스템에서 타겟을 정의합니다. 이 인터페이스는 타겟의 위치(`Vector3`) 반환, 타겟의 `Transform` 컴포넌트 반환,
[`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble) 인터페이스를 구현하는 오브젝트 인스턴스 반환 등의 기능을 제공합니다.

## 역할
- 타겟의 위치 반환(`Vector3`)
- 타겟의 `Transform` 컴포넌트 반환
- [`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble) 인터페이스를 구현하는 오브젝트 인스턴스 반환

## 선언
```csharp
public interface ITarget
```

## 멤버
### 메서드
```csharp
/// <summary>
/// 타겟의 위치를 반환합니다.
/// </summary>
/// <returns>타겟의 위치를 Vector3 형태로 반환합니다.</returns>
public Vector3 GetPosition();
```

```csharp
/// <summary>
/// 타겟의 Transform 컴포넌트를 반환합니다.
/// </summary>
/// <returns>타겟의 Transform 컴포넌트를 반환합니다.</returns>
public Transform GetTransform();
```

```csharp
/// <summary>
/// IDamageAble 인터페이스를 구현하는 오브젝트 인스턴스를 반환합니다.
/// </summary>
/// <returns>IDamageAble 인터페이스를 구현하는 오브젝트를 반환합니다.</returns>
public IDamageAble GetDamageAble();
```

## 기능 설명
### 구현체에서 컴포넌트 반환 반환
- 구현체의 위치를 `Vector3` 형태로 반환
- 구현체의 `Transform` 컴포넌트를 반환
- [`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble) 인터페이스를 구현하는 오브젝트를 반환

## 의존성/상속 관계
- 구현체
  - `BaseMonster` : 몬스터의 기본 기능을 정의하는 클래스에서 해당 인터페이스를 구현
  - `PlayerTarget` : 플레이어 타겟팅을 관리하는 클래스에서 해당 인터페이스를 구현

## 사용 예시
#### [`TargetScanner`](/docs/projects/SlimeRush/BattleSystem/TargetScanner)에서 범위 내의 타겟을 서치할 때 `GetPosition()` 사용
```csharp
private List<ITarget> GetTargetsInRange(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)
{
    // 스캔 시작 위치에서 각 타겟까지의 거리를 계산하여 스캔 범위 내에 있는 타겟만 필터링합니다
    return targets
        .Where(target => Vector3.Distance(scanBeginPoint, target.GetPosition()) <= scanRange)
        .ToList();
}
```

#### `MagicEffect`에서 마법이 발동될 때 시전자의 `Transform`을 기반으로 동작을 설정하기 위해 `GetTransform()`사용
```csharp
public void InvokeMagic(ITarget invoker, Vector3 targetPos, string magicObjectId)
{
    PlaySfx(MagicEffectType.Shoot, magicObjectId, invoker.GetPosition());
    
    var go = GetEffectPrefab(magicObjectId, MagicEffectType.Shoot, DefaultDurationTime);
    if (go == null) return;
    
    var parent = invoker.GetTransform();
    var pos = parent.position;
    var direction = (targetPos - pos).normalized;
    var lookRotation = Quaternion.LookRotation(direction);
    go.transform.SetPositionAndRotation(pos, lookRotation);
    go.transform.SetParent(parent, true);
}
```

#### `GunBullet`에서 공격 동작을 위해 `GetDamageAble()` 사용
```csharp
public void Fire(ITarget target, float power, float bulletSpeed)
{
    _damageAble = target.GetDamageAble();
    Fire(target.GetPosition(), power, bulletSpeed);
}
```

## 관련 클래스
- [`IDamageAble`](/docs/projects/SlimeRush/BattleSystem/IDamageAble)

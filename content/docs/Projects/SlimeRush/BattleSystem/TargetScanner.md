+++
title = "TargetScanner"
description = "전투 시스템에서 타겟을 찾는 기능을 제공하는 클래스"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`TargetScanner` 클래스는 SlimeRush 게임의 전투 시스템에서 타겟을 스캔하는 기능을 제공하는 클래스입니다. 이 클래스는 플레이어의 위치와 스캔 범위를 기반으로 가장 가까운 타겟, 랜덤한 타겟, 랜덤한 위치를 찾는 기능을 제공합니다.

## 역할
- 타겟 스캔
- 가장 가까운 타겟 찾기
- 랜덤한 타겟 찾기
- 랜덤한 위치 찾기

## 멤버
### 속성
```csharp
/// <summary>
/// 타겟 시스템
/// 타겟을 찾고 관리하는 시스템입니다.
/// </summary>
[Inject]
private TargetSystem targetSystem;
```

### 메서드
```csharp
/// <summary>
/// 가장 가까운 타겟을 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>가장 가까운 타겟</returns>
public ITarget FindNearestTarget(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)

/// <summary>
/// 가장 가까운 타겟을 여러 개 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanTargetNumber">찾을 타겟 수</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>가장 가까운 타겟 배열</returns>
public ITarget[] FindNearestTarget(Vector3 scanBeginPoint, ITarget[] targets, int scanTargetNumber, float scanRange)

/// <summary>
/// 랜덤한 타겟을 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>랜덤한 타겟</returns>
public ITarget FindRandomTarget(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)

/// <summary>
/// 랜덤한 타겟을 여러 개 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanTargetNumber">찾을 타겟 수</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>랜덤한 타겟 배열</returns>
public ITarget[] FindRandomTarget(Vector3 scanBeginPoint, ITarget[] targets, int scanTargetNumber, float scanRange)

/// <summary>
/// 랜덤한 위치를 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targetRange">타겟 범위</param>
/// <returns>랜덤한 위치</returns>
public Vector3 FindRandomPosition(Vector3 scanBeginPoint, float targetRange)

/// <summary>
/// 랜덤한 위치를 여러 개 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="scanTargetNumber">찾을 위치 수</param>
/// <param name="targetRange">타겟 범위</param>
/// <returns>랜덤한 위치 배열</returns>
public Vector3[] FindRandomPosition(Vector3 scanBeginPoint, int scanTargetNumber, float targetRange)

/// <summary>
/// 범위 내의 타겟을 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>범위 내의 타겟 목록</returns>
private List<ITarget> GetTargetsInRange(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)

/// <summary>
/// 범위 내의 타겟을 거리순으로 정렬하여 찾습니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targets">타겟 배열</param>
/// <param name="scanRange">스캔 범위</param>
/// <returns>거리순으로 정렬된 타겟 목록</returns>
private List<ITarget> GetDistanceSortedTargetsInRange(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)

/// <summary>
/// 랜덤한 위치를 생성합니다.
/// </summary>
/// <param name="scanBeginPoint">스캔 시작 위치</param>
/// <param name="targetRange">타겟 범위</param>
/// <returns>생성된 랜덤한 위치</returns>
private Vector3 GenerateRandomPosition(Vector3 scanBeginPoint, float targetRange)
```

## 주요 코드 스니펫
### 가장 가까운 타겟 찾기
```csharp
public ITarget FindNearestTarget(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)
{
    // 스캔 시작 위치에서 타겟까지의 거리를 계산하여 거리순으로 정렬된 타겟 목록을 가져옵니다
    var sortedTargetInRange = GetDistanceSortedTargetsInRange(scanBeginPoint, targets, scanRange);
    // 스캔 범위 내에 타겟이 없는 경우 null을 반환합니다
    if (sortedTargetInRange.Count == 0) return null;

    // 거리순으로 정렬된 목록의 첫 번째 타겟(가장 가까운 타겟)을 반환합니다
    return sortedTargetInRange.FirstOrDefault();
}

public ITarget[] FindNearestTarget(Vector3 scanBeginPoint, ITarget[] targets, int scanTargetNumber, float scanRange)
{
    // 스캔 시작 위치에서 타겟까지의 거리를 계산하여 거리순으로 정렬된 타겟 목록을 가져옵니다
    var sortedTargetInRange = GetDistanceSortedTargetsInRange(scanBeginPoint, targets, scanRange);
    // 스캔 범위 내에 타겟이 없는 경우 null을 반환합니다
    if (sortedTargetInRange.Count == 0) return null;

    // 스캔 범위 내의 타겟 수가 찾고자 하는 타겟 수보다 적거나 같은 경우 모든 타겟을 반환합니다
    if (sortedTargetInRange.Count <= scanTargetNumber)
    {
        return sortedTargetInRange.ToArray();
    }
    else
    {
        // 거리순으로 정렬된 목록에서 찾고자 하는 타겟 수만큼(가장 가까운 타겟들)을 반환합니다
        return sortedTargetInRange.Take(scanTargetNumber).ToArray();
    }
}
```

### 랜덤한 타겟 찾기
```csharp
public ITarget FindRandomTarget(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)
{
    // 스캔 범위 내의 타겟 목록을 가져옵니다
    var targetsInRange =
        GetTargetsInRange(scanBeginPoint, targets, scanRange);

    // 스캔 범위 내에 타겟이 없는 경우 null을 반환합니다
    if (targetsInRange.Count == 0) return null;

    // 랜덤 인덱스를 생성합니다
    var random = new System.Random();
    int randomIndex = random.Next(targetsInRange.Count);

    // 랜덤하게 선택된 타겟을 반환합니다
    return targetsInRange[randomIndex];
}

public ITarget[] FindRandomTarget(Vector3 scanBeginPoint, ITarget[] targets, int scanTargetNumber, float scanRange)
{
    // 스캔 범위 내의 타겟 목록을 가져옵니다
    var targetsInRange = GetTargetsInRange(scanBeginPoint, targets, scanRange);

    // 스캔 범위 내에 타겟이 없는 경우 null을 반환합니다
    if (targetsInRange.Count == 0) return null;

    // 스캔 범위 내의 타겟 수가 찾고자 하는 타겟 수보다 적거나 같은 경우 모든 타겟을 반환합니다
    if (targetsInRange.Count <= scanTargetNumber)
    {
        return targetsInRange.ToArray();
    }
    // 타겟 목록을 셔플하여 랜덤하게 섞은 후 찾고자 하는 타겟 수만큼을 반환합니다
    var shuffledTargets = targetsInRange.GetShuffledList().Take(scanTargetNumber).ToArray();

    return shuffledTargets;
}
```

### 랜덤한 위치 찾기
```csharp
public Vector3 FindRandomPosition(Vector3 scanBeginPoint, float targetRange)
{
    // 스캔 시작 위치를 기준으로 랜덤한 위치를 생성합니다
    return GenerateRandomPosition(scanBeginPoint, targetRange);
}

public Vector3[] FindRandomPosition(Vector3 scanBeginPoint, int scanTargetNumber, float targetRange)
{
    // 랜덤 위치 배열을 생성합니다
    Vector3[] randomPositions = new Vector3[scanTargetNumber];

    // 찾고자 하는 위치 수만큼 랜덤한 위치를 생성합니다
    for (int i = 0; i < scanTargetNumber; i++)
    {
        randomPositions[i] = GenerateRandomPosition(scanBeginPoint, targetRange);
    }

    return randomPositions;
}

private Vector3 GenerateRandomPosition(Vector3 scanBeginPoint, float targetRange)
{
    // 스캔 시작 위치의 X 좌표를 기준으로 랜덤한 X 좌표를 생성합니다
    float randomX = Random.Range(scanBeginPoint.x - targetRange, scanBeginPoint.x + targetRange);
    // 스캔 시작 위치의 Z 좌표를 기준으로 랜덤한 Z 좌표를 생성합니다
    float randomZ = Random.Range(scanBeginPoint.z - targetRange, scanBeginPoint.z + targetRange);
    // 새로운 위치를 생성하여 반환합니다 (Y 좌표는 스캔 시작 위치의 Y 좌표를 사용합니다)
    return new Vector3(randomX, scanBeginPoint.y, randomZ);
}
```

### 스캔 범위 내 타겟 찾기
```csharp
private List<ITarget> GetTargetsInRange(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)
{
    // 스캔 시작 위치에서 각 타겟까지의 거리를 계산하여 스캔 범위 내에 있는 타겟만 필터링합니다
    return targets
        .Where(target => Vector3.Distance(scanBeginPoint, target.GetPosition()) <= scanRange)
        .ToList();
}
```

### 거리순으로 정렬된 타겟 찾기
```csharp
private List<ITarget> GetDistanceSortedTargetsInRange(Vector3 scanBeginPoint, ITarget[] targets, float scanRange)
{
    // 각 타겟을 타겟 객체와 스캔 시작 위치에서 타겟까지의 거리 쌍으로 변환합니다
    var sortedTargetsInRange = targets.
        Select(target => new {Target = target, Distance = Vector3.Distance(scanBeginPoint, target.GetPosition())})
        // 스캔 범위 내에 있는 타겟만 필터링합니다
        .Where(x => x.Distance <= scanRange)
        // 거리를 기준으로 오름차순으로 정렬합니다
        .OrderBy(x=> x.Distance)
        // 타겟 객체만 선택합니다
        .Select(x => x.Target)
        .ToList();
    return sortedTargetsInRange;
}
```

## 기능 설명
### 가장 가까운 타겟 찾기
- 스캔 시작 위치와 스캔 범위를 기반으로 타겟 서칭
- 거리순으로 정렬된 타겟 목록을 반환
- 가장 가까운 타겟을 반환

### 랜덤한 타겟 찾기
- 스캔 시작 위치와 스캔 범위를 기반으로 타겟 서칭
- 랜덤한 타겟을 선택하여 반환

### 랜덤한 위치 찾기
- 스캔 시작 위치와 타겟 범위를 기반으로 랜덤한 위치 생성
- 랜덤한 위치를 반환

### 스캔 범위 내 타겟 찾기
- 스캔 시작 위치와 스캔 범위를 기반으로 타겟 필터링
- 필터링된 타겟 목록을 반환

### 거리순으로 정렬된 타겟 찾기
- 스캔 시작 위치와 스캔 범위를 기반으로 타겟 필터링
- 거리를 계산하고, 거리순으로 정렬된 타겟 목록을 반환

### 랜덤한 위치 생성
- 스캔 시작 위치와 타겟 범위를 기반으로 랜덤한 위치 생성
- 랜덤한 위치를 반환

## 의존성/상속 관계
- `MonoBehaviour`를 상속받습니다.
- `Battle.Common.Target` 네임스페이스에 의존합니다.

## 사용 예시
#### `TargetSystem`에서 타겟 타입에 따라 랜덤 혹은 가장 가까운 타겟 찾아 반환
```csharp
public ITarget FindTarget(
    Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 타겟 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        case MagicTargetType.RandomTarget:
            // 랜덤 타겟을 찾습니다
            var randomTarget = targetScanner.FindRandomTarget(scanPoint,_enemies.ToArray(), targetRadius);
            return randomTarget;
        case MagicTargetType.Nearest:
            // 가장 가까운 타겟을 찾습니다
            var nearTarget = targetScanner.FindNearestTarget(scanPoint,_enemies.ToArray(), targetRadius);
            return nearTarget;
        default:
            // 지원하지 않는 타입인 경우 null을 반환합니다
            return null;
    }
}
```

#### `TargetSystem`에서 타겟 타입에 따라 랜덤 혹은 가장 가까운 타겟 여러개를 찾아 반환
```csharp
public ITarget[] FindTargets(
    Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 타겟 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        case MagicTargetType.RandomTarget:
            // 랜덤 타겟을 여러 개 찾습니다
            var randomTargets = targetScanner.FindRandomTarget(
                scanPoint, _enemies.ToArray(),targetLength, targetRadius);
            return randomTargets?.ToArray();
        case MagicTargetType.Nearest:
            // 가장 가까운 타겟을 여러 개 찾습니다
            var nearTargets = targetScanner.FindNearestTarget(
                scanPoint, _enemies.ToArray(), targetLength, targetRadius);
            return nearTargets?.ToArray();
        default:
            // 지원하지 않는 타입인 경우 null을 반환합니다
            return null;
    }
}
```

#### `TargetSystem`에서 타겟 타입에 따라 랜덤 포지션 혹은 여러개의 랜덤 포지션을 생성해 반환
```csharp
public Vector3 FindPosition(Vector3 scanPoint, MagicTargetType magicTargetType, float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 위치 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        default:
        case MagicTargetType.None:
            // 랜덤 위치를 찾습니다
            return targetScanner.FindRandomPosition(scanPoint, targetRadius);
        case MagicTargetType.Mouse:
        {
            // 마우스 위치를 가져오고, 실패하면 플레이어 앞 위치를 사용합니다
            return TryGetMousePosition(out var resultPos) ? resultPos : GetPlayerForward();
        }
    }
}

public Vector3[] FindPositions(Vector3 scanPoint, MagicTargetType magicTargetType, int targetLength,
    float targetRadius = DefaultScanRadius)
{
    // 마법 타겟 타입에 따라 다른 위치 찾기 방법을 사용합니다
    switch (magicTargetType)
    {
        default:
        case MagicTargetType.None:
            // 랜덤 위치를 여러 개 찾습니다
            return targetScanner.FindRandomPosition(scanPoint, targetLength, targetRadius);
        case MagicTargetType.Mouse:
        {
            // 마우스 위치를 가져오고, 실패하면 플레이어 앞 위치를 사용합니다
            return new Vector3[] { TryGetMousePosition(out var resultPos) ? resultPos : GetPlayerForward() };
        }
    }
}
```

## 관련 클래스
- `TargetSystem`
- `ITarget`
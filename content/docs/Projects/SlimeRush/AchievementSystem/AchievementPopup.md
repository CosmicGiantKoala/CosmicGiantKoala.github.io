+++
title = "AchievementPopup"
description = "업적 팝업 UI를 관리하는 컴포넌트"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 201
+++
## 개요
`AchievementPopup` 클래스는 SlimeRush 게임의 업적 시스템에서 업적 팝업 UI를 관리하는 컴포넌트입니다. 
이 클래스는 업적 목록을 표시하고, 업적 상태 변경 시 자동으로 UI를 업데이트하며, 업적 아이템([`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem))의 정렬 및 레이아웃 관리를 담당합니다.
플레이어의 업적 진행 상황을 시각적으로 표시하여 게임 내 성취도를 확인할 수 있도록 합니다.

## 역할
- 업적 목록 UI 관리
- 업적 아이템([`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem)) 동적 생성 및 초기화
- 업적 상태 변경 감지 및 UI 업데이트
- 업적 아이템([`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem)) 동적 정렬

## 선언
```csharp
public class AchievementPopup : MonoBehaviour
```

## 멤버
### 속성
```csharp
/// <summary>
/// 업적 시스템 (의존성 주입)
/// </summary>
[Inject]
private AchievementSystem _achievementSystem;

/// <summary>
/// 아이템 목록 컨텍스트
/// </summary>
[SerializeField]
private GameObject _itemListContext;

/// <summary>
/// 업적 아이템 프리팹
/// </summary>
[SerializeField]
private GameObject _achievementItem;

/// <summary>
/// 업적 팝업 아이템 목록
/// </summary>
private readonly List<AchievementPopupItem> _achievementPopupItems = new List<AchievementPopupItem>();
```

### 메서드
```csharp
/// <summary>
/// 팝업 활성화 시 호출 (Unity OnEnable)
/// </summary>
private void OnEnable()

/// <summary>
/// 팝업 비활성화 시 호출 (Unity OnDisable)
/// </summary>
private void OnDisable()

/// <summary>
/// 업적 목록을 생성하거나 업데이트합니다.
/// 기존 항목을 재사용하거나 새로운 항목을 생성하여 업적 정보를 표시합니다.
/// </summary>
private void CreateAchievementList()

/// <summary>
/// 업적 목록을 정렬합니다.
/// 완료된 업적은 미완료 업적보다 뒤에 표시되며, 같은 상태의 업적은 ID 순으로 정렬됩니다.
/// </summary>
private void SortAchievementList()

/// <summary>
/// 컨텐츠 컨테이너의 크기를 업적 개수에 맞게 조정합니다.
/// </summary>
/// <param name="count">업적 개수</param>
private void UpdateContentsContextRect(int count)
```

## 주요 코드 스니펫
### 이벤트 구독 관리
```csharp
private void OnEnable()
{
    // 업적 목록을 처음 생성합니다
    CreateAchievementList();
    // 업적 상태가 변경될 때마다 업적 목록을 새로고침하기 위해 이벤트를 구독합니다
    _achievementSystem.OnChangedAchievementState += CreateAchievementList;
}

private void OnDisable()
{
    // 이벤트 구독을 해제하여 메모리 누수를 방지합니다
    _achievementSystem.OnChangedAchievementState -= CreateAchievementList;
}
```

### 업적 목록 생성
```csharp
private void CreateAchievementList()
{
    // 업적 시스템에서 모든 업적 정보를 가져옵니다
    var allAchievements = _achievementSystem.Achievements;
    
    // 컨텐츠 컨테이너의 크기를 업적 개수에 맞게 조정합니다
    UpdateContentsContextRect(allAchievements.Count);

    // 모든 업적 정보를 순회하며 UI를 업데이트합니다
    foreach (var achievement in allAchievements)
    {
        // 이미 존재하는 업적 항목을 찾습니다
        var matchedItem = _achievementPopupItems.FirstOrDefault(item => item.AchievementID == achievement.Id);
        if (matchedItem != null)
        {
            // 기존 항목이 있으면 정보만 업데이트합니다
            matchedItem.InitializeAchievementInfo(achievement);
        }
        else
        {
            // 새로운 항목을 생성합니다
            var item = Instantiate(_achievementItem, _itemListContext.transform);
            var achievementItem = item.GetComponent<AchievementPopupItem>();
            achievementItem.InitializeAchievementInfo(achievement);
            // 새로 생성된 항목을 목록에 추가합니다
            _achievementPopupItems.Add(achievementItem);
        }
    }

    // 업적 목록을 정렬합니다
    SortAchievementList();
}
```

### 업적 목록 정렬

```csharp
private void SortAchievementList()
{
    // 업적 항목을 비교 로직에 따라 정렬합니다
    _achievementPopupItems.Sort((a,b)=> a.CompareTo(b));

    // 정렬된 순서에 따라 UI 계층 구조를 업데이트합니다
    for (int i = 0; i < _achievementPopupItems.Count; i++)
    {
        _achievementPopupItems[i].transform.SetSiblingIndex(i);
    }
}
```

### 레이아웃 동적 조정

```csharp
private void UpdateContentsContextRect(int count)
{
    // 업적 개수가 0 이하이면 조정을 건너뜁니다
    if (count <= 0) return;
    
    // 레이아웃 그룹에서 항목 간 간격을 가져옵니다
    var spacing = _itemListContext.GetComponent<HorizontalOrVerticalLayoutGroup>().spacing;
    
    // 개별 업적 항목의 높이를 가져옵니다
    var itemHeight = _achievementItem.GetComponent<RectTransform>().rect.height;
    
    // 컨텐츠 컨테이너의 RectTransform을 가져옵니다
    var contextRectTrans = _itemListContext.GetComponent<RectTransform>();

    // 필요한 총 높이를 계산합니다 (항목 높이 + 간격) * 개수
    var calculatedHeight = (itemHeight * count) + (spacing * (count));
    
    // 새로운 크기를 설정합니다 (너비는 유지, 높이만 조정)
    var changedScale = new Vector2(contextRectTrans.sizeDelta.x, calculatedHeight);

    // 컨테이너의 크기를 업데이트합니다
    contextRectTrans.sizeDelta = changedScale;
}
```

## 기능 설명
### 동적 업적 목록 관리
- **데이터 바인딩**: [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)에서 업적 데이터 가져오기
- **아이템 재사용**: 기존 아이템([`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem))이 있으면 재사용, 없으면 새로 생성
- **동적 업데이트**: 업적 상태 변경 시 자동으로 UI 갱신

### 이벤트 기반 업데이트
- **상태 변경 감지**: [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)의 OnChangedAchievementState 이벤트 구독
- **자동 갱신**: 업적 상태 변경 시 자동으로 UI 갱신
- **효율적 갱신**: 변경된 데이터만 갱신하여 성능 최적화

### 동적 레이아웃 관리
- **동적 크기 조정**: 업적 수에 따라 스크롤 뷰 크기 자동 조정
- **정렬 기능**: 완료 상태, ID에 따른 우선 정렬
- **시각적 일관성**: 일관된 아이템 간격 및 레이아웃 유지

## 의존성/상속 관계
- `MonoBehaviour`를 상속받음
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem) 클래스에 의존 (의존성 주입)
- [`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem) 클래스에 의존
- [`UnityEngine.UI`](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/api/UnityEngine.UI.html) 네임스페이스 사용

## 관련 클래스
- [`AchievementSystem`](/docs/projects/SlimeRush/AchievementSystem/AchievementSystem)
- [`AchievementPopupItem`](/docs/projects/SlimeRush/AchievementSystem/AchievementPopupItem)
- [`Achievement`](/docs/projects/SlimeRush/AchievementSystem/Achievement)
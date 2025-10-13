+++
title = "프리팹ID 관리 유틸리티"
# description = "Rfice 개요"
icon = "barcode_scanner"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 303
+++

# PrefabLocalId 시스템 상세 기능 개요
## 📋 시스템 개요
PrefabLocalId 시스템은 Unity 프리팹 내의 컴포넌트들에게 고유한 로컬 ID를 자동으로 할당하고 관리하는 시스템입니다. 주로 프리팹이 변경될 때마다 자동으로 ID를 갱신하여 컴포넌트 간의 참조 무결성을 보장합니다.
## 🏗️ 시스템 구조 및 핵심 컴포넌트
### 1. 핵심 클래스 구조```
PrefabLocalId System
├── PrefabLocalIdHelper (Editor Only)     # 프리팹 변경 감지 및 ID 갱신 관리
├── PrefabLocalIdInteractor              # 프리팹의 LocalId 데이터 저장 및 관리
├── IPrefabLocalIdInteractor             # LocalId를 받을 수 있는 컴포넌트 인터페이스
└── Data Structures
├── LocalIdGroupInfo                 # 클래스별 LocalId 그룹 정보
└── LocalIdInfo                     # 개별 컴포넌트의 LocalId 정보
```

2. 데이터 구조 분석``` csharp
[Serializable]
public struct LocalIdGroupInfo
{
    public string TargetClassName;           // 대상 클래스명
    public List<LocalIdInfo> LocalIdentifierInfos;  // 해당 클래스의 모든 인스턴스 ID 정보
}

[Serializable] 
public struct LocalIdInfo
{
    public Component TargetObject;           // 대상 컴포넌트 참조
    public string PrefabLocalID;            // Unity 내부 LocalFileIdentifier
}
```

🔄 이벤트 시스템 및 연관 코드
1. 에디터 이벤트 콜백 구조``` csharp
   static PrefabLocalIdHelper()
   {
   // 프리팹 편집 후 저장 시 콜백
   PrefabStage.prefabSaved -= OnChangedPrefab;
   PrefabStage.prefabSaved += OnChangedPrefab;

   // 하이어라키에서 프리팹 Override 시 콜백  
   PrefabUtility.prefabInstanceUpdated -= OnChangedPrefab;
   PrefabUtility.prefabInstanceUpdated += OnChangedPrefab;
   }
```

2. 이벤트 흐름도``` 
프리팹 변경 감지
    ↓
OnChangedPrefab() 호출
    ↓
프리팹 에셋 및 인스턴스 구분
    ↓
ReloadLocalId() 실행
    ↓
FindLocalId()로 새로운 ID 수집
    ↓
원본 에셋 및 인스턴스 데이터 갱신
    ↓
에셋 저장 (VCS 반영)
```

⚙️ 핵심 기능 상세 분석
1. 자동 ID 갱신 시스템
   핵심 메서드: OnChangedPrefab()``` csharp
   private static void OnChangedPrefab(GameObject changedPrefabInstance)
   {
   if (changedPrefabInstance.TryGetComponent(out PrefabLocalIdInteractor instancesInteractor))
   {
   GameObject prefabAsset;
   PrefabStage prefabStage = PrefabStageUtility.GetCurrentPrefabStage();

        // 프리팹 편집 모드 vs 하이어라키 Override 구분
        if (prefabStage != null)
        {
            prefabAsset = AssetDatabase.LoadAssetAtPath<GameObject>(prefabStage.assetPath);
        }
        else
        {
            prefabAsset = PrefabUtility.GetCorrespondingObjectFromSource(changedPrefabInstance);
        }
        
        // 원본 에셋 갱신
        var originAssetsInteractor = prefabAsset.GetComponent<PrefabLocalIdInteractor>(); 
        ReloadLocalId(originAssetsInteractor);
        
        // 인스턴스 데이터 동기화
        instancesInteractor.UpdateLocalIdGroup(originAssetsInteractor.LocalIdGroup());
   }
   }
```

2. LocalId 수집 및 할당 시스템
핵심 메서드: FindLocalId()``` csharp
private static List<LocalIdGroupInfo> FindLocalId(PrefabLocalIdInteractor interactor)
{
    // 모든 IPrefabLocalIdInteractor 구현체 수집
    var interfaces = interactor.GetComponentsInChildren<IPrefabLocalIdInteractor>(true);
    
    // 클래스별로 그룹화
    var implementationGroup = interfaces.GroupBy(c => c.GetType());
    var localIdGroups = new List<LocalIdGroupInfo>();
    
    foreach (var implementClass in implementationGroup)
    {
        var typeName = implementClass.Key.Name;
        var localIdInfos = new List<LocalIdInfo>();
        
        foreach (var implementObject in implementClass)
        {
            var implementComp = implementObject as Component;
            
            // Unity AssetDatabase에서 LocalFileIdentifier 추출
            if (AssetDatabase.TryGetGUIDAndLocalFileIdentifier(implementComp, 
                out string guid, out long localId))
            {
                var localIdInfo = new LocalIdInfo(implementComp, localId.ToString());
                localIdInfos.Add(localIdInfo);
                
                // 해당 컴포넌트에 ID 전달
                implementObject.GrantLocalId(localIdInfo.PrefabLocalID);
            }
        }
        localIdGroups.Add(new LocalIdGroupInfo(typeName, localIdInfos));
    }
    return localIdGroups;
}
```

3. 런타임 ID 분배 시스템
   핵심 메서드: GrantLocalId()``` csharp
   private void GrantLocalId()
   {
   foreach (var localIdTarget in localIdGroup)
   {
   foreach (var localIdInfo in localIdTarget.LocalIdentifierInfos)
   {
   var target = localIdInfo.TargetObject.GetComponent<IPrefabLocalIdInteractor>();
   target.GrantLocalId(localIdInfo.PrefabLocalID);
   }
   }
   }
```

🔧 주요 특징 및 기술적 구현
1. Unity 에디터 통합
[InitializeOnLoad] 속성으로 에디터 시작 시 자동 초기화
PrefabStage와 PrefabUtility 이벤트 활용한 실시간 감지
AssetDatabase API를 통한 LocalFileIdentifier 추출
2. 데이터 지속성 보장
[SerializeField]를 통한 데이터 직렬화
EditorUtility.SetDirty()와 AssetDatabase.SaveAssetIfDirty()로 VCS 연동
프리팹 에셋과 인스턴스 간 데이터 동기화
3. 확장성 있는 인터페이스 설계
IPrefabLocalIdInteractor 인터페이스로 느슨한 결합
클래스별 그룹화로 효율적인 데이터 관리
컴포넌트 기반 아키텍처
💡 사용 시나리오
1. 프리팹 내 컴포넌트 식별``` csharp
public class MyComponent : MonoBehaviour, IPrefabLocalIdInteractor
{
    private string myLocalId;
    
    public void GrantLocalId(string localId)
    {
        myLocalId = localId;
        // 고유 ID를 활용한 로직 구현
    }
}
```
### 2. 전체 프리팹 ID 리로드
- **메뉴**: `Rfice -> ReloadAllLocalId`
- 모든 프리팹의 LocalId를 일괄 갱신
- 대규모 리팩토링 후 데이터 정합성 보장

## 🎯 시스템의 가치
1. **개발 효율성**: 프리팹 변경 시 자동 ID 갱신으로 수동 작업 불필요
2. **데이터 무결성**: Unity 내부 ID 시스템 활용으로 안정적인 참조 관리
3. **확장성**: 인터페이스 기반 설계로 다양한 컴포넌트 지원
4. **VCS 연동**: 자동 저장으로 팀 협업 시 변경사항 추적 가능

이 시스템은 Unity 프로젝트에서 프리팹 기반 컴포넌트 관리를 자동화하여 개발 생산성을 크게 향상시키는 핵심 인프라스트럭처입니다.
+++
title = "MyRoomEditorColorEditItem"
description = "선택 가능한 색상 항목을 나타내는 UI 컴포넌트"
icon = "code"
date = "2023-05-22T00:27:57+01:00"
lastmod = "2023-05-22T00:27:57+01:00"
draft = false
toc = true
weight = 431
+++

## 개요

`MyRoomEditorColorEditItem`은 선택 가능한 색상 항목을 나타내는 UI 컴포넌트입니다. 개별 색상을 표시하고 선택 상태를 관리합니다.

## 주요 메서드

```csharp
public void Initialize(int index)
public void Selected()
public void SetItemColor(Color color)
public void Release()
```

각 색상 옵션을 버튼 형태로 표시하고 선택 이벤트를 처리합니다.

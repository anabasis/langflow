# 컴포넌트 번들 기여하기

[**번들**](https://docs.langflow.org/components-bundle-components)은 특정 서비스 제공업체와 관련된 컴포넌트 그룹입니다. 커스텀 컴포넌트를 Langflow 프로젝트에 기여하려면 번들에 넣어야 합니다.

이 예시는 `DarthVader`라는 번들을 추가하는 방법을 보여줍니다.

---

## lfx 컴포넌트 폴더에 번들 추가

1. Langflow 저장소의 lfx 디렉토리로 이동하여 번들의 새 폴더를 만듭니다:
   `src/lfx/src/lfx/components/darth_vader`

2. 새로 만든 `darth_vader` 폴더 안에 다음 파일을 추가합니다:
   - `darth_vader_component.py` — 새 번들의 백엔드 로직이 포함된 파일
   - `__init__.py` — 번들 컴포넌트를 초기화하는 파일

---

## 프론트엔드 폴더에 번들 추가

1. Langflow 저장소의 프론트엔드 디렉토리로 이동하여 번들 아이콘을 추가합니다:
   `src/frontend/src/icons/DarthVader`

2. `icons/darth_vader` 폴더에 아이콘의 원시 SVG 파일(예: `darth_vader-icon.svg`)을 추가합니다.

3. `icons/darth_vader` 폴더에 JSX 형식의 아이콘 React 컴포넌트(예: `DarthVaderIcon.jsx`)를 추가합니다.

4. `icons/darth_vader` 폴더에 TypeScript 형식의 React 컴포넌트(예: `index.tsx`)를 추가합니다:

```tsx
import { useDarkStore } from "@/stores/darkStore";
import React, { forwardRef } from "react";
import DarthVaderIconSVG from "./DarthVaderIcon";

export const DarthVaderIcon = forwardRef<
  SVGSVGElement,
  React.PropsWithChildren<{}>
>((props, ref) => {
  const isdark = useDarkStore((state) => state.dark).toString();
  return <DarthVaderIconSVG ref={ref} isdark={isdark} {...props} />;
});

export default DarthVaderIcon;
```

5. `/src/frontend/src/icons/lazyIconImports.ts`를 열고 아이콘 이름을 추가합니다:

```typescript
DarthVader: () =>
  import("@/icons/DarthVader").then((mod) => ({ default: mod.DarthVaderIcon })),
```

6. `/src/frontend/src/utils/styleUtils.ts`의 `SIDEBAR_BUNDLES` 배열을 수정하여 번들을 **Bundles** 메뉴에 추가합니다:

```typescript
{ display_name: "DarthVader", name: "darth_vader", icon: "DarthVader" },
```

---

## 번들 컴포넌트를 아이콘으로 업데이트

`darth_vader_component.py` 파일에서 컴포넌트 클래스에 아이콘을 포함합니다:

```python
class DarthVaderAPIComponent(LCToolComponent):
    display_name: str = "Darth Vader Tools"
    description: str = "에이전트로 작업을 실행하기 위해 포스를 사용합니다"
    name = "DarthVaderAPI"
    icon = "DarthVader"
```

---

## 애플리케이션이 컴포넌트 번들을 빌드하는지 확인

백엔드와 프론트엔드를 다시 빌드합니다:

```bash
make install_frontend && make build_frontend && make install_backend && uv run langflow run --port 7860
```

프론트엔드 애플리케이션을 새로 고침하면 `DarthVader`라는 새 번들이 비주얼 에디터의 **Bundles** 메뉴에서 사용 가능합니다.

---

*원문: https://docs.langflow.org/next/contributing-bundles*

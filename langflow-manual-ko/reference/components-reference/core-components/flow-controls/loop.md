# Loop

> 원문: https://docs.langflow.org/next/loop

**Loop** 컴포넌트는 입력 목록을 순회하며 처리할 항목이 남아 있지 않을 때까지 **Item** 출력 포트에 연결된 다른 컴포넌트에 개별 항목을 전달합니다.
그런 다음 **Loop** 컴포넌트는 모든 반복 처리의 집계 결과를 **Done** 포트에 연결된 컴포넌트로 전달합니다.

## 반복 처리 과정[​](#the-looping-process "Direct link to The looping process")

**Loop** 컴포넌트는 플로우 안의 작은 플로우와 같습니다.
반복 처리 과정을 단계별로 살펴보면 다음과 같습니다.

1. **Loop** 컴포넌트의 **Inputs** 포트를 통해 CSV 파일과 같은 [`JSON`](https://docs.langflow.org/data-types#json) 또는 [`Table`](https://docs.langflow.org/data-types#table) 객체 목록을 받습니다.

2. 입력을 개별 항목으로 분할합니다. 예를 들어 CSV 파일은 행 단위로 분해됩니다.

    구체적으로, **Loop** 컴포넌트는 `JSON` 또는 `Table` 객체에서 `text` 키를 기준으로 더 이상 추출할 항목이 없을 때까지 반복적으로 항목을 추출합니다.
각 `item` 출력은 `JSON` 객체입니다.

3. 각 `item`을 **Item** 출력 포트로 전달하며 순회합니다.

    이 포트는 각 항목에 대한 작업을 수행하는 하나 이상의 컴포넌트에 연결됩니다.
**Item** 루프의 마지막 컴포넌트는 다음 항목을 처리하기 위해 **Loop** 컴포넌트의 **Looping** 포트로 다시 연결됩니다.

    **Item** 포트에는 하나의 컴포넌트만 연결되지만, 필요한 만큼 여러 컴포넌트를 거쳐 데이터를 전달할 수 있습니다. 다만 체인의 마지막 컴포넌트는 반드시 **Looping** 포트로 다시 연결되어야 합니다.

    [**If-Else** 컴포넌트](https://docs.langflow.org/if-else)는 **Loop** 컴포넌트와 호환되지 않습니다.
자세한 내용은 [조건부 반복](#conditional-looping)을 참고하세요.

4. 모든 항목을 처리한 후, 결과는 하나의 `JSON` 객체로 집계되어 **Loop** 컴포넌트의 **Done** 포트에서 플로우의 다음 컴포넌트로 전달됩니다.

다음의 단순화된 Python 코드는 **Loop** 컴포넌트가 작동하는 방식을 요약한 것입니다.
이는 실제 컴포넌트 코드가 *아니며*, 전체적인 과정을 이해하는 데 도움을 주기 위한 것입니다.

```python
for i in input:             # Receive input data as a list  
    process_item(i)         # Process each item through components connected at the Item port  
    if has_more_items():  
        continue            # Loop back to Looping port to process the next item  
    else:  
        break               # Exit the loop when no more items are left  

done = aggregate_results()  # Compile all returned items  

print(done)                 # Send the aggregated results from the Done port to another component  
```

## Loop 예제[​](#loop-example "Direct link to Loop example")

다음 예제에서 **Loop** 컴포넌트는 처리할 행이 남아 있지 않을 때까지 CSV 파일을 반복 순회합니다.
이 경우 **Item** 포트는 각 행을 **Type Convert** 컴포넌트로 전달하여 `Message` 객체로 변환하고, 이 `Message`를 **Structured Output** 컴포넌트로 전달하여 구조화된 데이터로 처리한 다음, 다시 **Loop** 컴포넌트의 **Looping** 포트로 전달합니다.
모든 행을 처리한 후, **Loop** 컴포넌트는 집계된 구조화 데이터 목록을 **Done** 포트에 연결된 **Chroma DB** 컴포넌트를 통해 Chroma DB 데이터베이스에 로드합니다.

![Loop CSV parser](https://docs.langflow.org/assets/images/component-loop-csv-66c1b53f0722b36a900632806cb32d78.png)

tip

**Loop** 컴포넌트의 더 많은 예제를 보려면 Langflow의 **Research Translation Loop** 템플릿을 사용해 보거나, 동영상 튜토리얼 [Mastering the Loop Component & Agentic RAG in Langflow](https://www.youtube.com/watch?v=9Wx7WODSKTo)를 참고하세요.

## 조건부 반복[​](#conditional-looping "Direct link to Conditional looping")

[**If-Else** 컴포넌트](https://docs.langflow.org/if-else)는 **Loop** 컴포넌트와 호환되지 않습니다.
조건부 반복 이벤트가 필요한 경우, 루프 이전에 조건을 처리하도록 플로우를 재설계하세요.
예를 들어 `Table`을 순회하는 경우, 여러 [**Data Operations** 컴포넌트](https://docs.langflow.org/next/operations)를 사용하여 조건부로 데이터를 필터링한 다음, 필터링된 각 데이터 세트에 대해 별도의 루프를 실행할 수 있습니다.

![조건부 반복이 있는 플로우.](https://docs.langflow.org/assets/images/conditional-looping-756b330b8dc690b3dab1c44cc2fb05db.png)

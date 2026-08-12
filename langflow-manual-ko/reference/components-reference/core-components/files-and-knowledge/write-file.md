# Write File

> 원문: https://docs.langflow.org/next/write-file

Langflow 버전 1.7.0에서 이 컴포넌트는 **Save File**에서 **Write File**로 이름이 변경되었습니다.

**Write File** 컴포넌트는 다른 컴포넌트가 생성한 데이터를 담은 파일을 생성합니다.
여러 파일 형식을 지원하며, [Langflow 스토리지](https://docs.langflow.org/memory), AWS S3, Google Drive, 로컬 파일 시스템에 파일을 저장할 수 있습니다.

플로우에서 **Write File** 컴포넌트를 구성하고 사용하려면 다음을 수행하세요.

1. 다른 컴포넌트의 [`Table`](https://docs.langflow.org/data-types#table), [`JSON`](https://docs.langflow.org/data-types#json), [`Message`](https://docs.langflow.org/data-types#message) 출력을 **Write File** 컴포넌트의 **Input** 포트에 연결합니다.

    여러 파일을 생성하거나, 서로 다른 파일 형식으로 데이터를 저장하거나, 여러 위치에 파일을 저장하려는 경우 동일한 출력을 여러 **Write File** 컴포넌트에 연결할 수 있습니다.

2. **Storage Location**을 클릭하고 **Local**, **AWS**, **Google Drive** 중 하나를 선택합니다.
필요한 경우 클라우드 제공업체의 자격 증명을 입력하세요.
자세한 내용은 [파일 스토리지 구성](https://docs.langflow.org/concepts-file-management#configure-file-storage)을 참고하세요.

3. **File Name**에 파일 이름과 선택적으로 경로를 입력합니다.

    **File Name** 파라미터는 파일이 저장되는 위치를 제어합니다.
파일 이름만 입력하거나 전체 파일 경로를 입력할 수 있습니다.

  - **기본 위치**: 파일 이름만 입력하면 파일은 Langflow 데이터 디렉터리에 저장됩니다. 예를 들어 macOS에서는 `~/Library/Caches/langflow/data`입니다.

  - **하위 디렉터리**: 하위 디렉터리에 파일을 저장하려면 **File Name** 파라미터에 경로를 추가하세요.
지정한 하위 디렉터리가 존재하지 않으면 Langflow가 자동으로 생성합니다.
예를 들어 `files/my_file`은 `/data/files`에 `my_file`을 생성하며, `files` 하위 디렉터리가 존재하지 않으면 함께 생성합니다.

  - **절대 경로 또는 상대 경로**: 환경 내 다른 위치나 로컬 파일 스토리지에 저장하려면 원하는 위치의 절대 경로 또는 상대 경로를 입력하세요.
예를 들어 `~/Desktop/my_file`은 바탕화면에 `my_file`을 저장합니다.

    파일 이름에 확장자를 포함하지 마세요.
확장자를 포함하면 해당 확장자는 파일 이름의 일부로 취급되며, **File Format** 파라미터에는 영향을 주지 않습니다.

4. 원하는 파일 형식을 선택한 뒤 **Close**를 클릭합니다.

    사용 가능한 **File Format** 옵션은 입력 데이터 유형에 따라 다릅니다.

  - `Table`은 CSV(기본값), Excel([사용자 정의 의존성](https://docs.langflow.org/install-custom-dependencies)인 `openpyxl` 필요), JSON(대체 기본값), Markdown으로 저장할 수 있습니다.

  - `JSON`은 CSV, Excel([사용자 정의 의존성](https://docs.langflow.org/install-custom-dependencies)인 `openpyxl` 필요), JSON(기본값), Markdown으로 저장할 수 있습니다.

  - `Message`는 TXT, JSON(기본값), Markdown으로 저장할 수 있습니다.

  덮어쓰기 허용
      하나 이상의 플로우에서 동일한 파일 이름, 경로, 확장자를 가진 여러 **Write File** 컴포넌트가 있는 경우, 파일에는 가장 최근 실행의 데이터만 담깁니다.
Langflow는 일치하는 파일이 이미 존재하더라도 덮어쓰기를 막지 않습니다.
의도치 않은 덮어쓰기를 방지하려면 고유한 파일 이름과 경로를 사용하세요.

5. **Write File** 컴포넌트를 테스트하려면 **Run component**를 클릭한 뒤 **Inspect output**을 클릭하여 파일이 저장된 경로를 확인합니다.

    컴포넌트의 실제 출력은 원본 데이터 유형, 파일 이름과 확장자, **File Name** 파라미터를 기반으로 한 파일의 절대 경로를 담은 `Message`입니다.
예를 들면 다음과 같습니다.

    ```
    DataFrame saved successfully as 'my_file.csv' at /Users/user.name/Library/Caches/langflow/data/my_file.csv
    ```

    **File Name**에 하위 디렉터리나 기본값이 아닌 다른 경로가 포함된 경우, 이는 `Message` 출력에도 반영됩니다.
예를 들어 파일 이름이 `~/Desktop/my_file`인 CSV 파일은 다음과 같은 출력을 생성할 수 있습니다.

    ```
    DataFrame saved successfully as '/Users/user.name/Desktop/my_file.csv' at /Users/user.name/Desktop/my_file.csv
    ```

6. 선택 사항: 저장된 파일을 플로우에서 사용하려면 API 호출이나 다른 컴포넌트를 사용하여 해당 파일 경로에서 파일을 가져와야 합니다.
